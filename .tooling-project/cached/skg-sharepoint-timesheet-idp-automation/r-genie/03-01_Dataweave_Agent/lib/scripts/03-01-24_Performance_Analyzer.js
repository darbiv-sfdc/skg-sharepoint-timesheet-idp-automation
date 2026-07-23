#!/usr/bin/env node

/**
 * 🚀 R-GENIE PERFORMANCE ANALYZER v2.0.0 (Enhanced)
 * 
 * @author Cheppali Shaik Sohail
 * @signature Q2hlcHBhbGlTaGFpa1NvaGFpbDE1MDgxOTkz
 * @system DataWeave Intelligence System v3.1+ - Performance Analysis Engine
 * @purpose Advanced DataWeave performance optimization with MuleSoft best practices
 * @version 2.0.0 - Enhanced with R-Genie infrastructure integration
 * 
 * Features:
 * - Analyzes DataWeave scripts for performance optimization opportunities
 * - Enhanced with R-Genie infrastructure integration and advanced detection
 * - MuleSoft-aligned performance recommendations and streaming patterns
 * 
 * Created: August 2025
 * Enhanced: August 31, 2025
 */

const fs = require('fs');
const path = require('path');
const { createLogger } = require('../utilities/03-01-20_Unified_Logger.js');
const { createErrorHandler, ErrorFactories } = require('../utilities/03-01-19_Error_Handler.js');

// Initialize R-Genie infrastructure
const logger = createLogger('performance-analyzer', { level: 'INFO' });
const errorHandler = createErrorHandler('performance-analyzer');
// @watermark CS150893‌

class DataWeavePerformanceAnalyzer {
    constructor() {
        this.version = '2.0.0';
        this.builtInFunctions = [
            // Core Array Functions
            'map', 'filter', 'reduce', 'groupBy', 'pluck', 'flatten',
            'sizeOf', 'isEmpty', 'contains', 'distinctBy', 'orderBy',
            'divideBy', 'zip', 'unzip', 'take', 'drop', 'slice',
            // Core Math Functions  
            'sum', 'avg', 'max', 'min', 'round', 'ceil', 'floor',
            'abs', 'sqrt', 'pow', 'randomInt',
            // Core Object Functions
            'keysOf', 'valuesOf', 'entriesOf', 'mergeWith', 'mapObject',
            'filterObject', 'removeKey', 'update',
            // Core String Functions
            'split', 'replace', 'trim', 'lower', 'upper', 'capitalize',
            'camelize', 'dasherize', 'underscore', 'pluralize',
            // Core Date/Time Functions
            'now', 'today', 'format', 'parse',
            // Core Type Functions
            'as', 'is', 'default', 'typeOf'
        ];
        
        this.performanceMetrics = {
            importEfficiency: 0,
            safeCheckEfficiency: 0,
            performanceScore: 0,
            recommendations: [],
            mulesoftOptimizations: {
                streamingUsage: 0,
                loopComplexity: 'unknown',
                batchProcessing: false,
                connectionOptimization: false,
                memoryEfficiency: 0
            }
        };
    }

    analyzeScript(scriptPath) {
        logger.info(`🚀 R-GENIE Performance Analyzer v${this.version}`);
        logger.info(`📁 Analyzing: ${path.basename(scriptPath)}`);
        
        // ENHANCED: Validate DataWeave file before analysis
        this.validateDataWeaveFile(scriptPath);
        
        const scriptContent = fs.readFileSync(scriptPath, 'utf8');
        
        // Analyze imports
        const importAnalysis = this.analyzeImports(scriptContent);
        
        // Analyze safe checking usage
        const safeCheckAnalysis = this.analyzeSafeChecking(scriptContent);
        
        // Analyze field access patterns
        const fieldAccessAnalysis = this.analyzeFieldAccess(scriptContent);
        
        // ENHANCED: MuleSoft-specific performance analysis
        const mulesoftAnalysis = this.analyzeMuleSoftPerformance(scriptContent);
        
        // Generate optimization recommendations
        const recommendations = this.generateRecommendations(
            importAnalysis, safeCheckAnalysis, fieldAccessAnalysis, mulesoftAnalysis
        );
        
        // Calculate performance scores
        this.calculatePerformanceScores(importAnalysis, safeCheckAnalysis, fieldAccessAnalysis, mulesoftAnalysis);
        
        // Generate report
        this.generateReport(importAnalysis, safeCheckAnalysis, fieldAccessAnalysis, recommendations);
        
        return this.performanceMetrics;
    }

    analyzeImports(scriptContent) {
        // FIXED: Exclude commented import statements to avoid false positives
        const allLines = scriptContent.split('\n');
        const realImports = [];
        
        allLines.forEach(line => {
            const trimmedLine = line.trim();
            // Only count actual import statements (not comments)
            if (trimmedLine.startsWith('import ') && !trimmedLine.startsWith('//') && !trimmedLine.includes('// ')) {
                realImports.push(trimmedLine);
            }
        });
        
        const wildcardImports = realImports.filter(imp => imp.includes('import *'));
        const specificImports = realImports.filter(imp => !imp.includes('import *'));
        
        // Analyze function usage
        const usedFunctions = [];
        for (const func of this.builtInFunctions) {
            if (scriptContent.includes(func + '(') || 
                scriptContent.includes(func + ' ') ||
                scriptContent.includes('.' + func)) {
                usedFunctions.push(func);
            }
        }
        
        // Check for unnecessary imports of built-in functions
        const unnecessaryImports = wildcardImports.filter(imp => {
            const module = imp.match(/from\s+(dw::\w+::\w+)/)?.[1];
            return module && this.isBuiltInModule(module, usedFunctions);
        });
        
        return {
            totalImports: realImports.length,
            wildcardImports: wildcardImports.length,
            specificImports: specificImports.length,
            usedBuiltInFunctions: usedFunctions.length,
            unnecessaryImports: unnecessaryImports.length,
            imports: realImports,
            usedFunctions: usedFunctions
        };
    }

    analyzeSafeChecking(scriptContent) {
        const safeStringCalls = (scriptContent.match(/safeString\s*\(/g) || []).length;
        const safeNumberCalls = (scriptContent.match(/safeNumber\s*\(/g) || []).length;
        const safeBooleanCalls = (scriptContent.match(/safeBoolean\s*\(/g) || []).length;
        const totalSafeCalls = safeStringCalls + safeNumberCalls + safeBooleanCalls;
        
        // Analyze direct field access
        const directAccess = (scriptContent.match(/payload\.\w+[\.\w]*(?!\s*as\s)/g) || []).length;
        const totalFieldAccess = directAccess + totalSafeCalls;
        
        // Detect potentially unnecessary safe checks
        const guaranteedFields = this.detectGuaranteedFields(scriptContent);
        const potentiallyUnnecessary = this.detectUnnecessarySafeChecks(scriptContent, guaranteedFields);
        
        return {
            totalSafeCalls,
            safeStringCalls,
            safeNumberCalls,
            safeBooleanCalls,
            directAccess,
            totalFieldAccess,
            guaranteedFields: guaranteedFields.length,
            potentiallyUnnecessary: potentiallyUnnecessary.length,
            unnecessaryChecks: potentiallyUnnecessary
        };
    }

    analyzeFieldAccess(scriptContent) {
        // Extract payload field accesses
        const fieldAccesses = scriptContent.match(/payload\.[\w\.]+/g) || [];
        const uniqueFields = [...new Set(fieldAccesses)];
        
        // Categorize field types
        const guaranteedFields = uniqueFields.filter(field => 
            this.isLikelyGuaranteedField(field)
        );
        
        const optionalFields = uniqueFields.filter(field => 
            this.isLikelyOptionalField(field)
        );
        
        return {
            totalUniqueFields: uniqueFields.length,
            guaranteedFields: guaranteedFields.length,
            optionalFields: optionalFields.length,
            fieldList: uniqueFields
        };
    }

    generateRecommendations(importAnalysis, safeCheckAnalysis, fieldAccessAnalysis) {
        const recommendations = [];
        
        // Import recommendations
        if (importAnalysis.wildcardImports > 0) {
            recommendations.push({
                type: 'IMPORT_OPTIMIZATION',
                priority: 'HIGH',
                message: `Remove ${importAnalysis.wildcardImports} wildcard imports and use specific imports`,
                impact: 'Memory usage reduction, faster startup'
            });
        }
        
        if (importAnalysis.usedBuiltInFunctions > 0) {
            recommendations.push({
                type: 'BUILTIN_USAGE',
                priority: 'MEDIUM',
                message: `${importAnalysis.usedBuiltInFunctions} built-in functions found - verify imports are necessary`,
                impact: 'Eliminate unnecessary imports'
            });
        }
        
        // Safe checking recommendations
        if (safeCheckAnalysis.potentiallyUnnecessary > 0) {
            recommendations.push({
                type: 'SAFE_CHECK_OPTIMIZATION',
                priority: 'HIGH',
                message: `${safeCheckAnalysis.potentiallyUnnecessary} potentially unnecessary safe checks found`,
                impact: 'Function call overhead reduction'
            });
        }
        
        if (safeCheckAnalysis.directAccess / safeCheckAnalysis.totalFieldAccess < 0.7) {
            recommendations.push({
                type: 'DIRECT_ACCESS_OPPORTUNITY',
                priority: 'MEDIUM',
                message: 'Consider more direct field access for guaranteed fields',
                impact: 'Performance improvement through reduced function calls'
            });
        }
        
        return recommendations;
    }

    calculatePerformanceScores(importAnalysis, safeCheckAnalysis, fieldAccessAnalysis) {
        // Import Efficiency Score
        if (importAnalysis.totalImports === 0) {
            this.performanceMetrics.importEfficiency = 100;
        } else {
            const unnecessary = importAnalysis.unnecessaryImports;
            this.performanceMetrics.importEfficiency = 
                Math.round(((importAnalysis.totalImports - unnecessary) / importAnalysis.totalImports) * 100);
        }
        
        // Safe Check Efficiency Score
        if (safeCheckAnalysis.totalSafeCalls === 0) {
            this.performanceMetrics.safeCheckEfficiency = 100;
        } else {
            const necessary = safeCheckAnalysis.totalSafeCalls - safeCheckAnalysis.potentiallyUnnecessary;
            this.performanceMetrics.safeCheckEfficiency = 
                Math.round((necessary / safeCheckAnalysis.totalSafeCalls) * 100);
        }
        
        // Overall Performance Score
        this.performanceMetrics.performanceScore = 
            Math.round((this.performanceMetrics.importEfficiency + this.performanceMetrics.safeCheckEfficiency) / 2);
    }

    generateReport(importAnalysis, safeCheckAnalysis, fieldAccessAnalysis, recommendations) {
        logger.info('📊 PERFORMANCE ANALYSIS REPORT');
        logger.info('═══════════════════════════════════════════════');
        
        logger.info('🎯 IMPORT ANALYSIS:');
        logger.detail(`   Total Imports: ${importAnalysis.totalImports}`);
        logger.detail(`   Wildcard Imports: ${importAnalysis.wildcardImports}`);
        logger.detail(`   Specific Imports: ${importAnalysis.specificImports}`);
        logger.detail(`   Built-in Functions Used: ${importAnalysis.usedBuiltInFunctions}`);
        logger.detail(`   Import Efficiency: ${this.performanceMetrics.importEfficiency}%`);
        
        logger.info('⚡ SAFE CHECKING ANALYSIS:');
        logger.detail(`   Total Safe Function Calls: ${safeCheckAnalysis.totalSafeCalls}`);
        logger.detail(`   Direct Field Access: ${safeCheckAnalysis.directAccess}`);
        logger.detail(`   Total Field Access: ${safeCheckAnalysis.totalFieldAccess}`);
        logger.detail(`   Potentially Unnecessary: ${safeCheckAnalysis.potentiallyUnnecessary}`);
        logger.detail(`   Safe Check Efficiency: ${this.performanceMetrics.safeCheckEfficiency}%`);
        
        logger.info('🏆 OVERALL PERFORMANCE SCORE:');
        logger.detail(`   Performance Score: ${this.performanceMetrics.performanceScore}%`);
        
        if (this.performanceMetrics.performanceScore >= 90) {
            logger.success('   Status: ✅ EXCELLENT PERFORMANCE');
        } else if (this.performanceMetrics.performanceScore >= 70) {
            logger.success('   Status: 🚀 GOOD PERFORMANCE');
        } else {
            logger.warning('   Status: ⚠️ NEEDS OPTIMIZATION');
        }
        
        logger.info('💡 OPTIMIZATION RECOMMENDATIONS:');
        if (recommendations.length === 0) {
            logger.success('   ✅ No optimization opportunities detected');
        } else {
            recommendations.forEach((rec, index) => {
                logger.warning(`   ${index + 1}. [${rec.priority}] ${rec.message}`);
                logger.detail(`      Impact: ${rec.impact}`);
            });
        }
    }

    isBuiltInModule(moduleName, usedFunctions) {
        // ENHANCED: Complete built-in module mappings for DataWeave 2.0
        const moduleMap = {
            'dw::core::Arrays': ['map', 'filter', 'reduce', 'groupBy', 'pluck', 'flatten', 
                                'sizeOf', 'isEmpty', 'contains', 'distinctBy', 'orderBy',
                                'divideBy', 'zip', 'unzip', 'take', 'drop', 'slice'],
            'dw::core::Objects': ['keysOf', 'valuesOf', 'entriesOf', 'mergeWith', 'mapObject',
                                 'filterObject', 'removeKey', 'update'],
            'dw::core::Strings': ['split', 'replace', 'trim', 'lower', 'upper', 'capitalize',
                                 'camelize', 'dasherize', 'underscore', 'pluralize'],
            'dw::core::Math': ['sum', 'avg', 'max', 'min', 'round', 'ceil', 'floor',
                              'abs', 'sqrt', 'pow', 'randomInt'],
            'dw::core::Types': ['as', 'is', 'typeOf'],
            'dw::core::Dates': ['now', 'today', 'format', 'parse']
        };
        
        const moduleBuiltIns = moduleMap[moduleName] || [];
        return usedFunctions.some(func => moduleBuiltIns.includes(func));
    }

    detectGuaranteedFields(scriptContent) {
        // Simple heuristics for guaranteed fields
        const guaranteedPatterns = [
            /payload\.company\.name/g,
            /payload\.company\.establishedYear/g,
            /payload\.company\.isActive/g,
            /payload\.[\w\.]*\.id(?!\w)/g,
            /payload\.[\w\.]*\.name(?!\w)/g
        ];
        
        const guaranteed = [];
        guaranteedPatterns.forEach(pattern => {
            const matches = scriptContent.match(pattern) || [];
            guaranteed.push(...matches);
        });
        
        return [...new Set(guaranteed)];
    }

    detectUnnecessarySafeChecks(scriptContent, guaranteedFields) {
        const unnecessary = [];
        
        guaranteedFields.forEach(field => {
            const safeStringPattern = new RegExp(`safeString\\(${field.replace(/\./g, '\\.')}\\)`, 'g');
            const safeNumberPattern = new RegExp(`safeNumber\\(${field.replace(/\./g, '\\.')}\\)`, 'g');
            
            if (safeStringPattern.test(scriptContent)) {
                unnecessary.push(`safeString(${field}) - field is guaranteed string`);
            }
            if (safeNumberPattern.test(scriptContent)) {
                unnecessary.push(`safeNumber(${field}) - field is guaranteed number`);
            }
        });
        
        return unnecessary;
    }

    isLikelyGuaranteedField(field) {
        const guaranteedIndicators = [
            /\.name$/,
            /\.id$/,
            /\.establishedYear$/,
            /\.isActive$/,
            /\.deptId$/,
            /\.employeeId$/,
            /\.projectId$/,
            /\.title$/,
            /\.status$/
        ];
        
        return guaranteedIndicators.some(pattern => pattern.test(field));
    }

    isLikelyOptionalField(field) {
        const optionalIndicators = [
            /\.contact/,
            /\.notes/,
            /\.milestones/,
            /\.phone/,
            /\.email/
        ];
        
        return optionalIndicators.some(pattern => pattern.test(field));
    }
    
    /**
     * ENHANCED: MuleSoft-specific performance analysis
     */
    analyzeMuleSoftPerformance(scriptContent) {
        const analysis = {
            streamingUsage: 0,
            loopComplexity: 'simple',
            batchProcessing: false,
            connectionOptimization: false,
            memoryEfficiency: 0,
            recommendations: []
        };

        // Analyze streaming patterns
        if (scriptContent.includes('deferred=true') || scriptContent.includes('streaming=true')) {
            analysis.streamingUsage = 100;
            analysis.memoryEfficiency += 30;
        } else if (scriptContent.includes('output application/json') && scriptContent.length > 5000) {
            analysis.recommendations.push({
                type: 'STREAMING',
                priority: 'HIGH',
                message: 'Consider enabling streaming for large transformations',
                impact: 'Memory usage reduction for large datasets'
            });
        }

        // Analyze loop complexity
        const nestedLoops = (scriptContent.match(/map\s*\([^)]*map\s*\(/g) || []).length;
        const flatMaps = (scriptContent.match(/flatMap/g) || []).length;
        
        if (nestedLoops > 2) {
            analysis.loopComplexity = 'complex';
            analysis.recommendations.push({
                type: 'LOOP_OPTIMIZATION',
                priority: 'HIGH',
                message: `${nestedLoops} nested loops detected - consider optimization`,
                impact: 'Reduce O(n²) complexity to O(n)'
            });
        } else if (nestedLoops > 0) {
            analysis.loopComplexity = 'moderate';
        }

        // Analyze batch processing patterns
        if (scriptContent.includes('divideBy') || scriptContent.includes('groupBy')) {
            analysis.batchProcessing = true;
            analysis.memoryEfficiency += 20;
        }

        // Analyze connection optimization
        if (scriptContent.includes('reduce') && scriptContent.includes('lookup')) {
            analysis.connectionOptimization = true;
            analysis.memoryEfficiency += 25;
        }

        // Calculate overall memory efficiency
        if (analysis.memoryEfficiency === 0) {
            analysis.memoryEfficiency = 50; // Default baseline
        }

        // Add MuleSoft-specific recommendations
        if (analysis.memoryEfficiency < 70) {
            analysis.recommendations.push({
                type: 'MULESOFT_OPTIMIZATION',
                priority: 'MEDIUM',
                message: 'Apply MuleSoft memory optimization patterns',
                impact: 'Improved runtime performance and reduced memory footprint'
            });
        }

        return analysis;
    }

    /**
     * ENHANCED: Validate DataWeave file before analysis
     */
    validateDataWeaveFile(scriptPath) {
        // Check file existence
        if (!fs.existsSync(scriptPath)) {
            throw ErrorFactories.fileNotFound(scriptPath, 'DataWeave script');
        }
        
        // Check file extension
        const ext = path.extname(scriptPath).toLowerCase();
        if (ext !== '.dwl') {
            logger.warning(`⚠️ File extension is '${ext}' - expected '.dwl'`);
        }
        
        // Check DataWeave header
        const content = fs.readFileSync(scriptPath, 'utf8');
        const lines = content.split('\n');
        const firstLine = lines[0].trim();
        
        if (!firstLine.startsWith('%dw ')) {
            logger.warning('⚠️ File may not be a valid DataWeave script - missing %dw header');
        }
        
        logger.debug(`✅ DataWeave file validation passed: ${scriptPath}`);
    }
}

// Enhanced CLI Usage with R-Genie standards
function main() {
    const args = process.argv.slice(2);
    
    // FIXED: Add proper help system like other R-Genie tools
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        console.log('🚀 R-GENIE Performance Analyzer v2.0.0 (Enhanced)');
        console.log('═══════════════════════════════════════════════');
        console.log('');
        console.log('USAGE:');
        console.log('  node 03-01-24_Performance_Analyzer.js <script.dwl> [options]');
        console.log('');
        console.log('🎯 OPTIONS:');
        console.log('  --help, -h      Show this help message');
        console.log('');
        console.log('📝 EXAMPLES:');
        console.log('  node 03-01-24_Performance_Analyzer.js company-transformation.dwl');
        console.log('  node 03-01-24_Performance_Analyzer.js mapping-script.dwl');
        console.log('');
        console.log('🏆 FEATURES:');
        console.log('  ✅ Import optimization analysis');
        console.log('  ✅ Safe function usage analysis');
        console.log('  ✅ Field access pattern analysis');
        console.log('  ✅ Performance scoring and recommendations');
        console.log('  ✅ R-Genie infrastructure integration');
        console.log('');
        process.exit(args.includes('--help') || args.includes('-h') ? 0 : 1);
    }
    
    const scriptPath = args[0];

    
    try {
        const analyzer = new DataWeavePerformanceAnalyzer();
        const metrics = analyzer.analyzeScript(scriptPath);
        
        logger.info('🎯 PERFORMANCE OPTIMIZATION COMPLETE');
        logger.info(`📊 Overall Score: ${metrics.performanceScore}%`);
        
        if (metrics.performanceScore >= 80) {
            logger.success('✅ PERFORMANCE VALIDATION: PASSED');
            process.exit(0);
        } else {
            logger.warning('⚠️ PERFORMANCE VALIDATION: NEEDS IMPROVEMENT');
            process.exit(1);
        }
        
    } catch (error) {
        logger.error(`❌ ANALYSIS ERROR: ${error.message}`);
        process.exit(1);
    }
}

// CLI Entry Point
if (require.main === module) {
    main();
}

// R-Genie Module Export (Enhanced v2.0)
module.exports = {
    DataWeavePerformanceAnalyzer,
    
    // Convenience function for external integration
    analyzePerformance: (scriptPath) => {
        const analyzer = new DataWeavePerformanceAnalyzer();
        return analyzer.analyzeScript(scriptPath);
    },
    
    // Cleanup function for R-Genie infrastructure
    destroy: () => {
        // Future: Add cleanup logic if needed
        logger.debug('🧹 Performance analyzer cleanup complete');
    }
};

