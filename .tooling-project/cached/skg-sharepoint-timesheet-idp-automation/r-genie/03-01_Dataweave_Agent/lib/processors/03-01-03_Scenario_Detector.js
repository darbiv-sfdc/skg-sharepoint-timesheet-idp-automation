#!/usr/bin/env node

/**
 * 🎯 R-Genie Scenario Detector v1.0
 * Automatically detects transformation scenario and routes to appropriate workflow
 * @signature Q2hlcHBhbGlTaGFpa1NvaGFpbDE1MDgxOTkz
 * Supports: Single example, Multiple examples, Mapping sheet only
 */

const fs = require('fs');
const path = require('path');

// Shared color codes
// @watermark CS150893‌
const { colors } = require('../utilities/colors.js');

function log(level, message) {
    const levelColors = {
        'INFO': colors.cyan,
        'SUCCESS': colors.green,
        'WARNING': colors.yellow,
        'ERROR': colors.red,
        'DETECT': colors.magenta
    };
    
    const color = levelColors[level] || colors.reset;
    console.log(`${color}[${level}]${colors.reset} ${message}`);
}

// 🆕 Detect file types and scenario
function detectScenario(args) {
    const files = args.filter(arg => !arg.startsWith('--'));
    const inputFiles = [];
    const outputFiles = [];
    const mappingFiles = [];
    const noteFiles = [];
    
    // Categorize files by type
    files.forEach(file => {
        if (!fs.existsSync(file)) {
            log('WARNING', `⚠️ File not found: ${file}`);
            return;
        }
        
        const extension = path.extname(file).toLowerCase();
        const basename = path.basename(file).toLowerCase();
        
        // Detect mapping files
        if (extension === '.csv' || basename.includes('mapping') || basename.includes('field') || 
            basename.includes('schema') || extension === '.xlsx' || extension === '.xls') {
            mappingFiles.push(file);
        }
        // Detect notes/documentation files
        else if (extension === '.txt' || extension === '.md' || basename.includes('note') || 
                 basename.includes('requirement') || basename.includes('spec')) {
            noteFiles.push(file);
        }
        // Detect output files FIRST (typically contain 'output', 'expected', 'target')
        else if (basename.includes('output') || basename.includes('expected') || 
                 basename.includes('target') || basename.includes('result')) {
            outputFiles.push(file);
        }
        // Detect input files (typically contain 'input', 'source', or come first)
        else if (basename.includes('input') || basename.includes('source') || basename.includes('req') ||
                 basename.includes('payload') || basename.includes('variable') || basename.includes('attribute') ||
                 basename.includes('param') || basename.includes('data')) {
            inputFiles.push(file);
        }
        // Default categorization based on order and content
        else {
            // Try to detect by content analysis
            try {
                const content = fs.readFileSync(file, 'utf8').trim();
                const isJson = (content.startsWith('{') || content.startsWith('[')) && content.endsWith('}' || ']');
                const isXml = content.includes('<?xml') || (content.includes('<') && content.includes('>'));
                
                if (isJson || isXml) {
                    // For ambiguous files, check if paired
                    if (inputFiles.length <= outputFiles.length) {
                        inputFiles.push(file);
                    } else {
                        outputFiles.push(file);
                    }
                }
            } catch (error) {
                log('WARNING', `⚠️ Could not analyze file content: ${file}`);
            }
        }
    });
    
    // Determine scenario
    let scenario = 'unknown';
    let confidence = 0;
    
    if (mappingFiles.length > 0 && inputFiles.length === 0 && outputFiles.length === 0) {
        scenario = 'mapping_sheet_only';
        confidence = 0.9;
    } else if (inputFiles.length === 1 && outputFiles.length === 1) {
        scenario = 'single_example';
        confidence = 0.95;
    } else if (inputFiles.length > 1 && outputFiles.length === 1) {
        scenario = 'multi_input_single_output';
        confidence = 0.85;
    } else if (inputFiles.length > 1 && outputFiles.length > 1 && inputFiles.length === outputFiles.length) {
        scenario = 'multi_example';
        confidence = 0.9;
    } else if (inputFiles.length > 0 || outputFiles.length > 0) {
        // Partial detection - try to infer
        if (inputFiles.length > outputFiles.length) {
            scenario = 'multi_example_partial';
            confidence = 0.6;
        } else {
            scenario = 'single_example_partial';
            confidence = 0.7;
        }
    }
    
    return {
        scenario,
        confidence,
        files: {
            input: inputFiles,
            output: outputFiles,
            mapping: mappingFiles,
            notes: noteFiles
        },
        recommendations: generateRecommendations(scenario, inputFiles, outputFiles, mappingFiles, noteFiles)
    };
}

// 🆕 Generate recommendations based on detected scenario
function generateRecommendations(scenario, inputFiles, outputFiles, mappingFiles, noteFiles) {
    const recommendations = [];
    
    switch (scenario) {
        case 'single_example':
            recommendations.push({
                workflow: 'enhanced_single',
                command: `node ./03-01-02_Requirements_Analyzer.js ${inputFiles[0]} ${outputFiles[0]}${noteFiles.length > 0 ? ' ' + noteFiles[0] : ''}`,
                description: 'Standard single-example enhanced workflow',
                confidence: 'high',
                advantages: ['100% accuracy validation', 'Complete business logic analysis', 'Full CLI testing'],
                limitations: ['Single data point - may miss edge cases']
            });
            break;
            
        case 'multi_example':
            const inputList = inputFiles.join(',');
            const outputList = outputFiles.join(',');
            recommendations.push({
                workflow: 'enhanced_multi',
                command: `node ./03-01-02_Requirements_Analyzer.js --multi-example --input-examples "${inputList}" --output-examples "${outputList}"${noteFiles.length > 0 ? ' ' + noteFiles[0] : ''}`,
                description: 'Multi-example enhanced workflow with pattern aggregation',
                confidence: 'highest',
                advantages: ['Pattern consistency analysis', 'Higher confidence scores', 'Edge case coverage', 'Robust validation'],
                limitations: ['Longer processing time', 'Potential pattern conflicts']
            });
            break;
            
        case 'multi_input_single_output':
            const multiInputList = inputFiles.join(',');
            recommendations.push({
                workflow: 'enhanced_multi_input',
                command: `node ./03-01-02_Requirements_Analyzer.js --multi-input --input-files "${multiInputList}" --output-file ${outputFiles[0]}${noteFiles.length > 0 ? ' ' + noteFiles[0] : ''}`,
                description: 'Multi-input enhanced workflow with variable analysis',
                confidence: 'high',
                advantages: ['Multiple data source integration', 'Variable and attribute analysis', 'Complex transformation support', 'Production-ready validation'],
                limitations: ['More complex setup', 'Requires understanding of input relationships']
            });
            break;
            
        case 'mapping_sheet_only':
            recommendations.push({
                workflow: 'mapping_only',
                command: `node ./03-01-02_Requirements_Analyzer.js --mapping-only ${mappingFiles[0]}${noteFiles.length > 0 ? ' ' + noteFiles[0] : ''}`,
                description: 'Mapping-sheet-only workflow with synthetic analysis',
                confidence: 'medium',
                advantages: ['Works without examples', 'Field mapping analysis', 'Syntax validation'],
                limitations: ['No accuracy validation', 'Limited business logic detection', 'Manual testing required']
            });
            break;
            
        case 'multi_example_partial':
            recommendations.push({
                workflow: 'create_missing_outputs',
                command: 'Create missing output files or use single-example workflow',
                description: 'More input files than output files detected',
                confidence: 'low',
                advantages: ['Potential for multi-example workflow'],
                limitations: ['Missing output files prevent full validation']
            });
            break;
            
        case 'single_example_partial':
            recommendations.push({
                workflow: 'verify_file_pairing',
                command: 'Verify input/output file pairing',
                description: 'Unclear file relationships detected',
                confidence: 'low',
                advantages: ['May work as single example'],
                limitations: ['File relationship unclear']
            });
            break;
            
        default:
            recommendations.push({
                workflow: 'manual_classification',
                command: 'Manually specify scenario type',
                description: 'Could not automatically detect scenario',
                confidence: 'unknown',
                advantages: ['Flexible manual specification'],
                limitations: ['Requires manual intervention']
            });
    }
    
    return recommendations;
}

// 🆕 Execute recommended workflow
function executeWorkflow(detection, executeNow = false) {
    const primaryRecommendation = detection.recommendations[0];
    
    if (!executeNow) {
        log('INFO', '🎯 Workflow recommendations generated. Use --execute to run automatically.');
        return;
    }
    
    log('INFO', `🚀 Executing ${primaryRecommendation.workflow} workflow...`);
    
    try {
        // Security: Validate command before execution
        const command = primaryRecommendation.command;
        if (!command || typeof command !== 'string') {
            throw new Error('Invalid command provided');
        }
        
        // Security: Whitelist allowed commands to prevent injection
        const allowedCommands = [
            'Verify input/output file pairing',
            'Manually specify scenario type'
        ];
        
        // Only execute if command is in whitelist or is a safe DataWeave CLI command
        const isSafeCommand = allowedCommands.includes(command) || 
                              (command.startsWith('dw ') && !command.includes(';') && !command.includes('|') && !command.includes('&'));
        
        if (!isSafeCommand) {
            log('WARNING', `Command not in whitelist, skipping execution: ${command}`);
            return;
        }
        
        const { exec } = require('child_process');
        exec(command, (error, stdout, stderr) => {
            if (error) {
                log('ERROR', `❌ Workflow execution failed: ${error.message}`);
                return;
            }
            
            if (stderr) {
                log('WARNING', `⚠️ Workflow warnings: ${stderr}`);
            }
            
            log('SUCCESS', '✅ Workflow executed successfully!');
            console.log(stdout);
        });
    } catch (error) {
        log('ERROR', `❌ Failed to execute workflow: ${error.message}`);
    }
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args.includes('--help')) {
        console.log("🎯 R-Genie Scenario Detector v1.0");
        console.log("═══════════════════════════════════");
        console.log("");
        console.log("USAGE:");
        console.log("  node scenario-detector.js [files...] [options]");
        console.log("");
        console.log("OPTIONS:");
        console.log("  --execute    Execute the recommended workflow automatically");
        console.log("  --help       Show this help message");
        console.log("");
        console.log("EXAMPLES:");
        console.log("  node scenario-detector.js input.json expected.json notes.txt");
        console.log("  node scenario-detector.js input1.json input2.json output1.json output2.json");
        console.log("  node scenario-detector.js mappings.csv transformation-notes.txt");
        console.log("  node scenario-detector.js *.json --execute");
        process.exit(0);
    }
    
    const executeNow = args.includes('--execute');
    const files = args.filter(arg => !arg.startsWith('--'));
    
    log('INFO', '🔍 Starting scenario detection...');
    console.log("");
    
    try {
        const detection = detectScenario(files);
        
        // Display results
        console.log(`${colors.bright}🎯 SCENARIO DETECTION RESULTS${colors.reset}`);
        console.log("═══════════════════════════════════════════════");
        console.log(`📊 Detected Scenario: ${colors.cyan}${detection.scenario.toUpperCase().replace(/_/g, ' ')}${colors.reset}`);
        console.log(`🎯 Confidence: ${colors.green}${Math.round(detection.confidence * 100)}%${colors.reset}`);
        console.log("");
        
        console.log(`${colors.bright}📁 FILE CATEGORIZATION${colors.reset}`);
        console.log("═══════════════════════════════════════════════");
        console.log(`📥 Input Files: ${colors.yellow}${detection.files.input.length}${colors.reset} - ${detection.files.input.join(', ') || 'None'}`);
        console.log(`📤 Output Files: ${colors.yellow}${detection.files.output.length}${colors.reset} - ${detection.files.output.join(', ') || 'None'}`);
        console.log(`📋 Mapping Files: ${colors.yellow}${detection.files.mapping.length}${colors.reset} - ${detection.files.mapping.join(', ') || 'None'}`);
        console.log(`📝 Notes Files: ${colors.yellow}${detection.files.notes.length}${colors.reset} - ${detection.files.notes.join(', ') || 'None'}`);
        console.log("");
        
        if (detection.recommendations.length > 0) {
            console.log(`${colors.bright}🚀 WORKFLOW RECOMMENDATIONS${colors.reset}`);
            console.log("═══════════════════════════════════════════════");
            
            detection.recommendations.forEach((rec, index) => {
                console.log(`${colors.bright}${index + 1}. ${rec.workflow.toUpperCase().replace(/_/g, ' ')}${colors.reset} (${rec.confidence} confidence)`);
                console.log(`   Description: ${rec.description}`);
                console.log(`   Command: ${colors.cyan}${rec.command}${colors.reset}`);
                
                if (rec.advantages.length > 0) {
                    console.log(`   ✅ Advantages: ${rec.advantages.join(', ')}`);
                }
                
                if (rec.limitations.length > 0) {
                    console.log(`   ⚠️ Limitations: ${rec.limitations.join(', ')}`);
                }
                
                console.log("");
            });
        }
        
        // Execute if requested
        if (executeNow && detection.recommendations.length > 0) {
            executeWorkflow(detection, true);
        }
        
        // Save detection results
        const outputFile = 'scenario-detection-results.json';
        fs.writeFileSync(outputFile, JSON.stringify(detection, null, 2));
        log('SUCCESS', `📁 Detection results saved to: ${outputFile}`);
        
    } catch (error) {
        log('ERROR', `❌ Scenario detection failed: ${error.message}`);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    detectScenario,
    generateRecommendations,
    executeWorkflow
};
