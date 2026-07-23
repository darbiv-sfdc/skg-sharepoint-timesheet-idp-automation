#!/usr/bin/env node

/**
 * DataWeave Enterprise Output Validator
 * 
 * A reusable utility for validating DataWeave transformation outputs
 * with enterprise-grade accuracy comparison and detailed reporting.
 * @signature Q2hlcHBhbGlTaGFpa1NvaGFpbDE1MDgxOTkz
 * 
 * Features:
 * - Deep JSON/XML structural comparison
 * - Percentage accuracy scoring
 * - Detailed difference reporting  
 * - Path-specific error identification
 * - Cross-platform compatibility
 * 
 * Usage:
 *   node dataweave-output-validator.js <actual_file> <expected_file>
 *   node dataweave-output-validator.js actual-output.json expected_output.json
 * 
 * Exit Codes:
 *   0 = 100% match (success)
 *   1 = Mismatch detected (failure) 
 *   2 = Usage/file error
 * 
 * @author Cheppali Shaik Sohail
 * @version 2.0.1
 */

const fs = require('fs');
const path = require('path');
// @watermark CS150893‌

class DataWeaveOutputValidator {
    constructor() {
        this.version = '2.1.0-field-level';
        this.startTime = Date.now();
    }

    /**
     * Main validation entry point
     */
    validateOutputs(actualFile, expectedFile) {
        try {
            console.log('🚀 DataWeave Enterprise Output Validator v' + this.version);
            console.log('📊 Starting validation comparison...');
            console.log(`📁 Actual: ${actualFile}`);
            console.log(`📁 Expected: ${expectedFile}`);
            
            // Validate file existence
            this.validateFileExists(actualFile, 'actual output');
            this.validateFileExists(expectedFile, 'expected output');
            
            // Read and parse files
            const actualContent = fs.readFileSync(actualFile, 'utf8');
            const expectedContent = fs.readFileSync(expectedFile, 'utf8');
            
            const actual = this.parseOutputSmart(actualContent, actualFile);
            const expected = this.parseOutputSmart(expectedContent, expectedFile);
            
            // Store data for field-level accuracy calculation
            this.actualData = actual;
            this.expectedData = expected;
            
            // Perform comparison
            const comparison = this.performDeepComparison(actual, expected);
            const score = this.calculateScore(comparison);
            const executionTime = Date.now() - this.startTime;
            
            // Generate report
            this.generateComparisonReport(comparison, score, executionTime);
            
            // Exit with appropriate code
            if (score === 100) {
                console.log('\n🎉 VALIDATION SUCCESS: 100% field-level accuracy achieved!');
                process.exit(0);
            } else {
                console.log(`\n❌ VALIDATION FAILED: ${score}% field-level accuracy (100% required)`);
                process.exit(1);
            }
            
        } catch (error) {
            console.error(`\n💥 VALIDATION ERROR: ${error.message}`);
            console.error('Stack trace:', error.stack);
            process.exit(2);
        }
    }

    /**
     * Validate file exists and is readable
     */
    validateFileExists(filePath, fileType) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`${fileType} file not found: ${filePath}`);
        }
        
        const stats = fs.statSync(filePath);
        if (!stats.isFile()) {
            throw new Error(`${fileType} path is not a file: ${filePath}`);
        }
    }

    /**
     * Intelligent parsing with format detection and error recovery
     */
    parseOutputSmart(content, fileName) {
        const trimmed = content.trim();
        
        if (!trimmed) {
            throw new Error(`Empty content in file: ${fileName}`);
        }
        
        // XML Detection and Normalization
        if (trimmed.startsWith('<') || trimmed.match(/^<\?xml/i)) {
            console.log(`🔍 Detected XML format: ${fileName}`);
            return this.normalizeXML(trimmed);
        }
        
        // JSON Detection and Parsing
        try {
            console.log(`🔍 Detected JSON format: ${fileName}`);
            return JSON.parse(trimmed);
        } catch (error) {
            console.log(`🔧 Attempting JSON repair for: ${fileName}`);
            // Attempt common JSON repairs
            const cleaned = trimmed
                .replace(/,\s*}/g, '}')    // Remove trailing commas in objects
                .replace(/,\s*]/g, ']')    // Remove trailing commas in arrays  
                .replace(/'/g, '"')        // Replace single quotes with double
                .replace(/(\w+):/g, '"$1":'); // Quote unquoted keys
                
            try {
                return JSON.parse(cleaned);
            } catch (repairError) {
                throw new Error(`Unable to parse JSON in ${fileName}: ${error.message}`);
            }
        }
    }

    /**
     * Deep recursive comparison with path tracking
     */
    performDeepComparison(actual, expected, path = 'root') {
        // Perfect match optimization
        if (actual === expected) {
            return { match: true, score: 100, path };
        }
        
        // Null/undefined handling
        if (actual === null && expected === null) {
            return { match: true, score: 100, path };
        }
        
        if ((actual === null || actual === undefined) || (expected === null || expected === undefined)) {
            return { 
                match: false, 
                score: 0, 
                path, 
                issue: `Null/undefined mismatch: actual=${actual}, expected=${expected}` 
            };
        }
        
        // Type validation
        const actualType = this.getDataType(actual);
        const expectedType = this.getDataType(expected);
        
        if (actualType !== expectedType) {
            return { 
                match: false, 
                score: 0, 
                path, 
                issue: `Type mismatch: actual=${actualType}, expected=${expectedType}` 
            };
        }
        
        // Recursive comparison by type
        if (Array.isArray(actual)) {
            return this.compareArrays(actual, expected, path);
        } else if (typeof actual === 'object') {
            return this.compareObjects(actual, expected, path);
        } else {
            // Primitive comparison with similarity scoring
            const match = actual === expected;
            return { 
                match, 
                score: match ? 100 : this.calculateSimilarityScore(actual, expected),
                path, 
                issue: match ? null : `Value mismatch: actual="${actual}", expected="${expected}"`
            };
        }
    }

    /**
     * Array comparison with element-by-element analysis
     */
    compareArrays(actual, expected, path) {
        if (actual.length !== expected.length) {
            return { 
                match: false, 
                score: 0, 
                path, 
                issue: `Array length mismatch: actual=${actual.length}, expected=${expected.length}` 
            };
        }
        
        let matches = 0;
        const issues = [];
        
        for (let i = 0; i < actual.length; i++) {
            const result = this.performDeepComparison(actual[i], expected[i], `${path}[${i}]`);
            if (result.match) {
                matches++;
            } else {
                issues.push(result);
            }
        }
        
        // Handle empty arrays (both length 0) as perfect match
        const score = actual.length === 0 ? 100 : Math.round((matches / actual.length) * 100);
        return { 
            match: score === 100, 
            score, 
            path, 
            issue: score === 100 ? null : `Array comparison: ${matches}/${actual.length} elements match (${score}%)`,
            issues: issues.length > 0 ? issues : null 
        };
    }

    /**
     * Object comparison with key-by-key analysis
     */
    compareObjects(actual, expected, path) {
        const actualKeys = Object.keys(actual).sort();
        const expectedKeys = Object.keys(expected).sort();
        
        // Key structure validation
        if (JSON.stringify(actualKeys) !== JSON.stringify(expectedKeys)) {
            const missingInActual = expectedKeys.filter(k => !actualKeys.includes(k));
            const extraInActual = actualKeys.filter(k => !expectedKeys.includes(k));
            
            let keyIssue = 'Key structure mismatch:';
            if (missingInActual.length > 0) keyIssue += ` missing=[${missingInActual.join(', ')}]`;
            if (extraInActual.length > 0) keyIssue += ` extra=[${extraInActual.join(', ')}]`;
            
            return { 
                match: false, 
                score: 0, 
                path, 
                issue: keyIssue 
            };
        }
        
        let matches = 0;
        const issues = [];
        
        for (const key of actualKeys) {
            const result = this.performDeepComparison(actual[key], expected[key], `${path}.${key}`);
            if (result.match) {
                matches++;
            } else {
                issues.push(result);
            }
        }
        
        const score = Math.round((matches / actualKeys.length) * 100);
        return { 
            match: score === 100, 
            score, 
            path, 
            issue: score === 100 ? null : `Object comparison: ${matches}/${actualKeys.length} fields match (${score}%)`,
            issues: issues.length > 0 ? issues : null 
        };
    }

    /**
     * Generate comprehensive comparison report
     */
    generateComparisonReport(comparison, score, executionTime) {
        console.log('\n📊 VALIDATION REPORT');
        console.log('═'.repeat(50));
        console.log(`🎯 Field-Level Accuracy: ${score}%`);
        
        // Show field counts for field-level accuracy
        if (this.actualData && this.expectedData) {
            const actualFields = this.getAllPrimitiveFields(this.actualData);
            const expectedFields = this.getAllPrimitiveFields(this.expectedData);
            const totalFields = Math.max(actualFields.length, expectedFields.length);
            const matchingFields = Math.round((score / 100) * totalFields);
            console.log(`📊 Field Count: ${matchingFields}/${totalFields} fields match`);
        }
        
        console.log(`⏱️  Execution Time: ${executionTime}ms`);
        console.log(`🔍 Root Match: ${comparison.match ? '✅' : '❌'}`);
        
        if (score === 100) {
            console.log('\n✅ PERFECT MATCH ACHIEVED!');
            console.log('🏆 All fields and values match exactly');
            console.log('🚀 Transformation ready for production');
        } else {
            console.log('\n❌ DIFFERENCES DETECTED:');
            console.log('─'.repeat(30));
            
            // Ensure we always show differences when score < 100%
            const hasVisibleDifferences = this.hasVisibleDifferences(comparison);
            if (hasVisibleDifferences) {
                this.printDifferences(comparison, '      ');
            } else {
                console.log(`      🔍 root: Structural differences detected (${score}% match)`);
                console.log('      ℹ️  Run validator in debug mode for detailed analysis');
            }
            
            console.log('\n💡 RECOMMENDATIONS:');
            console.log('• Review transformation logic for failed fields');
            console.log('• Verify business rule calculations');  
            console.log('• Check data type conversions');
            console.log('• Validate dynamic field mappings');
        }
    }

    /**
     * Check if comparison has visible differences to display
     */
    hasVisibleDifferences(comparison) {
        if (comparison.issue) {
            return true;
        }
        
        if (comparison.issues && Array.isArray(comparison.issues) && comparison.issues.length > 0) {
            return comparison.issues.some(issue => this.hasVisibleDifferences(issue));
        }
        
        return false;
    }

    /**
     * Recursively print differences with indentation
     */
    printDifferences(comparison, indent = '') {
        // Always show top-level issue if it exists
        if (comparison.issue) {
            console.log(`${indent}🔍 ${comparison.path}: ${comparison.issue}`);
        }
        
        // Show nested issues
        if (comparison.issues && Array.isArray(comparison.issues)) {
            comparison.issues.forEach(issue => {
                this.printDifferences(issue, indent + '  ');
            });
        }
        
        // Fallback: if no issue or issues shown but comparison failed, show generic message
        if (!comparison.match && !comparison.issue && (!comparison.issues || comparison.issues.length === 0)) {
            console.log(`${indent}🔍 ${comparison.path}: Comparison failed (score: ${comparison.score}%) - details not available`);
        }
    }

    /**
     * Calculate similarity score for primitive values
     */
    calculateSimilarityScore(actual, expected) {
        // For numbers, calculate percentage similarity
        if (typeof actual === 'number' && typeof expected === 'number') {
            const diff = Math.abs(actual - expected);
            const max = Math.max(Math.abs(actual), Math.abs(expected), 1);
            return Math.max(0, Math.round((1 - diff / max) * 100));
        }
        
        // For strings, calculate Levenshtein similarity
        if (typeof actual === 'string' && typeof expected === 'string') {
            const maxLen = Math.max(actual.length, expected.length, 1);
            const distance = this.levenshteinDistance(actual, expected);
            return Math.max(0, Math.round((1 - distance / maxLen) * 100));
        }
        
        return 0; // No similarity for different types
    }

    /**
     * Calculate Levenshtein distance for strings
     */
    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    /**
     * Get detailed data type
     */
    getDataType(value) {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        if (Array.isArray(value)) return 'array';
        return typeof value;
    }

    /**
     * Parse XML into structured object for field-by-field comparison
     */
    normalizeXML(xml) {
        try {
            // Use built-in XML parsing approach for better field-level analysis
            return this.parseXMLToObject(xml);
        } catch (error) {
            // Fallback to string normalization if parsing fails
            console.log('⚠️  XML parsing failed, using string comparison');
            return xml
                .replace(/>\s+</g, '><')
                .replace(/\s+/g, ' ')
                .replace(/version="([^"]*)"/g, "version='$1'")  // Normalize to DataWeave single quotes
                .replace(/encoding="([^"]*)"/g, "encoding='$1'")  // Normalize to DataWeave single quotes
                .replace(/standalone="([^"]*)"/g, "standalone='$1'")  // Normalize to DataWeave single quotes
                .trim();
        }
    }

    /**
     * Parse XML string into JavaScript object for field-level comparison
     */
    parseXMLToObject(xmlString) {
        // Simple XML parser for field-level analysis
        const cleaned = xmlString.replace(/>\s+</g, '><').trim();
        
        // Extract XML declaration separately
        const xmlDeclaration = cleaned.match(/^<\?xml[^>]*\?>/);
        const xmlContent = cleaned.replace(/^<\?xml[^>]*\?>/, '').trim();
        
        // Parse the main XML structure
        const result = this.parseXMLElement(xmlContent);
        
        // Add XML declaration info if present (normalize quotes for comparison)
        if (xmlDeclaration) {
            result._xmlDeclaration = xmlDeclaration[0]
                .replace(/version='([^']*)'/g, 'version="$1"')
                .replace(/encoding='([^']*)'/g, 'encoding="$1"')
                .replace(/standalone='([^']*)'/g, 'standalone="$1"');
        }
        
        return result;
    }

    /**
     * Recursively parse XML element into object structure
     */
    parseXMLElement(xmlString) {
        xmlString = xmlString.trim();
        
        // Handle self-closing tags
        if (xmlString.match(/^<[^>]+\/>$/)) {
            const match = xmlString.match(/^<([^\s>]+)([^>]*)\/>$/);
            if (match) {
                const tagName = match[1];
                const attributes = this.parseAttributes(match[2]);
                return { [tagName]: { ...attributes, _text: null } };
            }
        }
        
        // Handle regular tags
        const match = xmlString.match(/^<([^\s>]+)([^>]*?)>(.*)<\/\1>$/s);
        if (!match) {
            // If no match, treat as text content
            return xmlString;
        }
        
        const tagName = match[1];
        const attributesString = match[2];
        const content = match[3];
        
        const attributes = this.parseAttributes(attributesString);
        const element = { ...attributes };
        
        // Parse content
        if (content.trim() === '') {
            element._text = '';
        } else if (content.includes('<')) {
            // Contains child elements
            const children = this.parseXMLChildren(content);
            Object.assign(element, children);
        } else {
            // Text content only
            element._text = content.trim();
        }
        
        return { [tagName]: element };
    }

    /**
     * Parse XML attributes from attribute string
     */
    parseAttributes(attributeString) {
        const attributes = {};
        if (!attributeString || !attributeString.trim()) {
            return attributes;
        }
        
        const attrMatches = attributeString.matchAll(/(\w+)=["']([^"']*)["']/g);
        for (const match of attrMatches) {
            attributes[`@${match[1]}`] = match[2];
        }
        
        return attributes;
    }

    /**
     * Parse XML children elements
     */
    parseXMLChildren(content) {
        const children = {};
        let remaining = content.trim();
        
        while (remaining) {
            // Find the next complete element
            const match = remaining.match(/^<([^\s>\/]+)([^>]*?)>/);
            if (!match) {
                // No more elements, remaining content is text
                if (remaining.trim()) {
                    if (children._text) {
                        children._text += ' ' + remaining.trim();
                    } else {
                        children._text = remaining.trim();
                    }
                }
                break;
            }
            
            const tagName = match[1];
            const fullMatch = this.extractCompleteElement(remaining, tagName);
            
            if (fullMatch) {
                const parsed = this.parseXMLElement(fullMatch.element);
                const key = Object.keys(parsed)[0];
                
                // Handle multiple elements with same tag name (arrays)
                if (children[key]) {
                    if (!Array.isArray(children[key])) {
                        children[key] = [children[key]];
                    }
                    children[key].push(parsed[key]);
                } else {
                    children[key] = parsed[key];
                }
                
                remaining = remaining.substring(fullMatch.endIndex).trim();
            } else {
                // Couldn't parse, skip this part
                remaining = remaining.substring(1);
            }
        }
        
        return children;
    }

    /**
     * Extract complete XML element including nested elements
     */
    extractCompleteElement(xmlString, tagName) {
        const openTag = `<${tagName}`;
        const closeTag = `</${tagName}>`;
        
        let depth = 0;
        let i = 0;
        let inTag = false;
        let startIndex = -1;
        
        while (i < xmlString.length) {
            const char = xmlString[i];
            
            if (char === '<') {
                const remaining = xmlString.substring(i);
                
                if (remaining.startsWith(openTag)) {
                    if (startIndex === -1) startIndex = i;
                    if (remaining.charAt(openTag.length) === ' ' || 
                        remaining.charAt(openTag.length) === '>' ||
                        remaining.charAt(openTag.length) === '/') {
                        depth++;
                        // Skip to end of opening tag
                        const tagEnd = remaining.indexOf('>');
                        if (tagEnd !== -1) {
                            i += tagEnd;
                        }
                    }
                } else if (remaining.startsWith(closeTag)) {
                    depth--;
                    if (depth === 0) {
                        const endIndex = i + closeTag.length;
                        return {
                            element: xmlString.substring(startIndex, endIndex),
                            endIndex: endIndex
                        };
                    }
                    i += closeTag.length - 1;
                }
            }
            
            i++;
        }
        
        return null;
    }

    /**
     * Calculate field-level accuracy score using direct field counting
     */
    calculateScore(comparison) {
        // Get the original actual and expected data for direct field counting
        if (this.actualData && this.expectedData) {
            return this.calculateFieldLevelAccuracy(this.actualData, this.expectedData);
        }
        // Fallback to original scoring if data not available
        return comparison.score || 0;
    }

    /**
     * Calculate field-level accuracy by counting all primitive fields
     */
    calculateFieldLevelAccuracy(actual, expected) {
        const actualFields = this.getAllPrimitiveFields(actual);
        const expectedFields = this.getAllPrimitiveFields(expected);
        
        let matchingFields = 0;
        let totalFields = Math.max(actualFields.length, expectedFields.length);

        // Compare each field path and value
        for (let i = 0; i < totalFields; i++) {
            const actualField = actualFields[i];
            const expectedField = expectedFields[i];
            
            if (actualField && expectedField && 
                actualField.path === expectedField.path && 
                JSON.stringify(actualField.value) === JSON.stringify(expectedField.value)) {
                matchingFields++;
            }
        }

        return Math.round((matchingFields / totalFields) * 100);
    }

    /**
     * Extract all primitive fields (leaf values) from an object/array with their paths
     */
    getAllPrimitiveFields(obj, basePath = 'root') {
        const fields = [];

        const traverse = (current, path) => {
            if (current === null || current === undefined) {
                fields.push({ path, value: current });
                return;
            }

            if (typeof current === 'object') {
                if (Array.isArray(current)) {
                    current.forEach((item, index) => {
                        traverse(item, `${path}[${index}]`);
                    });
                } else {
                    Object.keys(current).forEach(key => {
                        traverse(current[key], `${path}.${key}`);
                    });
                }
            } else {
                // Primitive value (string, number, boolean)
                fields.push({ path, value: current });
            }
        };

        traverse(obj, basePath);
        return fields;
    }
}

// CLI Usage Handler
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        console.log(`
🚀 DataWeave Enterprise Output Validator v2.0.1

📋 USAGE:
  node dataweave-output-validator.js <actual_file> <expected_file>

📝 EXAMPLES:  
  node dataweave-output-validator.js actual-output.json expected_output.json
  node dataweave-output-validator.js output.xml expected.xml
  
🎯 EXIT CODES:
  0 = Perfect match (100% accuracy)
  1 = Mismatch detected  
  2 = Usage or file error
  
🏆 FEATURES:
  ✅ Deep JSON/XML comparison
  ✅ Percentage accuracy scoring  
  ✅ Detailed difference reporting
  ✅ Path-specific error identification
  ✅ Enterprise-grade validation
        `);
        process.exit(args.includes('--help') || args.includes('-h') ? 0 : 2);
    }
    
    if (args.length !== 2) {
        console.error('❌ ERROR: Exactly 2 file arguments required');
        console.error('Usage: node dataweave-output-validator.js <actual_file> <expected_file>');
        process.exit(2);
    }
    
    const [actualFile, expectedFile] = args;
    const validator = new DataWeaveOutputValidator();
    validator.validateOutputs(actualFile, expectedFile);
}

// Execute if called directly
if (require.main === module) {
    main();
}

module.exports = DataWeaveOutputValidator;
