---
description: DataWeave CLI Validation Framework - Commands, Pipeline, and Performance Monitoring
author: Cheppali Shaik Sohail
alwaysApply: false
---

# 🔧 **CLI VALIDATION FRAMEWORK**
*Enterprise DataWeave CLI Mastery and Validation Pipeline*

<!-- Q2hlcHBhbGlTaGFpa1NvaGFpbDE1MDgxOTkz -->
## **🔧 CLI ENVIRONMENT VALIDATION (PREREQUISITE CHECK)**

### **BEFORE starting CLI validation, verify CLI setup:**

```bash
# === DataWeave CLI Installation Verification ===
<!-- CS150893‌ -->

# Step 1: Verify DataWeave CLI installation and basic functionality
echo "Checking DataWeave CLI installation..."
if dw --version; then
    echo "✅ DataWeave CLI is installed and accessible"
    echo "Version: $(dw --version)"
else
    echo "❌ DataWeave CLI not found - Installation required"
    echo "💡 SOLUTION: Install DataWeave CLI from MuleSoft"
    echo "🔗 Download: https://docs.mulesoft.com/dataweave/latest/dataweave-cli"
    exit 1
fi

# Step 2: Test basic CLI help access (ensures CLI is properly configured)
echo "Testing CLI help system accessibility..."
dw help validate > /dev/null 2>&1
dw help run > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ CLI help system accessible - Ready for validation"
else
    echo "⚠️ CLI help system may have issues - proceeding with caution"
fi

# Step 3: Test basic CLI functionality
echo "Testing basic CLI transformation..."
echo '{"test": "value"}' | dw 'payload.test' > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Basic CLI transformation working"
else
    echo "⚠️ Basic CLI transformation failed - check CLI installation"
fi

echo "✅ CLI environment validation complete"
```

---

## **🧪 R-GENIE VALIDATION FRAMEWORK CHECK (ENTERPRISE PREREQUISITE)**

### **VERIFY permanent validation framework availability:**

```bash
# === R-Genie Enterprise Validator Verification ===

echo "Checking R-Genie validation framework..."
if [ -f "dataweave-output-validator.js" ]; then
    echo "✅ R-Genie Enterprise Validator found"
    
    # Check if validator has version info
    if node dataweave-output-validator.js --version > /dev/null 2>&1; then
        echo "Version: $(node dataweave-output-validator.js --version)"
    else
        echo "✅ Validator executable (version check not available)"
    fi
else
    echo "❌ dataweave-output-validator.js not found in project root"
    echo "💡 REQUIRED: R-Genie validation framework must be installed"
    echo "🔧 SOLUTION: Ensure dataweave-output-validator.js exists in workspace root"
    echo "📁 EXPECTED LOCATION: $(pwd)/dataweave-output-validator.js"
    exit 1
fi

# Optional: Test validator accessibility with help
echo "Testing R-Genie validator help system..."
node dataweave-output-validator.js --help > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ R-Genie validator help system accessible - Ready for enterprise validation"
else
    echo "⚠️ R-Genie validator may have issues - proceeding with validation attempt"
fi

echo "✅ R-Genie validation framework verification complete"
```

---

## **🛠️ DATAWEAVE CLI MASTERY (CRITICAL FOR SUCCESS)**

### **CLI Command Format Essentials (Production-Tested Patterns)**

#### **Validation Commands (Syntax Check Only)**
```bash
# ✅ SYNTAX VALIDATION - Check DataWeave script syntax
dw validate -f "transformation.dwl" -i payload

# ✅ VALIDATION WITH SPECIFIC INPUT TYPE
dw validate -f "transformation.dwl" -i payload -t json

# ✅ VALIDATION WITH MULTIPLE INPUTS
dw validate -f "transformation.dwl" -i payload -i context -i variables
```

#### **Execution Commands (Full Testing)**
```bash
# ✅ BASIC EXECUTION - File input (standard approach)
dw run -f "transformation.dwl" -i=payload="input.json" -o "output.json"

# ✅ EXECUTION WITH ABSOLUTE PATHS (recommended for Windows)
dw run -f "transformation.dwl" -i=payload="C:\full\path\to\input.json" -o "output.json"

# ✅ EXECUTION WITH MULTIPLE INPUTS
dw run -f "transformation.dwl" \
  -i=payload="input.json" \
  -i=config="config.json" \
  -i=metadata="metadata.json" \
  -o "output.json"

# ✅ LITERAL INPUT (Inline content)
dw run -f "transformation.dwl" -li payload='{"data": "value"}' -o "output.json"

# ✅ EXECUTION WITH OUTPUT FORMAT SPECIFICATION
dw run -f "transformation.dwl" -i=payload="input.json" -o "output.xml" --output-type application/xml
```

#### **Parameter-Based Context Testing**
```bash
# ✅ MULE CONTEXT SIMULATION (Use parameters instead of Mule vars)
dw run -f "transformation.dwl" \
  -i=payload="input.json" \
  -p batchId="BATCH_001" \
  -p environment="PROD" \
  -p contentType="application/json" \
  -p method="POST" \
  -p httpStatus="200" \
  -o "context-output.json"

# ✅ ADVANCED CONTEXT WITH ATTRIBUTES
dw run -f "transformation.dwl" \
  -i=payload="input.json" \
  -p "attributes.headers.content-type"="application/json" \
  -p "attributes.method"="POST" \
  -p "attributes.requestPath"="/api/data" \
  -o "context-output.json"
```

### **CLI Parameter Format Rules (MANDATORY)**

#### **Format Requirements**
- **Validation**: Use `-i payload` (no equals sign)
- **Execution**: Use `-i=name=value` format (with equals signs)
- **File Paths**: Use absolute paths on Windows for reliability
- **Multiple Inputs**: Separate each input with individual `-i=` flags
- **Output**: Always specify output file for comparison testing
- **Parameters**: Use `-p key=value` for context variables

#### **Platform-Specific Considerations**
```bash
# WINDOWS (PowerShell/CMD)
# Use absolute paths and proper escaping
dw run -f "transformation.dwl" -i=payload="C:\Users\username\input.json" -o "output.json"

# LINUX/MAC (Bash/Zsh)
# Can use relative paths but absolute recommended
dw run -f "transformation.dwl" -i=payload="/home/username/input.json" -o "output.json"

# GIT BASH (Windows)
# Unix-style paths work
dw run -f "transformation.dwl" -i=payload="/c/Users/username/input.json" -o "output.json"
```

---

## **🧪 COMPREHENSIVE CLI VALIDATION FRAMEWORK**

### **NEVER declare success without CLI validation:**

```bash
# === DataWeave Enterprise CLI Validation Pipeline ===

echo "🚀 Starting DataWeave Enterprise CLI Validation Pipeline"
echo "================================================================"

# === VALIDATION PHASE ===
echo "🔍 Phase 1: CLI Syntax Validation"
echo "Validating DataWeave script syntax..."

if dw validate -f "transformation.dwl" -i payload; then
    echo "✅ Syntax validation PASSED"
    echo "   - Script syntax is valid"
    echo "   - All functions and operators recognized"
    echo "   - Variable declarations correct"
else
    echo "❌ Syntax validation FAILED"
    echo "💡 ACTIONS REQUIRED:"
    echo "   - Check reserved keyword usage (quote if needed)"
    echo "   - Verify function syntax and imports"
    echo "   - Fix variable declaration errors"
    echo "   - Ensure proper bracket/parentheses matching"
    exit 1
fi

# === BASIC EXECUTION PHASE ===
echo ""
echo "🚀 Phase 2: Basic Execution with User Provided Sample"
echo "Testing script execution with actual input data..."

# Execute with timeout protection
if timeout 30s dw run -f "transformation.dwl" -i=payload="input.json" -o "actual-output.json"; then
    echo "✅ Basic execution PASSED"
    echo "   - Script executed without runtime errors"
    echo "   - Output file generated successfully"
    echo "   - Execution completed within timeout"
else
    echo "❌ Basic execution FAILED"
    echo "💡 ACTIONS REQUIRED:"
    echo "   - Check runtime errors (null pointer, type conversion)"
    echo "   - Verify input data format matches script expectations"
    echo "   - Check for infinite loops or performance issues"
    echo "   - Review error logs for specific failure points"
    exit 1
fi

# === CONTEXT TESTING PHASE ===
echo ""
echo "🔄 Phase 3: Parameter Context Testing"
if [ ! -z "$CONTEXT_PARAMS" ]; then
    echo "Testing script with Mule context parameters..."
    
    timeout 30s dw run -f "transformation.dwl" \
      -i=payload="input.json" \
      -p batchId="BATCH_001" \
      -p environment="DEV" \
      -p method="POST" \
      -p contentType="application/json" \
      -p httpStatus="200" \
      -p "attributes.headers.authorization"="Bearer token123" \
      -o "context-output.json"
    
    if [ $? -eq 0 ]; then
        echo "✅ Parameter context execution PASSED"
        echo "   - Script handles Mule context variables correctly"
        echo "   - Parameters accessible and used appropriately"
    else
        echo "❌ Parameter context execution FAILED"
        echo "💡 ACTIONS REQUIRED:"
        echo "   - Check parameter access syntax in script"
        echo "   - Verify context variable names match Mule conventions"
        echo "   - Ensure parameters have appropriate default values"
        exit 1
    fi
else
    echo "⏭️  Parameter context testing SKIPPED (no context parameters provided)"
fi

# === ENTERPRISE VALIDATION PHASE ===
echo ""
echo "📊 Phase 4: Enterprise-Grade Output Accuracy Validation"
echo "Using R-Genie Enterprise Validation Framework..."

# CRITICAL: Use permanent DataWeave output validator (NO temporary script creation)
# MANDATORY: The reusable validator (dataweave-output-validator.js) must exist in project root
if [ ! -f "dataweave-output-validator.js" ]; then
    echo "❌ ERROR: dataweave-output-validator.js not found in project root"
    echo "💡 SOLUTION: Ensure R-Genie validation framework is installed"
    echo "📁 EXPECTED: $(pwd)/dataweave-output-validator.js"
    exit 1
fi

echo "🚀 Using R-Genie Enterprise Validation Framework v2.0+"

# Execute enterprise-grade comparison using permanent validator
node dataweave-output-validator.js "actual-output.json" "expected-output.json"

if [ $? -eq 0 ]; then
    echo "✅ Output accuracy: 100% MATCH (R-Genie Enterprise Validator)"
    echo "   - Generated output matches expected output exactly"
    echo "   - All fields, values, and structure validated"
    echo "   - Enterprise-grade comparison completed successfully"
else
    echo "❌ Output accuracy: MISMATCH detected (R-Genie Enterprise Analysis)"
    echo "💡 ACTIONS REQUIRED:"
    echo "   - Review detailed comparison report from validator"
    echo "   - Fix field mapping issues identified"
    echo "   - Correct data transformation logic"
    echo "   - Re-run validation pipeline after fixes"
fi

# === PERFORMANCE VALIDATION PHASE ===
echo ""
echo "⚡ Phase 5: Performance Testing"
echo "Measuring execution performance with timeout protection..."

start_time=$(date +%s%N)

# Platform-specific timeout commands
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows: Use PowerShell Measure-Command
    echo "Using Windows PowerShell performance measurement..."
    powershell -Command "Measure-Command { dw run -f 'transformation.dwl' -i=payload='input.json' -o 'perf-output.json' }"
else
    # Linux/Mac: Use standard timeout command
    echo "Using Unix timeout command for performance measurement..."
    timeout 30s dw run -f "transformation.dwl" -i=payload="input.json" -o "perf-output.json"
fi

end_time=$(date +%s%N)
execution_time=$(((end_time - start_time) / 1000000))

if [ $execution_time -lt 30000 ]; then
    echo "✅ Performance validation PASSED (${execution_time}ms)"
    echo "   - Execution completed within acceptable time limits"
    echo "   - No performance bottlenecks detected"
else
    echo "⚠️ Performance validation WARNING (over 30 seconds)"
    echo "💡 OPTIMIZATION SUGGESTIONS:"
    echo "   - Review complex operations and loops"
    echo "   - Consider data size and processing efficiency"
    echo "   - Optimize array operations and aggregations"
fi

echo ""
echo "🏆 CLI Validation Pipeline Complete"
echo "================================================================"
```

---

## **⚡ CLI PERFORMANCE MONITORING (ENTERPRISE REQUIREMENTS)**

### **Performance Validation Commands**

#### **Memory Usage Monitoring**
```bash
# === LINUX/MAC MEMORY MONITORING ===
/usr/bin/time -v dw run -f "transformation.dwl" -i=payload="input.json" -o "output.json"

# Output includes:
# - Maximum resident set size (memory usage)
# - Page reclaims (soft page faults)
# - Page faults (hard page faults)
# - Voluntary context switches
# - Involuntary context switches

# === WINDOWS MEMORY MONITORING (PowerShell) ===
Measure-Command { 
    dw run -f "transformation.dwl" -i=payload="input.json" -o "output.json" 
} | Select-Object TotalMilliseconds

# Get memory usage information
Get-Process dw | Select-Object ProcessName, CPU, WorkingSet, VirtualMemorySize
```

#### **Cross-Platform Execution Time Tracking**
```bash
# === UNIX SYSTEMS (Linux/Mac/Git Bash) ===
start_time=$(date +%s%N)
dw run -f "transformation.dwl" -i=payload="input.json" -o "output.json"
end_time=$(date +%s%N)
execution_time=$(((end_time - start_time) / 1000000))
echo "Execution time: ${execution_time}ms"

# === WINDOWS POWERSHELL ===
$start = Get-Date
dw run -f "transformation.dwl" -i=payload="input.json" -o "output.json"
$end = Get-Date
$duration = $end - $start
echo "Execution time: $($duration.TotalMilliseconds)ms"
```

#### **Performance Testing with Timeout Protection**
```bash
# === PLATFORM-SPECIFIC TIMEOUT PROTECTION ===

# Linux/Mac (Bash/Zsh)
timeout 30s dw run -f "transformation.dwl" -i=payload="input.json" -o "output.json"
if [ $? -eq 124 ]; then
    echo "❌ TIMEOUT: Execution exceeded 30 seconds"
else
    echo "✅ Execution completed within timeout"
fi

# Windows PowerShell
$job = Start-Job -ScriptBlock { 
    dw run -f "transformation.dwl" -i=payload="input.json" -o "output.json" 
}
if (Wait-Job $job -Timeout 30) {
    echo "✅ Execution completed within timeout"
    Receive-Job $job
} else {
    echo "❌ TIMEOUT: Execution exceeded 30 seconds"
    Stop-Job $job
}
Remove-Job $job

# Git Bash (Windows)
timeout 30s dw run -f "transformation.dwl" -i=payload="input.json" -o "output.json"
```

### **Performance Benchmarks**

#### **Enterprise Performance Standards**
- **Small Dataset** (<1KB): <100ms execution time
- **Medium Dataset** (1-100KB): <1000ms execution time  
- **Large Dataset** (100KB-10MB): <10000ms execution time
- **Enterprise Dataset** (>10MB): <30000ms execution time (timeout limit)
- **Memory Usage**: Should not exceed available system memory
- **CPU Usage**: Should not cause system overload during execution

#### **Performance Monitoring Script**
```bash
#!/bin/bash
# === Performance Monitoring Utility ===

echo "📊 DataWeave Performance Monitoring"
echo "=================================="

# Input size analysis
input_size=$(wc -c < "input.json")
echo "Input size: ${input_size} bytes"

# Determine performance category
if [ $input_size -lt 1024 ]; then
    expected_time=100
    category="Small Dataset"
elif [ $input_size -lt 102400 ]; then
    expected_time=1000
    category="Medium Dataset"
elif [ $input_size -lt 10485760 ]; then
    expected_time=10000
    category="Large Dataset"
else
    expected_time=30000
    category="Enterprise Dataset"
fi

echo "Category: $category"
echo "Expected max execution time: ${expected_time}ms"

# Execute with performance monitoring
start_time=$(date +%s%N)
dw run -f "transformation.dwl" -i=payload="input.json" -o "output.json"
exit_code=$?
end_time=$(date +%s%N)

execution_time=$(((end_time - start_time) / 1000000))

echo "Actual execution time: ${execution_time}ms"

if [ $exit_code -eq 0 ]; then
    if [ $execution_time -le $expected_time ]; then
        echo "✅ PERFORMANCE: EXCELLENT (within expected range)"
    else
        echo "⚠️ PERFORMANCE: SLOW (exceeds expected range)"
    fi
else
    echo "❌ EXECUTION: FAILED (exit code: $exit_code)"
fi

# Output size analysis
if [ -f "output.json" ]; then
    output_size=$(wc -c < "output.json")
    echo "Output size: ${output_size} bytes"
    compression_ratio=$(echo "scale=2; $output_size / $input_size" | bc)
    echo "Compression ratio: ${compression_ratio}"
fi
```

---

## **🎯 CLI VALIDATION BEST PRACTICES**

### **Execution Order (MANDATORY)**
1. **Environment Validation**: Verify CLI installation and framework availability
2. **Syntax Validation**: Use `dw validate` to check script syntax
3. **Basic Execution**: Test with user-provided samples
4. **Context Testing**: Validate with Mule context parameters (if applicable)
5. **Enterprise Validation**: Use R-Genie framework for accuracy verification
6. **Performance Testing**: Monitor execution time and resource usage

### **Error Handling Strategy**
```bash
# === CLI ERROR HANDLING TEMPLATE ===
execute_cli_command() {
    local command="$1"
    local description="$2"
    
    echo "Executing: $description"
    echo "Command: $command"
    
    if eval "$command"; then
        echo "✅ SUCCESS: $description"
        return 0
    else
        echo "❌ FAILED: $description"
        echo "💡 Command: $command"
        return 1
    fi
}

# Usage examples:
execute_cli_command "dw validate -f transformation.dwl -i payload" "Syntax Validation"
execute_cli_command "dw run -f transformation.dwl -i=payload=input.json -o output.json" "Basic Execution"
```

### **Logging and Reporting**
```bash
# === CLI EXECUTION LOGGING ===
LOG_FILE="cli-validation-$(date +%Y%m%d-%H%M%S).log"

log_command() {
    local command="$1"
    local description="$2"
    
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Starting: $description" >> "$LOG_FILE"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Command: $command" >> "$LOG_FILE"
    
    if eval "$command" >> "$LOG_FILE" 2>&1; then
        echo "$(date '+%Y-%m-%d %H:%M:%S') - SUCCESS: $description" >> "$LOG_FILE"
        return 0
    else
        echo "$(date '+%Y-%m-%d %H:%M:%S') - FAILED: $description" >> "$LOG_FILE"
        return 1
    fi
}
```

---

*This CLI validation framework provides comprehensive testing coverage for DataWeave transformations. Always complete all validation phases before declaring transformation success.*