/**
 * 🚀 R-Genie Comprehensive Quality Gates System v3.0
 * Consolidated Node.js implementation of all quality checks and security validations
 * @signature Q2hlcHBhbGlTaGFpa1NvaGFpbDE1MDgxOTkz
 * Replaces bash-based quality gates with enhanced, configurable, and extensible system
 */

const fs = require('fs').promises;
const path = require('path');
const { createErrorHandler, ErrorFactories } = require('../utilities/03-01-19_Error_Handler.js');
const { createLogger } = require('../utilities/03-01-20_Unified_Logger.js');
const { getConfig } = require('../utilities/03-01-18_Config_Manager.js');
const { readFile } = require('../utilities/03-01-21_File_Utils.js');

const errorHandler = createErrorHandler('quality-gates');
const logger = createLogger('quality-gates', { level: 'INFO' });
// @watermark CS150893‌

class QualityGatesEngine {
    constructor(options = {}) {
        this.options = {
            enableAllChecks: options.enableAllChecks !== false,
            strictMode: options.strictMode !== false,
            enableAutoFix: options.enableAutoFix !== false,
            reportFormat: options.reportFormat || 'detailed', // detailed, summary, json
            ...options
        };
        
        // Initialize quality checks
        this.checks = this.initializeQualityChecks();
        
        // Violation tracking
        this.violations = [];
        this.warnings = [];
        this.suggestions = [];
        this.metrics = {
            totalChecks: 0,
            passedChecks: 0,
            failedChecks: 0,
            warningChecks: 0,
            linesScanned: 0,
            executionTime: 0
        };
        
        // Load configuration with CLI-optimized settings (disable hot reload to prevent hanging)
        this.loadConfiguration();
    }
    
    loadConfiguration() {
        // Get configuration from central config manager (disable hot reload for CLI to prevent hanging)
        const { initializeConfig } = require('../utilities/03-01-18_Config_Manager.js');
        const configManager = initializeConfig({ enableHotReload: false });
        
        this.config = {
            security: {
                enableHardcodeDetection: configManager.getSecurity('enableHardcodeDetection') ?? true,
                blockedPatterns: configManager.getSecurity('blockedPatterns') ?? ['password', 'secret', 'key', 'token'],
                allowedPatterns: configManager.getSecurity('allowedPatterns') ?? []
            },
            validation: {
                accuracyThreshold: configManager.getValidation('accuracyThreshold') ?? 80,
                securityThreshold: configManager.getValidation('securityThreshold') ?? 70
            },
            development: {
                enableDebugMode: configManager.getDevelopment('enableDebugMode') ?? false
            }
        };
    }
    
    initializeQualityChecks() {
        return {
            // Core hardcode detection checks
            hardcodedDates: {
                name: 'Hardcoded Date/Time Literals',
                category: 'security',
                severity: 'high',
                enabled: true,
                pattern: /\|[0-9]{4}-[0-9]{2}-[0-9]{2}(?:T[0-9]{2}:[0-9]{2}:[0-9]{2})?(?:\.[0-9]+)?(?:Z|[+-][0-9]{2}:[0-9]{2})?\|/g,
                exemptionPattern: /\/\/.*(?:user.*consent|approved|testing|example)/i,
                check: this.checkHardcodedDates.bind(this)
            },
            
            suspiciousNumbers: {
                name: 'Suspicious Numeric Literals',
                category: 'security',
                severity: 'medium',
                enabled: true,
                pattern: /var\s+[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*[0-9]+\.?[0-9]*\s*$/,
                exemptionPattern: /\/\/.*(?:user.*consent|approved|config)|(?:sizeOf|length|index|Math\.|default\s+[0-9])/i,
                check: this.checkSuspiciousNumbers.bind(this)
            },
            
            hardcodedStrings: {
                name: 'Hardcoded Business Strings',
                category: 'security',
                severity: 'high',
                enabled: true,
                pattern: /:\s*"[A-Z_][A-Z_0-9]{2,}"\s*(?:$|[,}])/,
                exemptionPattern: /(?:application\/json|application\/xml|UTF-8|ISO|dw::)|\/\/.*(?:user.*consent|approved|config)/i,
                check: this.checkHardcodedStrings.bind(this)
            },
            
            hardcodedArraysObjects: {
                name: 'Hardcoded Arrays/Objects',
                category: 'security',
                severity: 'medium',
                enabled: true,
                pattern: /var\s+\w+\s*=\s*[\[{]/,
                exemptionPattern: /\/\/.*(?:user.*consent|approved|config|template)/i,
                check: this.checkHardcodedArraysObjects.bind(this)
            },
            
            unsafeTypeCoercions: {
                name: 'Unsafe Type Coercions',
                category: 'safety',
                severity: 'critical',
                enabled: true,
                pattern: /\bas\s+(Number|String|Boolean|Date)(?!\s+default)/,
                exemptionPattern: /\/\/.*(?:safe|reviewed|approved)/i,
                check: this.checkUnsafeTypeCoercions.bind(this)
            },
            
            unsafeArithmeticOperations: {
                name: 'Unsafe Arithmetic Operations (Runtime Crash Risk)',
                category: 'safety',
                severity: 'critical',
                enabled: true,
                pattern: null, // Dynamic checking
                exemptionPattern: /\/\/.*(?:safe|verified|null.*checked)/i,
                check: this.checkUnsafeArithmeticOperations.bind(this)
            },
            
            missingArithmeticDefaults: {
                name: 'Missing Safe Defaults for Arithmetic Fields',
                category: 'safety',
                severity: 'high',
                enabled: true,
                pattern: null, // Dynamic checking  
                exemptionPattern: /\/\/.*(?:user.*consent|approved|business.*requirement)/i,
                check: this.checkMissingArithmeticDefaults.bind(this)
            },
            
            // Enhanced security checks
            sensitiveData: {
                name: 'Sensitive Data Exposure',
                category: 'security',
                severity: 'critical',
                enabled: true,
                pattern: null, // Dynamic based on config
                exemptionPattern: /\/\/.*(?:mock|test|example)/i,
                check: this.checkSensitiveData.bind(this)
            },
            
            sqlInjection: {
                name: 'SQL Injection Risks',
                category: 'security',
                severity: 'critical',
                enabled: true,
                pattern: /(?:SELECT|INSERT|UPDATE|DELETE|DROP|CREATE)\s+.*\+.*payload/i,
                exemptionPattern: /\/\/.*(?:safe|parameterized|reviewed)/i,
                check: this.checkSQLInjection.bind(this)
            },
            
            unsafeEval: {
                name: 'Unsafe Dynamic Evaluation',
                category: 'security',
                severity: 'critical',
                enabled: true,
                pattern: /eval\s*\(|Function\s*\(|new\s+Function/i,
                exemptionPattern: /\/\/.*(?:safe|reviewed|approved)/i,
                check: this.checkUnsafeEval.bind(this)
            },
            
            // Performance and best practices
            inefficientOperations: {
                name: 'Inefficient Operations',
                category: 'performance',
                severity: 'medium',
                enabled: true,
                pattern: null,
                exemptionPattern: /\/\/.*(?:performance.*reviewed|optimized)/i,
                check: this.checkIneffientOperations.bind(this)
            },
            
            deprecatedFunctions: {
                name: 'Deprecated Functions',
                category: 'maintenance',
                severity: 'low',
                enabled: true,
                pattern: null,
                exemptionPattern: /\/\/.*(?:legacy.*required|migration.*pending)/i,
                check: this.checkDeprecatedFunctions.bind(this)
            },
            
            // DataWeave-specific checks
            missingNullHandling: {
                name: 'Missing Null Handling',
                category: 'safety',
                severity: 'high',
                enabled: true,
                pattern: null,
                exemptionPattern: /\/\/.*(?:null.*safe|validated)/i,
                check: this.checkMissingNullHandling.bind(this)
            },
            
            dynamicFunctionUsage: {
                name: 'Dynamic Function Usage Verification',
                category: 'best-practices',
                severity: 'low',
                enabled: true,
                pattern: null,
                exemptionPattern: /\/\/.*(?:static.*required|hardcode.*approved)/i,
                check: this.checkDynamicFunctionUsage.bind(this)
            }
        };
    }
    
    /**
     * Main validation entry point
     */
    async validateScript(scriptPath, options = {}) {
        const startTime = Date.now();
        
        logger.stepStart('Quality Gates Validation', `Comprehensive quality check for ${path.basename(scriptPath)}`);
        
        try {
            // Reset state
            this.violations = [];
            this.warnings = [];
            this.suggestions = [];
            this.metrics = {
                totalChecks: 0,
                passedChecks: 0,
                failedChecks: 0,
                warningChecks: 0,
                linesScanned: 0,
                executionTime: 0
            };
            
            // Read script content with caching
            const content = await readFile(scriptPath, 'utf8');
            const lines = content.split('\n');
            this.metrics.linesScanned = lines.length;
            
            logger.info(`🔍 Analyzing ${lines.length} lines in ${path.basename(scriptPath)}`);
            
            // Run all enabled checks
            for (const [checkId, check] of Object.entries(this.checks)) {
                if (check.enabled && (this.options.enableAllChecks || !options.skipChecks?.includes(checkId))) {
                    this.metrics.totalChecks++;
                    
                    try {
                        logger.debug(`Running check: ${check.name}`);
                        await check.check(content, lines, scriptPath);
                        this.metrics.passedChecks++;
                    } catch (error) {
                        this.metrics.failedChecks++;
                        logger.warning(`Check ${check.name} failed: ${error.message}`);
                    }
                }
            }
            
            // Additional dynamic checks
            await this.runComplexityAnalysis(content, lines);
            
            // Calculate final metrics
            this.metrics.executionTime = Date.now() - startTime;
            
            // Generate report
            const report = this.generateReport(scriptPath);
            
            // Determine overall result
            const criticalViolations = this.violations.filter(v => v.severity === 'critical').length;
            const highViolations = this.violations.filter(v => v.severity === 'high').length;
            
            const success = criticalViolations === 0 && highViolations === 0;
            
            logger.stepEnd('Quality Gates Validation', success, {
                violations: this.violations.length,
                warnings: this.warnings.length,
                suggestions: this.suggestions.length
            });
            
            return {
                success,
                report,
                violations: this.violations,
                warnings: this.warnings,
                suggestions: this.suggestions,
                metrics: this.metrics,
                summary: this.generateSummary()
            };
            
        } catch (error) {
            logger.stepEnd('Quality Gates Validation', false, { error: error.message });
            throw ErrorFactories.validationFailed('Quality gates validation failed', error.message);
        }
    }
    
    /**
     * Individual check implementations
     */
    async checkHardcodedDates(content, lines, scriptPath) {
        const check = this.checks.hardcodedDates;
        let matches;
        
        while ((matches = check.pattern.exec(content)) !== null) {
            const lineNumber = this.getLineNumber(content, matches.index);
            const lineContent = lines[lineNumber - 1];
            
            if (!check.exemptionPattern.test(lineContent)) {
                this.addViolation({
                    type: 'hardcoded_date',
                    severity: check.severity,
                    category: check.category,
                    message: 'Hardcoded date/time literal detected',
                    line: lineNumber,
                    content: lineContent.trim(),
                    pattern: matches[0],
                    suggestion: 'Use dynamic alternatives like now(), today(), or payload.timestamp',
                    fix: 'Replace with payload.date or calculate dynamically'
                });
            }
        }
    }
    
    async checkSuspiciousNumbers(content, lines, scriptPath) {
        const check = this.checks.suspiciousNumbers;
        
        lines.forEach((line, index) => {
            if (check.pattern.test(line) && !check.exemptionPattern.test(line)) {
                this.addViolation({
                    type: 'suspicious_number',
                    severity: check.severity,
                    category: check.category,
                    message: 'Suspicious numeric literal in variable assignment',
                    line: index + 1,
                    content: line.trim(),
                    suggestion: 'Use payload.config.value, calculations, or document business requirement',
                    fix: 'Replace with dynamic value from payload or configuration'
                });
            }
        });
    }
    
    async checkHardcodedStrings(content, lines, scriptPath) {
        const check = this.checks.hardcodedStrings;
        
        lines.forEach((line, index) => {
            if (check.pattern.test(line) && !check.exemptionPattern.test(line)) {
                this.addViolation({
                    type: 'hardcoded_string',
                    severity: check.severity,
                    category: check.category,
                    message: 'Hardcoded business string value detected',
                    line: index + 1,
                    content: line.trim(),
                    suggestion: 'Use payload.status, calculated values, or document business requirement',
                    fix: 'Replace with dynamic value or add user consent documentation'
                });
            }
        });
    }
    
    async checkHardcodedArraysObjects(content, lines, scriptPath) {
        const check = this.checks.hardcodedArraysObjects;
        
        lines.forEach((line, index) => {
            if (check.pattern.test(line) && !check.exemptionPattern.test(line)) {
                this.addViolation({
                    type: 'hardcoded_array_object',
                    severity: check.severity,
                    category: check.category,
                    message: 'Hardcoded array or object detected',
                    line: index + 1,
                    content: line.trim(),
                    suggestion: 'Use payload.items, map/filter results, or document template requirement',
                    fix: 'Replace with dynamic data or add appropriate documentation'
                });
            }
        });
    }
    
    async checkUnsafeTypeCoercions(content, lines, scriptPath) {
        const check = this.checks.unsafeTypeCoercions;
        
        lines.forEach((line, index) => {
            if (check.pattern.test(line) && !check.exemptionPattern.test(line)) {
                this.addViolation({
                    type: 'unsafe_type_coercion',
                    severity: check.severity,
                    category: check.category,
                    message: 'Unsafe type coercion without safe default operator',
                    line: index + 1,
                    content: line.trim(),
                    suggestion: 'Add safe default to prevent runtime failures',
                    fix: 'Add safe default: "as Number default 0", "as String default \"\", "as Date default now()"'
                });
            }
        });
    }
    
    async checkUnsafeArithmeticOperations(content, lines, scriptPath) {
        // Check for arithmetic operations that could crash on null values
        const arithmeticPatterns = [
            /\w+\s*\*\s*\w+/,  // multiplication
            /\w+\s*\/\s*\w+/,  // division
            /\w+\s*\+\s*\w+/,  // addition (when not string concatenation)
            /\w+\s*-\s*\w+/    // subtraction
        ];
        
        lines.forEach((line, index) => {
            for (const pattern of arithmeticPatterns) {
                if (pattern.test(line) && !this.checks.unsafeArithmeticOperations.exemptionPattern.test(line)) {
                    // Check if variables in arithmetic are safely type-coerced
                    if (!line.includes('as Number default') && !line.includes('as Date default')) {
                        this.addViolation({
                            type: 'unsafe_arithmetic',
                            severity: 'critical',
                            category: 'safety',
                            message: 'Arithmetic operation on potentially null values',
                            line: index + 1,
                            content: line.trim(),
                            suggestion: 'Use safe type coercion with defaults for arithmetic operations',
                            fix: 'Convert to safe pattern: (field as Number default 0) * (field2 as Number default 0)'
                        });
                        break; // Only report once per line
                    }
                }
            }
        });
    }
    
    async checkMissingArithmeticDefaults(content, lines, scriptPath) {
        // Check for type coercions used in arithmetic contexts without safe defaults
        lines.forEach((line, index) => {
            // Look for type coercions in arithmetic contexts
            if (/as\s+(Number|Date)\s+(?!default)/.test(line) && 
                (/[\*\/\+\-]/.test(line) || /sum|multiply|divide|add|subtract/i.test(line))) {
                
                if (!this.checks.missingArithmeticDefaults.exemptionPattern.test(line)) {
                    this.addViolation({
                        type: 'missing_arithmetic_default',
                        severity: 'high',
                        category: 'safety',
                        message: 'Type coercion in arithmetic context lacks safe default',
                        line: index + 1,
                        content: line.trim(),
                        suggestion: 'Add safe default for arithmetic operations',
                        fix: 'Add safe default: "as Number default 0" for calculations, "as Date default now()" for date arithmetic'
                    });
                }
            }
        });
    }
    
    async checkSensitiveData(content, lines, scriptPath) {
        const check = this.checks.sensitiveData;
        const sensitivePatterns = this.config.security.blockedPatterns;
        
        lines.forEach((line, index) => {
            for (const pattern of sensitivePatterns) {
                const regex = new RegExp(pattern, 'i');
                if (regex.test(line) && !check.exemptionPattern.test(line)) {
                    this.addViolation({
                        type: 'sensitive_data',
                        severity: check.severity,
                        category: check.category,
                        message: `Potential sensitive data exposure: ${pattern}`,
                        line: index + 1,
                        content: line.trim(),
                        suggestion: 'Remove sensitive data or use secure alternatives',
                        fix: 'Use environment variables or secure configuration'
                    });
                }
            }
        });
    }
    
    async checkSQLInjection(content, lines, scriptPath) {
        const check = this.checks.sqlInjection;
        
        lines.forEach((line, index) => {
            if (check.pattern.test(line) && !check.exemptionPattern.test(line)) {
                this.addViolation({
                    type: 'sql_injection',
                    severity: check.severity,
                    category: check.category,
                    message: 'Potential SQL injection vulnerability',
                    line: index + 1,
                    content: line.trim(),
                    suggestion: 'Use parameterized queries or safe string building',
                    fix: 'Implement proper SQL parameter binding'
                });
            }
        });
    }
    
    async checkUnsafeEval(content, lines, scriptPath) {
        const check = this.checks.unsafeEval;
        
        lines.forEach((line, index) => {
            if (check.pattern.test(line) && !check.exemptionPattern.test(line)) {
                this.addViolation({
                    type: 'unsafe_eval',
                    severity: check.severity,
                    category: check.category,
                    message: 'Unsafe dynamic code evaluation detected',
                    line: index + 1,
                    content: line.trim(),
                    suggestion: 'Use safe alternatives or remove dynamic evaluation',
                    fix: 'Replace with safe data processing functions'
                });
            }
        });
    }
    
    async checkIneffientOperations(content, lines, scriptPath) {
        const inefficientPatterns = [
            { pattern: /map\s*\(\s*.*\)\s*map\s*\(/g, message: 'Chained map operations can be combined' },
            { pattern: /filter\s*\(\s*.*\)\s*filter\s*\(/g, message: 'Chained filter operations can be combined' },
            { pattern: /\[\s*0\s*\]/g, message: 'Array access [0] can be replaced with head operation' }
        ];
        
        for (const { pattern, message } of inefficientPatterns) {
            let matches;
            while ((matches = pattern.exec(content)) !== null) {
                const lineNumber = this.getLineNumber(content, matches.index);
                
                this.addWarning({
                    type: 'inefficient_operation',
                    severity: 'medium',
                    category: 'performance',
                    message,
                    line: lineNumber,
                    content: lines[lineNumber - 1].trim(),
                    suggestion: 'Consider optimizing for better performance'
                });
            }
        }
    }
    
    async checkDeprecatedFunctions(content, lines, scriptPath) {
        const deprecatedFunctions = [
            'toString', 'toNumber', 'toDate' // These should use 'as' operator instead
        ];
        
        for (const func of deprecatedFunctions) {
            const pattern = new RegExp(`\\b${func}\\s*\\(`, 'g');
            let matches;
            
            while ((matches = pattern.exec(content)) !== null) {
                const lineNumber = this.getLineNumber(content, matches.index);
                
                this.addWarning({
                    type: 'deprecated_function',
                    severity: 'low',
                    category: 'maintenance',
                    message: `Deprecated function: ${func}()`,
                    line: lineNumber,
                    content: lines[lineNumber - 1].trim(),
                    suggestion: `Use 'as ${func.replace('to', '')}' instead of ${func}()`
                });
            }
        }
    }
    
    async checkMissingNullHandling(content, lines, scriptPath) {
        lines.forEach((line, index) => {
            // Look for field access without null safety
            if (/payload\.\w+(?:\.\w+)*(?![?.])/g.test(line) && !/if\s*\(.*null\)|default\s+null|\?\.|\?\?/g.test(line)) {
                this.addWarning({
                    type: 'missing_null_handling',
                    severity: 'high',
                    category: 'safety',
                    message: 'Potential null reference without null handling',
                    line: index + 1,
                    content: line.trim(),
                    suggestion: 'Add null checking or use safe navigation (?.) operator'
                });
            }
        });
    }
    
    async checkDynamicFunctionUsage(content, lines, scriptPath) {
        // Check for dynamic function usage patterns (matches bash CHECK 5)
        const dynamicFunctions = {
            'now()': /now\(\)/.test(content),
            'today()': /today\(\)/.test(content),
            'payload access': /payload\./.test(content),
            'data processing': /(?:sumBy|sizeOf|map|filter|reduce|pluck|groupBy)/.test(content),
            'conditional logic': /if\s*\(/.test(content),
            'array operations': /\[\s*\d+\s*\]|\*\w+/.test(content)
        };
        
        const usedFunctions = Object.entries(dynamicFunctions)
            .filter(([_, used]) => used)
            .map(([func, _]) => func);
        
        if (usedFunctions.length === 0) {
            this.addWarning({
                type: 'no_dynamic_functions',
                severity: 'medium',
                category: 'best_practices',
                message: 'No dynamic functions detected - verify script uses payload data instead of hardcoded values',
                line: 1,
                content: 'Script analysis',
                suggestion: 'Use dynamic alternatives: now(), payload.*, sumBy(), map(), filter()'
            });
        } else {
            // Add positive feedback for good dynamic usage
            this.addSuggestion({
                type: 'dynamic_functions_found',
                category: 'best_practices',
                message: `Dynamic functions detected: ${usedFunctions.join(', ')}`,
                line: 1,
                content: 'Script follows dynamic-first principles',
                suggestion: 'Continue using dynamic patterns for maintainable code'
            });
        }
    }
    

    
    async runComplexityAnalysis(content, lines) {
        const complexity = {
            cyclomaticComplexity: (content.match(/if\s*\(|case\s*\(|when\s*\(/g) || []).length,
            nestingDepth: this.calculateNestingDepth(content),
            linesOfCode: lines.filter(line => line.trim() && !line.trim().startsWith('//')).length
        };
        
        if (complexity.cyclomaticComplexity > 10) {
            this.addWarning({
                type: 'high_complexity',
                severity: 'medium',
                category: 'maintainability',
                message: `High cyclomatic complexity: ${complexity.cyclomaticComplexity}`,
                line: 1,
                content: 'Script analysis',
                suggestion: 'Consider breaking down into smaller functions'
            });
        }
        
        if (complexity.nestingDepth > 4) {
            this.addWarning({
                type: 'deep_nesting',
                severity: 'medium',
                category: 'maintainability',
                message: `Deep nesting detected: ${complexity.nestingDepth} levels`,
                line: 1,
                content: 'Script analysis',
                suggestion: 'Consider flattening nested structures'
            });
        }
        
        this.metrics.complexity = complexity;
    }
    
    calculateNestingDepth(content) {
        let maxDepth = 0;
        let currentDepth = 0;
        
        for (let i = 0; i < content.length; i++) {
            if (content[i] === '{') {
                currentDepth++;
                maxDepth = Math.max(maxDepth, currentDepth);
            } else if (content[i] === '}') {
                currentDepth--;
            }
        }
        
        return maxDepth;
    }
    
    /**
     * Helper methods
     */
    getLineNumber(content, index) {
        return content.substring(0, index).split('\n').length;
    }
    
    addViolation(violation) {
        this.violations.push(violation);
        logger.debug(`Violation detected: ${violation.type} at line ${violation.line}`);
    }
    
    addWarning(warning) {
        this.warnings.push(warning);
        logger.debug(`Warning detected: ${warning.type} at line ${warning.line}`);
    }
    
    addSuggestion(suggestion) {
        this.suggestions.push(suggestion);
    }
    
    generateSummary() {
        const criticalCount = this.violations.filter(v => v.severity === 'critical').length;
        const highCount = this.violations.filter(v => v.severity === 'high').length;
        const mediumCount = this.violations.filter(v => v.severity === 'medium').length;
        const lowCount = this.violations.filter(v => v.severity === 'low').length;
        
        const overallScore = Math.max(0, 100 - (criticalCount * 25 + highCount * 10 + mediumCount * 5 + lowCount * 1));
        const securityScore = Math.max(0, 100 - (this.violations.filter(v => v.category === 'security').length * 15));
        
        return {
            overallResult: criticalCount === 0 && highCount === 0 ? 'PASSED' : 'FAILED',
            overallScore,
            securityScore,
            totalViolations: this.violations.length,
            totalWarnings: this.warnings.length,
            totalSuggestions: this.suggestions.length,
            violationsBySeverity: {
                critical: criticalCount,
                high: highCount,
                medium: mediumCount,
                low: lowCount
            },
            violationsByCategory: this.getViolationsByCategory(),
            readyForProduction: criticalCount === 0 && highCount === 0,
            requiresAttention: this.violations.length > 0 || this.warnings.length > 0
        };
    }
    
    getViolationsByCategory() {
        const categories = {};
        this.violations.forEach(v => {
            categories[v.category] = (categories[v.category] || 0) + 1;
        });
        return categories;
    }
    
    generateReport(scriptPath) {
        const summary = this.generateSummary();
        
        const report = {
            script: path.basename(scriptPath),
            timestamp: new Date().toISOString(),
            summary,
            metrics: this.metrics,
            violations: this.violations,
            warnings: this.warnings,
            suggestions: this.suggestions
        };
        
        // Generate human-readable report
        if (this.options.reportFormat === 'detailed') {
            report.readableReport = this.generateReadableReport(scriptPath, summary);
        }
        
        return report;
    }
    
    generateReadableReport(scriptPath, summary) {
        const lines = [
            '🚨 R-GENIE COMPREHENSIVE QUALITY GATES REPORT',
            '═══════════════════════════════════════════════════════════════',
            `📁 Script: ${path.basename(scriptPath)}`,
            `📅 Analysis Date: ${new Date().toLocaleString()}`,
            `📊 Lines Scanned: ${this.metrics.linesScanned}`,
            `⏱️  Execution Time: ${this.metrics.executionTime}ms`,
            '',
            '📋 OVERALL ASSESSMENT',
            '─────────────────────────────────────────────────────────────',
            `🎯 Overall Result: ${summary.overallResult}`,
            `📊 Overall Score: ${summary.overallScore}/100`,
            `🛡️  Security Score: ${summary.securityScore}/100`,
            `🚀 Production Ready: ${summary.readyForProduction ? 'YES' : 'NO'}`,
            ''
        ];
        
        if (this.violations.length > 0) {
            lines.push(
                '❌ VIOLATIONS DETECTED',
                '─────────────────────────────────────────────────────────────'
            );
            
            this.violations.forEach((violation, index) => {
                const severityIcon = {
                    critical: '🚨',
                    high: '❌',
                    medium: '⚠️',
                    low: '💡'
                }[violation.severity];
                
                lines.push(
                    `${index + 1}. ${severityIcon} ${violation.message}`,
                    `   📍 Line ${violation.line}: ${violation.content}`,
                    `   💡 Suggestion: ${violation.suggestion}`,
                    `   🔧 Fix: ${violation.fix || 'Review and address manually'}`,
                    ''
                );
            });
        }
        
        if (this.warnings.length > 0) {
            lines.push(
                '⚠️  WARNINGS',
                '─────────────────────────────────────────────────────────────'
            );
            
            this.warnings.forEach((warning, index) => {
                lines.push(
                    `${index + 1}. ⚠️  ${warning.message}`,
                    `   📍 Line ${warning.line}: ${warning.content}`,
                    `   💡 Suggestion: ${warning.suggestion}`,
                    ''
                );
            });
        }
        
        if (summary.overallResult === 'PASSED') {
            lines.push(
                '✅ QUALITY GATE PASSED',
                '─────────────────────────────────────────────────────────────',
                '🎯 Script follows R-Genie quality standards',
                '🚀 Ready for production deployment',
                '',
                '📋 COMPLIANCE SUMMARY:',
                `   • Security Checks: ✅ PASSED (${summary.securityScore}/100)`,
                `   • Safety Checks: ✅ PASSED`,
                `   • Best Practices: ✅ PASSED`,
                `   • Performance: ✅ PASSED`
            );
        } else {
            lines.push(
                '❌ QUALITY GATE FAILED',
                '─────────────────────────────────────────────────────────────',
                `🛑 ${summary.totalViolations} violation(s) must be addressed`,
                '',
                '📋 REQUIRED ACTIONS:',
                '   1. Review each violation above',
                '   2. Implement suggested fixes',
                '   3. Add appropriate documentation for business requirements',
                '   4. Re-run quality gates after fixes',
                '',
                '💡 DYNAMIC ALTERNATIVES:',
                '   • Dates: now(), today(), payload.timestamp',
                '   • Numbers: payload.config.value, sumBy(), sizeOf()',
                '   • Strings: payload.status, calculated values',
                '   • Arrays: payload.items, map/filter results'
            );
        }
        
        return lines.join('\n');
    }
}

// Convenience functions
async function validateScript(scriptPath, options = {}) {
    const engine = new QualityGatesEngine(options);
    return engine.validateScript(scriptPath, options);
}

async function validateMultipleScripts(scriptPaths, options = {}) {
    const results = [];
    
    for (const scriptPath of scriptPaths) {
        try {
            const result = await validateScript(scriptPath, options);
            results.push({ scriptPath, ...result });
        } catch (error) {
            results.push({
                scriptPath,
                success: false,
                error: error.message
            });
        }
    }
    
    return results;
}

module.exports = {
    QualityGatesEngine,
    validateScript,
    validateMultipleScripts
};

// CLI Execution
if (require.main === module) {
    (async () => {
        try {
            const scriptPath = process.argv[2];
            
            if (!scriptPath) {
                console.error('❌ Usage: node 03-01-16_Quality_Gates.js <script-path> [options]');
                console.error('');
                console.error('Options:');
                console.error('  --strict          Enable strict mode (default: true)');
                console.error('  --report-only     Generate report without failing');
                console.error('  --json            Output results in JSON format');
                console.error('');
                console.error('Example:');
                console.error('  node 03-01-16_Quality_Gates.js script.dwl');
                console.error('  node 03-01-16_Quality_Gates.js script.dwl --report-only');
                process.exit(1);
            }
            
            const options = {
                enableAllChecks: true,
                strictMode: !process.argv.includes('--no-strict'),
                reportFormat: process.argv.includes('--json') ? 'json' : 'detailed'
            };
            
            const reportOnly = process.argv.includes('--report-only');
            
            console.log(`🔍 Running Quality Gates on: ${scriptPath}\n`);
            
            const result = await validateScript(scriptPath, options);
            
            if (options.reportFormat === 'json') {
                console.log(JSON.stringify(result, null, 2));
            } else {
                console.log(result.report);
            }
            
            // Clean exit based on success (or always succeed in report-only mode)
            if (reportOnly) {
                console.log('\n📋 Report-only mode: Exiting with success regardless of violations');
                process.exit(0);
            } else {
                process.exit(result.success ? 0 : 1);
            }
            
        } catch (error) {
            console.error(`\n❌ Quality Gates Error: ${error.message}`);
            console.error(error.stack);
            process.exit(1);
        }
    })();
}
