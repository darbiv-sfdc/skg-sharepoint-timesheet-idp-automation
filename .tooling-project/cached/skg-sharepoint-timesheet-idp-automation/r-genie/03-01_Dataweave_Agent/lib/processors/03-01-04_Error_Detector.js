#!/usr/bin/env node

/**
 * 🚨 R-Genie Error Detector Enhanced v1.0
 * Intelligent error detection and resolution with proactive analysis
 * @signature Q2hlcHBhbGlTaGFpa1NvaGFpbDE1MDgxOTkz
 * Transforms static error patterns into intelligent prevention and resolution
 */

const fs = require('fs');
const path = require('path');
const { readFile } = require('../utilities/03-01-21_File_Utils.js');

// Shared color codes
// @watermark CS150893‌
const { colors } = require('../utilities/colors.js');

function log(level, message) {
    const timestamp = new Date().toISOString();
    const levelColors = {
        'INFO': colors.cyan,
        'SUCCESS': colors.green,
        'WARNING': colors.yellow,
        'ERROR': colors.red,
        'DETAIL': colors.blue,
        'PREVENTION': colors.magenta
    };
    
    const color = levelColors[level] || colors.reset;
    console.log(`${color}[${level}]${colors.reset} ${message}`);
}

// 🧠 INTELLIGENT RESERVED KEYWORD DETECTION
function detectReservedKeywords(scriptContent, inputAnalysis, outputAnalysis) {
    const reservedWords = [
        'if', 'else', 'unless', 'using', 'as', 'is', 'null', 'true', 'false',
        'default', 'case', 'fun', 'input', 'output', 'ns', 'type', 'import',
        'var', 'and', 'or', 'throw', 'do', 'for', 'yield', 'enum', 'private', 'async'
    ];

    const issues = [];
    const allFields = [...(inputAnalysis?.fields || []), ...(outputAnalysis?.fields || [])];
    
    // Extract field access patterns from script
    const fieldAccessPatterns = scriptContent.match(/payload\.(\w+)/g) || [];
    const itemAccessPatterns = scriptContent.match(/\$\.(\w+)/g) || [];
    
    const allAccessedFields = [
        ...fieldAccessPatterns.map(match => match.replace('payload.', '')),
        ...itemAccessPatterns.map(match => match.replace('$.', ''))
    ];

    // Check for reserved words in field access
    allAccessedFields.forEach(field => {
        if (reservedWords.includes(field.toLowerCase())) {
            // Check if it's already quoted
            const quotedPattern = new RegExp(`payload\\."${field}"|\\$\\."${field}"`, 'g');
            if (!scriptContent.match(quotedPattern)) {
                issues.push({
                    type: 'reserved_keyword',
                    severity: 'CRITICAL',
                    field: field,
                    message: `Reserved keyword '${field}' must be quoted`,
                    wrongPattern: `payload.${field}`,
                    correctPattern: `payload."${field}"`,
                    autoFix: true,
                    impact: 'Compilation will fail with "Invalid field name identifier" error'
                });
            }
        }
    });

    return issues;
}

// 🎯 INTELLIGENT XML ERROR DETECTION
function detectXMLErrors(scriptContent, inputAnalysis, outputAnalysis) {
    const issues = [];
    
    // Detect if this is likely an XML transformation
    const hasXmlIndicators = scriptContent.includes('.*') || 
                           scriptContent.includes('@') ||
                           (inputAnalysis?.format === 'xml') ||
                           (outputAnalysis?.format === 'xml');

    if (!hasXmlIndicators) {
        return issues; // Not an XML transformation
    }

    // 1. Missing multivalue selectors
    const arrayAccessPatterns = scriptContent.match(/payload\.(\w+)\.(\w+)\s+map/g) || [];
    arrayAccessPatterns.forEach(pattern => {
        if (!pattern.includes('.*')) {
            const match = pattern.match(/payload\.(\w+)\.(\w+)/);
            if (match) {
                const [, parent, child] = match;
                issues.push({
                    type: 'xml_missing_multivalue',
                    severity: 'HIGH',
                    message: `Missing multivalue selector for XML array '${child}'`,
                    wrongPattern: `payload.${parent}.${child}`,
                    correctPattern: `payload.${parent}.*${child}`,
                    autoFix: true,
                    impact: 'Will fail with "Cannot coerce Object to Array" or "You called function \'map\' with Object"',
                    xmlSpecific: true
                });
            }
        }
    });

    // 2. Missing @ prefix for attributes
    const attributePatterns = scriptContent.match(/\w+\.(id|type|status|name|category|version)\s*[,}]/g) || [];
    attributePatterns.forEach(pattern => {
        if (!pattern.includes('@')) {
            const match = pattern.match(/(\w+)\.(\w+)/);
            if (match) {
                const [, element, attr] = match;
                issues.push({
                    type: 'xml_missing_attribute_prefix',
                    severity: 'HIGH',
                    message: `Missing @ prefix for XML attribute '${attr}'`,
                    wrongPattern: `${element}.${attr}`,
                    correctPattern: `${element}.@${attr}`,
                    autoFix: true,
                    impact: 'Will fail with "Cannot resolve field" error',
                    xmlSpecific: true
                });
            }
        }
    });

    // 3. valuesOf() usage for XML arrays (anti-pattern)
    const valuesOfPatterns = scriptContent.match(/valuesOf\([^)]*\)\s*map/g) || [];
    if (valuesOfPatterns.length > 0) {
        issues.push({
            type: 'xml_valuesof_antipattern',
            severity: 'MEDIUM',
            message: 'Using valuesOf() for XML arrays - multivalue selectors preferred',
            wrongPattern: 'valuesOf(payload.catalog) map (...)',
            correctPattern: 'payload.catalog.*product map (...)',
            autoFix: false,
            impact: 'Works but not XML-native approach, harder to maintain',
            xmlSpecific: true,
            recommendation: 'Switch to multivalue selectors for XML-native processing'
        });
    }

    // 4. Missing "as String" for XML text extraction
    const specObjectPatterns = scriptContent.match(/{\s*\([^)]+\):\s*(\w+)\s*}/g) || [];
    specObjectPatterns.forEach(pattern => {
        if (!pattern.includes('as String')) {
            issues.push({
                type: 'xml_missing_text_extraction',
                severity: 'MEDIUM',
                message: 'XML element should be converted to text value',
                wrongPattern: '{ (spec.@name): spec }',
                correctPattern: '{ (spec.@name): spec as String }',
                autoFix: true,
                impact: 'Will get XML element structure instead of text value',
                xmlSpecific: true
            });
        }
    });

    return issues;
}

// 🔧 INTELLIGENT COMPILATION ERROR DETECTION
function detectCompilationErrors(scriptContent) {
    const issues = [];

    // 1. Missing payload access in main block
    if (!scriptContent.includes('---')) {
        issues.push({
            type: 'missing_separator',
            severity: 'CRITICAL',
            message: 'Missing --- separator in DataWeave script',
            wrongPattern: 'payload access without --- separator',
            correctPattern: 'Use --- to separate header from main transformation',
            autoFix: false,
            impact: 'Will fail with "Unable to resolve reference of: payload" error'
        });
    }

    // 2. Incorrect function syntax
    const incorrectFunctionCalls = [
        { pattern: /payload\.\w+\s+sizeOf/g, correct: 'sizeOf(payload.field)' },
        { pattern: /\w+\s+as\s+String\s+default/g, correct: 'field as String default null' }
    ];

    incorrectFunctionCalls.forEach(({ pattern, correct }) => {
        const matches = scriptContent.match(pattern) || [];
        matches.forEach(match => {
            issues.push({
                type: 'incorrect_function_syntax',
                severity: 'HIGH',
                message: 'Incorrect function call syntax',
                wrongPattern: match.trim(),
                correctPattern: correct,
                autoFix: false,
                impact: 'Will fail with "Missing Expression" or syntax error'
            });
        });
    });

    // 3. Missing closing brackets/parentheses
    const openBrackets = (scriptContent.match(/[{[(]/g) || []).length;
    const closeBrackets = (scriptContent.match(/[}\])]/g) || []).length;
    
    if (openBrackets !== closeBrackets) {
        issues.push({
            type: 'bracket_mismatch',
            severity: 'CRITICAL',
            message: `Bracket mismatch: ${openBrackets} opening, ${closeBrackets} closing`,
            wrongPattern: 'Unmatched brackets/parentheses',
            correctPattern: 'Ensure all brackets and parentheses are properly closed',
            autoFix: false,
            impact: 'Will fail with "Missing Expression" or "Invalid input" error'
        });
    }

    // 4. DO block syntax issues
    const doBlockIssues = scriptContent.match(/do\s*{\s*[^-]*}/g) || [];
    doBlockIssues.forEach(block => {
        if (!block.includes('---')) {
            issues.push({
                type: 'do_block_missing_separator',
                severity: 'HIGH',
                message: 'DO block missing --- separator',
                wrongPattern: 'do { var x = value; { result: x } }',
                correctPattern: 'do { var x = value; --- { result: x } }',
                autoFix: true,
                impact: 'Will fail with "Invalid input" error in do block'
            });
        }
    });

    return issues;
}

// 🛡️ INTELLIGENT HARDCODING DETECTION
function detectHardcodingPatterns(scriptContent) {
    const issues = [];

    // 1. Numeric hardcoding patterns
    const numericPatterns = [
        { pattern: /:\s*\d+\.?\d*\s*[,}]/g, description: 'Hardcoded numeric values' },
        { pattern: /var\s+\w+\s*=\s*\d+\.?\d*/g, description: 'Hardcoded numeric variables' }
    ];

    numericPatterns.forEach(({ pattern, description }) => {
        const matches = scriptContent.match(pattern) || [];
        matches.forEach(match => {
            issues.push({
                type: 'hardcoded_numeric',
                severity: 'WARNING',
                message: `${description} detected: ${match.trim()}`,
                pattern: match.trim(),
                recommendation: 'Consider deriving from payload data or get user consent',
                requiresConsent: true,
                impact: 'May violate dynamic-first principle'
            });
        });
    });

    // 2. String hardcoding patterns
    const stringPatterns = scriptContent.match(/:\s*"[^"]*"\s*[,}]/g) || [];
    stringPatterns.forEach(match => {
        // Skip common safe patterns
        if (!match.includes('"USD"') && !match.includes('"UNKNOWN"') && !match.includes('""')) {
            issues.push({
                type: 'hardcoded_string',
                severity: 'WARNING',
                message: `Hardcoded string value detected: ${match.trim()}`,
                pattern: match.trim(),
                recommendation: 'Consider deriving dynamically or get user consent',
                requiresConsent: true,
                impact: 'May violate dynamic-first principle'
            });
        }
    });

    // 3. Date/timestamp hardcoding
    const datePatterns = scriptContent.match(/\|\d{4}-\d{2}-\d{2}[^|]*\|/g) || [];
    datePatterns.forEach(match => {
        issues.push({
            type: 'hardcoded_date',
            severity: 'HIGH',
            message: `Hardcoded date/timestamp detected: ${match}`,
            pattern: match,
            recommendation: 'Use now(), today(), or derive from payload',
            requiresConsent: true,
            impact: 'Violates dynamic calculation principles'
        });
    });

    // 4. Array/object hardcoding
    const arrayPatterns = scriptContent.match(/\[[^\]]*{\s*"[^"]*":\s*[^}]*}[^\]]*\]/g) || [];
    arrayPatterns.forEach(match => {
        issues.push({
            type: 'hardcoded_array',
            severity: 'HIGH',
            message: `Hardcoded array/object detected`,
            pattern: match.substring(0, 50) + '...',
            recommendation: 'Generate from input data or get explicit user consent',
            requiresConsent: true,
            impact: 'Violates dynamic transformation principles'
        });
    });

    return issues;
}

// 🎯 INTELLIGENT PERFORMANCE ISSUE DETECTION
function detectPerformanceIssues(scriptContent, inputAnalysis) {
    const issues = [];

    // 1. Inefficient nested operations
    const nestedOperations = (scriptContent.match(/map\s*\([^)]*map\s*\(/g) || []).length;
    if (nestedOperations > 2) {
        issues.push({
            type: 'nested_operations',
            severity: 'MEDIUM',
            message: `${nestedOperations} nested map operations detected`,
            recommendation: 'Consider using reduce or flatten for better performance',
            impact: 'May cause performance issues with large datasets',
            optimization: 'Use single-pass processing where possible'
        });
    }

    // 2. Repeated payload access
    const payloadAccess = (scriptContent.match(/payload\.\w+/g) || []).length;
    if (payloadAccess > 10) {
        issues.push({
            type: 'repeated_payload_access',
            severity: 'LOW',
            message: `${payloadAccess} payload access operations detected`,
            recommendation: 'Consider caching frequently accessed payload data in variables',
            impact: 'Minor performance impact, affects readability',
            optimization: 'var cachedData = payload.frequentlyUsedData'
        });
    }

    // 3. Large dataset processing without optimization
    if (inputAnalysis?.input?.category === 'large' || inputAnalysis?.input?.category === 'enterprise') {
        const hasOptimizations = scriptContent.includes('divideBy') || 
                                scriptContent.includes('flatten') ||
                                scriptContent.includes('var ');
        
        if (!hasOptimizations) {
            issues.push({
                type: 'large_dataset_unoptimized',
                severity: 'HIGH',
                message: `Large dataset (${inputAnalysis.input.category}) without performance optimizations`,
                recommendation: 'Use batching, caching, or streaming operations',
                impact: 'May exceed timeout limits or cause memory issues',
                optimization: 'Consider divideBy, flatten, or variable caching'
            });
        }
    }

    return issues;
}

// 🧪 INTELLIGENT TYPE SAFETY DETECTION
function detectTypeSafetyIssues(scriptContent) {
    const issues = [];

    // 1. Missing default operators
    const typeConversions = scriptContent.match(/as\s+(String|Number|Boolean|Date)/g) || [];
    const defaultOperators = scriptContent.match(/default\s+/g) || [];
    
    if (typeConversions.length > defaultOperators.length) {
        issues.push({
            type: 'missing_default_operators',
            severity: 'CRITICAL',
            message: `🚨 CRITICAL: ${typeConversions.length} type conversions but only ${defaultOperators.length} default operators - RUNTIME FAILURE RISK`,
            recommendation: 'Add default null for type conversions: field as Number default null (R-Genie Production Safety)',
            impact: 'PRODUCTION FAILURE: Runtime crashes on null/missing data - violates R-Genie safety standards',
            saftyPattern: 'field as TargetType default null'
        });
    }

    // 2. Unsafe array access
    const arrayAccess = scriptContent.match(/\[\d+\]/g) || [];
    if (arrayAccess.length > 0) {
        issues.push({
            type: 'unsafe_array_access',
            severity: 'MEDIUM',
            message: `${arrayAccess.length} direct array index access detected`,
            recommendation: 'Use safe array access with size checking',
            impact: 'Risk of index out of bounds errors',
            saftyPattern: 'if (sizeOf(array) > index) array[index] else defaultValue'
        });
    }

    // 3. Missing null checks
    const fieldAccess = (scriptContent.match(/\.\w+/g) || []).length;
    const nullChecks = (scriptContent.match(/!= null|is null/g) || []).length;
    
    if (fieldAccess > 20 && nullChecks < 3) {
        issues.push({
            type: 'insufficient_null_checks',
            severity: 'LOW',
            message: `${fieldAccess} field access operations with only ${nullChecks} null checks`,
            recommendation: 'Add null checks for critical field access',
            impact: 'Risk of runtime errors with missing data',
            saftyPattern: 'if (field != null) field else defaultValue'
        });
    }

    return issues;
}

// 🚀 INTELLIGENT AUTO-FIX GENERATOR
function generateAutoFixes(issues) {
    const fixes = [];

    issues.forEach(issue => {
        if (issue.autoFix) {
            fixes.push({
                type: issue.type,
                description: issue.message,
                search: issue.wrongPattern,
                replace: issue.correctPattern,
                severity: issue.severity,
                impact: issue.impact
            });
        }
    });

    return fixes;
}

// 📊 INTELLIGENT ERROR PREVENTION ANALYSIS
async function performIntelligentErrorAnalysis(scriptFile, inputFile, outputFile) {
    log('INFO', '🧠 Starting Intelligent Error Prevention Analysis');
    console.log('═══════════════════════════════════════════════════════════');

    const analysis = {
        criticalIssues: [],
        highIssues: [],
        mediumIssues: [],
        lowIssues: [],
        warningIssues: [],
        autoFixes: [],
        recommendations: [],
        summary: {
            totalIssues: 0,
            criticalCount: 0,
            preventedErrors: 0,
            optimizations: 0
        }
    };

    try {
        // Read and analyze files with caching
        log('DETAIL', 'Reading script and analyzing context...');
        const scriptContent = await readFile(scriptFile, 'utf8');
        
        let inputAnalysis = null;
        if (fs.existsSync(inputFile)) {
            const inputData = JSON.parse(await readFile(inputFile, 'utf8'));
            inputAnalysis = {
                fields: Object.keys(inputData),
                format: inputFile.endsWith('.xml') ? 'xml' : 'json',
                input: {
                    size: fs.statSync(inputFile).size,
                    category: fs.statSync(inputFile).size > 100000 ? 'large' : 'medium'
                }
            };
        }

        let outputAnalysis = null;
        if (fs.existsSync(outputFile)) {
            try {
                const outputData = JSON.parse(await readFile(outputFile, 'utf8'));
                outputAnalysis = {
                    fields: Object.keys(outputData),
                    format: outputFile.endsWith('.xml') ? 'xml' : 'json'
                };
            } catch (error) {
                log('WARNING', 'Could not parse expected output file for analysis');
            }
        }

        // Run intelligent error detection
        log('PREVENTION', '🔍 Analyzing reserved keywords...');
        const reservedIssues = detectReservedKeywords(scriptContent, inputAnalysis, outputAnalysis);

        log('PREVENTION', '🎯 Analyzing XML patterns...');
        const xmlIssues = detectXMLErrors(scriptContent, inputAnalysis, outputAnalysis);

        log('PREVENTION', '🔧 Analyzing compilation patterns...');
        const compilationIssues = detectCompilationErrors(scriptContent);

        log('PREVENTION', '🛡️ Analyzing hardcoding patterns...');
        const hardcodingIssues = detectHardcodingPatterns(scriptContent);

        log('PREVENTION', '⚡ Analyzing performance patterns...');
        const performanceIssues = detectPerformanceIssues(scriptContent, inputAnalysis);

        log('PREVENTION', '🛡️ Analyzing type safety...');
        const typeSafetyIssues = detectTypeSafetyIssues(scriptContent);

        // Categorize all issues
        const allIssues = [
            ...reservedIssues,
            ...xmlIssues,
            ...compilationIssues,
            ...hardcodingIssues,
            ...performanceIssues,
            ...typeSafetyIssues
        ];

        // Sort issues by severity
        allIssues.forEach(issue => {
            switch (issue.severity) {
                case 'CRITICAL':
                    analysis.criticalIssues.push(issue);
                    break;
                case 'HIGH':
                    analysis.highIssues.push(issue);
                    break;
                case 'MEDIUM':
                    analysis.mediumIssues.push(issue);
                    break;
                case 'LOW':
                    analysis.lowIssues.push(issue);
                    break;
                case 'WARNING':
                    analysis.warningIssues.push(issue);
                    break;
            }
        });

        // Generate auto-fixes
        analysis.autoFixes = generateAutoFixes(allIssues);

        // Generate summary
        analysis.summary.totalIssues = allIssues.length;
        analysis.summary.criticalCount = analysis.criticalIssues.length;
        analysis.summary.preventedErrors = analysis.criticalIssues.length + analysis.highIssues.length;
        analysis.summary.optimizations = performanceIssues.length;

        // Display results
        console.log('');
        log('SUCCESS', '🎯 INTELLIGENT ERROR ANALYSIS COMPLETE');
        console.log('═══════════════════════════════════════════════════════════');

        if (analysis.summary.totalIssues === 0) {
            console.log(`${colors.green}✅ NO ISSUES DETECTED - Script appears error-free!${colors.reset}`);
        } else {
            console.log(`${colors.bright}📊 ANALYSIS SUMMARY:${colors.reset}`);
            console.log(`   Total Issues: ${analysis.summary.totalIssues}`);
            console.log(`   ${colors.red}Critical: ${analysis.criticalIssues.length}${colors.reset}`);
            console.log(`   ${colors.yellow}High: ${analysis.highIssues.length}${colors.reset}`);
            console.log(`   ${colors.blue}Medium: ${analysis.mediumIssues.length}${colors.reset}`);
            console.log(`   ${colors.cyan}Low: ${analysis.lowIssues.length}${colors.reset}`);
            console.log(`   ${colors.magenta}Warnings: ${analysis.warningIssues.length}${colors.reset}`);
            console.log('');

            // Display critical issues
            if (analysis.criticalIssues.length > 0) {
                console.log(`${colors.red}🚨 CRITICAL ISSUES (Must Fix):${colors.reset}`);
                analysis.criticalIssues.forEach(issue => {
                    console.log(`   • ${issue.message}`);
                    if (issue.wrongPattern && issue.correctPattern) {
                        console.log(`     ❌ Wrong: ${colors.red}${issue.wrongPattern}${colors.reset}`);
                        console.log(`     ✅ Correct: ${colors.green}${issue.correctPattern}${colors.reset}`);
                    }
                    console.log(`     Impact: ${issue.impact}`);
                });
                console.log('');
            }

            // Display auto-fixes available
            if (analysis.autoFixes.length > 0) {
                console.log(`${colors.green}🔧 AUTO-FIXES AVAILABLE: ${analysis.autoFixes.length}${colors.reset}`);
                analysis.autoFixes.forEach(fix => {
                    console.log(`   • ${fix.description}`);
                    console.log(`     Replace: "${fix.search}" → "${fix.replace}"`);
                });
                console.log('');
            }

            // Display prevention summary
            console.log(`${colors.bright}🛡️ ERROR PREVENTION SUMMARY:${colors.reset}`);
            console.log(`   ${colors.green}Prevented CLI Errors: ${analysis.summary.preventedErrors}${colors.reset}`);
            console.log(`   ${colors.blue}Performance Optimizations: ${analysis.summary.optimizations}${colors.reset}`);
            console.log(`   ${colors.cyan}Auto-Fix Solutions: ${analysis.autoFixes.length}${colors.reset}`);
        }

        return analysis;

    } catch (error) {
        log('ERROR', `Analysis failed: ${error.message}`);
        return {
            success: false,
            error: error.message,
            summary: { totalIssues: 0, criticalCount: 0, preventedErrors: 0, optimizations: 0 }
        };
    }
}

// 🔧 CLI INTERFACE
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length < 1) {
        console.log(`${colors.bright}🚨 R-Genie Error Detector Enhanced v1.0${colors.reset}`);
        console.log("═══════════════════════════════════════════════════════════");
        console.log("");
        console.log("Intelligent error detection and prevention with auto-fix generation");
        console.log("");
        console.log("USAGE:");
        console.log("  node error-detector-enhanced.js <script.dwl> [input.json] [output.json]");
        console.log("");
        console.log("FEATURES:");
        console.log("  🧠 Intelligent error pattern detection");
        console.log("  🎯 XML-specific error prevention");
        console.log("  🛡️ Hardcoding pattern analysis");
        console.log("  ⚡ Performance issue detection");
        console.log("  🔧 Auto-fix generation");
        console.log("  📊 Comprehensive error prevention");
        console.log("");
        console.log("EXAMPLE:");
        console.log("  node error-detector-enhanced.js script.dwl input.json expected.json");
        process.exit(1);
    }

    const [scriptFile, inputFile, outputFile] = args;

    console.log(`${colors.bright}🚨 R-Genie Error Detector Enhanced v1.0${colors.reset}`);
    console.log("═══════════════════════════════════════════════════════════");
    console.log("");

    const result = await performIntelligentErrorAnalysis(scriptFile, inputFile, outputFile);
    
    if (result.success === false) {
        process.exit(1);
    } else if (result.summary.criticalCount > 0) {
        log('WARNING', 'Critical issues detected - recommend fixing before CLI execution');
        process.exit(2); // Different exit code for critical issues
    } else {
        log('SUCCESS', 'Error analysis complete - script ready for validation');
        process.exit(0);
    }
}

if (require.main === module) {
    main().catch(error => {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    });
}

module.exports = {
    performIntelligentErrorAnalysis,
    detectReservedKeywords,
    detectXMLErrors,
    detectCompilationErrors,
    detectHardcodingPatterns,
    detectPerformanceIssues,
    generateAutoFixes
};
