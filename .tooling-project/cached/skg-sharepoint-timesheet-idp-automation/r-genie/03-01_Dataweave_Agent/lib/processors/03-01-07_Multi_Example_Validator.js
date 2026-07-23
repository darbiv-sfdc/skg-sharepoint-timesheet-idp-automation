#!/usr/bin/env node

/**
 * 🎯 R-Genie Multi-Example Validator v1.0
 * Validates DataWeave transformations against multiple input/output examples
 * @signature Q2hlcHBhbGlTaGFpa1NvaGFpbDE1MDgxOTkz
 * Provides aggregated accuracy scoring and consistency analysis
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { createLogger } = require('../utilities/03-01-20_Unified_Logger.js');

// Initialize unified logger
const logger = createLogger('multi-example-validator', { level: 'INFO' });

// Shared color codes
// @watermark CS150893‌
const { colors } = require('../utilities/colors.js');

// Using unified logger - custom log function removed

// 🆕 Validate script against multiple examples
function validateMultipleExamples(scriptFile, examplesDir, expectedDir) {
    logger.info( '🎯 Starting multi-example validation...');
    logger.info( `📝 Script: ${scriptFile}`);
    logger.info( `📁 Examples: ${examplesDir}`);
    logger.info( `📁 Expected: ${expectedDir}`);
    
    const results = {
        metadata: {
            timestamp: new Date().toISOString(),
            scriptFile,
            examplesDir,
            expectedDir,
            validationVersion: "1.0.0-multi-example"
        },
        examples: [],
        summary: {
            totalExamples: 0,
            passedExamples: 0,
            failedExamples: 0,
            averageAccuracy: 0,
            consistencyScore: 0,
            overallResult: 'PENDING'
        },
        recommendations: []
    };
    
    try {
        // Find example pairs
        const examplePairs = findExamplePairs(examplesDir, expectedDir);
        results.summary.totalExamples = examplePairs.length;
        
        if (examplePairs.length === 0) {
            throw new Error('No valid example pairs found');
        }
        
        logger.info( `📊 Found ${examplePairs.length} example pairs to validate`);
        console.log("");
        
        // Validate each example
        let totalAccuracy = 0;
        const accuracyScores = [];
        
        for (let i = 0; i < examplePairs.length; i++) {
            const pair = examplePairs[i];
            logger.info( `🔍 Validating example ${i + 1}/${examplePairs.length}: ${path.basename(pair.input)}`);
            
            const exampleResult = validateSingleExample(scriptFile, pair.input, pair.expected, i + 1);
            results.examples.push(exampleResult);
            
            if (exampleResult.passed) {
                results.summary.passedExamples++;
            } else {
                results.summary.failedExamples++;
            }
            
            totalAccuracy += exampleResult.accuracy;
            accuracyScores.push(exampleResult.accuracy);
            
            console.log(`   ${exampleResult.passed ? '✅' : '❌'} ${exampleResult.accuracy}% accuracy`);
        }
        
        // Calculate summary metrics
        results.summary.averageAccuracy = Math.round(totalAccuracy / examplePairs.length);
        results.summary.consistencyScore = calculateConsistencyScore(accuracyScores);
        results.summary.overallResult = determineOverallResult(results.summary);
        
        // Generate recommendations
        results.recommendations = generateValidationRecommendations(results);
        
        return results;
        
    } catch (error) {
        logger.error( `❌ Multi-example validation failed: ${error.message}`);
        results.summary.overallResult = 'FAILED';
        results.error = error.message;
        return results;
    }
}

// 🆕 Find input/output example pairs
function findExamplePairs(examplesDir, expectedDir) {
    const pairs = [];
    
    if (!fs.existsSync(examplesDir) || !fs.existsSync(expectedDir)) {
        return pairs;
    }
    
    const exampleFiles = fs.readdirSync(examplesDir)
        .filter(file => file.endsWith('.json') || file.endsWith('.xml'))
        .sort();
    
    const expectedFiles = fs.readdirSync(expectedDir)
        .filter(file => file.endsWith('.json') || file.endsWith('.xml'))
        .sort();
    
    // Try to match files by name pattern
    exampleFiles.forEach(exampleFile => {
        const baseName = path.basename(exampleFile, path.extname(exampleFile));
        
        // Look for corresponding expected file
        const expectedFile = expectedFiles.find(expFile => {
            const expBaseName = path.basename(expFile, path.extname(expFile));
            return expBaseName === baseName || 
                   expBaseName === baseName.replace('input', 'output') ||
                   expBaseName === baseName.replace('example', 'expected') ||
                   expBaseName === `expected-${baseName}` ||
                   expBaseName === `output-${baseName}`;
        });
        
        if (expectedFile) {
            pairs.push({
                input: path.join(examplesDir, exampleFile),
                expected: path.join(expectedDir, expectedFile)
            });
        }
    });
    
    // If no matches found, try sequential pairing
    if (pairs.length === 0 && exampleFiles.length === expectedFiles.length) {
        for (let i = 0; i < exampleFiles.length; i++) {
            pairs.push({
                input: path.join(examplesDir, exampleFiles[i]),
                expected: path.join(expectedDir, expectedFiles[i])
            });
        }
    }
    
    return pairs;
}

// 🆕 Validate single example
function validateSingleExample(scriptFile, inputFile, expectedFile, exampleIndex) {
    const result = {
        exampleIndex,
        inputFile,
        expectedFile,
        passed: false,
        accuracy: 0,
        executionTime: 0,
        errors: [],
        details: {}
    };
    
    const startTime = Date.now();
    
    try {
        
        // Generate output file name
        const outputFile = `temp-output-${exampleIndex}.json`;
        
        // Security: Sanitize file paths to prevent command injection
        const sanitizedScriptPath = path.resolve(scriptFile);
        const sanitizedInputPath = path.resolve(inputFile);
        const sanitizedExpectedPath = path.resolve(expectedFile);
        
        if (sanitizedScriptPath.includes('..') || sanitizedInputPath.includes('..') || sanitizedExpectedPath.includes('..') ||
            sanitizedScriptPath.includes(';') || sanitizedInputPath.includes(';') || sanitizedExpectedPath.includes(';') ||
            sanitizedScriptPath.includes('|') || sanitizedInputPath.includes('|') || sanitizedExpectedPath.includes('|')) {
            throw new Error('Invalid file path detected');
        }
        
        // Execute DataWeave script
        const dwCommand = `dw run -f "${sanitizedScriptPath}" --input payload="${sanitizedInputPath}" --output "${outputFile}"`;
        execSync(dwCommand, { stdio: 'pipe' });
        
        result.executionTime = Date.now() - startTime;
        
        // Validate output if file was created
        if (fs.existsSync(outputFile)) {
            // Run accuracy validation
            const validatorCommand = `node ./03-01-12_Output_Validator.js "${outputFile}" "${sanitizedExpectedPath}"`;
            const validatorOutput = execSync(validatorCommand, { 
                stdio: 'pipe',
                cwd: __dirname 
            }).toString();
            
            // Parse accuracy from validator output
            const accuracyMatch = validatorOutput.match(/Field-Level Accuracy: (\d+)%/);
            if (accuracyMatch) {
                result.accuracy = parseInt(accuracyMatch[1]);
                result.passed = result.accuracy === 100;
            }
            
            result.details.validatorOutput = validatorOutput;
            
            // Clean up temporary file
            fs.unlinkSync(outputFile);
        } else {
            result.errors.push('Output file was not generated');
        }
        
    } catch (error) {
        result.errors.push(error.message);
        result.executionTime = Date.now() - startTime;
    }
    
    return result;
}

// 🆕 Calculate consistency score
function calculateConsistencyScore(accuracyScores) {
    if (accuracyScores.length <= 1) return 100;
    
    const mean = accuracyScores.reduce((sum, score) => sum + score, 0) / accuracyScores.length;
    const variance = accuracyScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / accuracyScores.length;
    const stdDev = Math.sqrt(variance);
    
    // Lower standard deviation = higher consistency
    const consistencyScore = Math.max(0, 100 - (stdDev * 2));
    return Math.round(consistencyScore);
}

// 🆕 Determine overall result
function determineOverallResult(summary) {
    if (summary.failedExamples === 0 && summary.averageAccuracy === 100) {
        return 'PERFECT';
    } else if (summary.averageAccuracy >= 95 && summary.consistencyScore >= 90) {
        return 'EXCELLENT';
    } else if (summary.averageAccuracy >= 90 && summary.consistencyScore >= 80) {
        return 'GOOD';
    } else if (summary.averageAccuracy >= 80) {
        return 'ACCEPTABLE';
    } else if (summary.averageAccuracy >= 60) {
        return 'NEEDS_IMPROVEMENT';
    } else {
        return 'POOR';
    }
}

// 🆕 Generate validation recommendations
function generateValidationRecommendations(results) {
    const recommendations = [];
    const summary = results.summary;
    
    if (summary.overallResult === 'PERFECT') {
        recommendations.push({
            type: 'success',
            message: 'Perfect validation! Ready for production deployment.',
            action: 'Deploy with confidence'
        });
    } else if (summary.overallResult === 'EXCELLENT') {
        recommendations.push({
            type: 'success',
            message: 'Excellent validation results with minor variations.',
            action: 'Review minor differences and deploy'
        });
    } else if (summary.consistencyScore < 70) {
        recommendations.push({
            type: 'warning',
            message: 'Low consistency across examples detected.',
            action: 'Review failed examples for pattern inconsistencies'
        });
    }
    
    if (summary.failedExamples > 0) {
        recommendations.push({
            type: 'action',
            message: `${summary.failedExamples} examples failed validation.`,
            action: 'Review failed examples and refine transformation logic'
        });
    }
    
    if (summary.averageAccuracy < 90) {
        recommendations.push({
            type: 'improvement',
            message: 'Average accuracy below 90% threshold.',
            action: 'Analyze accuracy gaps and improve transformation rules'
        });
    }
    
    return recommendations;
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length < 3) {
        console.log("🎯 R-Genie Multi-Example Validator v1.0");
        console.log("═════════════════════════════════════════");
        console.log("");
        console.log("USAGE:");
        console.log("  node multi-example-validator.js <script.dwl> <examples-dir> <expected-dir>");
        console.log("");
        console.log("EXAMPLE:");
        console.log("  node multi-example-validator.js transformation.dwl examples/ expected-outputs/");
        process.exit(1);
    }
    
    const scriptFile = args[0];
    const examplesDir = args[1];
    const expectedDir = args[2];
    
    try {
        const results = validateMultipleExamples(scriptFile, examplesDir, expectedDir);
        
        console.log("");
        console.log(`${colors.bright}🏆 MULTI-EXAMPLE VALIDATION RESULTS${colors.reset}`);
        console.log("═══════════════════════════════════════════════");
        console.log(`📊 Total Examples: ${colors.cyan}${results.summary.totalExamples}${colors.reset}`);
        console.log(`✅ Passed: ${colors.green}${results.summary.passedExamples}${colors.reset}`);
        console.log(`❌ Failed: ${colors.red}${results.summary.failedExamples}${colors.reset}`);
        console.log(`📈 Average Accuracy: ${colors.yellow}${results.summary.averageAccuracy}%${colors.reset}`);
        console.log(`🔄 Consistency Score: ${colors.blue}${results.summary.consistencyScore}%${colors.reset}`);
        console.log(`🎯 Overall Result: ${colors.magenta}${results.summary.overallResult}${colors.reset}`);
        console.log("");
        
        if (results.recommendations.length > 0) {
            console.log(`${colors.bright}💡 RECOMMENDATIONS${colors.reset}`);
            console.log("═══════════════════════════════════════════════");
            results.recommendations.forEach(rec => {
                const icon = rec.type === 'success' ? '✅' : rec.type === 'warning' ? '⚠️' : '🔧';
                console.log(`   ${icon} ${rec.message}`);
                console.log(`     Action: ${rec.action}`);
            });
            console.log("");
        }
        
        // Save detailed results
        const outputFile = 'multi-example-validation-results.json';
        fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
        logger.success( `📁 Detailed results saved to: ${outputFile}`);
        
        // Set exit code based on results
        if (results.summary.overallResult === 'PERFECT' || results.summary.overallResult === 'EXCELLENT') {
            logger.success( '🎉 Multi-example validation PASSED!');
            process.exit(0);
        } else if (results.summary.averageAccuracy >= 90) {
            logger.warning( '⚠️ Multi-example validation PASSED with minor issues');
            process.exit(0);
        } else {
            logger.error( '❌ Multi-example validation FAILED');
            process.exit(1);
        }
        
    } catch (error) {
        logger.error( `❌ Validation failed: ${error.message}`);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    validateMultipleExamples,
    findExamplePairs,
    validateSingleExample,
    calculateConsistencyScore
};
