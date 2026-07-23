/**
 * 🚀 R-Genie Centralized Configuration Manager v3.0
 * Unified configuration management with environment support, validation, and hot-reloading
 * @signature Q2hlcHBhbGlTaGFpa1NvaGFpbDE1MDgxOTkz
 * Provides consistent configuration access across all validation components
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const os = require('os');
const { createErrorHandler, ErrorFactories } = require('./03-01-19_Error_Handler.js');
const { createLogger } = require('./03-01-20_Unified_Logger.js');

const errorHandler = createErrorHandler('config-manager');
const logger = createLogger('config-manager', { level: 'INFO' });
// @watermark CS150893‌

class ConfigManager {
    constructor(options = {}) {
        this.options = {
            configFile: options.configFile || path.join(__dirname, 'r-genie-config.json'),
            envPrefix: options.envPrefix || 'RGENIE_',
            enableHotReload: options.enableHotReload !== false,
            enableValidation: options.enableValidation !== false,
            enableEnvironmentOverrides: options.enableEnvironmentOverrides !== false,
            watchInterval: options.watchInterval || 5000, // 5 seconds
            ...options
        };
        
        // Configuration cache
        this.config = {};
        this.schema = {};
        this.watchers = new Set();
        this.lastModified = null;
        this.hotReloadInterval = null;
        
        // Default configuration schema
        this.defineDefaultSchema();
        
        // Load initial configuration
        this.loadConfiguration();
        
        // Setup hot reload if enabled
        if (this.options.enableHotReload) {
            this.setupHotReload();
        }
    }
    
    defineDefaultSchema() {
        this.schema = {
            // Core system settings
            system: {
                type: 'object',
                properties: {
                    maxWorkers: { type: 'number', default: Math.min(os.cpus().length, 8), min: 1, max: 16 },
                    timeout: { type: 'number', default: 30000, min: 1000, max: 300000 },
                    retryAttempts: { type: 'number', default: 2, min: 0, max: 5 },
                    enableMetrics: { type: 'boolean', default: true },
                    enableCaching: { type: 'boolean', default: true },
                    maxCacheSize: { type: 'number', default: 100, min: 10, max: 1000 },
                    logLevel: { type: 'string', default: 'INFO', enum: ['TRACE', 'DEBUG', 'INFO', 'WARNING', 'ERROR'] }
                }
            },
            
            // Validation settings
            validation: {
                type: 'object',
                properties: {
                    enablePreValidation: { type: 'boolean', default: true },
                    enableRequirementsAnalysis: { type: 'boolean', default: true },
                    enableErrorDetection: { type: 'boolean', default: true },
                    enableSecurityScanning: { type: 'boolean', default: true },
                    enableParallelProcessing: { type: 'boolean', default: true },
                    parallelThreshold: { type: 'number', default: 3, min: 1, max: 10 },
                    accuracyThreshold: { type: 'number', default: 80, min: 0, max: 100 },
                    securityThreshold: { type: 'number', default: 70, min: 0, max: 100 }
                }
            },
            
            // File operations
            files: {
                type: 'object',
                properties: {
                    maxFileSize: { type: 'number', default: 10 * 1024 * 1024 }, // 10MB
                    enableCompression: { type: 'boolean', default: true },
                    tempDirectory: { type: 'string', default: os.tmpdir() },
                    enableCleanup: { type: 'boolean', default: true },
                    cleanupInterval: { type: 'number', default: 3600000 } // 1 hour
                }
            },
            
            // Logging configuration
            logging: {
                type: 'object',
                properties: {
                    level: { type: 'string', default: 'INFO', enum: ['TRACE', 'DEBUG', 'INFO', 'WARNING', 'ERROR'] },
                    enableConsole: { type: 'boolean', default: true },
                    enableFile: { type: 'boolean', default: true },
                    enableStructured: { type: 'boolean', default: false },
                    maxFileSize: { type: 'number', default: 10 * 1024 * 1024 }, // 10MB
                    maxFiles: { type: 'number', default: 5, min: 1, max: 20 },
                    enableColors: { type: 'boolean', default: true },
                    format: { type: 'string', default: 'standard', enum: ['standard', 'json', 'compact'] }
                }
            },
            
            // Security settings
            security: {
                type: 'object',
                properties: {
                    enableHardcodeDetection: { type: 'boolean', default: true },
                    enableVulnerabilityScanning: { type: 'boolean', default: true },
                    maxScanDepth: { type: 'number', default: 5, min: 1, max: 10 },
                    allowedPatterns: { type: 'array', default: [] },
                    blockedPatterns: { type: 'array', default: ['password', 'secret', 'key', 'token'] }
                }
            },
            
            // Performance settings
            performance: {
                type: 'object',
                properties: {
                    enableProfiling: { type: 'boolean', default: false },
                    enableMetrics: { type: 'boolean', default: true },
                    metricsInterval: { type: 'number', default: 60000 }, // 1 minute
                    memoryLimit: { type: 'number', default: 512 * 1024 * 1024 }, // 512MB
                    enableGC: { type: 'boolean', default: true }
                }
            },
            
            // DataWeave CLI settings
            dataweave: {
                type: 'object',
                properties: {
                    cliPath: { type: 'string', default: 'dw' },
                    timeout: { type: 'number', default: 30000, min: 5000, max: 120000 },
                    enableValidation: { type: 'boolean', default: true },
                    enableExecution: { type: 'boolean', default: true },
                    maxOutputSize: { type: 'number', default: 5 * 1024 * 1024 } // 5MB
                }
            },
            
            // Development settings
            development: {
                type: 'object',
                properties: {
                    enableDebugMode: { type: 'boolean', default: false },
                    enableVerboseLogging: { type: 'boolean', default: false },
                    enableStackTraces: { type: 'boolean', default: false },
                    enableHotReload: { type: 'boolean', default: true },
                    enableTestMode: { type: 'boolean', default: false }
                }
            }
        };
    }
    
    async loadConfiguration() {
        try {
            // Start with defaults
            this.config = this.generateDefaultConfig();
            
            // Load from config file if it exists
            if (await this.fileExists(this.options.configFile)) {
                const fileConfig = await this.loadConfigFile();
                this.config = this.mergeConfigs(this.config, fileConfig);
            } else {
                // Create default config file
                await this.saveConfigFile();
            }
            
            // Apply environment overrides
            if (this.options.enableEnvironmentOverrides) {
                this.applyEnvironmentOverrides();
            }
            
            // Validate configuration
            if (this.options.enableValidation) {
                this.validateConfiguration();
            }
            
            logger.info('📋 Configuration loaded successfully', { 
                source: this.options.configFile,
                envOverrides: this.options.enableEnvironmentOverrides
            });
            
        } catch (error) {
            logger.error('❌ Failed to load configuration', { error: error.message });
            throw ErrorFactories.configurationError('Configuration loading failed', error.message);
        }
    }
    
    async fileExists(filePath) {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }
    
    async loadConfigFile() {
        try {
            const content = await fs.readFile(this.options.configFile, 'utf8');
            // ENHANCED: Apply variable substitution before parsing
            const substitutedContent = this.substituteVariables(content);
            const config = JSON.parse(substitutedContent);
            
            // Track file modification time
            const stats = await fs.stat(this.options.configFile);
            this.lastModified = stats.mtime;
            
            return config;
        } catch (error) {
            throw ErrorFactories.configurationError('Config file parsing failed', error.message);
        }
    }
    
    /**
     * ENHANCED: Cross-platform variable substitution
     */
    substituteVariables(content) {
        // Define variable mappings
        const variables = {
            '${OS_TEMP}': os.tmpdir(),
            '${HOME}': os.homedir(),
            '${USER}': os.userInfo().username,
            '${PLATFORM}': os.platform(),
            '${ARCH}': os.arch(),
            '${NODE_VERSION}': process.version
        };
        
        let result = content;
        for (const [variable, value] of Object.entries(variables)) {
            result = result.replace(new RegExp(variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
        }
        
        logger.debug('🔄 Variable substitution applied', { 
            variables: Object.keys(variables),
            tempDir: variables['${OS_TEMP}']
        });
        
        return result;
    }
    
    async saveConfigFile() {
        try {
            const configDir = path.dirname(this.options.configFile);
            await fs.mkdir(configDir, { recursive: true });
            
            const content = JSON.stringify(this.config, null, 2);
            await fs.writeFile(this.options.configFile, content, 'utf8');
            
            logger.info('💾 Configuration file saved', { file: this.options.configFile });
            
        } catch (error) {
            logger.warning('⚠️ Failed to save configuration file', { error: error.message });
        }
    }
    
    generateDefaultConfig() {
        const defaults = {};
        
        for (const [section, schema] of Object.entries(this.schema)) {
            defaults[section] = {};
            
            if (schema.properties) {
                for (const [key, prop] of Object.entries(schema.properties)) {
                    defaults[section][key] = prop.default;
                }
            }
        }
        
        return defaults;
    }
    
    mergeConfigs(base, override) {
        const merged = JSON.parse(JSON.stringify(base)); // Deep clone
        
        for (const [section, values] of Object.entries(override)) {
            if (merged[section] && typeof values === 'object' && !Array.isArray(values)) {
                merged[section] = { ...merged[section], ...values };
            } else {
                merged[section] = values;
            }
        }
        
        return merged;
    }
    
    applyEnvironmentOverrides() {
        const envVars = process.env;
        const prefix = this.options.envPrefix;
        
        for (const [key, value] of Object.entries(envVars)) {
            if (key.startsWith(prefix)) {
                const configPath = key.substring(prefix.length).toLowerCase();
                this.setConfigFromEnv(configPath, value);
            }
        }
    }
    
    setConfigFromEnv(path, value) {
        const parts = path.split('_');
        
        if (parts.length >= 2) {
            const section = parts[0];
            const key = parts.slice(1).join('_');
            
            if (this.config[section]) {
                // Convert string values to appropriate types
                const convertedValue = this.convertEnvValue(value);
                this.config[section][key] = convertedValue;
                
                logger.debug('🔧 Environment override applied', { 
                    path: `${section}.${key}`, 
                    value: convertedValue 
                });
            }
        }
    }
    
    convertEnvValue(value) {
        // Boolean conversion
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;
        
        // Number conversion
        if (/^\d+$/.test(value)) return parseInt(value, 10);
        if (/^\d+\.\d+$/.test(value)) return parseFloat(value);
        
        // Array conversion (comma-separated)
        if (value.includes(',')) {
            return value.split(',').map(v => v.trim());
        }
        
        // String (default)
        return value;
    }
    
    validateConfiguration() {
        const errors = [];
        
        for (const [section, schema] of Object.entries(this.schema)) {
            if (!this.config[section]) {
                errors.push(`Missing configuration section: ${section}`);
                continue;
            }
            
            if (schema.properties) {
                for (const [key, prop] of Object.entries(schema.properties)) {
                    const value = this.config[section][key];
                    const validation = this.validateValue(value, prop, `${section}.${key}`);
                    
                    if (!validation.valid) {
                        errors.push(validation.error);
                    }
                }
            }
        }
        
        if (errors.length > 0) {
            logger.error('❌ Configuration validation failed', { errors });
            throw ErrorFactories.configurationError('Configuration validation failed', errors.join('; '));
        }
        
        logger.success('✅ Configuration validation passed');
    }
    
    validateValue(value, schema, path) {
        // Type validation
        if (schema.type) {
            const actualType = Array.isArray(value) ? 'array' : typeof value;
            if (actualType !== schema.type) {
                return {
                    valid: false,
                    error: `${path}: expected ${schema.type}, got ${actualType}`
                };
            }
        }
        
        // Enum validation
        if (schema.enum && !schema.enum.includes(value)) {
            return {
                valid: false,
                error: `${path}: value '${value}' not in allowed values: ${schema.enum.join(', ')}`
            };
        }
        
        // Number range validation
        if (schema.type === 'number') {
            if (schema.min !== undefined && value < schema.min) {
                return {
                    valid: false,
                    error: `${path}: value ${value} is below minimum ${schema.min}`
                };
            }
            if (schema.max !== undefined && value > schema.max) {
                return {
                    valid: false,
                    error: `${path}: value ${value} is above maximum ${schema.max}`
                };
            }
        }
        
        return { valid: true };
    }
    
    setupHotReload() {
        const checkForChanges = async () => {
            try {
                if (await this.fileExists(this.options.configFile)) {
                    const stats = await fs.stat(this.options.configFile);
                    
                    if (!this.lastModified || stats.mtime > this.lastModified) {
                        logger.info('🔄 Configuration file changed, reloading...');
                        await this.loadConfiguration();
                        this.notifyWatchers();
                    }
                }
            } catch (error) {
                logger.warning('⚠️ Hot reload check failed', { error: error.message });
            }
        };
        
        // Check for changes periodically
        this.hotReloadInterval = setInterval(checkForChanges, this.options.watchInterval);
    }
    
    notifyWatchers() {
        this.watchers.forEach(callback => {
            try {
                callback(this.config);
            } catch (error) {
                logger.warning('⚠️ Config watcher callback failed', { error: error.message });
            }
        });
    }
    
    /**
     * Configuration access methods
     */
    get(path, defaultValue = undefined) {
        const parts = path.split('.');
        let current = this.config;
        
        for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                return defaultValue;
            }
        }
        
        return current;
    }
    
    set(path, value) {
        const parts = path.split('.');
        let current = this.config;
        
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!current[part] || typeof current[part] !== 'object') {
                current[part] = {};
            }
            current = current[part];
        }
        
        current[parts[parts.length - 1]] = value;
        
        logger.debug('🔧 Configuration updated', { path, value });
        
        // Validate if enabled
        if (this.options.enableValidation) {
            try {
                this.validateConfiguration();
            } catch (error) {
                logger.warning('⚠️ Configuration validation failed after update', { path, value });
            }
        }
    }
    
    has(path) {
        return this.get(path) !== undefined;
    }
    
    delete(path) {
        const parts = path.split('.');
        let current = this.config;
        
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!current[part]) return false;
            current = current[part];
        }
        
        const lastPart = parts[parts.length - 1];
        if (lastPart in current) {
            delete current[lastPart];
            logger.debug('🗑️ Configuration deleted', { path });
            return true;
        }
        
        return false;
    }
    
    /**
     * Section-specific getters for convenience
     */
    getSystem(key) { return this.get(`system.${key}`); }
    getValidation(key) { return this.get(`validation.${key}`); }
    getFiles(key) { return this.get(`files.${key}`); }
    getLogging(key) { return this.get(`logging.${key}`); }
    getSecurity(key) { return this.get(`security.${key}`); }
    getPerformance(key) { return this.get(`performance.${key}`); }
    getDataWeave(key) { return this.get(`dataweave.${key}`); }
    getDevelopment(key) { return this.get(`development.${key}`); }
    
    /**
     * Environment-specific configurations
     */
    isProduction() {
        return process.env.NODE_ENV === 'production';
    }
    
    isDevelopment() {
        return process.env.NODE_ENV === 'development' || this.getDevelopment('enableDebugMode');
    }
    
    isTestMode() {
        return process.env.NODE_ENV === 'test' || this.getDevelopment('enableTestMode');
    }
    
    /**
     * Watch for configuration changes
     */
    watch(callback) {
        this.watchers.add(callback);
        return () => this.watchers.delete(callback);
    }
    
    /**
     * Cleanup resources (intervals, watchers)
     */
    destroy() {
        if (this.hotReloadInterval) {
            clearInterval(this.hotReloadInterval);
            this.hotReloadInterval = null;
            logger.debug('🧹 Hot reload interval cleared');
        }
        
        this.watchers.clear();
        logger.debug('🧹 Configuration watchers cleared');
    }
    
    /**
     * Configuration export/import
     */
    export() {
        return JSON.parse(JSON.stringify(this.config));
    }
    
    async import(config) {
        this.config = this.mergeConfigs(this.config, config);
        
        if (this.options.enableValidation) {
            this.validateConfiguration();
        }
        
        await this.saveConfigFile();
        this.notifyWatchers();
        
        logger.info('📥 Configuration imported successfully');
    }
    
    /**
     * Reset to defaults
     */
    async reset() {
        this.config = this.generateDefaultConfig();
        await this.saveConfigFile();
        this.notifyWatchers();
        
        logger.info('🔄 Configuration reset to defaults');
    }
    
    /**
     * Get configuration summary
     */
    getSummary() {
        const summary = {
            file: this.options.configFile,
            lastModified: this.lastModified,
            envPrefix: this.options.envPrefix,
            hotReloadEnabled: this.options.enableHotReload,
            validationEnabled: this.options.enableValidation,
            sections: Object.keys(this.config),
            totalSettings: 0
        };
        
        for (const section of Object.values(this.config)) {
            if (typeof section === 'object' && section !== null) {
                summary.totalSettings += Object.keys(section).length;
            }
        }
        
        return summary;
    }
}

// Global configuration instance
let globalConfig = null;

/**
 * Factory function to get or create global configuration instance
 */
function getConfig(options = {}) {
    if (!globalConfig) {
        globalConfig = new ConfigManager(options);
    }
    return globalConfig;
}

/**
 * Initialize configuration with specific options
 */
function initializeConfig(options = {}) {
    globalConfig = new ConfigManager(options);
    return globalConfig;
}

module.exports = {
    ConfigManager,
    getConfig,
    initializeConfig,
    
    // Convenience exports using global config
    get: (path, defaultValue) => getConfig().get(path, defaultValue),
    set: (path, value) => getConfig().set(path, value),
    has: (path) => getConfig().has(path),
    
    // Section-specific getters
    getSystem: (key) => getConfig().getSystem(key),
    getValidation: (key) => getConfig().getValidation(key),
    getFiles: (key) => getConfig().getFiles(key),
    getLogging: (key) => getConfig().getLogging(key),
    getSecurity: (key) => getConfig().getSecurity(key),
    getPerformance: (key) => getConfig().getPerformance(key),
    getDataWeave: (key) => getConfig().getDataWeave(key),
    getDevelopment: (key) => getConfig().getDevelopment(key),
    
    // Environment checks
    isProduction: () => getConfig().isProduction(),
    isDevelopment: () => getConfig().isDevelopment(),
    isTestMode: () => getConfig().isTestMode(),
    
    // Resource cleanup
    destroy: () => {
        if (globalConfig) {
            globalConfig.destroy();
            globalConfig = null;
        }
    }
};
