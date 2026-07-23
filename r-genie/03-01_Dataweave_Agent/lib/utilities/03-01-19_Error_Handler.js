/**
 * 🚨 R-Genie Standardized Error Handler v3.0
 * Centralized error handling, logging, and exit code management
 * @signature Q2hlcHBhbGlTaGFpa1NvaGFpbDE1MDgxOTkz
 * Provides consistent error reporting across all validation components
 */

const fs = require('fs');
const path = require('path');
// @watermark CS150893‌

class RGenieError extends Error {
    constructor(message, code = 'GENERAL_ERROR', context = {}) {
        super(message);
        this.name = 'RGenieError';
        this.code = code;
        this.context = context;
        this.timestamp = new Date().toISOString();
        
        // Capture stack trace
        Error.captureStackTrace(this, RGenieError);
    }
}

class RGenieErrorHandler {
    constructor(options = {}) {
        this.options = {
            logFile: options.logFile || path.join(__dirname, 'logs', 'errors.log'),
            verbose: options.verbose || false,
            silent: options.silent || false,
            component: options.component || 'r-genie-validation',
            enableStackTrace: options.enableStackTrace || false,
            ...options
        };
        
        // Error codes mapping to exit codes
        this.exitCodes = {
            // Success
            SUCCESS: 0,
            
            // General errors (1-10)
            GENERAL_ERROR: 1,
            INVALID_ARGUMENTS: 2,
            FILE_NOT_FOUND: 3,
            PERMISSION_DENIED: 4,
            CONFIGURATION_ERROR: 5,
            
            // Validation errors (11-20)
            SYNTAX_ERROR: 11,
            VALIDATION_FAILED: 12,
            ACCURACY_FAILED: 13,
            REQUIREMENTS_FAILED: 14,
            FORMAT_ERROR: 15,
            
            // Security errors (21-30)
            SECURITY_VIOLATION: 21,
            CRITICAL_SECURITY: 22,
            SECURITY_SCORE_LOW: 23,
            HARDCODE_DETECTED: 24,
            
            // Infrastructure errors (31-40)
            DATAWEAVE_CLI_MISSING: 31,
            NODEJS_MISSING: 32,
            DEPENDENCY_MISSING: 33,
            NETWORK_ERROR: 34,
            TIMEOUT_ERROR: 35,
            
            // Integration errors (41-50)
            MULTI_FILE_ERROR: 41,
            SCENARIO_DETECTION_FAILED: 42,
            ORCHESTRATION_FAILED: 43,
            PIPELINE_ERROR: 44,
            
            // Resource errors (51-60)
            MEMORY_ERROR: 51,
            DISK_SPACE_ERROR: 52,
            LOG_ERROR: 53,
            CLEANUP_ERROR: 54
        };
        
        // Error severity levels
        this.severityLevels = {
            LOW: 'LOW',
            MEDIUM: 'MEDIUM',
            HIGH: 'HIGH',
            CRITICAL: 'CRITICAL'
        };
        
        // Ensure log directory exists
        this.ensureLogDirectory();
        
        // Set up global error handlers if enabled
        if (options.handleGlobalErrors) {
            this.setupGlobalErrorHandlers();
        }
    }
    
    ensureLogDirectory() {
        const logDir = path.dirname(this.options.logFile);
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
    }
    
    setupGlobalErrorHandlers() {
        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            this.handleFatalError(error, 'UNCAUGHT_EXCEPTION');
        });
        
        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason, promise) => {
            this.handleFatalError(reason, 'UNHANDLED_REJECTION', { promise });
        });
    }
    
    /**
     * Create a standardized error with context
     */
    createError(message, code = 'GENERAL_ERROR', context = {}) {
        return new RGenieError(message, code, context);
    }
    
    /**
     * Log error to file and console
     */
    logError(error, severity = this.severityLevels.MEDIUM) {
        const errorEntry = {
            timestamp: new Date().toISOString(),
            component: this.options.component,
            severity: severity,
            code: error.code || 'UNKNOWN',
            message: error.message,
            context: error.context || {},
            stack: this.options.enableStackTrace ? error.stack : undefined
        };
        
        // Write to log file
        this.writeToLogFile(errorEntry);
        
        // Console output based on severity
        if (!this.options.silent) {
            this.writeToConsole(errorEntry);
        }
        
        return errorEntry;
    }
    
    writeToLogFile(errorEntry) {
        try {
            const logLine = `${JSON.stringify(errorEntry)}\n`;
            fs.appendFileSync(this.options.logFile, logLine);
        } catch (logError) {
            // If we can't log, at least show the error
            console.error('Failed to write to error log:', logError.message);
        }
    }
    
    writeToConsole(errorEntry) {
        const colors = {
            LOW: '\x1b[33m',      // Yellow
            MEDIUM: '\x1b[31m',   // Red
            HIGH: '\x1b[35m',     // Magenta
            CRITICAL: '\x1b[91m'  // Bright Red
        };
        
        const icons = {
            LOW: '⚠️ ',
            MEDIUM: '❌',
            HIGH: '🚨',
            CRITICAL: '💥'
        };
        
        const color = colors[errorEntry.severity] || colors.MEDIUM;
        const icon = icons[errorEntry.severity] || icons.MEDIUM;
        const reset = '\x1b[0m';
        
        console.error(`${color}${icon} [${errorEntry.component.toUpperCase()}] ${errorEntry.message}${reset}`);
        
        if (errorEntry.code !== 'UNKNOWN') {
            console.error(`${color}   Error Code: ${errorEntry.code}${reset}`);
        }
        
        if (this.options.verbose && errorEntry.context && Object.keys(errorEntry.context).length > 0) {
            console.error(`${color}   Context: ${JSON.stringify(errorEntry.context)}${reset}`);
        }
        
        if (this.options.enableStackTrace && errorEntry.stack) {
            console.error(`${color}   Stack: ${errorEntry.stack}${reset}`);
        }
    }
    
    /**
     * Handle error and exit with appropriate code
     */
    handleErrorAndExit(error, severity = this.severityLevels.MEDIUM) {
        const errorEntry = this.logError(error, severity);
        const exitCode = this.getExitCode(error.code);
        
        if (!this.options.silent) {
            console.error(`\n🔄 Exit Code: ${exitCode}`);
        }
        
        process.exit(exitCode);
    }
    
    /**
     * Handle fatal errors that require immediate termination
     */
    handleFatalError(error, code = 'FATAL_ERROR', context = {}) {
        const fatalError = new RGenieError(
            `Fatal error: ${error.message || error}`,
            code,
            { ...context, originalError: error.toString() }
        );
        
        this.logError(fatalError, this.severityLevels.CRITICAL);
        
        console.error('\n💥 FATAL ERROR - TERMINATING PROCESS');
        console.error(`Error: ${error.message || error}`);
        
        process.exit(this.exitCodes.GENERAL_ERROR);
    }
    
    /**
     * Get appropriate exit code for error code
     */
    getExitCode(errorCode) {
        return this.exitCodes[errorCode] || this.exitCodes.GENERAL_ERROR;
    }
    
    /**
     * Validate required arguments
     */
    validateArguments(args, required, usage) {
        if (args.length < required) {
            const error = this.createError(
                `Insufficient arguments. Required: ${required}, provided: ${args.length}`,
                'INVALID_ARGUMENTS',
                { provided: args.length, required, usage }
            );
            
            if (usage) {
                console.error(usage);
            }
            
            this.handleErrorAndExit(error, this.severityLevels.HIGH);
        }
    }
    
    /**
     * Validate file existence
     */
    validateFileExists(filePath, description = 'File') {
        if (!fs.existsSync(filePath)) {
            const error = this.createError(
                `${description} not found: ${filePath}`,
                'FILE_NOT_FOUND',
                { filePath, description }
            );
            
            this.handleErrorAndExit(error, this.severityLevels.HIGH);
        }
    }
    
    /**
     * Validate multiple files exist
     */
    validateFilesExist(filePaths, descriptions = []) {
        filePaths.forEach((filePath, index) => {
            const description = descriptions[index] || `File ${index + 1}`;
            this.validateFileExists(filePath, description);
        });
    }
    
    /**
     * Handle validation results with proper error reporting
     */
    handleValidationResult(result, successMessage = 'Validation completed successfully') {
        if (result.success) {
            if (!this.options.silent) {
                console.log(`✅ ${successMessage}`);
            }
            process.exit(this.exitCodes.SUCCESS);
        } else {
            const error = this.createError(
                result.error || 'Validation failed',
                result.errorCode || 'VALIDATION_FAILED',
                result.context || {}
            );
            
            this.handleErrorAndExit(error, this.severityLevels.HIGH);
        }
    }
    
    /**
     * Wrap async functions with error handling
     */
    wrapAsync(asyncFn, errorCode = 'GENERAL_ERROR') {
        return async (...args) => {
            try {
                return await asyncFn(...args);
            } catch (error) {
                const wrappedError = this.createError(
                    error.message,
                    errorCode,
                    { originalStack: error.stack }
                );
                throw wrappedError;
            }
        };
    }
    
    /**
     * Graceful shutdown with cleanup
     */
    gracefulShutdown(cleanupFn, timeoutMs = 5000) {
        const signals = ['SIGINT', 'SIGTERM', 'SIGUSR2'];
        
        signals.forEach(signal => {
            process.on(signal, async () => {
                console.log(`\n🔄 Received ${signal}, performing graceful shutdown...`);
                
                const shutdownTimer = setTimeout(() => {
                    console.error('❌ Graceful shutdown timeout, forcing exit');
                    process.exit(1);
                }, timeoutMs);
                
                try {
                    if (cleanupFn) {
                        await cleanupFn();
                    }
                    clearTimeout(shutdownTimer);
                    console.log('✅ Graceful shutdown completed');
                    process.exit(0);
                } catch (error) {
                    clearTimeout(shutdownTimer);
                    this.handleFatalError(error, 'CLEANUP_ERROR');
                }
            });
        });
    }
    
    /**
     * Get error summary for reporting
     */
    getErrorSummary() {
        try {
            const logContent = fs.readFileSync(this.options.logFile, 'utf8');
            const errors = logContent.split('\n')
                .filter(line => line.trim())
                .map(line => {
                    try {
                        return JSON.parse(line);
                    } catch {
                        return null;
                    }
                })
                .filter(entry => entry !== null);
            
            const summary = {
                totalErrors: errors.length,
                bySeverity: {},
                byCode: {},
                recent: errors.slice(-10) // Last 10 errors
            };
            
            errors.forEach(error => {
                summary.bySeverity[error.severity] = (summary.bySeverity[error.severity] || 0) + 1;
                summary.byCode[error.code] = (summary.byCode[error.code] || 0) + 1;
            });
            
            return summary;
        } catch (error) {
            return { error: 'Could not read error log', totalErrors: 0 };
        }
    }
}

// Predefined error factories for common scenarios
const ErrorFactories = {
    fileNotFound: (filePath, description = 'File') => 
        new RGenieError(`${description} not found: ${filePath}`, 'FILE_NOT_FOUND', { filePath }),
    
    invalidArguments: (provided, required, usage = '') =>
        new RGenieError(`Invalid arguments: expected ${required}, got ${provided}`, 'INVALID_ARGUMENTS', { provided, required, usage }),
    
    validationFailed: (details, context = {}) =>
        new RGenieError(`Validation failed: ${details}`, 'VALIDATION_FAILED', context),
    
    syntaxError: (details, line = null) =>
        new RGenieError(`Syntax error: ${details}`, 'SYNTAX_ERROR', { line }),
    
    securityViolation: (violation, severity = 'HIGH') =>
        new RGenieError(`Security violation: ${violation}`, 'SECURITY_VIOLATION', { severity }),
    
    dependencyMissing: (dependency, installCommand = '') =>
        new RGenieError(`Missing dependency: ${dependency}`, 'DEPENDENCY_MISSING', { dependency, installCommand }),
    
    timeoutError: (operation, timeoutMs) =>
        new RGenieError(`Operation timed out: ${operation}`, 'TIMEOUT_ERROR', { operation, timeoutMs }),
    
    configurationError: (setting, expected) =>
        new RGenieError(`Configuration error: ${setting}`, 'CONFIGURATION_ERROR', { setting, expected })
};

// Export both the class and factory functions
module.exports = {
    RGenieErrorHandler,
    RGenieError,
    ErrorFactories,
    
    // Convenience function to create a pre-configured handler
    createErrorHandler: (component, options = {}) => {
        return new RGenieErrorHandler({
            component,
            ...options
        });
    }
};
