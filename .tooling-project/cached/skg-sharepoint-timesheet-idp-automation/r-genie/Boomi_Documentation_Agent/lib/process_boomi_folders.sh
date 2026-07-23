#!/bin/bash
# Generic Boomi export folder processor
# Usage: ./process_boomi_folders.sh [source_directory] [source_directory2] ...
#
# This script detects folders containing Boomi XML exports and prepares them
# for processing with the Boomi Documentation Agent (08)

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGENT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
WORKSPACE_ROOT="$(cd "$AGENT_DIR/../.." && pwd)"
PROJECT_DIR="$WORKSPACE_ROOT/project"
INPUT_DIR="$PROJECT_DIR/input_boomi"
OUTPUT_DIR="$PROJECT_DIR/output_boomi"
LOG_FILE="$PROJECT_DIR/boomi_processing.log"
INSTRUCTIONS_FILE="$PROJECT_DIR/PROCESSING_INSTRUCTIONS.md"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Initialize log file
init_log() {
    if [ ! -f "$LOG_FILE" ]; then
        echo "# Boomi Processing Log" > "$LOG_FILE"
        echo "# Generated: $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG_FILE"
        echo "" >> "$LOG_FILE"
    fi
}

# Log a message
log_message() {
    local status="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$status] $message" >> "$LOG_FILE"
    echo -e "${BLUE}[$timestamp]${NC} ${GREEN}[$status]${NC} $message"
}

# Check if folder contains Boomi XML exports
is_boomi_folder() {
    local folder="$1"
    
    if [ ! -d "$folder" ]; then
        return 1
    fi
    
    # Check if folder contains XML files (Boomi exports typically have .xml extension)
    if find "$folder" -maxdepth 1 -name "*.xml" -type f 2>/dev/null | grep -q .; then
        return 0
    fi
    
    return 1
}

# Detect folders containing Boomi XML exports
detect_folders() {
    local source_dir="$1"
    local folders=()
    
    if [ ! -d "$source_dir" ]; then
        echo -e "${RED}Error:${NC} Directory does not exist: $source_dir" >&2
        return 1
    fi
    
    # Resolve absolute path
    source_dir="$(cd "$source_dir" && pwd)"
    
    # Check if source_dir itself is a Boomi folder
    if is_boomi_folder "$source_dir"; then
        folders+=("$source_dir")
        printf '%s\n' "${folders[@]}"
        return 0
    fi
    
    # Find all direct subdirectories only
    while IFS= read -r -d '' dir; do
        # Resolve to absolute path
        dir="$(cd "$dir" && pwd)"
        if is_boomi_folder "$dir"; then
            folders+=("$dir")
        fi
    done < <(find "$source_dir" -mindepth 1 -maxdepth 1 -type d -print0 2>/dev/null)
    
    printf '%s\n' "${folders[@]}"
}

# Get folder name from path
get_folder_name() {
    local folder_path="$1"
    basename "$folder_path"
}

# Format XML files (pretty print with proper indentation)
format_xml_files() {
    local target_dir="$1"
    local xml_count=0
    local formatted_count=0
    local error_count=0
    
    log_message "INFO" "Formatting XML files in: $target_dir"
    
    # Check if Python 3 is available
    if ! command -v python3 &> /dev/null; then
        log_message "WARNING" "python3 not found. Skipping XML formatting."
        return 1
    fi
    
    # Find all XML files and format them
    while IFS= read -r -d '' xml_file; do
        ((xml_count++))
        
        # Format using Python's xml.dom.minidom
        if python3 -c "
import xml.dom.minidom

try:
    with open('$xml_file', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Parse and pretty print
    dom = xml.dom.minidom.parseString(content)
    pretty_xml = dom.toprettyxml(indent='  ', encoding=None)
    
    # Remove extra blank lines that minidom adds
    lines = [line for line in pretty_xml.split('\n') if line.strip()]
    formatted = '\n'.join(lines)
    
    # Write back
    with open('$xml_file', 'w', encoding='utf-8') as f:
        f.write(formatted)
except Exception:
    exit(1)
" 2>/dev/null; then
            ((formatted_count++))
        else
            ((error_count++))
            log_message "WARNING" "Failed to format: $(basename "$xml_file")"
        fi
    done < <(find "$target_dir" -maxdepth 1 -name "*.xml" -type f -print0 2>/dev/null)
    
    if [ $xml_count -gt 0 ]; then
        log_message "SUCCESS" "Formatted $formatted_count/$xml_count XML files"
        if [ $error_count -gt 0 ]; then
            log_message "WARNING" "$error_count XML file(s) had formatting errors"
        fi
    else
        log_message "INFO" "No XML files found to format"
    fi
    
    return 0
}

# Prepare folder for processing (copy to input directory)
prepare_folder() {
    local source_folder="$1"
    local folder_name=$(get_folder_name "$source_folder")
    
    # Create input directory if it doesn't exist
    mkdir -p "$INPUT_DIR"
    
    # Clear previous input (backup if exists)
    if [ -d "$INPUT_DIR" ] && [ "$(ls -A $INPUT_DIR 2>/dev/null)" ]; then
        local backup_dir="${INPUT_DIR}_backup_$(date +%Y%m%d_%H%M%S)"
        log_message "INFO" "Backing up existing input to: $backup_dir"
        mv "$INPUT_DIR" "$backup_dir"
        mkdir -p "$INPUT_DIR"
    fi
    
    # Copy folder contents to input directory
    log_message "INFO" "Copying $folder_name to input directory..."
    cp -r "$source_folder"/* "$INPUT_DIR/" 2>/dev/null || {
        # If source_folder is a single folder, copy its contents
        cp -r "$source_folder"/. "$INPUT_DIR/" 2>/dev/null || {
            echo -e "${RED}Error:${NC} Failed to copy files from $source_folder" >&2
            return 1
        }
    }
    
    # Format XML files after copying
    format_xml_files "$INPUT_DIR"
    
    log_message "SUCCESS" "Folder $folder_name prepared in $INPUT_DIR"
    return 0
}

# Generate Cursor command instruction
generate_cursor_command() {
    local folder_path="$1"
    local folder_name=$(get_folder_name "$folder_path")
    
    # Convert to relative path if possible
    local rel_path="$folder_path"
    if [[ "$folder_path" == "$WORKSPACE_ROOT"* ]]; then
        rel_path="${folder_path#$WORKSPACE_ROOT/}"
    elif [[ "$folder_path" == "$PROJECT_DIR"* ]]; then
        rel_path="${folder_path#$PROJECT_DIR/}"
    fi
    
    cat <<EOF
### Folder: $folder_name
- **Path:** \`$rel_path\`
- **Command:** \`/use-boomi-documentation\`
- **Then:** \`Document this Boomi process: @$rel_path\`
- **Status:** [ ] Pending
- **Processed:** Not yet processed

EOF
}

# Generate instructions file
generate_instructions() {
    local folders=("$@")
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    {
        echo "# Boomi Processing Instructions"
        echo ""
        echo "Generated: $timestamp"
        echo ""
        echo "## Instructions"
        echo ""
        echo "For each folder below:"
        echo "1. Run the command: \`/use-boomi-documentation\`"
        echo "2. Then provide: \`Document this Boomi process: @{folder_path}\`"
        echo "3. Mark the folder as complete when done"
        echo ""
        
        local folder_num=1
        for folder in "${folders[@]}"; do
            local folder_name=$(get_folder_name "$folder")
            echo "---"
            echo ""
            echo "## Folder $folder_num: $folder_name"
            generate_cursor_command "$folder"
            ((folder_num++))
        done
        
        echo ""
        echo "---"
        echo ""
        echo "## Processing Log"
        echo ""
        echo "See \`boomi_processing.log\` for detailed processing history."
    } > "$INSTRUCTIONS_FILE"
    
    log_message "SUCCESS" "Instructions file generated: $INSTRUCTIONS_FILE"
}

# Process a single folder using Cursor CLI
process_folder() {
    local folder_path="$1"
    local folder_name=$(get_folder_name "$folder_path")
    
    log_message "PROCESSING" "Starting processing for: $folder_name"
    
    if ! is_boomi_folder "$folder_path"; then
        log_message "SKIP" "Skipping $folder_name - not a valid Boomi export folder"
        return 1
    fi
    
    if ! prepare_folder "$folder_path"; then
        log_message "ERROR" "Failed to prepare folder: $folder_name"
        return 1
    fi
    
    # Optional: Attempt CLI automation if cursor-agent is available
    if command -v cursor-agent &> /dev/null; then
        # Convert to relative path for Cursor command
        local rel_path="$folder_path"
        if [[ "$folder_path" == "$WORKSPACE_ROOT"* ]]; then
            rel_path="${folder_path#$WORKSPACE_ROOT/}"
        elif [[ "$folder_path" == "$PROJECT_DIR"* ]]; then
            rel_path="${folder_path#$PROJECT_DIR/}"
        fi
        
        # Invoke Cursor CLI to process the folder
        log_message "INFO" "Invoking Cursor CLI agent for: $folder_name"
        
        # Change to workspace root for cursor-agent
        cd "$WORKSPACE_ROOT" || return 1
        
        # Prepare the full prompt for Cursor agent
        local cursor_prompt="/use-boomi-documentation

Document this Boomi process: @$rel_path"
        
        # Run cursor-agent with --print flag for non-interactive mode
        local cursor_output
        cursor_output=$(cursor-agent --print --approve-mcps "$cursor_prompt" 2>&1)
        local cursor_exit_code=$?
        
        # Log the output
        echo "$cursor_output" | tee -a "$LOG_FILE"
        
        # Check exit code
        if [ $cursor_exit_code -eq 0 ]; then
            log_message "SUCCESS" "Cursor agent completed processing for: $folder_name"
            cd - > /dev/null || return 1
            return 0
        else
            log_message "WARNING" "Cursor agent failed. Folder prepared in input directory."
            log_message "INFO" "You can manually process this folder in Cursor IDE."
            cd - > /dev/null || return 1
        fi
    else
        log_message "INFO" "cursor-agent not found. Folder prepared in input directory."
        log_message "INFO" "Process manually in Cursor IDE using: /use-boomi-documentation"
    fi
    
    return 0
}

# Show processing status
show_status() {
    local folders=("$@")
    
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Boomi Folder Processing Status${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${GREEN}Found ${#folders[@]} folder(s) to process:${NC}"
    echo ""
    
    local folder_num=1
    for folder in "${folders[@]}"; do
        local folder_name=$(get_folder_name "$folder")
        echo -e "  ${YELLOW}$folder_num.${NC} $folder_name"
        echo -e "     ${BLUE}Path:${NC} $folder"
        ((folder_num++))
    done
    
    echo ""
    echo -e "${BLUE}Input Directory:${NC} $INPUT_DIR"
    echo -e "${BLUE}Output Directory:${NC} $OUTPUT_DIR"
    echo -e "${BLUE}Instructions File:${NC} $INSTRUCTIONS_FILE"
    echo -e "${BLUE}Log File:${NC} $LOG_FILE"
    echo ""
}

# Process all folders sequentially
process_all() {
    local folders=("$@")
    local total=${#folders[@]}
    local current=0
    local success=0
    local failed=0
    
    if [ $total -eq 0 ]; then
        echo -e "${YELLOW}Warning:${NC} No folders found to process"
        return 1
    fi
    
    show_status "${folders[@]}"
    
    echo -e "${BLUE}Starting sequential processing...${NC}"
    echo ""
    
    for folder in "${folders[@]}"; do
        ((current++))
        local folder_name=$(get_folder_name "$folder")
        
        echo -e "${BLUE}[$current/$total]${NC} Processing: $folder_name"
        
        if process_folder "$folder"; then
            ((success++))
            echo -e "${GREEN}✓${NC} Folder $folder_name processed successfully"
        else
            ((failed++))
            echo -e "${RED}✗${NC} Failed to process folder $folder_name"
        fi
        
        echo ""
        
        # Small delay between folders (optional, can be removed for faster processing)
        if [ $current -lt $total ]; then
            sleep 2
        fi
    done
    
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}Processing Complete!${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "Total folders: $total"
    echo -e "${GREEN}Successful: $success${NC}"
    echo -e "${RED}Failed: $failed${NC}"
    echo ""
    echo -e "See ${BLUE}$INSTRUCTIONS_FILE${NC} for Cursor commands"
    echo -e "See ${BLUE}$LOG_FILE${NC} for detailed log"
    echo ""
}

# Check Cursor CLI availability (optional)
check_cursor_auth() {
    if command -v cursor-agent &> /dev/null; then
        echo -e "${GREEN}✓${NC} cursor-agent is available (optional CLI automation enabled)"
        return 0
    else
        echo -e "${YELLOW}Note:${NC} cursor-agent not found. CLI automation disabled."
        echo -e "${BLUE}Info:${NC} Folders will be prepared for manual processing in Cursor IDE."
        return 0
    fi
}

# Main function
main() {
    # Initialize
    init_log
    
    # Check Cursor CLI availability (optional)
    echo -e "${BLUE}Checking optional CLI automation...${NC}"
    check_cursor_auth
    echo ""
    
    # Check if any arguments provided
    if [ $# -eq 0 ]; then
        echo -e "${RED}Error:${NC} No folder path(s) provided"
        echo ""
        echo "Usage: $0 [source_directory] [source_directory2] ..."
        echo ""
        echo "Examples:"
        echo "  $0 \"exports 5\""
        echo "  $0 \"exports 5\" \"exports 6\""
        echo "  $0 \"exports 5/040f88f2-023b-486f-9e5d-b3aaa1380b66\""
        echo ""
        exit 1
    fi
    
    # Collect all folders from all provided directories
    local all_folders=()
    
    for source_dir in "$@"; do
        # Resolve absolute path
        if [[ "$source_dir" != /* ]]; then
            # Try workspace root first, then project directory
            if [ -d "$WORKSPACE_ROOT/$source_dir" ]; then
                source_dir="$WORKSPACE_ROOT/$source_dir"
            elif [ -d "$PROJECT_DIR/$source_dir" ]; then
                source_dir="$PROJECT_DIR/$source_dir"
            else
                echo -e "${RED}Error:${NC} Directory not found: $source_dir (checked workspace root and project directory)" >&2
                continue
            fi
        fi
        
        log_message "INFO" "Scanning directory: $source_dir"
        
        # Detect folders in this directory (using mapfile to preserve paths with spaces)
        local detected_folders=()
        while IFS= read -r folder; do
            [ -n "$folder" ] && detected_folders+=("$folder")
        done < <(detect_folders "$source_dir")
        
        if [ ${#detected_folders[@]} -eq 0 ]; then
            echo -e "${YELLOW}Warning:${NC} No Boomi export folders found in: $source_dir"
            continue
        fi
        
        # Add to all_folders array
        for folder in "${detected_folders[@]}"; do
            all_folders+=("$folder")
        done
    done
    
    if [ ${#all_folders[@]} -eq 0 ]; then
        echo -e "${RED}Error:${NC} No Boomi export folders found in any provided directory"
        exit 1
    fi
    
    # Generate instructions file
    generate_instructions "${all_folders[@]}"
    
    # Process all folders
    process_all "${all_folders[@]}"
}

# Run main function with all arguments
main "$@"
