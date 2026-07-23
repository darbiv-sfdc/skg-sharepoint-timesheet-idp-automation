#!/bin/bash
# Standalone XML formatting script for Boomi Documentation Agent
# Usage: ./format_xml_files.sh [directory]
#
# Formats all XML files in the specified directory (or current directory if not specified)
# with proper indentation and line breaks for better readability and parsing

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get target directory (default to current directory)
TARGET_DIR="${1:-.}"

# Check if directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo -e "${RED}Error:${NC} Directory does not exist: $TARGET_DIR" >&2
    exit 1
fi

# Resolve absolute path
TARGET_DIR="$(cd "$TARGET_DIR" && pwd)"

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error:${NC} python3 not found. Please install Python 3 to format XML files." >&2
    exit 1
fi

echo -e "${BLUE}Formatting XML files in:${NC} $TARGET_DIR"
echo ""

xml_count=0
formatted_count=0
error_count=0

# Find all XML files and format them
while IFS= read -r -d '' xml_file; do
    ((xml_count++))
    filename=$(basename "$xml_file")
    
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
        echo -e "  ${GREEN}✓${NC} Formatted: $filename"
    else
        ((error_count++))
        echo -e "  ${RED}✗${NC} Error formatting: $filename"
    fi
done < <(find "$TARGET_DIR" -maxdepth 1 -name "*.xml" -type f -print0 2>/dev/null)

echo ""
if [ $xml_count -eq 0 ]; then
    echo -e "${YELLOW}No XML files found in:${NC} $TARGET_DIR"
    exit 0
fi

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Formatting Complete!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "Total XML files: $xml_count"
echo -e "${GREEN}Successfully formatted: $formatted_count${NC}"
if [ $error_count -gt 0 ]; then
    echo -e "${RED}Errors: $error_count${NC}"
    exit 1
fi
echo ""
echo -e "${GREEN}All XML files have been formatted with proper indentation and line breaks.${NC}"
