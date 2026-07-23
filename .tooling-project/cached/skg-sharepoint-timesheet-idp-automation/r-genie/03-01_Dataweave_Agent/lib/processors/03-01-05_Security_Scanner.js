#!/usr/bin/env node

/**
 * 🛡️ R-Genie Security Scanner Enhanced v1.0
 * Intelligent security validation and performance monitoring with automated compliance checking
 * @signature Q2hlcHBhbGlTaGFpa1NvaGFpbDE1MDgxOTkz
 * Transforms static quality gates into intelligent security automation
 */

const fs = require('fs');
const path = require('path');
const { getConfig } = require('../utilities/03-01-18_Config_Manager.js');
const { readFile } = require('../utilities/03-01-21_File_Utils.js');
const crypto = require('crypto');

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
        'SECURITY': colors.magenta,
        'COMPLIANCE': colors.blue
    };
    
    const color = levelColors[level] || colors.reset;
    console.log(`${color}[${level}]${colors.reset} ${message}`);
}

// 🔒 INTELLIGENT SENSITIVE DATA DETECTION
function detectSensitiveData(scriptContent, inputFile, outputFile) {
    const violations = [];
    
    // 1. Hardcoded sensitive data patterns
    const sensitivePatterns = [
        { pattern: /password\s*[:=]\s*["']?[^"',\s]+/gi, type: 'password', severity: 'CRITICAL' },
        { pattern: /token\s*[:=]\s*["']?[^"',\s]+/gi, type: 'token', severity: 'CRITICAL' },
        { pattern: /key\s*[:=]\s*["']?[^"',\s]+/gi, type: 'key', severity: 'CRITICAL' },
        { pattern: /secret\s*[:=]\s*["']?[^"',\s]+/gi, type: 'secret', severity: 'CRITICAL' },
        { pattern: /credential\s*[:=]\s*["']?[^"',\s]+/gi, type: 'credential', severity: 'CRITICAL' },
        { pattern: /api[_-]?key\s*[:=]\s*["']?[^"',\s]+/gi, type: 'api_key', severity: 'CRITICAL' },
        { pattern: /database\s*[:=]\s*["']?[^"',\s]+/gi, type: 'database_connection', severity: 'HIGH' },
        { pattern: /jdbc\s*[:=]\s*["']?[^"',\s]+/gi, type: 'database_connection', severity: 'HIGH' },
        { pattern: /https?:\/\/[^"',\s]+/gi, type: 'url', severity: 'MEDIUM' }
    ];

    sensitivePatterns.forEach(({ pattern, type, severity }) => {
        const matches = scriptContent.match(pattern) || [];
        matches.forEach(match => {
            violations.push({
                category: 'sensitive_data',
                type: type,
                severity: severity,
                message: `Hardcoded ${type} detected: ${match.substring(0, 20)}...`,
                pattern: match,
                recommendation: `Remove hardcoded ${type} and use environment variables or secure vault`,
                impact: 'Security risk - sensitive data exposure',
                compliance: 'Violates data security policies'
            });
        });
    });

    // 2. PII (Personally Identifiable Information) patterns
    const piiPatterns = [
        { pattern: /ssn\s*[:=]\s*["']?\d{3}-?\d{2}-?\d{4}/gi, type: 'ssn', severity: 'CRITICAL' },
        { pattern: /email\s*[:=]\s*["']?[^@\s]+@[^@\s]+\.[^"',\s]+/gi, type: 'email', severity: 'HIGH' },
        { pattern: /phone\s*[:=]\s*["']?[\+]?[\d\s\-\(\)]{10,}/gi, type: 'phone', severity: 'MEDIUM' },
        { pattern: /credit[_-]?card\s*[:=]\s*["']?\d{4}[^\d]*\d{4}/gi, type: 'credit_card', severity: 'CRITICAL' }
    ];

    piiPatterns.forEach(({ pattern, type, severity }) => {
        const matches = scriptContent.match(pattern) || [];
        matches.forEach(match => {
            violations.push({
                category: 'pii_exposure',
                type: type,
                severity: severity,
                message: `PII detected: ${type} in script`,
                pattern: match.substring(0, 30) + '...',
                recommendation: `Mask or remove PII - use anonymization functions`,
                impact: 'Privacy violation - PII exposure risk',
                compliance: 'GDPR/CCPA compliance violation'
            });
        });
    });

    // 3. File content analysis for sensitive data
    [inputFile, outputFile].forEach(file => {
        if (file && fs.existsSync(file)) {
            try {
                const content = fs.readFileSync(file, 'utf8');
                const sampleSize = Math.min(content.length, 1000); // Check first 1KB
                const sample = content.substring(0, sampleSize);
                
                // Check for sensitive patterns in data files
                sensitivePatterns.forEach(({ pattern, type, severity }) => {
                    if (severity === 'CRITICAL' && pattern.test(sample)) {
                        violations.push({
                            category: 'sensitive_data_in_files',
                            type: type,
                            severity: 'HIGH',
                            message: `Possible ${type} detected in ${path.basename(file)}`,
                            recommendation: `Review and sanitize ${type} in data files`,
                            impact: 'Data security risk in input/output files',
                            compliance: 'Data handling policy violation'
                        });
                    }
                });
            } catch (error) {
                log('WARNING', `Could not analyze ${file} for sensitive data`);
            }
        }
    });

    return violations;
}

// 🚨 INTELLIGENT INJECTION RISK DETECTION
function detectInjectionRisks(scriptContent) {
    const violations = [];

    // 1. SQL injection patterns
    const sqlPatterns = [
        { pattern: /SELECT\s+.*\s+FROM\s+.*\s+WHERE/gi, type: 'sql_query', severity: 'HIGH' },
        { pattern: /INSERT\s+INTO\s+.*\s+VALUES/gi, type: 'sql_insert', severity: 'HIGH' },
        { pattern: /UPDATE\s+.*\s+SET\s+.*\s+WHERE/gi, type: 'sql_update', severity: 'HIGH' },
        { pattern: /DELETE\s+FROM\s+.*\s+WHERE/gi, type: 'sql_delete', severity: 'HIGH' },
        { pattern: /\+\s*"[^"]*"\s*\+/g, type: 'string_concatenation', severity: 'MEDIUM' }
    ];

    sqlPatterns.forEach(({ pattern, type, severity }) => {
        const matches = scriptContent.match(pattern) || [];
        matches.forEach(match => {
            violations.push({
                category: 'injection_risk',
                type: type,
                severity: severity,
                message: `Potential SQL injection risk: ${type}`,
                pattern: match.substring(0, 50) + '...',
                recommendation: 'Use parameterized queries and input validation',
                impact: 'SQL injection vulnerability',
                compliance: 'Security standards violation'
            });
        });
    });

    // 2. Script injection patterns
    const scriptPatterns = [
        { pattern: /<script[^>]*>/gi, type: 'script_tag', severity: 'HIGH' },
        { pattern: /javascript\s*:/gi, type: 'javascript_protocol', severity: 'HIGH' },
        { pattern: /vbscript\s*:/gi, type: 'vbscript_protocol', severity: 'HIGH' },
        { pattern: /eval\s*\(/gi, type: 'eval_function', severity: 'CRITICAL' },
        { pattern: /Function\s*\(/gi, type: 'function_constructor', severity: 'HIGH' }
    ];

    scriptPatterns.forEach(({ pattern, type, severity }) => {
        const matches = scriptContent.match(pattern) || [];
        matches.forEach(match => {
            violations.push({
                category: 'script_injection',
                type: type,
                severity: severity,
                message: `Script injection risk: ${type}`,
                pattern: match,
                recommendation: 'Remove dynamic code execution and validate all inputs',
                impact: 'Code injection vulnerability',
                compliance: 'Security policy violation'
            });
        });
    });

    // 3. Template injection patterns
    const templatePatterns = [
        { pattern: /\$\{[^}]*\}/g, type: 'template_literal', severity: 'MEDIUM' },
        { pattern: /#\{[^}]*\}/g, type: 'hash_interpolation', severity: 'MEDIUM' },
        { pattern: /\{\{[^}]*\}\}/g, type: 'mustache_template', severity: 'MEDIUM' }
    ];

    templatePatterns.forEach(({ pattern, type, severity }) => {
        const matches = scriptContent.match(pattern) || [];
        matches.forEach(match => {
            violations.push({
                category: 'template_injection',
                type: type,
                severity: severity,
                message: `Template injection risk: ${type}`,
                pattern: match,
                recommendation: 'Validate and sanitize template inputs',
                impact: 'Template injection vulnerability',
                compliance: 'Input validation requirement'
            });
        });
    });

    return violations;
}

// ⚡ INTELLIGENT PERFORMANCE RISK ANALYSIS
function analyzePerformanceRisks(scriptContent, inputFile) {
    const risks = [];
    let inputSize = 0;
    
    // Get input file size for context
    if (inputFile && fs.existsSync(inputFile)) {
        inputSize = fs.statSync(inputFile).size;
    }

    // 1. Execution time risk analysis
    const complexityIndicators = [
        { pattern: /map\s*\(/g, factor: 1, description: 'map operations' },
        { pattern: /reduce\s*\(/g, factor: 2, description: 'reduce operations' },
        { pattern: /filter\s*\(/g, factor: 1, description: 'filter operations' },
        { pattern: /groupBy\s*\(/g, factor: 3, description: 'groupBy operations' },
        { pattern: /orderBy\s*\(/g, factor: 2, description: 'orderBy operations' },
        { pattern: /distinctBy\s*\(/g, factor: 2, description: 'distinctBy operations' },
        { pattern: /joinBy\s*\(/g, factor: 4, description: 'join operations' }
    ];

    let complexityScore = 0;
    const detectedOperations = [];

    complexityIndicators.forEach(({ pattern, factor, description }) => {
        const matches = scriptContent.match(pattern) || [];
        if (matches.length > 0) {
            complexityScore += matches.length * factor;
            detectedOperations.push(`${matches.length} ${description}`);
        }
    });

    // Risk assessment based on complexity and input size
    const riskThresholds = {
        small: { low: 5, medium: 10, high: 20 },
        medium: { low: 3, medium: 7, high: 15 },
        large: { low: 2, medium: 5, high: 10 },
        enterprise: { low: 1, medium: 3, high: 7 }
    };

    let sizeCategory = 'small';
    if (inputSize > 10485760) sizeCategory = 'enterprise';
    else if (inputSize > 102400) sizeCategory = 'large';
    else if (inputSize > 1024) sizeCategory = 'medium';

    const thresholds = riskThresholds[sizeCategory];
    let riskLevel = 'LOW';
    let expectedTime = 1000;

    if (complexityScore >= thresholds.high) {
        riskLevel = 'HIGH';
        expectedTime = sizeCategory === 'enterprise' ? 30000 : 15000;
    } else if (complexityScore >= thresholds.medium) {
        riskLevel = 'MEDIUM';
        expectedTime = sizeCategory === 'large' ? 10000 : 5000;
    } else if (complexityScore >= thresholds.low) {
        riskLevel = 'LOW';
        expectedTime = 2000;
    }

    if (riskLevel !== 'LOW') {
        risks.push({
            category: 'performance_risk',
            type: 'execution_time',
            severity: riskLevel,
            message: `${riskLevel} performance risk detected (complexity: ${complexityScore})`,
            details: detectedOperations.join(', '),
            recommendation: riskLevel === 'HIGH' ? 'Consider optimization or batching' : 'Monitor execution time',
            impact: `May exceed ${expectedTime}ms execution time`,
            expectedTime: expectedTime,
            inputSize: inputSize,
            sizeCategory: sizeCategory
        });
    }

    // 2. Memory usage risk analysis
    const memoryRisks = [
        { pattern: /map\s*\([^)]*map\s*\(/g, type: 'nested_mapping', severity: 'MEDIUM' },
        { pattern: /reduce\s*\([^)]*\+\+/g, type: 'object_accumulation', severity: 'LOW' },
        { pattern: /\[\s*\.\.\.[^]]*\]/g, type: 'array_spreading', severity: 'LOW' }
    ];

    memoryRisks.forEach(({ pattern, type, severity }) => {
        const matches = scriptContent.match(pattern) || [];
        if (matches.length > 0) {
            risks.push({
                category: 'memory_risk',
                type: type,
                severity: severity,
                message: `Memory usage risk: ${type}`,
                occurrences: matches.length,
                recommendation: 'Consider memory-efficient alternatives or streaming',
                impact: 'Potential memory overflow with large datasets'
            });
        }
    });

    return risks;
}

// 🔍 INTELLIGENT INPUT VALIDATION ANALYSIS
function analyzeInputValidation(scriptContent) {
    const issues = [];

    // 1. Missing type safety
    const typeConversions = scriptContent.match(/as\s+(String|Number|Boolean|Date)/g) || [];
    const safeConversions = scriptContent.match(/as\s+\w+\s+default/g) || [];
    
    if (typeConversions.length > safeConversions.length) {
        const unsafeCount = typeConversions.length - safeConversions.length;
        issues.push({
            category: 'input_validation',
            type: 'unsafe_type_conversion',
            severity: 'CRITICAL',
            message: `🚨 CRITICAL: ${unsafeCount} unsafe type conversions without default values - RUNTIME FAILURE RISK`,
            recommendation: 'Add default null: field as Number default null (R-Genie Production Safety Requirement)',
            impact: 'PRODUCTION FAILURE: Runtime crashes on null/missing data - violates R-Genie safety standards',
            compliance: 'R-Genie Critical Production Safety (Aug 2025 learnings)'
        });
    }

    // 2. Missing null checks
    const fieldAccess = (scriptContent.match(/\.\w+/g) || []).length;
    const nullChecks = (scriptContent.match(/!= null|is null|\?/g) || []).length;
    
    if (fieldAccess > 10 && nullChecks < Math.floor(fieldAccess * 0.1)) {
        issues.push({
            category: 'input_validation',
            type: 'insufficient_null_checks',
            severity: 'LOW',
            message: `${fieldAccess} field accesses with only ${nullChecks} null checks`,
            recommendation: 'Add null checks for critical field access',
            impact: 'Risk of null pointer exceptions',
            compliance: 'Defensive programming requirement'
        });
    }

    // 3. Input sanitization
    const userInputPatterns = [
        'payload.userInput',
        'payload.query',
        'payload.search',
        'payload.filter'
    ];

    userInputPatterns.forEach(pattern => {
        if (scriptContent.includes(pattern)) {
            const sanitizationPattern = new RegExp(`${pattern}[^)]*sanitize|clean|validate`, 'i');
            if (!scriptContent.match(sanitizationPattern)) {
                issues.push({
                    category: 'input_validation',
                    type: 'unsanitized_input',
                    severity: 'HIGH',
                    message: `User input ${pattern} may not be sanitized`,
                    recommendation: 'Add input sanitization before processing',
                    impact: 'Risk of injection attacks',
                    compliance: 'Input sanitization requirement'
                });
            }
        }
    });

    return issues;
}

// 📋 INTELLIGENT COMPLIANCE CHECKER
function checkCompliance(allViolations, scriptContent) {
    const complianceReport = {
        gdpr: { compliant: true, violations: [] },
        security: { compliant: true, violations: [] },
        performance: { compliant: true, violations: [] },
        dataHandling: { compliant: true, violations: [] }
    };

    // GDPR compliance check
    const gdprViolations = allViolations.filter(v => 
        v.category === 'pii_exposure' || 
        (v.category === 'sensitive_data' && ['email', 'phone'].includes(v.type))
    );
    
    if (gdprViolations.length > 0) {
        complianceReport.gdpr.compliant = false;
        complianceReport.gdpr.violations = gdprViolations;
    }

    // Security compliance check
    const securityViolations = allViolations.filter(v => 
        v.category === 'injection_risk' || 
        v.category === 'script_injection' ||
        (v.category === 'sensitive_data' && v.severity === 'CRITICAL')
    );
    
    if (securityViolations.length > 0) {
        complianceReport.security.compliant = false;
        complianceReport.security.violations = securityViolations;
    }

    // Performance compliance check
    const performanceViolations = allViolations.filter(v => 
        v.category === 'performance_risk' && v.severity === 'HIGH'
    );
    
    if (performanceViolations.length > 0) {
        complianceReport.performance.compliant = false;
        complianceReport.performance.violations = performanceViolations;
    }

    // Data handling compliance check
    const dataViolations = allViolations.filter(v => 
        v.category === 'sensitive_data_in_files' ||
        (v.category === 'input_validation' && v.severity !== 'LOW')
    );
    
    if (dataViolations.length > 0) {
        complianceReport.dataHandling.compliant = false;
        complianceReport.dataHandling.violations = dataViolations;
    }

    return complianceReport;
}

// 🚀 MAIN SECURITY ANALYSIS FUNCTION
async function performIntelligentSecurityAnalysis(scriptFile, inputFile, outputFile) {
    log('INFO', '🛡️ Starting Intelligent Security Analysis');
    console.log('═══════════════════════════════════════════════════════════');

    const analysis = {
        criticalViolations: [],
        highViolations: [],
        mediumViolations: [],
        lowViolations: [],
        compliance: null,
        recommendations: [],
        summary: {
            totalViolations: 0,
            criticalCount: 0,
            securityScore: 100,
            complianceStatus: 'COMPLIANT'
        }
    };

    try {
        // Read script content with caching
        log('SECURITY', 'Reading and analyzing script content...');
        const scriptContent = await readFile(scriptFile, 'utf8');

        // Run security analysis modules
        log('SECURITY', '🔍 Detecting sensitive data...');
        const sensitiveViolations = detectSensitiveData(scriptContent, inputFile, outputFile);

        log('SECURITY', '🚨 Analyzing injection risks...');
        const injectionViolations = detectInjectionRisks(scriptContent);

        log('SECURITY', '⚡ Analyzing performance risks...');
        const performanceViolations = analyzePerformanceRisks(scriptContent, inputFile);

        log('SECURITY', '🔍 Checking input validation...');
        const inputValidationViolations = analyzeInputValidation(scriptContent);

        // Combine all violations
        const allViolations = [
            ...sensitiveViolations,
            ...injectionViolations,
            ...performanceViolations,
            ...inputValidationViolations
        ];

        // Categorize by severity
        allViolations.forEach(violation => {
            switch (violation.severity) {
                case 'CRITICAL':
                    analysis.criticalViolations.push(violation);
                    break;
                case 'HIGH':
                    analysis.highViolations.push(violation);
                    break;
                case 'MEDIUM':
                    analysis.mediumViolations.push(violation);
                    break;
                case 'LOW':
                    analysis.lowViolations.push(violation);
                    break;
            }
        });

        // Run compliance check
        log('COMPLIANCE', '📋 Checking regulatory compliance...');
        analysis.compliance = checkCompliance(allViolations, scriptContent);

        // Calculate security score
        const config = getConfig();
        const severityWeights = config.getSecurity('severityWeights') || { CRITICAL: -25, HIGH: -10, MEDIUM: -5, LOW: -2 };
        const deduction = allViolations.reduce((total, violation) => {
            return total + (severityWeights[violation.severity] || 0);
        }, 0);
        
        analysis.summary.securityScore = Math.max(0, 100 + deduction);
        analysis.summary.totalViolations = allViolations.length;
        analysis.summary.criticalCount = analysis.criticalViolations.length;

        // Determine overall compliance status
        const hasComplianceIssues = Object.values(analysis.compliance).some(c => !c.compliant);
        analysis.summary.complianceStatus = hasComplianceIssues ? 'NON-COMPLIANT' : 'COMPLIANT';

        // Generate recommendations
        if (analysis.criticalViolations.length > 0) {
            analysis.recommendations.push('CRITICAL: Address all critical security violations before deployment');
        }
        if (analysis.highViolations.length > 0) {
            analysis.recommendations.push('HIGH: Review and fix high-severity security issues');
        }
        if (!analysis.compliance.security.compliant) {
            analysis.recommendations.push('SECURITY: Implement security controls to meet compliance requirements');
        }
        if (analysis.summary.securityScore < 80) {
            analysis.recommendations.push('SCORE: Security score below acceptable threshold (80)');
        }

        // Display results
        console.log('');
        log('SUCCESS', '🎯 INTELLIGENT SECURITY ANALYSIS COMPLETE');
        console.log('═══════════════════════════════════════════════════════════');

        // Security Score
        const scoreColor = analysis.summary.securityScore >= 90 ? colors.green : 
                          analysis.summary.securityScore >= 70 ? colors.yellow : colors.red;
        console.log(`${colors.bright}🛡️ SECURITY SCORE: ${scoreColor}${analysis.summary.securityScore}/100${colors.reset}`);
        console.log(`${colors.bright}📊 COMPLIANCE STATUS: ${analysis.summary.complianceStatus === 'COMPLIANT' ? colors.green : colors.red}${analysis.summary.complianceStatus}${colors.reset}`);
        console.log('');

        // Violations summary
        if (analysis.summary.totalViolations === 0) {
            console.log(`${colors.green}✅ NO SECURITY VIOLATIONS DETECTED${colors.reset}`);
        } else {
            console.log(`${colors.bright}📊 VIOLATIONS SUMMARY:${colors.reset}`);
            console.log(`   Total: ${analysis.summary.totalViolations}`);
            console.log(`   ${colors.red}Critical: ${analysis.criticalViolations.length}${colors.reset}`);
            console.log(`   ${colors.yellow}High: ${analysis.highViolations.length}${colors.reset}`);
            console.log(`   ${colors.blue}Medium: ${analysis.mediumViolations.length}${colors.reset}`);
            console.log(`   ${colors.cyan}Low: ${analysis.lowViolations.length}${colors.reset}`);
            console.log('');

            // Display critical violations
            if (analysis.criticalViolations.length > 0) {
                console.log(`${colors.red}🚨 CRITICAL SECURITY VIOLATIONS:${colors.reset}`);
                analysis.criticalViolations.forEach(violation => {
                    console.log(`   • ${violation.message}`);
                    console.log(`     Impact: ${violation.impact}`);
                    console.log(`     Action: ${violation.recommendation}`);
                });
                console.log('');
            }
        }

        // Compliance report
        console.log(`${colors.bright}📋 COMPLIANCE REPORT:${colors.reset}`);
        Object.entries(analysis.compliance).forEach(([standard, status]) => {
            const statusColor = status.compliant ? colors.green : colors.red;
            const statusText = status.compliant ? 'COMPLIANT' : 'NON-COMPLIANT';
            console.log(`   ${standard.toUpperCase()}: ${statusColor}${statusText}${colors.reset}`);
            if (!status.compliant && status.violations.length > 0) {
                console.log(`     Violations: ${status.violations.length}`);
            }
        });

        // Recommendations
        if (analysis.recommendations.length > 0) {
            console.log('');
            console.log(`${colors.bright}💡 SECURITY RECOMMENDATIONS:${colors.reset}`);
            analysis.recommendations.forEach(rec => {
                console.log(`   • ${rec}`);
            });
        }

        return analysis;

    } catch (error) {
        log('ERROR', `Security analysis failed: ${error.message}`);
        return {
            success: false,
            error: error.message,
            summary: { totalViolations: 0, criticalCount: 0, securityScore: 0, complianceStatus: 'UNKNOWN' }
        };
    }
}

// 🔧 CLI INTERFACE
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length < 1) {
        console.log(`${colors.bright}🛡️ R-Genie Security Scanner Enhanced v1.0${colors.reset}`);
        console.log("═══════════════════════════════════════════════════════════");
        console.log("");
        console.log("Intelligent security validation and compliance checking");
        console.log("");
        console.log("USAGE:");
        console.log("  node security-scanner-enhanced.js <script.dwl> [input.json] [output.json]");
        console.log("");
        console.log("FEATURES:");
        console.log("  🔒 Sensitive data detection and PII analysis");
        console.log("  🚨 Injection risk assessment and prevention");
        console.log("  ⚡ Performance risk analysis and prediction");
        console.log("  📋 Regulatory compliance checking (GDPR, Security)");
        console.log("  🛡️ Comprehensive security scoring");
        console.log("  💡 Intelligent security recommendations");
        console.log("");
        console.log("EXAMPLE:");
        console.log("  node security-scanner-enhanced.js script.dwl input.json output.json");
        process.exit(1);
    }

    const [scriptFile, inputFile, outputFile] = args;

    console.log(`${colors.bright}🛡️ R-Genie Security Scanner Enhanced v1.0${colors.reset}`);
    console.log("═══════════════════════════════════════════════════════════");
    console.log("");

    const result = await performIntelligentSecurityAnalysis(scriptFile, inputFile, outputFile);
    
    if (result.success === false) {
        process.exit(1);
    } else if (result.summary.criticalCount > 0) {
        log('ERROR', 'Critical security violations detected - deployment blocked');
        process.exit(2); // Critical security issues
    } else if (result.summary.securityScore < 70) {
        log('WARNING', 'Security score below threshold - review recommended');
        process.exit(3); // Low security score
    } else {
        log('SUCCESS', 'Security analysis complete - approved for deployment');
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
    performIntelligentSecurityAnalysis,
    detectSensitiveData,
    detectInjectionRisks,
    analyzePerformanceRisks,
    analyzeInputValidation,
    checkCompliance
};
