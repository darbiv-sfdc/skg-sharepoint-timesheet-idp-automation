#!/usr/bin/env node

/**
 * 🎯 R-Genie Multi-Input Validator v1.0
 * Validates DataWeave transformations with multiple input files (payload, variables, attributes)
 * @signature Q2hlcHBhbGlTaGFpa1NvaGFpbDE1MDgxOTkz
 * Supports complex multi-source data integration scenarios
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { createLogger } = require('../utilities/03-01-20_Unified_Logger.js');

// Initialize unified logger
const logger = createLogger('multi-input-validator', { level: 'INFO' });

// Shared color codes
// @watermark CS150893‌
const { colors } = require('../utilities/colors.js');

// Using unified logger - custom log function removed

// 🆕 Validate multi-input DataWeave transformation
function validateMultiInputTransformation(scriptFile, inputFiles, expectedOutputFile) {
    logger.info( '🎯 Starting multi-input validation...');
    logger.info( `📝 Script: ${scriptFile}`);
    logger.info( `📁 Input Files: ${inputFiles.length}`);
    inputFiles.forEach((file, i) => {
        const inputType = detectInputType(file);
        logger.info( `   ${i + 1}. ${file} (${inputType})`);
    });
    logger.info( `📤 Expected Output: ${expectedOutputFile}`);
    
    const results = {
        metadata: {
            timestamp: new Date().toISOString(),
            scriptFile,
            inputFiles,
            expectedOutputFile,
            validationVersion: "1.0.0-multi-input"
        },
        inputValidation: {
            filesExist: [],
            formatValidation: [],
            structureAnalysis: []
        },
        executionResults: {
            syntaxValid: false,
            executionSuccessful: false,
            outputGenerated: false,
            executionTime: 0,
            errors: []
        },
        accuracyResults: {
            fieldLevelAccuracy: 0,
            structuralMatch: false,
            typeConsistency: true,
            businessLogicCorrect: false
        },
        integrationResults: {
            inputIntegration: [],
            crossReferenceValidation: [],
            mergeValidation: []
        },
        summary: {
            overallResult: 'PENDING',
            passedChecks: 0,
            totalChecks: 0,
            confidence: 0
        },
        recommendations: []
    };
    
    try {
        // Step 1: Validate input files
        logger.info( '📋 Validating input files...');
        validateInputFiles(inputFiles, results);
        
        // Step 2: Validate DataWeave syntax
        logger.info( '🔍 Validating DataWeave syntax...');
        validateSyntax(scriptFile, results);
        
        // Step 3: Execute transformation
        if (results.executionResults.syntaxValid) {
            logger.info( '🚀 Executing multi-input transformation...');
            executeMultiInputTransformation(scriptFile, inputFiles, results);
        }
        
        // Step 4: Validate accuracy
        if (results.executionResults.outputGenerated) {
            logger.info( '📊 Validating output accuracy...');
            validateAccuracy(results.tempOutputFile, expectedOutputFile, results);
        }
        
        // Step 5: Validate integration
        logger.info( '🔗 Validating input integration...');
        validateIntegration(inputFiles, results);
        
        // Step 6: Calculate summary
        calculateSummary(results);
        
        // Step 7: Generate recommendations
        results.recommendations = generateMultiInputRecommendations(results);
        
        return results;
        
    } catch (error) {
        logger.error( `❌ Multi-input validation failed: ${error.message}`);
        results.summary.overallResult = 'FAILED';
        results.error = error.message;
        return results;
    }
}

// 🆕 Detect input file type
function detectInputType(filename) {
    const basename = path.basename(filename).toLowerCase();
    
    if (basename.includes('payload') || basename.includes('main') || basename.includes('data')) {
        return 'payload';
    } else if (basename.includes('variable') || basename.includes('var') || basename.includes('param')) {
        return 'variables';
    } else if (basename.includes('attribute') || basename.includes('attr') || basename.includes('property')) {
        return 'attributes';
    } else if (basename.includes('config') || basename.includes('setting')) {
        return 'configuration';
    } else if (basename.includes('context') || basename.includes('env')) {
        return 'context';
    } else {
        return 'unknown';
    }
}

// 🆕 Validate input files existence and format
function validateInputFiles(inputFiles, results) {
    inputFiles.forEach(inputFile => {
        const fileCheck = {
            file: inputFile,
            exists: fs.existsSync(inputFile),
            format: 'unknown',
            valid: false,
            inputType: detectInputType(inputFile),
            size: 0
        };
        
        if (fileCheck.exists) {
            try {
                const stats = fs.statSync(inputFile);
                fileCheck.size = stats.size;
                
                // Detect format
                const extension = path.extname(inputFile).toLowerCase();
                if (extension === '.json') {
                    fileCheck.format = 'json';
                    const content = fs.readFileSync(inputFile, 'utf8');
                    JSON.parse(content); // Validate JSON
                    fileCheck.valid = true;
                } else if (extension === '.xml') {
                    fileCheck.format = 'xml';
                    const content = fs.readFileSync(inputFile, 'utf8');
                    fileCheck.valid = content.includes('<') && content.includes('>');
                } else {
                    fileCheck.format = 'unknown';
                }
            } catch (error) {
                fileCheck.valid = false;
                fileCheck.error = error.message;
            }
        }
        
        results.inputValidation.filesExist.push(fileCheck);
    });
}

// 🆕 Validate DataWeave syntax
function validateSyntax(scriptFile, results) {
    try {
        // Security: Sanitize file path to prevent command injection
        const sanitizedPath = path.resolve(scriptFile);
        if (sanitizedPath.includes('..') || sanitizedPath.includes(';') || sanitizedPath.includes('|') || sanitizedPath.includes('&')) {
            throw new Error('Invalid file path detected');
        }
        
        const command = `dw validate -f "${sanitizedPath}"`;
        const output = execSync(command, { stdio: 'pipe' }).toString();
        
        if (output.includes('No errors found')) {
            results.executionResults.syntaxValid = true;
        } else {
            results.executionResults.errors.push('Syntax validation failed');
        }
    } catch (error) {
        results.executionResults.syntaxValid = false;
        results.executionResults.errors.push(`Syntax error: ${error.message}`);
    }
}

// 🆕 Execute multi-input transformation
function executeMultiInputTransformation(scriptFile, inputFiles, results) {
    const startTime = Date.now();
    const outputFile = 'temp-multi-input-output.json';
    
    try {
        // Build DataWeave command with multiple inputs
        let dwCommand = `dw run -f "${scriptFile}"`;
        
        // Add input files to command
        inputFiles.forEach((inputFile, index) => {
            const inputType = detectInputType(inputFile);
            const inputName = inputType === 'payload' ? 'payload' : inputType;
            dwCommand += ` --input ${inputName}="${inputFile}"`;
        });
        
        dwCommand += ` --output "${outputFile}"`;
        
        logger.info( `🔧 Executing: ${dwCommand}`);
        execSync(dwCommand, { stdio: 'pipe' });
        
        results.executionResults.executionSuccessful = true;
        results.executionResults.outputGenerated = fs.existsSync(outputFile);
        results.tempOutputFile = outputFile;
        
    } catch (error) {
        results.executionResults.executionSuccessful = false;
        results.executionResults.errors.push(`Execution error: ${error.message}`);
    }
    
    results.executionResults.executionTime = Date.now() - startTime;
}

// 🆕 Validate output accuracy
function validateAccuracy(outputFile, expectedOutputFile, results) {
    try {
        // Use existing output validator
        const validatorCommand = `node ./03-01-12_Output_Validator.js "${outputFile}" "${expectedOutputFile}"`;
        const validatorOutput = execSync(validatorCommand, { 
            stdio: 'pipe',
            cwd: __dirname 
        }).toString();
        
        // Parse accuracy from validator output
        const accuracyMatch = validatorOutput.match(/Field-Level Accuracy: (\d+)%/);
        if (accuracyMatch) {
            results.accuracyResults.fieldLevelAccuracy = parseInt(accuracyMatch[1]);
        }
        
        const structuralMatch = validatorOutput.includes('✅ Structure match');
        results.accuracyResults.structuralMatch = structuralMatch;
        
        const typeConsistency = !validatorOutput.includes('Type mismatch');
        results.accuracyResults.typeConsistency = typeConsistency;
        
        results.accuracyResults.businessLogicCorrect = results.accuracyResults.fieldLevelAccuracy === 100;
        
    } catch (error) {
        results.accuracyResults.validationError = error.message;
    } finally {
        // Clean up temporary file (always executed)
        if (fs.existsSync(outputFile)) {
            fs.unlinkSync(outputFile);
        }
    }
}

// 🆕 Validate input integration
function validateIntegration(inputFiles, results) {
    // Check if all required input types are present
    const inputTypes = inputFiles.map(file => detectInputType(file));
    const hasPayload = inputTypes.includes('payload');
    const hasVariables = inputTypes.includes('variables');
    const hasAttributes = inputTypes.includes('attributes');
    
    results.integrationResults.inputIntegration.push({
        check: 'Required Input Types',
        hasPayload,
        hasVariables,
        hasAttributes,
        passed: hasPayload, // Payload is minimum requirement
        recommendation: !hasPayload ? 'Consider adding a payload file for primary data' : 'Good input type coverage'
    });
    
    // Validate cross-references if multiple inputs
    if (inputFiles.length > 1) {
        const crossRefValidation = validateCrossReferences(inputFiles);
        results.integrationResults.crossReferenceValidation = crossRefValidation;
    }
    
    // Validate merge potential
    if (inputFiles.length > 1) {
        const mergeValidation = validateMergePotential(inputFiles);
        results.integrationResults.mergeValidation = mergeValidation;
    }
}

// 🆕 Validate cross-references between inputs
function validateCrossReferences(inputFiles) {
    const crossRefs = [];
    
    for (let i = 0; i < inputFiles.length; i++) {
        for (let j = i + 1; j < inputFiles.length; j++) {
            try {
                const data1 = JSON.parse(fs.readFileSync(inputFiles[i], 'utf8'));
                const data2 = JSON.parse(fs.readFileSync(inputFiles[j], 'utf8'));
                
                const fields1 = extractFieldNames(data1);
                const fields2 = extractFieldNames(data2);
                
                const commonFields = fields1.filter(field => fields2.includes(field));
                
                crossRefs.push({
                    file1: inputFiles[i],
                    file2: inputFiles[j],
                    commonFields: commonFields.length,
                    fields: commonFields,
                    compatibility: commonFields.length > 0 ? 'compatible' : 'independent'
                });
                
            } catch (error) {
                crossRefs.push({
                    file1: inputFiles[i],
                    file2: inputFiles[j],
                    error: error.message,
                    compatibility: 'unknown'
                });
            }
        }
    }
    
    return crossRefs;
}

// 🆕 Extract field names from data structure
function extractFieldNames(obj, prefix = '') {
    const fields = [];
    
    if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach(key => {
            const fieldPath = prefix ? `${prefix}.${key}` : key;
            fields.push(fieldPath);
            
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                fields.push(...extractFieldNames(obj[key], fieldPath));
            }
        });
    }
    
    return fields;
}

// 🆕 Validate merge potential
function validateMergePotential(inputFiles) {
    const mergeAnalysis = {
        totalInputs: inputFiles.length,
        mergeableInputs: 0,
        conflictingFields: [],
        mergeStrategy: 'unknown'
    };
    
    try {
        const allFields = [];
        const conflictMap = new Map();
        
        inputFiles.forEach(inputFile => {
            const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
            const fields = extractFieldNames(data);
            
            fields.forEach(field => {
                if (conflictMap.has(field)) {
                    conflictMap.set(field, conflictMap.get(field) + 1);
                } else {
                    conflictMap.set(field, 1);
                }
            });
            
            allFields.push(...fields);
            mergeAnalysis.mergeableInputs++;
        });
        
        // Identify conflicting fields
        conflictMap.forEach((count, field) => {
            if (count > 1) {
                mergeAnalysis.conflictingFields.push({
                    field,
                    occurrences: count
                });
            }
        });
        
        // Suggest merge strategy
        if (mergeAnalysis.conflictingFields.length === 0) {
            mergeAnalysis.mergeStrategy = 'simple_merge';
        } else if (mergeAnalysis.conflictingFields.length < allFields.length * 0.1) {
            mergeAnalysis.mergeStrategy = 'conflict_resolution';
        } else {
            mergeAnalysis.mergeStrategy = 'selective_merge';
        }
        
    } catch (error) {
        mergeAnalysis.error = error.message;
    }
    
    return mergeAnalysis;
}

// 🆕 Calculate validation summary
function calculateSummary(results) {
    let passedChecks = 0;
    let totalChecks = 0;
    
    // Input file checks
    const validInputs = results.inputValidation.filesExist.filter(f => f.exists && f.valid).length;
    const totalInputs = results.inputValidation.filesExist.length;
    totalChecks += totalInputs;
    passedChecks += validInputs;
    
    // Syntax check
    totalChecks += 1;
    if (results.executionResults.syntaxValid) passedChecks += 1;
    
    // Execution check
    totalChecks += 1;
    if (results.executionResults.executionSuccessful) passedChecks += 1;
    
    // Output generation check
    totalChecks += 1;
    if (results.executionResults.outputGenerated) passedChecks += 1;
    
    // Accuracy check
    if (results.accuracyResults.fieldLevelAccuracy !== undefined) {
        totalChecks += 1;
        if (results.accuracyResults.fieldLevelAccuracy >= 90) passedChecks += 1;
    }
    
    results.summary.passedChecks = passedChecks;
    results.summary.totalChecks = totalChecks;
    results.summary.confidence = totalChecks > 0 ? (passedChecks / totalChecks) : 0;
    
    // Determine overall result
    if (passedChecks === totalChecks && results.accuracyResults.fieldLevelAccuracy === 100) {
        results.summary.overallResult = 'PERFECT';
    } else if (results.summary.confidence >= 0.9) {
        results.summary.overallResult = 'EXCELLENT';
    } else if (results.summary.confidence >= 0.8) {
        results.summary.overallResult = 'GOOD';
    } else if (results.summary.confidence >= 0.6) {
        results.summary.overallResult = 'ACCEPTABLE';
    } else {
        results.summary.overallResult = 'POOR';
    }
}

// 🆕 Generate recommendations
function generateMultiInputRecommendations(results) {
    const recommendations = [];
    
    // Input file recommendations
    const invalidInputs = results.inputValidation.filesExist.filter(f => !f.exists || !f.valid);
    if (invalidInputs.length > 0) {
        recommendations.push({
            type: 'input_files',
            message: `${invalidInputs.length} input files have issues`,
            action: 'Check file existence and format validity',
            details: invalidInputs.map(f => `${f.file}: ${f.exists ? 'invalid format' : 'not found'}`)
        });
    }
    
    // Syntax recommendations
    if (!results.executionResults.syntaxValid) {
        recommendations.push({
            type: 'syntax',
            message: 'DataWeave syntax errors detected',
            action: 'Fix syntax errors before proceeding',
            details: results.executionResults.errors
        });
    }
    
    // Execution recommendations
    if (!results.executionResults.executionSuccessful) {
        recommendations.push({
            type: 'execution',
            message: 'Transformation execution failed',
            action: 'Review input bindings and DataWeave logic',
            details: results.executionResults.errors
        });
    }
    
    // Accuracy recommendations
    if (results.accuracyResults.fieldLevelAccuracy < 100) {
        recommendations.push({
            type: 'accuracy',
            message: `Accuracy is ${results.accuracyResults.fieldLevelAccuracy}% (target: 100%)`,
            action: 'Review field mappings and transformation logic'
        });
    }
    
    // Integration recommendations
    if (results.integrationResults.mergeValidation && results.integrationResults.mergeValidation.conflictingFields.length > 0) {
        recommendations.push({
            type: 'integration',
            message: `${results.integrationResults.mergeValidation.conflictingFields.length} field conflicts detected`,
            action: 'Implement conflict resolution strategy for overlapping fields'
        });
    }
    
    // Success recommendations
    if (results.summary.overallResult === 'PERFECT') {
        recommendations.push({
            type: 'success',
            message: 'Perfect multi-input validation! Ready for production.',
            action: 'Deploy with confidence'
        });
    }
    
    return recommendations;
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length < 3) {
        console.log("🎯 R-Genie Multi-Input Validator v1.0");
        console.log("════════════════════════════════════════");
        console.log("");
        console.log("USAGE:");
        console.log("  node multi-input-validator.js <script.dwl> \"<input-files>\" <expected-output>");
        console.log("");
        console.log("EXAMPLES:");
        console.log("  node multi-input-validator.js transform.dwl \"payload.json,variables.json,attributes.json\" expected.json");
        console.log("  node multi-input-validator.js script.dwl \"data.json,params.json\" output.json");
        process.exit(1);
    }
    
    const scriptFile = args[0];
    const inputFilesList = args[1];
    const expectedOutputFile = args[2];
    
    // Parse input files list
    const inputFiles = inputFilesList.split(',').map(f => f.trim());
    
    if (!fs.existsSync(scriptFile)) {
        logger.error( `❌ Script file not found: ${scriptFile}`);
        process.exit(1);
    }
    
    if (!fs.existsSync(expectedOutputFile)) {
        logger.error( `❌ Expected output file not found: ${expectedOutputFile}`);
        process.exit(1);
    }
    
    try {
        const results = validateMultiInputTransformation(scriptFile, inputFiles, expectedOutputFile);
        
        console.log("");
        console.log(`${colors.bright}🏆 MULTI-INPUT VALIDATION RESULTS${colors.reset}`);
        console.log("═══════════════════════════════════════════════");
        console.log(`📊 Total Checks: ${colors.cyan}${results.summary.totalChecks}${colors.reset}`);
        console.log(`✅ Passed: ${colors.green}${results.summary.passedChecks}${colors.reset}`);
        console.log(`📈 Confidence: ${colors.yellow}${Math.round(results.summary.confidence * 100)}%${colors.reset}`);
        console.log(`🎯 Overall Result: ${colors.magenta}${results.summary.overallResult}${colors.reset}`);
        console.log(`📊 Field Accuracy: ${colors.blue}${results.accuracyResults.fieldLevelAccuracy || 'N/A'}%${colors.reset}`);
        console.log("");
        
        // Display input validation
        console.log(`${colors.bright}📁 INPUT VALIDATION${colors.reset}`);
        console.log("═══════════════════════════════════════════════");
        results.inputValidation.filesExist.forEach(input => {
            const status = input.exists && input.valid ? `${colors.green}✅ VALID${colors.reset}` : `${colors.red}❌ INVALID${colors.reset}`;
            console.log(`   ${input.inputType.toUpperCase()}: ${status} - ${path.basename(input.file)}`);
        });
        console.log("");
        
        // Display integration results
        if (results.integrationResults.mergeValidation) {
            console.log(`${colors.bright}🔗 INTEGRATION ANALYSIS${colors.reset}`);
            console.log("═══════════════════════════════════════════════");
            console.log(`   Merge Strategy: ${colors.cyan}${results.integrationResults.mergeValidation.mergeStrategy}${colors.reset}`);
            console.log(`   Conflicting Fields: ${colors.yellow}${results.integrationResults.mergeValidation.conflictingFields.length}${colors.reset}`);
            console.log("");
        }
        
        // Display recommendations
        if (results.recommendations.length > 0) {
            console.log(`${colors.bright}💡 RECOMMENDATIONS${colors.reset}`);
            console.log("═══════════════════════════════════════════════");
            results.recommendations.forEach(rec => {
                const icon = {
                    'input_files': '📁',
                    'syntax': '📝',
                    'execution': '🚀',
                    'accuracy': '📊',
                    'integration': '🔗',
                    'success': '✅'
                }[rec.type] || '💡';
                
                console.log(`   ${icon} ${rec.message}`);
                console.log(`     Action: ${rec.action}`);
            });
            console.log("");
        }
        
        // Save detailed results
        const outputDir = path.dirname(expectedOutputFile);
        const resultsFile = `${outputDir}/multi-input-validation-results.json`;
        fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
        logger.success( `📁 Detailed results saved to: ${resultsFile}`);
        
        // Set exit code based on results
        if (results.summary.overallResult === 'PERFECT' || results.summary.overallResult === 'EXCELLENT') {
            logger.success( '🎉 Multi-input validation PASSED!');
            process.exit(0);
        } else if (results.summary.confidence >= 0.8) {
            logger.warning( '⚠️ Multi-input validation PASSED with minor issues');
            process.exit(0);
        } else {
            logger.error( '❌ Multi-input validation FAILED');
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
    validateMultiInputTransformation,
    detectInputType,
    validateInputFiles,
    validateIntegration
};
