#!/usr/bin/env node

/**
 * 🎯 R-Genie Mapping Sheet Analyzer v3.0 (Streamlined)
 * Analyzes mapping specifications with enhanced AI intelligence
 * @signature Q2hlcHBhbGlTaGFpa1NvaGFpbDE1MDgxOTkz
 * Generates transformation requirements with domain context and DataWeave strategy
 * JSON-FIRST approach for maximum AI understanding and processing efficiency
 */

const fs = require('fs');
const path = require('path');
const { createLogger } = require('./03-01-20_Unified_Logger.js');

// Initialize unified logger
const logger = createLogger('mapping-sheet-analyzer', { level: 'INFO' });
// @watermark CS150893‌

// Shared color codes
const { colors } = require('./colors.js');

// Using unified logger - custom log function removed

// 🆕 Parse mapping sheet content (JSON-FIRST priority for R-GENIE intelligence)
function parseMappingSheet(filePath) {
    const extension = path.extname(filePath).toLowerCase();
    const content = fs.readFileSync(filePath, 'utf8');
    
    // PRIORITY 1: JSON format (most efficient for R-GENIE analysis)
    if (extension === '.json' || content.trim().startsWith('{') || content.trim().startsWith('[')) {
        console.log('🎯 Using JSON format (optimal for R-GENIE intelligence)');
        return parseJsonMapping(content);
    } 
    // PRIORITY 2: CSV format (legacy support)
    else if (extension === '.csv' || (content.includes(',') && content.includes('\n'))) {
        console.log('📊 Using CSV format (converting to JSON-like structure)');
        return parseCsvMapping(content);
    } 
    // PRIORITY 3: Text/Markdown format (fallback)
    else if (extension === '.md' || extension === '.txt') {
        console.log('📝 Using text format (basic parsing)');
        return parseTextMapping(content);
    } 
    // AUTO-DETECT: Default to text parsing
    else {
        console.log('🔍 Auto-detecting format...');
        return parseTextMapping(content);
    }
}

// Parse CSV-style mapping (SourceField,TargetField,DataType,Transformation)
function parseCsvMapping(content) {
    const lines = content.split('\n').filter(line => line.trim());
    const mappings = [];
    
    // Skip header if present
    const startIndex = lines[0].toLowerCase().includes('source') || lines[0].toLowerCase().includes('target') ? 1 : 0;
    
    for (let i = startIndex; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim().replace(/['"]/g, ''));
        if (parts.length >= 2) {
            mappings.push({
                sourceField: parts[0],
                targetField: parts[1],
                dataType: parts[2] || 'string',
                transformation: parts[3] || 'direct',
                lineNumber: i + 1
            });
        }
    }
    
    return mappings;
}

// Parse JSON mapping specification (Streamlined v3.0)
function parseJsonMapping(content) {
    const json = JSON.parse(content);
    const mappings = [];
    
    console.log('🔍 JSON Debug: isArray=', Array.isArray(json), 'aiOptimized=', json.metadata?.aiOptimized, 'metadata=', !!json.metadata, 'data=', !!json.data);
    
    // NEW: Handle Basic JSON array format (pure Excel conversion)
    if (Array.isArray(json) && json.length > 0 && json[0]['Source Field'] && json[0]['Target Field']) {
        console.log('📋 Basic JSON mapping array detected - using direct extraction!');
        return parseBasicJsonMappingArray(json);
    }
    
    // Handle clean JSON format from simplified Excel Converter
    if ((json.aiOptimized || json.metadata?.aiOptimized) && json.metadata && json.data) {
        console.log('📊 Structured JSON detected - Using enhanced parsing!');
        
        // Enhanced mapping sheet detection - check for standard mapping columns
        const hasProperMappingStructure = json.data && json.data.length > 0 && 
            json.data[0] && (
                (json.data[0]['Source Field'] && json.data[0]['Target Field']) ||
                (Object.values(json.data[0]).some(val => 
                    typeof val === 'string' && val.toLowerCase().includes('source'))) &&
                (Object.values(json.data[0]).some(val => 
                    typeof val === 'string' && val.toLowerCase().includes('target')))
            );
        
        // Extract mapping intelligence from AI-optimized structure
        if (hasProperMappingStructure || (json.mappingHints && json.mappingHints.likelyMappingSheet && json.mappingHints.likelyMappingSheet.isLikely)) {
            console.log('🎯 Detected as mapping sheet - using AI mapping extraction');
            // Process as mapping sheet with AI insights
            return parseAIOptimizedMappingSheet(json);
        } else {
            console.log('📊 Detected as data sheet - using schema analysis');
            // Process as data with AI schema analysis
            return parseAIOptimizedDataSheet(json);
        }
    }
    
    // LEGACY: Handle standard JSON mapping formats
    if (Array.isArray(json)) {
        json.forEach((mapping, index) => {
            mappings.push({
                sourceField: mapping.source || mapping.sourceField,
                targetField: mapping.target || mapping.targetField,
                dataType: mapping.dataType || mapping.type || 'string',
                transformation: mapping.transformation || mapping.rule || 'direct',
                lineNumber: index + 1,
                confidence: 70 // Standard confidence for manual mapping
            });
        });
    } else if (json.mappings) {
        Object.entries(json.mappings).forEach(([target, source], index) => {
            mappings.push({
                sourceField: typeof source === 'string' ? source : source.field,
                targetField: target,
                dataType: typeof source === 'object' ? source.type : 'string',
                transformation: typeof source === 'object' ? source.rule : 'direct',
                lineNumber: index + 1,
                confidence: 75 // Higher confidence for structured mapping
            });
        });
    }
    
    return mappings;
}

// NEW: Parse Basic JSON mapping array (pure Excel conversion)
function parseBasicJsonMappingArray(json) {
    console.log('📋 Processing basic JSON mapping array...');
    const mappings = [];
    
    json.forEach((row, index) => {
        const sourceField = row['Source Field'];
        const targetField = row['Target Field'];
        const dataType = row['Data Type'] || 'string';
        const transformation = row['Transformation'] || 'direct';
        const formula = row['Formula/Logic'] || '';
        const complexity = row['Complexity'] || 'Simple';
        const confidence = row['AI Confidence'] || 'Medium';
        const notes = row['Notes'] || '';
        
        if (sourceField && targetField && !targetField.includes('(dropped)')) {
            mappings.push({
                sourceField: sourceField,
                targetField: targetField,
                dataType: dataType,
                transformation: transformation,
                formula: formula,
                complexity: complexity,
                confidence: confidence,
                notes: notes,
                lineNumber: index + 1
            });
        }
    });
    
    console.log(`🎯 Extracted ${mappings.length} basic mappings from Excel data`);
    return mappings;
}

// Parse structured mapping sheet with enhanced intelligence
function parseAIOptimizedMappingSheet(json) {
    console.log('🎯 Processing structured mapping sheet with enhanced intelligence...');
    const mappings = [];
    const hints = json.mappingHints || {};
    const analysis = json.aiAnalysis || {};
    
    // Enhanced header detection for standard mapping columns
    const standardMappingColumns = {
        source: ['Source Field', 'source', 'input', 'from'],
        target: ['Target Field', 'target', 'output', 'to'],
        dataType: ['Data Type', 'type', 'datatype'],
        transformation: ['Transformation', 'transform', 'rule'],
        formula: ['Formula/Logic', 'formula', 'logic', 'expression'],
        complexity: ['Complexity', 'difficulty', 'level'],
        confidence: ['AI Confidence', 'confidence', 'score'],
        notes: ['Notes', 'comments', 'description']
    };
    
    // Find column mappings by examining actual column names (not values)
    const columnMap = {};
    if (json.data && json.data.length > 0) {
        const firstRow = json.data[0];
        Object.keys(firstRow).forEach(columnKey => {
            // Check if the column KEY (header name) matches our expected mapping types
            Object.keys(standardMappingColumns).forEach(mappingType => {
                const expectedHeaders = standardMappingColumns[mappingType];
                if (expectedHeaders.some(header => 
                    columnKey.toLowerCase().includes(header.toLowerCase()) ||
                    header.toLowerCase().includes(columnKey.toLowerCase())
                )) {
                    columnMap[mappingType] = columnKey;
                }
            });
        });
    }
    
    console.log(`🔍 Column Detection:`, Object.keys(columnMap));
    console.log(`🧠 Domain Context: ${(analysis.domainHints || []).join(', ')}`);
    console.log(`⚡ Complexity Level: ${analysis.complexity ? analysis.complexity.level : 'Unknown'}`);
    
    // Process data rows (skip header row if detected)
    const dataRows = json.data.slice(1); // Skip first row which contains headers
    
    dataRows.forEach((row, index) => {
        const sourceField = columnMap.source ? row[columnMap.source] : null;
        const targetField = columnMap.target ? row[columnMap.target] : null;
        const dataType = columnMap.dataType ? row[columnMap.dataType] : 'string';
        const transformation = columnMap.transformation ? row[columnMap.transformation] : 'direct';
        const formula = columnMap.formula ? row[columnMap.formula] : null;
        const complexity = columnMap.complexity ? row[columnMap.complexity] : 'Simple';
        const confidence = columnMap.confidence ? row[columnMap.confidence] : 'High';
        const notes = columnMap.notes ? row[columnMap.notes] : '';
        
        if (sourceField && targetField) {
            mappings.push({
                sourceField: sourceField,
                targetField: targetField,
                dataType: dataType || 'string',
                transformation: transformation || 'direct',
                formula: formula,
                complexity: complexity,
                confidence: confidence,
                notes: notes,
                lineNumber: index + 2, // +2 because we skipped header row
                aiContext: {
                    domain: analysis.domainHints || [],
                    complexity: analysis.complexity || {},
                    patterns: analysis.transformationPatterns || [],
                    strategy: analysis.dataWeaveStrategy || {},
                    recommendations: hints.dataWeaveRecommendations || []
                }
            });
        }
    });
    
    console.log(`🎯 Extracted ${mappings.length} intelligent mappings with full context`);
    return mappings;
}

// Parse structured data sheet for mapping analysis
function parseAIOptimizedDataSheet(json) {
    console.log('📊 Processing structured data sheet for mapping analysis...');
    const mappings = [];
    const analysis = json.aiAnalysis || {};
    const data = json.data || [];
    
    // Look for mapping headers in the data rows
    let headerRowIndex = -1;
    let headers = {};
    
    // Find the row with mapping headers (Source Element, Destination Element, etc.)
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const values = Object.values(row).filter(v => v !== null);
        
        // Check if this row contains proper mapping table headers (must have both source and destination)
        const hasSourceElement = values.some(v => typeof v === 'string' && 
            v.toLowerCase().includes('source') && v.toLowerCase().includes('element'));
        const hasDestElement = values.some(v => typeof v === 'string' && 
            (v.toLowerCase().includes('destination') || v.toLowerCase().includes('target')) && 
            v.toLowerCase().includes('element'));
        
        if (hasSourceElement && hasDestElement) {
            headerRowIndex = i;
            
            // Map column positions to header names
            Object.keys(row).forEach(colKey => {
                if (row[colKey] && typeof row[colKey] === 'string') {
                    headers[colKey] = row[colKey].toLowerCase();
                }
            });
            
            console.log(`🎯 Found mapping headers at row ${i + 1}: ${Object.values(headers).join(', ')}`);
            break;
        }
    }
    
    if (headerRowIndex === -1) {
        console.log('🔍 No mapping headers found, trying to extract direct field mappings...');
        
        // Fallback: Look for direct source->target mappings in data
        data.forEach((row, index) => {
            const values = Object.values(row).filter(v => v !== null && v !== '');
            if (values.length >= 2) {
                // Try to identify source and target from long field paths
                const sourceCandidate = values.find(v => typeof v === 'string' && v.includes('/') && v.length > 20);
                const targetCandidate = values.find(v => typeof v === 'string' && v !== sourceCandidate && v.includes('/'));
                
                if (sourceCandidate && targetCandidate) {
                    mappings.push({
                        sourceField: sourceCandidate,
                        targetField: targetCandidate,
                        dataType: 'string',
                        transformation: 'direct',
                        lineNumber: index + 1,
                        confidence: 85,
                        aiContext: {
                            domain: analysis.domainHints || ['Integration'],
                            complexity: analysis.complexity || { level: 'Advanced' },
                            extractedFromRow: index + 1
                        }
                    });
                }
            }
        });
    } else {
        // Parse mapping data rows (after headers)
        for (let i = headerRowIndex + 1; i < data.length; i++) {
            const row = data[i];
            const values = Object.values(row).filter(v => v !== null && v !== '');
            
            if (values.length === 0) continue; // Skip empty rows
            
            // Extract source and destination fields based on headers
            let sourceField = null;
            let targetField = null;
            let transformation = 'direct';
            let defaultValue = null;
            let functionInput = null;
            let functionOutput = null;
            
            Object.keys(row).forEach(colKey => {
                const headerName = headers[colKey];
                const value = row[colKey];
                
                if (value !== null && value !== '') {
                    if (headerName && headerName.includes('source')) {
                        sourceField = value;
                    } else if (headerName && (headerName.includes('destination') || headerName.includes('target'))) {
                        targetField = value;
                    } else if (headerName && headerName.includes('default')) {
                        defaultValue = value;
                    } else if (headerName && headerName.includes('input')) {
                        functionInput = value;
                    } else if (headerName && headerName.includes('output')) {
                        functionOutput = value;
                    }
                }
            });
            
            // Create mapping if we have at least source or target
            if (sourceField || targetField) {
                // Determine transformation type
                if (functionInput || functionOutput) {
                    transformation = 'function';
                } else if (defaultValue !== null) {
                    transformation = 'default_value';
                }
                
                mappings.push({
                    sourceField: sourceField || 'N/A',
                    targetField: targetField || 'N/A',
                    dataType: 'string',
                    transformation: transformation,
                    lineNumber: i + 1,
                    confidence: 90,
                    aiContext: {
                        domain: analysis.domainHints || ['Integration'],
                        complexity: analysis.complexity || { level: 'Advanced' },
                        extractedFromRow: i + 1,
                        defaultValue: defaultValue,
                        functionInput: functionInput,
                        functionOutput: functionOutput,
                        transformationType: transformation
                    }
                });
            }
        }
    }
    
    console.log(`🧠 Schema Analysis: ${Object.keys(headers).length} header columns detected`);
    console.log(`🎯 Domain Context: ${(analysis.domainHints || ['Integration']).join(', ')}`);
    console.log(`⚡ AI Confidence: ${analysis.confidenceScore || 90}%`);
    console.log(`🎯 Generated ${mappings.length} intelligent field mappings with AI insights`);
    
    return mappings;
}

// Parse text-based mapping (various formats)
function parseTextMapping(content) {
    const lines = content.split('\n').filter(line => line.trim());
    const mappings = [];
    
    lines.forEach((line, index) => {
        line = line.trim();
        
        // Skip comments and empty lines
        if (line.startsWith('#') || line.startsWith('//') || !line) return;
        
        // Pattern: source -> target
        let match = line.match(/(.+?)\s*->\s*(.+)/);
        if (match) {
            mappings.push({
                sourceField: match[1].trim(),
                targetField: match[2].trim(),
                dataType: 'string',
                transformation: 'direct',
                lineNumber: index + 1
            });
            return;
        }
        
        // Pattern: source = target
        match = line.match(/(.+?)\s*=\s*(.+)/);
        if (match) {
            mappings.push({
                sourceField: match[1].trim(),
                targetField: match[2].trim(),
                dataType: 'string',
                transformation: 'direct',
                lineNumber: index + 1
            });
            return;
        }
        
        // Pattern: source : target
        match = line.match(/(.+?)\s*:\s*(.+)/);
        if (match) {
            mappings.push({
                sourceField: match[1].trim(),
                targetField: match[2].trim(),
                dataType: 'string',
                transformation: 'direct',
                lineNumber: index + 1
            });
            return;
        }
        
        // Single field (assume direct mapping)
        if (line && !line.includes(' ')) {
            mappings.push({
                sourceField: line,
                targetField: line,
                dataType: 'string',
                transformation: 'direct',
                lineNumber: index + 1
            });
        }
    });
    
    return mappings;
}

// 🆕 Analyze mapping patterns and business logic (Enhanced AI-Optimized v2.0)
function analyzeMappingPatterns(mappings) {
    const analysis = {
        totalMappings: mappings.length,
        directMappings: 0,
        transformations: 0,
        calculations: [],
        dataTypes: {
            strings: [],
            numbers: [],
            booleans: [],
            dates: [],
            objects: [],
            arrays: []
        },
        businessRules: [],
        complexity: 'simple',
        // NEW: AI-Enhanced Analysis
        aiEnhanced: false,
        aiContext: {
            domains: new Set(),
            confidenceScores: [],
            complexityLevels: new Set(),
            dataWeaveStrategies: new Set(),
            patterns: new Set(),
            recommendations: new Set()
        }
    };
    
    mappings.forEach(mapping => {
        // Count mapping types
        if (mapping.transformation === 'direct' || mapping.sourceField === mapping.targetField) {
            analysis.directMappings++;
        } else {
            analysis.transformations++;
        }
        
        // NEW: Collect AI context information if available
        if (mapping.aiContext) {
            analysis.aiEnhanced = true;
            
            // Aggregate AI domain hints
            if (mapping.aiContext.domain) {
                mapping.aiContext.domain.forEach(domain => analysis.aiContext.domains.add(domain));
            }
            
            // Collect confidence scores
            if (mapping.confidence) {
                analysis.aiContext.confidenceScores.push(mapping.confidence);
            }
            
            // Aggregate complexity levels
            if (mapping.aiContext.complexity && mapping.aiContext.complexity.level) {
                analysis.aiContext.complexityLevels.add(mapping.aiContext.complexity.level);
            }
            
            // Collect transformation patterns
            if (mapping.aiContext.patterns) {
                mapping.aiContext.patterns.forEach(pattern => analysis.aiContext.patterns.add(pattern));
            }
            
            // Aggregate DataWeave strategies
            if (mapping.aiContext.dataWeaveStrategy && mapping.aiContext.dataWeaveStrategy.approach) {
                analysis.aiContext.dataWeaveStrategies.add(mapping.aiContext.dataWeaveStrategy.approach);
            }
            
            // Collect recommendations
            if (mapping.aiContext.recommendations) {
                mapping.aiContext.recommendations.forEach(rec => analysis.aiContext.recommendations.add(rec));
            }
            
            // Enhanced business rule detection using AI suggestions
            if (mapping.aiContext.suggestions) {
                mapping.aiContext.suggestions.forEach(suggestion => {
                    if (suggestion.includes('currency') || suggestion.includes('decimal')) {
                        analysis.businessRules.push({
                            field: mapping.targetField,
                            type: 'financial_formatting',
                            rule: suggestion,
                            aiGenerated: true
                        });
                    }
                    if (suggestion.includes('date') || suggestion.includes('parsing')) {
                        analysis.businessRules.push({
                            field: mapping.targetField,
                            type: 'date_transformation',
                            rule: suggestion,
                            aiGenerated: true
                        });
                    }
                });
            }
        }
        
        // Analyze data types
        const dataType = mapping.dataType.toLowerCase();
        if (dataType.includes('string') || dataType.includes('text')) {
            analysis.dataTypes.strings.push(mapping.targetField);
        } else if (dataType.includes('number') || dataType.includes('int') || dataType.includes('decimal')) {
            analysis.dataTypes.numbers.push(mapping.targetField);
        } else if (dataType.includes('bool')) {
            analysis.dataTypes.booleans.push(mapping.targetField);
        } else if (dataType.includes('date') || dataType.includes('time')) {
            analysis.dataTypes.dates.push(mapping.targetField);
        } else if (dataType.includes('array') || dataType.includes('list')) {
            analysis.dataTypes.arrays.push(mapping.targetField);
        } else if (dataType.includes('object')) {
            analysis.dataTypes.objects.push(mapping.targetField);
        }
        
        // Detect calculations
        const transformation = mapping.transformation.toLowerCase();
        if (transformation.includes('sum') || transformation.includes('total') || 
            transformation.includes('calculate') || transformation.includes('*') || 
            transformation.includes('+') || transformation.includes('-')) {
            analysis.calculations.push({
                field: mapping.targetField,
                type: 'arithmetic',
                rule: mapping.transformation,
                aiGenerated: !!mapping.aiContext
            });
        }
        
        // Detect business rules
        if (transformation.includes('if') || transformation.includes('when') || 
            transformation.includes('condition') || transformation.includes('validate')) {
            analysis.businessRules.push({
                field: mapping.targetField,
                type: 'conditional',
                rule: mapping.transformation,
                aiGenerated: !!mapping.aiContext
            });
        }
    });
    
    // Determine complexity
    if (analysis.calculations.length > 3 || analysis.businessRules.length > 2) {
        analysis.complexity = 'complex';
    } else if (analysis.transformations > analysis.directMappings) {
        analysis.complexity = 'moderate';
    }
    
    return analysis;
}

// 🆕 Generate synthetic data structure from mappings
function generateSyntheticStructure(mappings, analysis) {
    const inputStructure = {};
    const outputStructure = {};
    
    mappings.forEach(mapping => {
        // Generate sample input data
        const sourceField = mapping.sourceField;
        const dataType = mapping.dataType.toLowerCase();
        
        let sampleValue;
        if (dataType.includes('number') || dataType.includes('int')) {
            sampleValue = 123;
        } else if (dataType.includes('decimal') || dataType.includes('float')) {
            sampleValue = 123.45;
        } else if (dataType.includes('bool')) {
            sampleValue = true;
        } else if (dataType.includes('date')) {
            sampleValue = "2024-01-01";
        } else if (dataType.includes('array')) {
            sampleValue = ["sample1", "sample2"];
        } else if (dataType.includes('object')) {
            sampleValue = { "nested": "value" };
        } else {
            sampleValue = "sample_value";
        }
        
        // Handle nested field paths
        setNestedValue(inputStructure, sourceField, sampleValue);
        setNestedValue(outputStructure, mapping.targetField, sampleValue);
    });
    
    return { inputStructure, outputStructure };
}

// Helper function to set nested object values
function setNestedValue(obj, path, value) {
    // Handle complex paths with multiple field references (e.g., "order.items[].price, order.items[].quantity")
    if (path.includes(',')) {
        // For multi-field paths, use the first field as the primary path
        path = path.split(',')[0].trim();
    }
    
    // Handle array notation (e.g., "order.items[]")
    path = path.replace(/\[\]/g, '');
    
    const parts = path.split('.').filter(p => p.trim());
    let current = obj;
    
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i].trim();
        if (!(part in current)) {
            current[part] = {};
        }
        current = current[part];
    }
    
    const finalKey = parts[parts.length - 1].trim();
    current[finalKey] = value;
}

// 🆕 Generate DataWeave function suggestions based on mappings
function suggestDataWeaveFunctions(analysis) {
    const suggestions = [];
    
    // Basic mapping functions
    if (analysis.directMappings > 0) {
        suggestions.push({ name: "map", priority: "high", reason: "Field mapping transformations" });
        suggestions.push({ name: "filter", priority: "medium", reason: "Data filtering needs" });
    }
    
    // Calculation functions
    if (analysis.calculations.length > 0) {
        suggestions.push({ name: "sumBy", priority: "high", reason: "Arithmetic calculations detected" });
        suggestions.push({ name: "sizeOf", priority: "medium", reason: "Count/size operations" });
        suggestions.push({ name: "groupBy", priority: "medium", reason: "Aggregation needs" });
    }
    
    // Array processing
    if (analysis.dataTypes.arrays.length > 0) {
        suggestions.push({ name: "flatten", priority: "high", reason: "Array processing required" });
        suggestions.push({ name: "reduce", priority: "medium", reason: "Array transformation needs" });
    }
    
    // Type conversions
    if (analysis.dataTypes.numbers.length > 0 && analysis.dataTypes.strings.length > 0) {
        suggestions.push({ name: "as", priority: "high", reason: "Type conversion requirements" });
        suggestions.push({ name: "default", priority: "high", reason: "R-Genie NULL-FIRST: Safe type handling with 'default null'" });
    }
    
    // Conditional logic
    if (analysis.businessRules.length > 0) {
        suggestions.push({ name: "if-else", priority: "high", reason: "Conditional business rules" });
        suggestions.push({ name: "match", priority: "medium", reason: "Pattern matching needs" });
    }
    
    return suggestions;
}

// 🆕 Main analysis function
function performMappingAnalysis(mappingFile, transformationNotes = null) {
    logger.info( '🎯 Starting mapping sheet analysis...');
    logger.info( `📁 Mapping File: ${mappingFile}`);
    
    // Read transformation notes if available
    let notes = '';
    if (transformationNotes && fs.existsSync(transformationNotes)) {
        notes = fs.readFileSync(transformationNotes, 'utf8');
        logger.info( `📝 Transformation notes loaded: ${transformationNotes}`);
    }
    
    try {
        // Parse mapping sheet
        logger.info( '📋 Parsing mapping sheet...');
        const mappings = parseMappingSheet(mappingFile);
        
        if (mappings.length === 0) {
            throw new Error('No valid mappings found in the file');
        }
        
        logger.success( `✅ Parsed ${mappings.length} field mappings`);
        
        // Analyze patterns
        logger.info( '🔍 Analyzing mapping patterns...');
        const analysis = analyzeMappingPatterns(mappings);
        
        // Generate synthetic structures
        logger.info( '🏗️ Generating synthetic data structures...');
        const { inputStructure, outputStructure } = generateSyntheticStructure(mappings, analysis);
        
        // Generate function suggestions
        logger.info( '🚀 Generating DataWeave function suggestions...');
        const functionSuggestions = suggestDataWeaveFunctions(analysis);
        
        return {
            metadata: {
                timestamp: new Date().toISOString(),
                mappingFile,
                transformationNotes,
                analysisVersion: "1.0.0-mapping-sheet"
            },
            mappings,
            analysis,
            syntheticStructures: {
                input: inputStructure,
                output: outputStructure
            },
            functionSuggestions,
            transformationNotes: notes,
            scenario: 'mapping_sheet_only'
        };
        
    } catch (error) {
        logger.error( `❌ Mapping analysis failed: ${error.message}`);
        throw error;
    }
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length < 1 || args.includes('--help') || args.includes('-h')) {
        console.log("🎯 R-Genie Mapping Sheet Analyzer v3.0 (Streamlined)");
        console.log("════════════════════════════════════════");
        console.log("");
        console.log("USAGE:");
        console.log("  node mapping-sheet-analyzer.js <mapping-file> [transformation-notes]");
        console.log("");
        console.log("SUPPORTED FORMATS (JSON-FIRST PRIORITY):");
        console.log("  📊 CLEAN JSON: Simplified structure from streamlined Excel Converter (RECOMMENDED)");
        console.log("  • JSON: {mappings: {target: source}} or [{source, target, type}] (legacy)");
        console.log("  • CSV: source,target,datatype,transformation (legacy)");
        console.log("  • Text: source -> target or source = target (fallback)");
        console.log("");
        console.log("EXAMPLES:");
        console.log("  📊 CLEAN JSON: node mapping-sheet-analyzer.js mapping.xlsx.json");
        console.log("  📊 LEGACY CSV: node mapping-sheet-analyzer.js mappings.csv transformation-notes.txt");
        process.exit(args.includes('--help') || args.includes('-h') ? 0 : 1);
    }
    
    const mappingFile = args[0];
    const transformationNotes = args[1] || null;
    
    try {
        const analysis = performMappingAnalysis(mappingFile, transformationNotes);
        
        console.log("");
        logger.success( '✅ Mapping sheet analysis completed successfully!');
        console.log("");
        
        // Display results
        console.log(`${colors.bright}📋 MAPPING ANALYSIS SUMMARY${colors.reset}`);
        console.log("═══════════════════════════════════════════════");
        console.log(`📊 Total Mappings: ${colors.cyan}${analysis.analysis.totalMappings}${colors.reset}`);
        console.log(`🔗 Direct Mappings: ${colors.green}${analysis.analysis.directMappings}${colors.reset}`);
        console.log(`🔄 Transformations: ${colors.yellow}${analysis.analysis.transformations}${colors.reset}`);
        console.log(`🎯 Complexity: ${colors.magenta}${analysis.analysis.complexity.toUpperCase()}${colors.reset}`);
        console.log("");
        
        if (analysis.analysis.calculations.length > 0) {
            console.log(`${colors.bright}🔢 CALCULATIONS DETECTED${colors.reset}`);
            console.log("═══════════════════════════════════════════════");
            analysis.analysis.calculations.forEach(calc => {
                console.log(`   • ${colors.yellow}${calc.field}${colors.reset}: ${calc.rule}`);
            });
            console.log("");
        }
        
        if (analysis.analysis.businessRules.length > 0) {
            console.log(`${colors.bright}📋 BUSINESS RULES DETECTED${colors.reset}`);
            console.log("═══════════════════════════════════════════════");
            analysis.analysis.businessRules.forEach(rule => {
                console.log(`   • ${colors.yellow}${rule.field}${colors.reset}: ${rule.rule}`);
            });
            console.log("");
        }
        
        console.log(`${colors.bright}🚀 DATAWEAVE FUNCTION SUGGESTIONS${colors.reset}`);
        console.log("═══════════════════════════════════════════════");
        analysis.functionSuggestions.forEach(suggestion => {
            const priority = suggestion.priority === 'high' ? colors.red : colors.yellow;
            console.log(`   • ${priority}${suggestion.name}${colors.reset} (${suggestion.priority}): ${suggestion.reason}`);
        });
        console.log("");
        
        // Save analysis
        const outputFile = `${path.dirname(mappingFile)}/mapping-analysis.json`;
        fs.writeFileSync(outputFile, JSON.stringify(analysis, null, 2));
        logger.success( `📁 Analysis saved to: ${outputFile}`);
        
        console.log("");
        logger.info( '🎯 Use this analysis to generate DataWeave transformation without input/output examples!');
        
    } catch (error) {
        logger.error( `❌ Analysis failed: ${error.message}`);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    performMappingAnalysis,
    parseMappingSheet,
    analyzeMappingPatterns,
    generateSyntheticStructure,
    suggestDataWeaveFunctions
};
