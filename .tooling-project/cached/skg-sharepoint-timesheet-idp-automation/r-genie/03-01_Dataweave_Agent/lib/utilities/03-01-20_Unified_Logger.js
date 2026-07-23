/**
 * 🚀 R-Genie Unified Logging Framework v3.0
 * Centralized logging system with structured output, multiple transports, and performance tracking
 * @signature Q2hlcHBhbGlTaGFpa1NvaGFpbDE1MDgxOTkz
 * Provides consistent logging experience across all validation components
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const { createErrorHandler, ErrorFactories } = require('./03-01-19_Error_Handler.js');

const errorHandler = createErrorHandler('unified-logger');
// @watermark CS150893‌

class UnifiedLogger {
    constructor(options = {}) {
        this.options = {
            level: options.level || 'INFO',
            component: options.component || 'r-genie',
            logFile: options.logFile || this.generateLogFile(),
            enableConsole: options.enableConsole !== false,
            enableFile: options.enableFile !== false,
            enableStructured: options.enableStructured !== false,
            maxFileSize: options.maxFileSize || 10 * 1024 * 1024, // 10MB
            maxFiles: options.maxFiles || 5,
            enableColors: options.enableColors !== false,
            enableTimestamp: options.enableTimestamp !== false,
            enableMetrics: options.enableMetrics !== false,
            format: options.format || 'standard', // standard, json, compact
            ...options
        };
        
        // Log levels with priorities
        this.levels = {
            TRACE: { priority: 0, color: '\x1b[37m', icon: '🔍' },
            DEBUG: { priority: 1, color: '\x1b[36m', icon: '🐛' },
            INFO: { priority: 2, color: '\x1b[32m', icon: 'ℹ️' },
            DETAIL: { priority: 3, color: '\x1b[34m', icon: '📋' },
            WARNING: { priority: 4, color: '\x1b[33m', icon: '⚠️' },
            ERROR: { priority: 5, color: '\x1b[31m', icon: '❌' },
            CRITICAL: { priority: 6, color: '\x1b[91m', icon: '🚨' },
            SUCCESS: { priority: 7, color: '\x1b[92m', icon: '✅' },
            METRIC: { priority: 8, color: '\x1b[95m', icon: '📊' },
            SECURITY: { priority: 9, color: '\x1b[35m', icon: '🛡️' }
        };
        
        this.currentLevel = this.levels[this.options.level.toUpperCase()]?.priority || 2;
        this.reset = '\x1b[0m';
        
        // Performance tracking
        this.metrics = {
            totalLogs: 0,
            logsByLevel: {},
            startTime: Date.now(),
            lastLogTime: Date.now(),
            averageLogsPerSecond: 0
        };
        
        // Session tracking
        this.sessionId = this.generateSessionId();
        this.sessionStartTime = Date.now();
        
        // Phase tracking (for orchestrator-style logging)
        this.phases = [];
        this.currentPhase = null;
        this.steps = [];
        this.currentStep = null;
        
        // Initialize metrics
        Object.keys(this.levels).forEach(level => {
            this.metrics.logsByLevel[level] = 0;
        });
        
        // Ensure log directory exists
        this.ensureLogDirectory();
        
        // Initialize session
        this.logSessionStart();
    }
    
    generateLogFile() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        return path.join(__dirname, 'logs', `unified_${timestamp}.log`);
    }
    
    generateSessionId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    ensureLogDirectory() {
        const logDir = path.dirname(this.options.logFile);
        if (!fsSync.existsSync(logDir)) {
            fsSync.mkdirSync(logDir, { recursive: true });
        }
    }
    
    logSessionStart() {
        const sessionInfo = {
            sessionId: this.sessionId,
            component: this.options.component,
            startTime: new Date().toISOString(),
            logLevel: this.options.level,
            logFile: this.options.logFile,
            pid: process.pid,
            nodeVersion: process.version,
            platform: process.platform
        };
        
        this.log('INFO', '🚀 Session started', sessionInfo);
    }
    
    /**
     * Core logging method
     */
    log(level, message, context = {}, options = {}) {
        const levelConfig = this.levels[level.toUpperCase()];
        if (!levelConfig || levelConfig.priority < this.currentLevel) {
            return; // Skip if level is below threshold
        }
        
        const logEntry = this.createLogEntry(level, message, context, options);
        
        // Update metrics
        this.updateMetrics(level);
        
        // Output to transports
        if (this.options.enableConsole) {
            this.writeToConsole(logEntry, levelConfig);
        }
        
        if (this.options.enableFile) {
            this.writeToFile(logEntry);
        }
        
        return logEntry;
    }
    
    createLogEntry(level, message, context, options) {
        const timestamp = new Date().toISOString();
        
        const entry = {
            timestamp,
            sessionId: this.sessionId,
            level: level.toUpperCase(),
            component: this.options.component,
            message,
            context: context || {},
            phase: this.currentPhase,
            step: this.currentStep,
            duration: options.duration || null,
            tags: options.tags || [],
            metadata: {
                pid: process.pid,
                memory: process.memoryUsage(),
                uptime: process.uptime()
            }
        };
        
        return entry;
    }
    
    writeToConsole(logEntry, levelConfig) {
        let output;
        
        switch (this.options.format) {
            case 'json':
                output = JSON.stringify(logEntry);
                break;
            case 'compact':
                output = this.formatCompact(logEntry, levelConfig);
                break;
            default:
                output = this.formatStandard(logEntry, levelConfig);
        }
        
        console.log(output);
    }
    
    formatStandard(logEntry, levelConfig) {
        const color = this.options.enableColors ? levelConfig.color : '';
        const reset = this.options.enableColors ? this.reset : '';
        const icon = levelConfig.icon;
        const timestamp = this.options.enableTimestamp ? 
            `[${new Date(logEntry.timestamp).toLocaleTimeString()}] ` : '';
        
        let message = `${color}${icon} ${timestamp}[${logEntry.component.toUpperCase()}] ${logEntry.message}${reset}`;
        
        // Add phase/step context
        if (logEntry.phase) {
            message += ` ${color}(Phase: ${logEntry.phase})${reset}`;
        }
        if (logEntry.step) {
            message += ` ${color}(Step: ${logEntry.step})${reset}`;
        }
        
        // Add duration if provided
        if (logEntry.duration) {
            message += ` ${color}(${logEntry.duration}ms)${reset}`;
        }
        
        // Add context in verbose mode
        if (Object.keys(logEntry.context).length > 0 && this.options.level === 'DEBUG') {
            message += `\n${color}   Context: ${JSON.stringify(logEntry.context)}${reset}`;
        }
        
        return message;
    }
    
    formatCompact(logEntry, levelConfig) {
        const icon = levelConfig.icon;
        const timestamp = new Date(logEntry.timestamp).toLocaleTimeString();
        return `${icon} ${timestamp} ${logEntry.message}`;
    }
    
    async writeToFile(logEntry) {
        try {
            const logLine = this.options.enableStructured ? 
                JSON.stringify(logEntry) + '\n' : 
                this.formatFileOutput(logEntry) + '\n';
            
            await fs.appendFile(this.options.logFile, logLine);
            
            // Check for log rotation
            await this.checkLogRotation();
            
        } catch (error) {
            console.error('Failed to write to log file:', error.message);
        }
    }
    
    formatFileOutput(logEntry) {
        const timestamp = logEntry.timestamp;
        const level = logEntry.level.padEnd(8);
        const component = logEntry.component.padEnd(15);
        let message = `${timestamp} ${level} ${component} ${logEntry.message}`;
        
        if (logEntry.phase) {
            message += ` [Phase: ${logEntry.phase}]`;
        }
        if (logEntry.step) {
            message += ` [Step: ${logEntry.step}]`;
        }
        if (logEntry.duration) {
            message += ` [${logEntry.duration}ms]`;
        }
        
        return message;
    }
    
    async checkLogRotation() {
        try {
            const stats = await fs.stat(this.options.logFile);
            if (stats.size > this.options.maxFileSize) {
                await this.rotateLog();
            }
        } catch (error) {
            // Log file doesn't exist yet, no rotation needed
        }
    }
    
    async rotateLog() {
        const logDir = path.dirname(this.options.logFile);
        const logName = path.basename(this.options.logFile, '.log');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const rotatedName = `${logName}_${timestamp}.log`;
        const rotatedPath = path.join(logDir, rotatedName);
        
        try {
            await fs.rename(this.options.logFile, rotatedPath);
            
            // Compress rotated log
            // Security: Sanitize path to prevent command injection
            const sanitizedPath = path.resolve(rotatedPath);
            if (sanitizedPath.includes('..') || sanitizedPath.includes(';') || sanitizedPath.includes('|') || sanitizedPath.includes('&')) {
                throw new Error('Invalid log path detected');
            }
            const { execAsync } = require('child_process');
            await execAsync(`gzip "${sanitizedPath}"`);
            
            this.log('INFO', '📄 Log rotated', { rotatedTo: `${rotatedName}.gz` });
            
            // Clean old logs
            await this.cleanOldLogs();
            
        } catch (error) {
            console.error('Log rotation failed:', error.message);
        }
    }
    
    async cleanOldLogs() {
        try {
            const logDir = path.dirname(this.options.logFile);
            const files = await fs.readdir(logDir);
            const logFiles = files
                .filter(f => f.endsWith('.log.gz'))
                .map(f => ({
                    name: f,
                    path: path.join(logDir, f),
                    stat: fsSync.statSync(path.join(logDir, f))
                }))
                .sort((a, b) => b.stat.mtime - a.stat.mtime);
            
            // Keep only the most recent files
            const filesToDelete = logFiles.slice(this.options.maxFiles);
            
            for (const file of filesToDelete) {
                await fs.unlink(file.path);
            }
            
            if (filesToDelete.length > 0) {
                this.log('INFO', '🧹 Cleaned old logs', { deleted: filesToDelete.length });
            }
            
        } catch (error) {
            console.error('Log cleanup failed:', error.message);
        }
    }
    
    updateMetrics(level) {
        this.metrics.totalLogs++;
        this.metrics.logsByLevel[level.toUpperCase()]++;
        this.metrics.lastLogTime = Date.now();
        
        const elapsed = (Date.now() - this.metrics.startTime) / 1000;
        this.metrics.averageLogsPerSecond = this.metrics.totalLogs / elapsed;
    }
    
    /**
     * Phase tracking methods (orchestrator-style)
     */
    phaseStart(phaseName, description = '') {
        this.currentPhase = phaseName;
        this.phases.push({
            name: phaseName,
            description,
            startTime: Date.now(),
            steps: []
        });
        
        this.log('INFO', `🚀 Phase Started: ${phaseName}`, { description });
    }
    
    phaseEnd(phaseName, success = true) {
        const phase = this.phases.find(p => p.name === phaseName);
        if (phase) {
            phase.endTime = Date.now();
            phase.duration = phase.endTime - phase.startTime;
            phase.success = success;
        }
        
        const level = success ? 'SUCCESS' : 'ERROR';
        const icon = success ? '✅' : '❌';
        this.log(level, `${icon} Phase ${success ? 'Completed' : 'Failed'}: ${phaseName}`, 
                 { duration: phase?.duration });
        
        this.currentPhase = null;
    }
    
    stepStart(stepName, description = '') {
        this.currentStep = stepName;
        const step = {
            name: stepName,
            description,
            startTime: Date.now()
        };
        
        this.steps.push(step);
        
        if (this.currentPhase) {
            const phase = this.phases.find(p => p.name === this.currentPhase);
            if (phase) {
                phase.steps.push(step);
            }
        }
        
        this.log('INFO', `[Step] Starting: ${stepName}`, { description });
    }
    
    stepEnd(stepName, success = true, context = {}) {
        const step = this.steps.find(s => s.name === stepName);
        if (step) {
            step.endTime = Date.now();
            step.duration = step.endTime - step.startTime;
            step.success = success;
        }
        
        const level = success ? 'SUCCESS' : 'ERROR';
        this.log(level, `[Step] ${success ? 'Completed' : 'Failed'}: ${stepName}`, 
                 { ...context, duration: step?.duration });
        
        this.currentStep = null;
    }
    
    /**
     * Convenience methods for different log levels
     */
    trace(message, context = {}) { return this.log('TRACE', message, context); }
    debug(message, context = {}) { return this.log('DEBUG', message, context); }
    info(message, context = {}) { return this.log('INFO', message, context); }
    detail(message, context = {}) { return this.log('DETAIL', message, context); }
    warn(message, context = {}) { return this.log('WARNING', message, context); }
    warning(message, context = {}) { return this.log('WARNING', message, context); }
    error(message, context = {}) { return this.log('ERROR', message, context); }
    critical(message, context = {}) { return this.log('CRITICAL', message, context); }
    success(message, context = {}) { return this.log('SUCCESS', message, context); }
    metric(message, context = {}) { return this.log('METRIC', message, context); }
    security(message, context = {}) { return this.log('SECURITY', message, context); }
    
    /**
     * Specialized logging methods
     */
    performance(operation, duration, context = {}) {
        this.log('METRIC', `⚡ Performance: ${operation}`, 
                 { ...context, duration, unit: 'ms' }, { duration });
    }
    
    validation(type, result, context = {}) {
        const level = result.success ? 'SUCCESS' : 'ERROR';
        const icon = result.success ? '✅' : '❌';
        this.log(level, `${icon} Validation: ${type}`, { ...context, result });
    }
    
    fileOperation(operation, filePath, success = true, context = {}) {
        const level = success ? 'DEBUG' : 'ERROR';
        const icon = success ? '📁' : '❌';
        this.log(level, `${icon} File ${operation}: ${path.basename(filePath)}`, 
                 { ...context, filePath, operation });
    }
    
    apiCall(endpoint, method, statusCode, duration, context = {}) {
        const level = statusCode < 400 ? 'DEBUG' : 'ERROR';
        this.log(level, `🌐 API ${method} ${endpoint}`, 
                 { ...context, statusCode, duration });
    }
    
    /**
     * Session and summary methods
     */
    getSessionSummary() {
        const sessionDuration = Date.now() - this.sessionStartTime;
        
        return {
            sessionId: this.sessionId,
            component: this.options.component,
            startTime: new Date(this.sessionStartTime).toISOString(),
            duration: sessionDuration,
            metrics: this.metrics,
            phases: this.phases,
            totalSteps: this.steps.length,
            successfulSteps: this.steps.filter(s => s.success).length,
            failedSteps: this.steps.filter(s => s.success === false).length
        };
    }
    
    printSummary() {
        const summary = this.getSessionSummary();
        
        this.log('METRIC', '📊 Session Summary', summary);
        
        console.log('\n🚀 R-GENIE SESSION SUMMARY');
        console.log('════════════════════════════════════════════════════════════');
        console.log(`📅 Session ID: ${summary.sessionId}`);
        console.log(`⏱️  Duration: ${Math.round(summary.duration / 1000)}s`);
        console.log(`📊 Total Logs: ${summary.metrics.totalLogs}`);
        console.log(`🏆 Success Rate: ${summary.totalSteps > 0 ? Math.round((summary.successfulSteps / summary.totalSteps) * 100) : 100}%`);
        console.log(`📈 Avg Logs/sec: ${Math.round(summary.metrics.averageLogsPerSecond * 100) / 100}`);
        
        if (summary.phases.length > 0) {
            console.log(`\n📋 Phases Completed: ${summary.phases.length}`);
            summary.phases.forEach(phase => {
                const status = phase.success ? '✅' : '❌';
                const duration = phase.duration ? `(${Math.round(phase.duration / 1000)}s)` : '';
                console.log(`   ${status} ${phase.name} ${duration}`);
            });
        }
        
        console.log('════════════════════════════════════════════════════════════\n');
        
        return summary;
    }
    
    /**
     * Graceful shutdown
     */
    async shutdown() {
        this.log('INFO', '🔄 Logger shutting down');
        
        // Print final summary
        this.printSummary();
        
        // Ensure all logs are written
        await new Promise(resolve => setTimeout(resolve, 100));
        
        this.log('INFO', '✅ Logger shutdown completed');
    }
}

/**
 * Factory function to create component-specific loggers
 */
function createLogger(component, options = {}) {
    return new UnifiedLogger({
        component,
        ...options
    });
}

/**
 * Global logger instance for convenience
 */
const globalLogger = new UnifiedLogger({ component: 'r-genie-global' });

module.exports = {
    UnifiedLogger,
    createLogger,
    
    // Convenience exports using global logger
    log: (level, message, context) => globalLogger.log(level, message, context),
    trace: (message, context) => globalLogger.trace(message, context),
    debug: (message, context) => globalLogger.debug(message, context),
    info: (message, context) => globalLogger.info(message, context),
    detail: (message, context) => globalLogger.detail(message, context),
    warn: (message, context) => globalLogger.warn(message, context),
    warning: (message, context) => globalLogger.warning(message, context),
    error: (message, context) => globalLogger.error(message, context),
    critical: (message, context) => globalLogger.critical(message, context),
    success: (message, context) => globalLogger.success(message, context),
    metric: (message, context) => globalLogger.metric(message, context),
    security: (message, context) => globalLogger.security(message, context),
    
    // Specialized methods
    performance: (operation, duration, context) => globalLogger.performance(operation, duration, context),
    validation: (type, result, context) => globalLogger.validation(type, result, context),
    fileOperation: (operation, filePath, success, context) => globalLogger.fileOperation(operation, filePath, success, context),
    
    // Phase tracking
    phaseStart: (name, description) => globalLogger.phaseStart(name, description),
    phaseEnd: (name, success) => globalLogger.phaseEnd(name, success),
    stepStart: (name, description) => globalLogger.stepStart(name, description),
    stepEnd: (name, success, context) => globalLogger.stepEnd(name, success, context),
    
    // Session management
    getSessionSummary: () => globalLogger.getSessionSummary(),
    printSummary: () => globalLogger.printSummary(),
    shutdown: () => globalLogger.shutdown()
};
