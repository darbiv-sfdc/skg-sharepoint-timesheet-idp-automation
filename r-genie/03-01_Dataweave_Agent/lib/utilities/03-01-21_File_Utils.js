/**
 * 🚀 R-Genie Async File Utilities v3.0
 * High-performance async file operations with caching and error handling
 * @signature Q2hlcHBhbGlTaGFpa1NvaGFpbDE1MDgxOTkz
 * Provides standardized async file operations across all validation components
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const { createErrorHandler, ErrorFactories } = require('./03-01-19_Error_Handler.js');

const errorHandler = createErrorHandler('async-file-utils');
// @watermark CS150893‌

class AsyncFileUtils {
    constructor(options = {}) {
        this.options = {
            enableCaching: options.enableCaching !== false,
            maxCacheSize: options.maxCacheSize || 100, // Maximum cached files
            maxFileSize: options.maxFileSize || 10 * 1024 * 1024, // 10MB max cache per file
            cacheTTL: options.cacheTTL || 5 * 60 * 1000, // 5 minutes
            encoding: options.encoding || 'utf8',
            ...options
        };
        
        // File content cache
        this.cache = new Map();
        this.cacheStats = {
            hits: 0,
            misses: 0,
            size: 0,
            lastCleanup: Date.now()
        };
        
        // Performance metrics
        this.metrics = {
            totalReads: 0,
            totalWrites: 0,
            totalTime: 0,
            cacheHitRate: 0
        };
        
        // Interval management for cleanup
        this.cleanupInterval = null;
        
        // Setup cache cleanup interval
        if (this.options.enableCaching) {
            this.setupCacheCleanup();
        }
    }
    
    setupCacheCleanup() {
        // Clean cache every 5 minutes
        this.cleanupInterval = setInterval(() => {
            this.cleanupCache();
        }, 5 * 60 * 1000);
    }
    
    cleanupCache() {
        const now = Date.now();
        let cleanedCount = 0;
        
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > this.options.cacheTTL) {
                this.cache.delete(key);
                this.cacheStats.size -= entry.size;
                cleanedCount++;
            }
        }
        
        this.cacheStats.lastCleanup = now;
        
        if (cleanedCount > 0) {
            console.debug(`🧹 Cache cleanup: removed ${cleanedCount} expired entries`);
        }
    }
    
    generateCacheKey(filePath, operation, options = {}) {
        const resolvedPath = path.resolve(filePath);
        const optionsStr = JSON.stringify(options);
        return `${operation}:${resolvedPath}:${optionsStr}`;
    }
    
    getCachedContent(cacheKey) {
        const entry = this.cache.get(cacheKey);
        
        if (!entry) {
            this.cacheStats.misses++;
            return null;
        }
        
        const now = Date.now();
        if (now - entry.timestamp > this.options.cacheTTL) {
            this.cache.delete(cacheKey);
            this.cacheStats.size -= entry.size;
            this.cacheStats.misses++;
            return null;
        }
        
        this.cacheStats.hits++;
        this.updateCacheHitRate();
        return entry.content;
    }
    
    setCachedContent(cacheKey, content, size) {
        if (!this.options.enableCaching) return;
        
        // Don't cache files that are too large
        if (size > this.options.maxFileSize) return;
        
        // Evict old entries if cache is full
        while (this.cache.size >= this.options.maxCacheSize) {
            const firstKey = this.cache.keys().next().value;
            const firstEntry = this.cache.get(firstKey);
            this.cache.delete(firstKey);
            this.cacheStats.size -= firstEntry.size;
        }
        
        this.cache.set(cacheKey, {
            content,
            timestamp: Date.now(),
            size
        });
        
        this.cacheStats.size += size;
    }
    
    updateCacheHitRate() {
        const total = this.cacheStats.hits + this.cacheStats.misses;
        this.cacheStats.hitRate = total > 0 ? (this.cacheStats.hits / total) * 100 : 0;
    }
    
    /**
     * Async file existence check
     */
    async exists(filePath) {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }
    
    /**
     * Async file existence check (sync version for compatibility)
     */
    existsSync(filePath) {
        return fsSync.existsSync(filePath);
    }
    
    /**
     * Read file with caching support
     */
    async readFile(filePath, options = {}) {
        const startTime = Date.now();
        this.metrics.totalReads++;
        
        try {
            const resolvedPath = path.resolve(filePath);
            const cacheKey = this.generateCacheKey(resolvedPath, 'read', options);
            
            // Check cache first
            if (this.options.enableCaching) {
                const cached = this.getCachedContent(cacheKey);
                if (cached !== null) {
                    this.metrics.totalTime += Date.now() - startTime;
                    return cached;
                }
            }
            
            // Read from file system
            const content = await fs.readFile(resolvedPath, {
                encoding: options.encoding || this.options.encoding,
                ...options
            });
            
            // Cache the content
            if (this.options.enableCaching) {
                const size = Buffer.byteLength(content, this.options.encoding);
                this.setCachedContent(cacheKey, content, size);
            }
            
            this.metrics.totalTime += Date.now() - startTime;
            return content;
            
        } catch (error) {
            throw ErrorFactories.fileNotFound(filePath, 'File');
        }
    }
    
    /**
     * Write file with atomic operations
     */
    async writeFile(filePath, content, options = {}) {
        const startTime = Date.now();
        this.metrics.totalWrites++;
        
        try {
            const resolvedPath = path.resolve(filePath);
            const dir = path.dirname(resolvedPath);
            
            // Ensure directory exists
            await fs.mkdir(dir, { recursive: true });
            
            // Atomic write using temporary file
            const tempPath = `${resolvedPath}.tmp.${Date.now()}`;
            
            await fs.writeFile(tempPath, content, {
                encoding: options.encoding || this.options.encoding,
                ...options
            });
            
            // Atomic rename
            await fs.rename(tempPath, resolvedPath);
            
            // Invalidate cache
            if (this.options.enableCaching) {
                const cacheKey = this.generateCacheKey(resolvedPath, 'read', {});
                this.cache.delete(cacheKey);
            }
            
            this.metrics.totalTime += Date.now() - startTime;
            
        } catch (error) {
            throw ErrorFactories.configurationError('File write failed', error.message);
        }
    }
    
    /**
     * Append to file
     */
    async appendFile(filePath, content, options = {}) {
        try {
            const resolvedPath = path.resolve(filePath);
            const dir = path.dirname(resolvedPath);
            
            // Ensure directory exists
            await fs.mkdir(dir, { recursive: true });
            
            await fs.appendFile(resolvedPath, content, {
                encoding: options.encoding || this.options.encoding,
                ...options
            });
            
            // Invalidate cache
            if (this.options.enableCaching) {
                const cacheKey = this.generateCacheKey(resolvedPath, 'read', {});
                this.cache.delete(cacheKey);
            }
            
        } catch (error) {
            throw ErrorFactories.configurationError('File append failed', error.message);
        }
    }
    
    /**
     * Copy file
     */
    async copyFile(sourcePath, destPath, options = {}) {
        try {
            const resolvedSource = path.resolve(sourcePath);
            const resolvedDest = path.resolve(destPath);
            const destDir = path.dirname(resolvedDest);
            
            // Ensure destination directory exists
            await fs.mkdir(destDir, { recursive: true });
            
            await fs.copyFile(resolvedSource, resolvedDest, options.flags || 0);
            
        } catch (error) {
            throw ErrorFactories.configurationError('File copy failed', error.message);
        }
    }
    
    /**
     * Get file stats
     */
    async getFileStats(filePath) {
        try {
            const resolvedPath = path.resolve(filePath);
            return await fs.stat(resolvedPath);
        } catch (error) {
            throw ErrorFactories.fileNotFound(filePath, 'File');
        }
    }
    
    /**
     * Read directory
     */
    async readDirectory(dirPath, options = {}) {
        try {
            const resolvedPath = path.resolve(dirPath);
            const entries = await fs.readdir(resolvedPath, { withFileTypes: true, ...options });
            
            return entries.map(entry => ({
                name: entry.name,
                isFile: entry.isFile(),
                isDirectory: entry.isDirectory(),
                path: path.join(resolvedPath, entry.name)
            }));
            
        } catch (error) {
            throw ErrorFactories.fileNotFound(dirPath, 'Directory');
        }
    }
    
    /**
     * Find files matching pattern
     */
    async findFiles(dirPath, pattern, options = {}) {
        const results = [];
        const recursive = options.recursive !== false;
        
        try {
            const entries = await this.readDirectory(dirPath);
            
            for (const entry of entries) {
                if (entry.isFile && pattern.test(entry.name)) {
                    results.push(entry.path);
                } else if (entry.isDirectory && recursive) {
                    const subResults = await this.findFiles(entry.path, pattern, options);
                    results.push(...subResults);
                }
            }
            
            return results;
            
        } catch (error) {
            if (options.ignoreErrors) {
                return results;
            }
            throw error;
        }
    }
    
    /**
     * Delete file
     */
    async deleteFile(filePath) {
        try {
            const resolvedPath = path.resolve(filePath);
            await fs.unlink(resolvedPath);
            
            // Invalidate cache
            if (this.options.enableCaching) {
                const cacheKey = this.generateCacheKey(resolvedPath, 'read', {});
                this.cache.delete(cacheKey);
            }
            
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw ErrorFactories.configurationError('File deletion failed', error.message);
            }
        }
    }
    
    /**
     * Ensure directory exists
     */
    async ensureDirectory(dirPath) {
        try {
            const resolvedPath = path.resolve(dirPath);
            await fs.mkdir(resolvedPath, { recursive: true });
        } catch (error) {
            throw ErrorFactories.configurationError('Directory creation failed', error.message);
        }
    }
    
    /**
     * Read JSON file with parsing
     */
    async readJSON(filePath, options = {}) {
        try {
            const content = await this.readFile(filePath, options);
            return JSON.parse(content);
        } catch (error) {
            if (error.name === 'SyntaxError') {
                throw ErrorFactories.syntaxError(`Invalid JSON in ${filePath}: ${error.message}`);
            }
            throw error;
        }
    }
    
    /**
     * Write JSON file with formatting
     */
    async writeJSON(filePath, data, options = {}) {
        const indent = options.indent !== undefined ? options.indent : 2;
        const content = JSON.stringify(data, null, indent);
        await this.writeFile(filePath, content, options);
    }
    
    /**
     * Batch file operations
     */
    async batchRead(filePaths, options = {}) {
        const concurrent = options.concurrent || 5;
        const results = new Map();
        
        // Process files in batches to avoid overwhelming the system
        for (let i = 0; i < filePaths.length; i += concurrent) {
            const batch = filePaths.slice(i, i + concurrent);
            const promises = batch.map(async (filePath) => {
                try {
                    const content = await this.readFile(filePath, options);
                    return { filePath, content, success: true };
                } catch (error) {
                    return { filePath, error: error.message, success: false };
                }
            });
            
            const batchResults = await Promise.all(promises);
            batchResults.forEach(result => {
                results.set(result.filePath, result);
            });
        }
        
        return results;
    }
    
    /**
     * Get performance metrics
     */
    getMetrics() {
        this.updateCacheHitRate();
        
        return {
            reads: this.metrics.totalReads,
            writes: this.metrics.totalWrites,
            totalTime: this.metrics.totalTime,
            averageTime: this.metrics.totalReads > 0 ? this.metrics.totalTime / this.metrics.totalReads : 0,
            cache: {
                enabled: this.options.enableCaching,
                size: this.cache.size,
                hitRate: this.cacheStats.hitRate.toFixed(2) + '%',
                hits: this.cacheStats.hits,
                misses: this.cacheStats.misses,
                totalSize: this.cacheStats.size,
                lastCleanup: new Date(this.cacheStats.lastCleanup).toISOString()
            }
        };
    }
    
    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        this.cacheStats = {
            hits: 0,
            misses: 0,
            size: 0,
            lastCleanup: Date.now()
        };
    }
    
    /**
     * Destroy and cleanup resources
     */
    destroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        this.clearCache();
    }
}

// Global instance for convenience
const defaultFileUtils = new AsyncFileUtils();

// Export both class and convenience functions
module.exports = {
    AsyncFileUtils,
    
    // Convenience functions using default instance
    exists: (filePath) => defaultFileUtils.exists(filePath),
    existsSync: (filePath) => defaultFileUtils.existsSync(filePath),
    readFile: (filePath, options) => defaultFileUtils.readFile(filePath, options),
    writeFile: (filePath, content, options) => defaultFileUtils.writeFile(filePath, content, options),
    appendFile: (filePath, content, options) => defaultFileUtils.appendFile(filePath, content, options),
    copyFile: (sourcePath, destPath, options) => defaultFileUtils.copyFile(sourcePath, destPath, options),
    deleteFile: (filePath) => defaultFileUtils.deleteFile(filePath),
    ensureDirectory: (dirPath) => defaultFileUtils.ensureDirectory(dirPath),
    readJSON: (filePath, options) => defaultFileUtils.readJSON(filePath, options),
    writeJSON: (filePath, data, options) => defaultFileUtils.writeJSON(filePath, data, options),
    readDirectory: (dirPath, options) => defaultFileUtils.readDirectory(dirPath, options),
    findFiles: (dirPath, pattern, options) => defaultFileUtils.findFiles(dirPath, pattern, options),
    getFileStats: (filePath) => defaultFileUtils.getFileStats(filePath),
    batchRead: (filePaths, options) => defaultFileUtils.batchRead(filePaths, options),
    getMetrics: () => defaultFileUtils.getMetrics(),
    clearCache: () => defaultFileUtils.clearCache(),
    
    // Create custom instance
    create: (options) => new AsyncFileUtils(options),
    
    // Cleanup function for global instance
    destroy: () => {
        if (defaultFileUtils) {
            defaultFileUtils.destroy();
        }
    }
};
