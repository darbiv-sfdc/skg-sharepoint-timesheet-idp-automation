#!/usr/bin/env node

/**
 * 🔧 R-Genie CLI Validator Enhanced v1.0
 * Intelligent CLI command selection and execution with context awareness
 * @signature Q2hlcHBhbGlTaGFpa1NvaGFpbDE1MDgxOTkz
 * Transforms static CLI validation framework into intelligent automation
 */

const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const os = require('os');
const { getConfig } = require('../utilities/03-01-18_Config_Manager.js');

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
        'CLI': colors.magenta
    };
    
    const color = levelColors[level] || colors.reset;
    console.log(`${color}[${level}]${colors.reset} ${message}`);
}

// 🧠 INTELLIGENT PLATFORM DETECTION
function detectPlatform() {
    const platform = os.platform();
    const shell = process.env.SHELL || process.env.ComSpec || '';
    
    return {
        platform,
        isWindows: platform === 'win32',
        isMac: platform === 'darwin',
        isLinux: platform === 'linux',
        shell: shell,
        isPowerShell: shell.includes('powershell') || process.env.PSModulePath,
        isGitBash: shell.includes('bash') && platform === 'win32',
        supportsTimeout: (platform === 'linux') || (shell.includes('bash') && platform === 'win32')
    };
}

// 🎯 INTELLIGENT FILE ANALYSIS
function analyzeFiles(scriptFile, inputFile, expectedOutputFile) {
    const analysis = {
        script: { exists: false, size: 0, complexity: 'simple' },
        input: { exists: false, size: 0, format: 'unknown', category: 'small' },
        expectedOutput: { exists: false, size: 0, format: 'unknown' },
        hasXmlInput: false,
        hasXmlOutput: false,
        estimatedExecutionTime: 1000,
        recommendedTimeout: 30
    };

    // Analyze script file
    if (fs.existsSync(scriptFile)) {
        analysis.script.exists = true;
        analysis.script.size = fs.statSync(scriptFile).size;
        
        const scriptContent = fs.readFileSync(scriptFile, 'utf8');
        
        // Complexity analysis
        const complexityIndicators = [
            (scriptContent.match(/map\s*\(/g) || []).length,
            (scriptContent.match(/reduce\s*\(/g) || []).length,
            (scriptContent.match(/filter\s*\(/g) || []).length,
            (scriptContent.match(/groupBy\s*\(/g) || []).length,
            (scriptContent.match(/\.\*/g) || []).length // XML multivalue selectors
        ];
        
        const complexityScore = complexityIndicators.reduce((sum, count) => sum + count, 0);
        
        if (complexityScore > 10) analysis.script.complexity = 'advanced';
        else if (complexityScore > 5) analysis.script.complexity = 'complex';
        else if (complexityScore > 2) analysis.script.complexity = 'moderate';
        
        // XML detection
        analysis.hasXmlInput = scriptContent.includes('.*') || scriptContent.includes('@');
        analysis.hasXmlOutput = scriptContent.includes('application/xml');
    }

    // Analyze input file
    if (fs.existsSync(inputFile)) {
        analysis.input.exists = true;
        analysis.input.size = fs.statSync(inputFile).size;
        
        // Format detection
        if (inputFile.endsWith('.xml')) analysis.input.format = 'xml';
        else if (inputFile.endsWith('.json')) analysis.input.format = 'json';
        else if (inputFile.endsWith('.csv')) analysis.input.format = 'csv';
        
        // Size categorization (from performance benchmarks)
        if (analysis.input.size < 1024) {
            analysis.input.category = 'small';
            analysis.estimatedExecutionTime = 100;
            analysis.recommendedTimeout = 5;
        } else if (analysis.input.size < 102400) {
            analysis.input.category = 'medium';
            analysis.estimatedExecutionTime = 1000;
            analysis.recommendedTimeout = 15;
        } else if (analysis.input.size < 10485760) {
            analysis.input.category = 'large';
            analysis.estimatedExecutionTime = 10000;
            analysis.recommendedTimeout = 30;
        } else {
            analysis.input.category = 'enterprise';
            analysis.estimatedExecutionTime = 30000;
            analysis.recommendedTimeout = 60;
        }
    }

    // Analyze expected output file
    if (expectedOutputFile && fs.existsSync(expectedOutputFile)) {
        analysis.expectedOutput.exists = true;
        analysis.expectedOutput.size = fs.statSync(expectedOutputFile).size;
        
        if (expectedOutputFile.endsWith('.xml')) {
            analysis.expectedOutput.format = 'xml';
            analysis.hasXmlOutput = true;
        } else if (expectedOutputFile.endsWith('.json')) {
            analysis.expectedOutput.format = 'json';
        }
    }

    return analysis;
}

// 🎯 INTELLIGENT CLI COMMAND BUILDER
function buildIntelligentCLICommands(scriptFile, inputFile, outputFile, platform, analysis) {
    const commands = {
        validation: null,
        execution: null,
        performanceMonitoring: null
    };

    // Base paths - use absolute paths on Windows for reliability
    const scriptPath = platform.isWindows ? path.resolve(scriptFile) : scriptFile;
    const inputPath = platform.isWindows ? path.resolve(inputFile) : inputFile;
    const outputPath = platform.isWindows ? path.resolve(outputFile) : outputFile;

    // 🔍 INTELLIGENT VALIDATION COMMAND
    commands.validation = `dw validate -f "${scriptPath}" -i payload`;

    // 🚀 INTELLIGENT EXECUTION COMMAND
    const executionBase = `dw run -f "${scriptPath}" -i=payload="${inputPath}" -o "${outputPath}"`;
    
    // For XML output, the script should already handle the format via the output directive
    // CLI doesn't need additional format specification
    commands.execution = executionBase;

    // ⚡ INTELLIGENT PERFORMANCE MONITORING
    if (platform.supportsTimeout) {
        commands.performanceMonitoring = `timeout ${analysis.recommendedTimeout}s ${commands.execution}`;
    } else if (platform.isPowerShell) {
        commands.performanceMonitoring = `Measure-Command { ${commands.execution} }`;
    } else {
        commands.performanceMonitoring = commands.execution;
    }

    return commands;
}

// 🔧 INTELLIGENT CLI EXECUTOR
async function executeWithIntelligence(command, description, timeout) {
    const config = getConfig();
    timeout = timeout || config.getDataWeave('timeout') || 30000;
    log('CLI', `Executing: ${description}`);
    log('DETAIL', `Command: ${command}`);
    
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        
        const childProcess = exec(command, { timeout }, (error, stdout, stderr) => {
            const executionTime = Date.now() - startTime;
            
            if (error) {
                if (error.code === 'ETIMEDOUT') {
                    log('ERROR', `Command timed out after ${timeout}ms`);
                    reject(new Error(`Timeout: ${description} exceeded ${timeout}ms`));
                } else {
                    log('ERROR', `Command failed: ${error.message}`);
                    if (stderr) log('ERROR', `STDERR: ${stderr}`);
                    reject(error);
                }
            } else {
                log('SUCCESS', `${description} completed in ${executionTime}ms`);
                if (stdout) log('DETAIL', `STDOUT: ${stdout.substring(0, 200)}${stdout.length > 200 ? '...' : ''}`);
                resolve({ stdout, stderr, executionTime });
            }
        });

        // Handle process events
        childProcess.on('error', (error) => {
            log('ERROR', `Process error: ${error.message}`);
            reject(error);
        });
    });
}

// 🛡️ INTELLIGENT ERROR RECOVERY
async function intelligentErrorRecovery(error, command, description, analysis, platform) {
    log('WARNING', `Attempting intelligent error recovery for: ${description}`);
    
    const errorMessage = error.message.toLowerCase();
    
    // File path issues (common on Windows)
    if (errorMessage.includes('filenotfoundexception') || errorMessage.includes('cannot find')) {
        log('CLI', 'Detected file path issue - trying absolute paths');
        
        // Rebuild command with absolute paths
        const absoluteCommand = command.replace(/(?:"[^"]*")/g, (match) => {
            const cleanPath = match.replace(/"/g, '');
            return `"${path.resolve(cleanPath)}"`;
        });
        
        try {
            return await executeWithIntelligence(absoluteCommand, `${description} (absolute paths)`, analysis.recommendedTimeout * 1000);
        } catch (retryError) {
            log('ERROR', 'Absolute path recovery failed');
        }
    }

    // CLI environment issues
    if (errorMessage.includes('dw: command not found') || errorMessage.includes('dw is not recognized')) {
        log('CLI', 'DataWeave CLI not found - providing installation guidance');
        throw new Error(`
DataWeave CLI not found. Please install:
1. Download from: https://docs.mulesoft.com/dataweave/latest/dataweave-cli
2. Ensure CLI is in system PATH
3. Verify installation: dw --version
        `);
    }

    // Input parameter format issues
    if (errorMessage.includes('should be in key=value format')) {
        log('CLI', 'Detected parameter format issue - adjusting command format');
        
        // Fix parameter format
        const fixedCommand = command.replace(/-i payload/, '-i=payload');
        
        try {
            return await executeWithIntelligence(fixedCommand, `${description} (fixed parameters)`, analysis.recommendedTimeout * 1000);
        } catch (retryError) {
            log('ERROR', 'Parameter format recovery failed');
        }
    }

    // Timeout issues - try with increased timeout
    if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT')) {
        log('CLI', 'Detected timeout - increasing timeout limit');
        
        const increasedTimeout = analysis.recommendedTimeout * 2000;
        try {
            return await executeWithIntelligence(command, `${description} (extended timeout)`, increasedTimeout);
        } catch (retryError) {
            log('ERROR', 'Extended timeout recovery failed');
        }
    }

    // If all recovery attempts fail, throw the original error
    throw error;
}

// 🎯 MAIN CLI VALIDATION PIPELINE
async function runIntelligentCLIValidation(scriptFile, inputFile, outputFile, expectedOutputFile) {
    log('INFO', '🚀 Starting Intelligent CLI Validation Pipeline');
    console.log('══════════════════════════════════════════════════════════');

    try {
        // Phase 1: Intelligent Environment Analysis
        log('INFO', '🔍 Phase 1: Intelligent Environment Analysis');
        const platform = detectPlatform();
        log('DETAIL', `Platform: ${platform.platform}, Shell: ${path.basename(platform.shell)}`);
        
        const analysis = analyzeFiles(scriptFile, inputFile, expectedOutputFile);
        log('DETAIL', `Input Category: ${analysis.input.category}, Complexity: ${analysis.script.complexity}`);
        log('DETAIL', `Estimated Execution Time: ${analysis.estimatedExecutionTime}ms, Recommended Timeout: ${analysis.recommendedTimeout}s`);

        // Phase 2: Intelligent Command Construction
        log('INFO', '🔧 Phase 2: Intelligent Command Construction');
        const commands = buildIntelligentCLICommands(scriptFile, inputFile, outputFile, platform, analysis);

        // Phase 3: CLI Environment Validation
        log('INFO', '✅ Phase 3: CLI Environment Validation');
        
        try {
            await executeWithIntelligence('dw --version', 'DataWeave CLI version check', 5000);
        } catch (error) {
            log('ERROR', 'DataWeave CLI not accessible');
            throw new Error('DataWeave CLI environment validation failed. Please ensure CLI is installed and accessible.');
        }

        // Phase 4: Intelligent Syntax Validation
        log('INFO', '🔍 Phase 4: Intelligent Syntax Validation');
        
        try {
            await executeWithIntelligence(commands.validation, 'DataWeave syntax validation', 10000);
            log('SUCCESS', '✅ Syntax validation PASSED');
        } catch (error) {
            try {
                const recovery = await intelligentErrorRecovery(error, commands.validation, 'syntax validation', analysis, platform);
                log('SUCCESS', '✅ Syntax validation PASSED (after recovery)');
            } catch (recoveryError) {
                log('ERROR', '❌ Syntax validation FAILED');
                throw new Error(`Syntax validation failed: ${recoveryError.message}`);
            }
        }

        // Phase 5: Intelligent Execution Testing
        log('INFO', '🚀 Phase 5: Intelligent Execution Testing');
        
        let executionResult;
        try {
            executionResult = await executeWithIntelligence(
                commands.performanceMonitoring, 
                'DataWeave script execution', 
                analysis.recommendedTimeout * 1000
            );
            log('SUCCESS', `✅ Execution PASSED (${executionResult.executionTime}ms)`);
        } catch (error) {
            try {
                const recovery = await intelligentErrorRecovery(error, commands.execution, 'script execution', analysis, platform);
                executionResult = recovery;
                log('SUCCESS', `✅ Execution PASSED (after recovery, ${recovery.executionTime}ms)`);
            } catch (recoveryError) {
                log('ERROR', '❌ Execution FAILED');
                throw new Error(`Script execution failed: ${recoveryError.message}`);
            }
        }

        // Phase 6: Performance Analysis
        log('INFO', '⚡ Phase 6: Performance Analysis');
        
        const performanceCategory = analysis.input.category;
        const actualTime = executionResult.executionTime;
        const expectedTime = analysis.estimatedExecutionTime;
        
        if (actualTime <= expectedTime) {
            log('SUCCESS', `✅ Performance EXCELLENT: ${actualTime}ms (expected ≤${expectedTime}ms for ${performanceCategory} dataset)`);
        } else if (actualTime <= expectedTime * 2) {
            log('WARNING', `⚠️ Performance ACCEPTABLE: ${actualTime}ms (slightly above expected ${expectedTime}ms)`);
        } else {
            log('WARNING', `⚠️ Performance SLOW: ${actualTime}ms (significantly above expected ${expectedTime}ms)`);
        }

        // Phase 7: Output Validation (if R-Genie validator available)
        if (expectedOutputFile && fs.existsSync('./03-01-12_Output_Validator.js')) {
            log('INFO', '📊 Phase 7: Enterprise Output Validation');
            
            try {
                await executeWithIntelligence(
                    `node ./03-01-12_Output_Validator.js "${outputFile}" "${expectedOutputFile}"`,
                    'R-Genie Enterprise Validation',
                    15000
                );
                log('SUCCESS', '✅ Output accuracy: 100% MATCH (R-Genie Enterprise Validator)');
            } catch (error) {
                log('ERROR', '❌ Output accuracy: MISMATCH detected');
                throw new Error('Output validation failed - see detailed comparison report');
            }
        } else {
            log('WARNING', '⏭️ Enterprise validation skipped (R-Genie validator not available)');
        }

        // Success Summary
        console.log('');
        log('SUCCESS', '🏆 INTELLIGENT CLI VALIDATION COMPLETE');
        console.log('══════════════════════════════════════════════════════════');
        console.log(`${colors.green}✅ All validation phases completed successfully${colors.reset}`);
        console.log(`${colors.blue}📊 Performance: ${actualTime}ms (${performanceCategory} dataset)${colors.reset}`);
        console.log(`${colors.blue}🎯 Platform Optimization: ${platform.platform} detected and optimized${colors.reset}`);
        console.log(`${colors.blue}🛡️ Intelligence Features: Context-aware commands, error recovery, performance prediction${colors.reset}`);
        
        return {
            success: true,
            executionTime: actualTime,
            performanceCategory: performanceCategory,
            platform: platform.platform,
            phases: 7
        };

    } catch (error) {
        console.log('');
        log('ERROR', '❌ INTELLIGENT CLI VALIDATION FAILED');
        console.log('══════════════════════════════════════════════════════════');
        console.log(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
        
        return {
            success: false,
            error: error.message,
            platform: detectPlatform().platform
        };
    }
}

// 🔧 CLI INTERFACE
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length < 3) {
        console.log(`${colors.bright}🔧 R-Genie CLI Validator Enhanced v1.0${colors.reset}`);
        console.log("═══════════════════════════════════════════════════════════");
        console.log("");
        console.log("Intelligent CLI validation with context-aware optimization");
        console.log("");
        console.log("USAGE:");
        console.log("  node cli-validator-enhanced.js <script.dwl> <input.json> <output.json> [expected-output.json]");
        console.log("");
        console.log("FEATURES:");
        console.log("  🧠 Platform detection and optimization");
        console.log("  🎯 Context-aware command selection");
        console.log("  ⚡ Performance prediction and monitoring");
        console.log("  🛡️ Intelligent error recovery");
        console.log("  📊 Enterprise validation integration");
        console.log("");
        console.log("EXAMPLE:");
        console.log("  node cli-validator-enhanced.js script.dwl input.json output.json expected.json");
        process.exit(1);
    }

    const [scriptFile, inputFile, outputFile, expectedOutputFile] = args;

    console.log(`${colors.bright}🔧 R-Genie CLI Validator Enhanced v1.0${colors.reset}`);
    console.log("═══════════════════════════════════════════════════════════");
    console.log("");

    try {
        const result = await runIntelligentCLIValidation(scriptFile, inputFile, outputFile, expectedOutputFile);
        
        if (result.success) {
            process.exit(0);
        } else {
            process.exit(1);
        }
    } catch (error) {
        log('ERROR', `Unexpected error: ${error.message}`);
        process.exit(1);
    };
}

if (require.main === module) {
    main().catch(error => {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    });
}

module.exports = {
    runIntelligentCLIValidation,
    detectPlatform,
    analyzeFiles,
    buildIntelligentCLICommands
};
