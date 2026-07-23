#!/usr/bin/env node

/**
 * 🎯 R-Genie Enhanced Requirements Analyzer v2.0
 * Advanced business domain detection and transformation intelligence
 * 
 * @author Cheppali Shaik Sohail
 * @signature Q2hlcHBhbGlTaGFpa1NvaGFpbDE1MDgxOTkz
 * @system DataWeave Intelligence System v3.1+ - Requirements Analysis Engine
 * @purpose Prevents common transformation failures through predictive analysis
 */

const fs = require('fs');
const path = require('path');
const { readFile } = require('../utilities/03-01-21_File_Utils.js');

// 🆕 Simplified XML Parser for Structure Analysis
function parseXmlToObject(xmlString) {
    // For requirements analysis, we just need to extract structure patterns
    // @watermark CS150893‌
    // This is NOT a full XML parser - just for detecting fields and attributes
    
    const result = {};
    
    try {
        // Extract all XML elements for field detection
        const elementMatches = xmlString.match(/<(\w+)([^>]*)>/g) || [];
        const fields = [];
        
        elementMatches.forEach(match => {
            const elementMatch = match.match(/<(\w+)([^>]*)/);
            if (elementMatch) {
                const elementName = elementMatch[1];
                const attrString = elementMatch[2];
                
                // Add element as field
                fields.push(elementName);
                
                // Extract attributes
                const attrMatches = attrString.match(/(\w+)="([^"]+)"/g) || [];
                attrMatches.forEach(attr => {
                    const attrMatch = attr.match(/(\w+)="([^"]+)"/);
                    if (attrMatch) {
                        fields.push(`@${attrMatch[1]}`);
                    }
                });
            }
        });
        
        // Create a simple structure for analysis
        // We just need field names for the requirements analyzer
        const uniqueFields = [...new Set(fields)];
        uniqueFields.forEach((field, index) => {
            if (field.startsWith('@')) {
                result[field] = `attribute_value_${index}`;
            } else {
                result[field] = `element_content_${index}`;
            }
        });
        
        // If we have product elements, simulate array structure
        if (fields.includes('product')) {
            result.catalog = {
                product: [
                    result.product || {},
                    result.product || {}
                ]
            };
        }
        
        return result;
        
    } catch (error) {
        log('ERROR', `XML parsing failed, falling back to simple field extraction: ${error.message}`);
        
        // Fallback: just extract element names as fields
        const simpleFields = (xmlString.match(/<(\w+)/g) || [])
            .map(m => m.replace('<', ''))
            .filter(f => f !== '?xml');
            
        const fallbackResult = {};
        simpleFields.forEach(field => {
            fallbackResult[field] = 'sample_value';
        });
        
        return fallbackResult;
    }
}

// 🆕 File Format Detection
function detectFileFormat(filePath) {
    const extension = path.extname(filePath).toLowerCase();
    
    // 🧞‍♂️ EXCEL DETECTION MAGIC
    if (extension === '.xlsx' || extension === '.xls') {
        return 'excel';
    }
    
    // 🧞‍♂️ DOCUMENT DETECTION MAGIC
    if (extension === '.pdf' || extension === '.docx') {
        return 'document';
    }
    
    const content = fs.readFileSync(filePath, 'utf8').trim();
    
    if (extension === '.xml' || content.startsWith('<?xml') || content.startsWith('<')) {
        return 'xml';
    } else if (extension === '.json' || content.startsWith('{') || content.startsWith('[')) {
        return 'json';
    } else {
        // Try to detect by content
        if (content.includes('<?xml') || (content.includes('<') && content.includes('>'))) {
            return 'xml';
        } else {
            return 'json'; // Default fallback
        }
    }
}

// 🆕 Universal File Parser with Excel and Document Magic
async function parseDataFile(filePath, preserveXmlFormat = false) {
    const format = detectFileFormat(filePath);
    
    // 🧞‍♂️ EXCEL MAGIC: Auto-convert Excel files
    if (format === 'excel') {
        return await handleExcelFile(filePath);
    }
    
    // 🧞‍♂️ DOCUMENT MAGIC: Currently supports PDF only (Word processing removed)
    if (format === 'document') {
        log('WARNING', '📄 Document processing limited to PDF only. Word documents not supported.');
        throw new Error('Word document processing removed. Please convert to PDF or use text format.');
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (format === 'xml') {
        log('ENHANCED', `📄 Processing XML file: ${filePath}`);
        
        // 🎯 SMART XML HANDLING: Distinguish between analysis vs preservation
        const fileName = path.basename(filePath).toLowerCase();
        const isInputOutputExample = fileName.includes('input') || fileName.includes('output') || 
                                   fileName.includes('expected') || fileName.includes('sample') ||
                                   preserveXmlFormat;
        
        if (isInputOutputExample) {
            log('ENHANCED', `📋 Preserving XML format for transformation example: ${fileName}`);
            // Return raw XML content for transformation examples
            return { 
                _xmlContent: content, 
                _isXmlFormat: true,
                _fileName: fileName,
                _preservedForTransformation: true 
            };
        } else {
            log('ENHANCED', `🔍 Converting XML to object structure for analysis: ${fileName}`);
            // Convert to object for structural analysis (mapping sheets, etc.)
            return parseXmlToObject(content);
        }
    } else {
        log('ENHANCED', `📄 Parsing JSON file: ${filePath}`);
        return JSON.parse(content);
    }
}

// 🧞‍♂️ Excel File Handler with Auto-Conversion Magic
async function handleExcelFile(filePath) {
    log('MAGIC', `🧞‍♂️ Excel file detected: ${filePath}`);
    log('INFO', '📊 Attempting automatic Excel conversion...');
    
    try {
        // Check if Excel converter is available
        const converterPath = path.join(__dirname, '../utilities/03-01-13_Excel_Converter.js');
        if (!fs.existsSync(converterPath)) {
            throw new Error('Excel converter not found. Please ensure 03-01-13_Excel_Converter.js is available.');
        }
        
        // Check if exceljs dependency is installed
        let ExcelJS;
        try {
            ExcelJS = require('exceljs');
        } catch (error) {
            log('WARNING', '📦 exceljs library not found. Installing Excel support...');
            log('INFO', '💡 Run: npm install exceljs to enable Excel conversion');
            throw new Error('exceljs library not installed. Run npm install exceljs to enable Excel support.');
        }
        
        // Convert Excel file directly using ExcelJS
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const sheetNames = workbook.worksheets.map(ws => ws.name);
        
        log('DETAIL', `📋 Found ${sheetNames.length} worksheet(s): ${sheetNames.join(', ')}`);
        
        // Use first non-empty sheet or sheet named 'mapping'/'data'
        let targetWorksheet = workbook.worksheets[0];
        const preferredNames = ['mapping', 'map', 'data', 'sheet1'];
        for (const preferred of preferredNames) {
            const found = workbook.worksheets.find(ws => ws.name.toLowerCase().includes(preferred.toLowerCase()));
            if (found) {
                targetWorksheet = found;
                break;
            }
        }
        
        log('SUCCESS', `📄 Using worksheet: ${targetWorksheet.name}`);
        
        // Convert worksheet to JSON using ExcelJS
        const jsonData = [];
        targetWorksheet.eachRow((row, rowIndex) => {
            const rowData = [];
            row.eachCell((cell, colIndex) => {
                rowData[colIndex - 1] = cell.value;
            });
            jsonData.push(rowData);
        });
        
        if (jsonData.length === 0) {
            throw new Error(`Worksheet '${targetWorksheet.name}' is empty`);
        }
        
        // If it looks like a mapping sheet, return as mapping data
        if (isMappingSheetData(jsonData)) {
            log('MAGIC', '🎯 Detected mapping sheet format');
            return {
                _excelMappingSheet: true,
                _originalFile: filePath,
                _worksheetName: targetWorksheet.name,
                mappings: jsonData,
                headers: jsonData[0] || [],
                data: jsonData.slice(1)
            };
        } else {
            // Convert to structured object for regular data analysis
            const headers = jsonData[0] || [];
            const data = jsonData.slice(1);
            
            if (data.length === 0) {
                throw new Error('No data rows found in Excel sheet');
            }
            
            // Convert to object format
            const structuredData = data.map(row => {
                const obj = {};
                headers.forEach((header, index) => {
                    if (header && header.trim()) {
                        obj[header.trim()] = row[index] || null;
                    }
                });
                return obj;
            });
            
            log('SUCCESS', `✨ Converted ${structuredData.length} rows from Excel`);
            
            // Return first row as sample or array if multiple rows
            return structuredData.length === 1 ? structuredData[0] : structuredData;
        }
        
    } catch (error) {
        log('ERROR', `❌ Excel conversion failed: ${error.message}`);
        log('INFO', '💡 SOLUTIONS:');
        log('INFO', '   1. Run: ./temp/install-r-genie.sh');
        log('INFO', '   2. Manually convert Excel to CSV/JSON');
                        log('INFO', '   3. Use: node 03-01-13_Excel_Converter.js yourfile.xlsx --json-only');
        
        throw new Error(`Excel file conversion failed: ${error.message}`);
    }
}

// Helper function to detect if Excel data is a mapping sheet
function isMappingSheetData(jsonData) {
    if (jsonData.length < 2) return false;
    
    const headers = jsonData[0] || [];
    const mappingKeywords = [
        'source', 'target', 'input', 'output', 'field', 'column', 
        'mapping', 'transformation', 'dataweave', 'path'
    ];
    
    const mappingHeaderCount = headers.filter(header => 
        typeof header === 'string' && 
        mappingKeywords.some(keyword => 
            header.toLowerCase().includes(keyword)
        )
    ).length;
    
    return mappingHeaderCount >= 2; // At least 2 mapping-related headers
}

// Document files not supported - convert externally to JSON/XML/text
function handleDocumentFile(filePath) {
    const extension = path.extname(filePath).toLowerCase();
    log('WARNING', `📄 Document file detected: ${filePath}`);
    log('INFO', '💡 DataWeave transforms structured data (JSON, XML, CSV, Excel).');
    log('INFO', '💡 Please convert your document to a supported format:');
    log('INFO', '   - JSON or XML for data transformation');
    log('INFO', '   - Text/Markdown for requirements (paste content directly)');
    throw new Error(`Unsupported format: ${extension}. Convert to JSON, XML, CSV, or Excel.`);
}

// Analyze document content for technical patterns
function analyzeDocumentContent(text) {
    const lowerText = text.toLowerCase();
    
    const technicalKeywords = [
        'requirement', 'specification', 'architecture', 'design', 'system',
        'integration', 'api', 'database', 'connector', 'transformation',
        'mulesoft', 'dataweave', 'flow', 'endpoint', 'protocol',
        'security', 'authentication', 'deployment', 'configuration',
        'testing', 'validation', 'performance', 'monitoring'
    ];
    
    const foundKeywords = technicalKeywords.filter(keyword => 
        lowerText.includes(keyword.toLowerCase())
    );
    
    const technicalScore = foundKeywords.length / technicalKeywords.length;
    
    // Document type detection
    let documentType = 'general_document';
    if (lowerText.includes('requirement') && lowerText.includes('specification')) {
        documentType = 'requirements_specification';
    } else if (lowerText.includes('architecture') && lowerText.includes('design')) {
        documentType = 'technical_design';
    } else if (lowerText.includes('api') && lowerText.includes('integration')) {
        documentType = 'integration_specification';
    } else if (technicalScore > 0.3) {
        documentType = 'technical_document';
    }
    
    // Extract potential requirements
    const lines = text.split('\n');
    const requirementPatterns = [
        /^.*\b(must|shall|will|should|requirement|required)\b.*$/i,
        /^.*\b(api|integration|connector|database|system)\b.*$/i,
        /^.*\b(mulesoft|dataweave|cloudhub|anypoint)\b.*$/i
    ];
    
    const requirements = [];
    lines.forEach(line => {
        const cleanLine = line.trim();
        if (cleanLine.length >= 20 && cleanLine.length <= 200) {
            requirementPatterns.forEach(pattern => {
                if (pattern.test(cleanLine) && !requirements.includes(cleanLine)) {
                    requirements.push(cleanLine);
                }
            });
        }
    });
    
    // Simple section detection
    const sections = [];
    let currentSection = null;
    
    lines.forEach((line, index) => {
        const cleanLine = line.trim();
        if (cleanLine.length === 0) return;
        
        // Detect potential section headers
        if (isPotentialSectionHeader(cleanLine)) {
            if (currentSection) {
                sections.push(currentSection);
            }
            currentSection = {
                title: cleanLine,
                startLine: index,
                content: []
            };
        } else if (currentSection) {
            currentSection.content.push(cleanLine);
        }
    });
    
    if (currentSection) {
        sections.push(currentSection);
    }
    
    return {
        type: documentType,
        technicalScore,
        keywords: foundKeywords,
        requirements: requirements.slice(0, 20), // Limit to first 20 requirements
        sections: sections.slice(0, 10) // Limit to first 10 sections
    };
}

// Helper function to detect section headers
function isPotentialSectionHeader(line) {
    if (line.length > 100) return false; // Too long to be a header
    
    const headerPatterns = [
        /^\d+\.\s+/,           // "1. Introduction"
        /^[A-Z\s]+$/,          // "REQUIREMENTS OVERVIEW"
        /^#{1,6}\s+/,          // "## Section"
        /^\*\*.*\*\*$/,        // "**Bold Header**"
        /^[A-Z][^.!?]*:$/,     // "Introduction:"
        /^\d+\.\d+\s+/,        // "1.1 Subsection"
    ];
    
    return headerPatterns.some(pattern => pattern.test(line));
}

// Shared color codes
const { colors } = require('../utilities/colors.js');

function log(level, message) {
    const timestamp = new Date().toISOString();
    const levelColors = {
        'INFO': colors.cyan,
        'SUCCESS': colors.green,
        'WARNING': colors.yellow,
        'ERROR': colors.red,
        'DETAIL': colors.blue,
        'ENHANCED': colors.magenta
    };
    
    const color = levelColors[level] || colors.reset;
    console.log(`${color}[${level}]${colors.reset} ${message}`);
}

// 🆕 ENHANCED: Business Domain Detection
function detectBusinessDomain(inputAnalysis, outputAnalysis, transformationNotes = '') {
    const domains = {
        healthcare: 0,
        financial: 0,
        ecommerce: 0,
        supply_chain: 0,
        procurement: 0,
        logistics: 0,
        general: 0
    };

    const allFields = [...inputAnalysis.fields, ...outputAnalysis.fields].join(' ').toLowerCase();
    const notes = transformationNotes.toLowerCase();
    const allText = allFields + ' ' + notes;

    // Healthcare indicators
    const healthcareTerms = [
        'patient', 'visit', 'diagnosis', 'medication', 'vital', 'bmi', 'blood', 'heart',
        'medical', 'clinical', 'treatment', 'procedure', 'symptoms', 'age', 'weight', 'height'
    ];
    domains.healthcare = healthcareTerms.filter(term => allText.includes(term)).length;

    // Financial indicators (Enhanced)
    const financialTerms = [
        'transaction', 'balance', 'amount', 'currency', 'payment', 'fee', 'cost', 'price',
        'deposit', 'withdrawal', 'account', 'exchange', 'rate', 'tax', 'revenue',
        'invoice', 'credit', 'debit', 'ledger', 'accounting', 'budget', 'expense',
        'profit', 'loss', 'asset', 'liability', 'equity', 'cash', 'finance'
    ];
    domains.financial = financialTerms.filter(term => allText.includes(term)).length;

    // E-commerce/Commerce indicators (Enhanced)
    const ecommerceTerms = [
        'product', 'order', 'cart', 'inventory', 'shipping', 'category', 'seller', 'buyer',
        'purchase', 'discount', 'coupon', 'review', 'rating', 'stock', 'customer',
        'sales', 'marketplace', 'checkout', 'payment', 'subscription', 'catalog',
        'sku', 'warehouse', 'fulfillment', 'return', 'refund', 'merchant'
    ];
    domains.ecommerce = ecommerceTerms.filter(term => allText.includes(term)).length;

    // Supply Chain indicators (New)
    const supplyChainTerms = [
        'supplier', 'vendor', 'shipment', 'delivery', 'logistics', 'warehouse', 'distribution',
        'manufacturing', 'production', 'forecast', 'demand', 'supply', 'lead', 'time',
        'quality', 'inspection', 'batch', 'lot', 'tracking', 'traceability', 'chain',
        'upstream', 'downstream', 'bottleneck', 'capacity', 'throughput'
    ];
    domains.supply_chain = supplyChainTerms.filter(term => allText.includes(term)).length;

    // Procurement indicators (New)
    const procurementTerms = [
        'procurement', 'sourcing', 'vendor', 'supplier', 'contract', 'agreement', 'tender',
        'bid', 'rfp', 'rfq', 'quote', 'requisition', 'approval', 'authorization',
        'compliance', 'audit', 'specification', 'requirement', 'criteria', 'evaluation',
        'selection', 'negotiation', 'terms', 'conditions', 'sla', 'kpi'
    ];
    domains.procurement = procurementTerms.filter(term => allText.includes(term)).length;

    // Determine primary domain
    const primaryDomain = Object.keys(domains).reduce((a, b) => domains[a] > domains[b] ? a : b);
    
    // Get detected terms for the primary domain
    const getDetectedTerms = (domain) => {
        switch(domain) {
            case 'healthcare': return healthcareTerms.filter(term => allText.includes(term));
            case 'financial': return financialTerms.filter(term => allText.includes(term));
            case 'ecommerce': return ecommerceTerms.filter(term => allText.includes(term));
            case 'supply_chain': return supplyChainTerms.filter(term => allText.includes(term));
            case 'procurement': return procurementTerms.filter(term => allText.includes(term));
            default: return [];
        }
    };

    return {
        primaryDomain,
        confidence: Math.max(...Object.values(domains)) / 5, // Normalized confidence
        scores: domains,
        detectedTerms: getDetectedTerms(primaryDomain)
    };
}

// 🆕 ENHANCED: Business Rule Extraction from Notes
function extractBusinessRules(transformationNotes = '') {
    const rules = [];
    const calculations = [];
    const requirements = [];

    if (!transformationNotes) return { rules, calculations, requirements };

    const lines = transformationNotes.split('\n').map(line => line.trim());
    
    lines.forEach(line => {
        if (line.includes('calculate') || line.includes('determine')) {
            calculations.push(line.replace(/^[•*-]\s*/, ''));
        } else if (line.includes('analyze') || line.includes('identify')) {
            rules.push(line.replace(/^[•*-]\s*/, ''));
        } else if (line.includes('include') || line.includes('must') || line.includes('should')) {
            requirements.push(line.replace(/^[•*-]\s*/, ''));
        }
    });

    return { rules, calculations, requirements };
}

// 🆕 ENHANCED: Domain-Specific Calculation Detection
function detectCalculationPatterns(inputAnalysis, outputAnalysis, domain) {
    const patterns = [];
    const recommendations = [];

    // Get ALL fields from all data types for comprehensive detection (used by all domains)
    const getAllFields = (analysis) => [
        ...analysis.fields,
        ...analysis.dataTypes.strings,
        ...analysis.dataTypes.numbers,
        ...analysis.dataTypes.booleans,
        ...analysis.dataTypes.arrays,
        ...analysis.dataTypes.objects,
        ...analysis.dataTypes.dates
    ];
    
    const allInputFields = getAllFields(inputAnalysis).join(' ').toLowerCase();
    const allOutputFields = getAllFields(outputAnalysis).join(' ').toLowerCase();

    // Healthcare-specific patterns
    if (domain === 'healthcare') {
        
        if ((inputAnalysis.dataTypes.dates.some(field => field.toLowerCase().includes('birth')) ||
             allInputFields.includes('dateofbirth')) &&
            (outputAnalysis.dataTypes.numbers.some(field => field.toLowerCase().includes('age')) ||
             allOutputFields.includes('age'))) {
            patterns.push({
                type: 'age_calculation',
                description: 'Dynamic age calculation from birth date',
                riskLevel: 'HIGH',
                recommendation: 'Use now() function for current date - avoid hardcoding dates',
                detectedFields: {
                    birthDate: inputAnalysis.dataTypes.dates.filter(f => f.toLowerCase().includes('birth')),
                    ageField: outputAnalysis.fields.filter(f => f.toLowerCase().includes('age'))
                }
            });
        }

        // BMI calculation pattern - improved detection
        if ((allInputFields.includes('weight') && allInputFields.includes('height')) &&
            allOutputFields.includes('bmi')) {
            patterns.push({
                type: 'bmi_calculation',
                description: 'BMI calculation from weight and height',
                riskLevel: 'MEDIUM',
                recommendation: 'Formula: weight / ((height/100) * (height/100))',
                detectedFields: {
                    weight: inputAnalysis.fields.filter(f => f.toLowerCase().includes('weight')),
                    height: inputAnalysis.fields.filter(f => f.toLowerCase().includes('height')),
                    bmi: outputAnalysis.fields.filter(f => f.toLowerCase().includes('bmi'))
                }
            });
        }

        // Trend analysis pattern - improved detection
        if (inputAnalysis.dataTypes.arrays.length > 0 &&
            allOutputFields.includes('trend')) {
            patterns.push({
                type: 'trend_analysis',
                description: 'Trend analysis between multiple data points',
                riskLevel: 'HIGH',
                recommendation: 'Define proper threshold for STABLE vs IMPROVING/WORSENING',
                detectedFields: {
                    arrays: inputAnalysis.dataTypes.arrays,
                    trends: outputAnalysis.fields.filter(f => f.toLowerCase().includes('trend'))
                }
            });
        }

        // Chronic condition detection pattern
        if (allInputFields.includes('diagnosis') && allOutputFields.includes('chronic')) {
            patterns.push({
                type: 'chronic_condition_detection',
                description: 'Chronic condition identification from diagnosis codes',
                riskLevel: 'MEDIUM',
                recommendation: 'Use diagnosis code patterns and medical terminology matching'
            });
        }

        // Risk assessment pattern
        if (allInputFields.includes('vital') && allOutputFields.includes('risk')) {
            patterns.push({
                type: 'risk_assessment',
                description: 'Medical risk factor calculation from vitals',
                riskLevel: 'HIGH',
                recommendation: 'Use medical standards for risk thresholds and calculations'
            });
        }
    }

    // Financial-specific patterns (Enhanced)
    if (domain === 'financial') {
        // Currency conversion pattern
        if (allInputFields.includes('rate') || allInputFields.includes('exchange')) {
            patterns.push({
                type: 'currency_conversion',
                description: 'Currency conversion calculations',
                riskLevel: 'HIGH',
                recommendation: 'Use dynamic exchange rates - avoid hardcoded rates'
            });
        }

        // Financial aggregation pattern
        if (allInputFields.includes('amount') && allOutputFields.includes('total')) {
            patterns.push({
                type: 'financial_aggregation',
                description: 'Financial amount aggregation and totals',
                riskLevel: 'MEDIUM',
                recommendation: 'Use sumBy for financial totals with proper rounding: round(total * 100) / 100'
            });
        }

        // Tax calculation pattern
        if (allInputFields.includes('amount') && allOutputFields.includes('tax')) {
            patterns.push({
                type: 'tax_calculation',
                description: 'Tax calculation on financial amounts',
                riskLevel: 'HIGH',
                recommendation: 'Use dynamic tax rates based on jurisdiction - avoid hardcoded percentages'
            });
        }

        // Accounting reconciliation pattern
        if (allInputFields.includes('debit') && allInputFields.includes('credit')) {
            patterns.push({
                type: 'accounting_reconciliation',
                description: 'Debit/Credit reconciliation and balance calculations',
                riskLevel: 'HIGH',
                recommendation: 'Ensure debits equal credits in accounting entries'
            });
        }
    }

    // E-commerce/Commerce-specific patterns (Enhanced)
    if (domain === 'ecommerce') {
        // Order total calculation pattern
        if (allInputFields.includes('price') && allInputFields.includes('quantity') &&
            allOutputFields.includes('total')) {
            patterns.push({
                type: 'order_total_calculation',
                description: 'Order total calculation from item prices and quantities',
                riskLevel: 'MEDIUM',
                recommendation: 'Use sumBy for aggregation: sumBy(items, (item) -> item.price * item.quantity)'
            });
        }
        
        // Discount calculation pattern
        if (allInputFields.includes('discount') && allOutputFields.includes('final')) {
            patterns.push({
                type: 'discount_calculation', 
                description: 'Discount and final price calculations',
                riskLevel: 'MEDIUM',
                recommendation: 'Apply discounts correctly: originalPrice - discount OR originalPrice * (1 - discountPercent)'
            });
        }
        
        // Inventory management pattern
        if (allInputFields.includes('stock') && allOutputFields.includes('available')) {
            patterns.push({
                type: 'inventory_calculation',
                description: 'Inventory availability and stock calculations',
                riskLevel: 'MEDIUM',
                recommendation: 'Track stock levels accurately: available = stock - reserved - pending'
            });
        }

        // Shipping cost calculation
        if (allInputFields.includes('weight') && allOutputFields.includes('shipping')) {
            patterns.push({
                type: 'shipping_calculation',
                description: 'Shipping cost calculation based on weight/distance',
                riskLevel: 'MEDIUM',
                recommendation: 'Use dynamic shipping rates based on carrier APIs'
            });
        }
    }

    // Supply Chain-specific patterns (New)
    if (domain === 'supply_chain') {
        // Lead time calculation pattern
        if (allInputFields.includes('order') && allInputFields.includes('delivery') &&
            allOutputFields.includes('lead')) {
            patterns.push({
                type: 'lead_time_calculation',
                description: 'Lead time calculation from order to delivery',
                riskLevel: 'MEDIUM',
                recommendation: 'Calculate lead time in business days: deliveryDate - orderDate'
            });
        }

        // Demand forecasting pattern
        if (allInputFields.includes('demand') && allOutputFields.includes('forecast')) {
            patterns.push({
                type: 'demand_forecasting',
                description: 'Demand forecasting and planning calculations',
                riskLevel: 'HIGH',
                recommendation: 'Use historical data patterns for accurate forecasting'
            });
        }

        // Inventory optimization pattern
        if (allInputFields.includes('inventory') && allOutputFields.includes('optimal')) {
            patterns.push({
                type: 'inventory_optimization',
                description: 'Optimal inventory level calculations',
                riskLevel: 'HIGH',
                recommendation: 'Consider demand variability and lead times in optimization'
            });
        }

        // Quality metrics pattern
        if (allInputFields.includes('quality') && allOutputFields.includes('score')) {
            patterns.push({
                type: 'quality_scoring',
                description: 'Quality score and metrics calculations',
                riskLevel: 'MEDIUM',
                recommendation: 'Use weighted scoring for multiple quality criteria'
            });
        }
    }

    // Procurement-specific patterns (New)
    if (domain === 'procurement') {
        // Vendor scoring pattern
        if (allInputFields.includes('vendor') && allOutputFields.includes('score')) {
            patterns.push({
                type: 'vendor_scoring',
                description: 'Vendor evaluation and scoring calculations',
                riskLevel: 'MEDIUM',
                recommendation: 'Use weighted criteria for vendor assessment: price, quality, delivery'
            });
        }

        // Cost analysis pattern
        if (allInputFields.includes('cost') && allOutputFields.includes('total')) {
            patterns.push({
                type: 'procurement_cost_analysis',
                description: 'Total cost of ownership calculations',
                riskLevel: 'HIGH',
                recommendation: 'Include all costs: purchase price + shipping + taxes + handling'
            });
        }

        // Contract compliance pattern
        if (allInputFields.includes('contract') && allOutputFields.includes('compliance')) {
            patterns.push({
                type: 'contract_compliance',
                description: 'Contract terms compliance verification',
                riskLevel: 'HIGH',
                recommendation: 'Check all contract terms: delivery dates, quantities, specifications'
            });
        }

        // Approval workflow pattern
        if (allInputFields.includes('approval') && allOutputFields.includes('status')) {
            patterns.push({
                type: 'approval_workflow',
                description: 'Procurement approval workflow processing',
                riskLevel: 'MEDIUM',
                recommendation: 'Implement proper approval hierarchies and thresholds'
            });
        }
    }

    return patterns;
}

// 🆕 ENHANCED: Accuracy Risk Assessment
function assessAccuracyRisks(inputAnalysis, outputAnalysis, calculationPatterns, businessRules) {
    const risks = [];
    
    // Dynamic date calculation risk
    if (calculationPatterns.some(p => p.type === 'age_calculation')) {
        risks.push({
            category: 'dynamic_calculations',
            risk: 'Age calculations using current date may not match static expected output',
            severity: 'HIGH',
            impact: 'Output accuracy may be <100% due to dynamic date behavior (75-80% typical)',
            mitigation: 'Business Logic Priority - Accept accuracy variance for dynamic correctness',
            technicalDetails: 'Dynamic age calculation using now() provides real-world accuracy but varies from static test dates'
        });
    }

    // BMI calculation accuracy risk
    if (calculationPatterns.some(p => p.type === 'bmi_calculation')) {
        risks.push({
            category: 'calculation_precision',
            risk: 'BMI calculations may have rounding differences',
            severity: 'LOW',
            impact: 'Minor decimal variations in BMI values',
            mitigation: 'Use consistent rounding: round(bmi * 100) / 100'
        });
    }

    // Trend analysis threshold risk
    if (calculationPatterns.some(p => p.type === 'trend_analysis')) {
        risks.push({
            category: 'business_logic_sensitivity',
            risk: 'Trend classification sensitive to threshold selection',
            severity: 'MEDIUM',
            impact: 'STABLE vs IMPROVING classifications may vary with threshold changes',
            mitigation: 'Test threshold values (3-5%) against medical standards'
        });
    }

    // Complex trend analysis risk
    if (calculationPatterns.some(p => p.type === 'trend_analysis')) {
        risks.push({
            category: 'business_logic',
            risk: 'Trend analysis threshold sensitivity may cause accuracy variations',
            severity: 'MEDIUM',
            impact: 'Threshold selection affects STABLE vs IMPROVING classification',
            mitigation: 'Fine-tune thresholds based on domain requirements'
        });
    }

    // Financial-specific risks
    if (calculationPatterns.some(p => p.type === 'currency_conversion')) {
        risks.push({
            category: 'dynamic_calculations',
            risk: 'Currency exchange rates change frequently',
            severity: 'HIGH',
            impact: 'Hardcoded rates cause immediate accuracy failures',
            mitigation: 'Use live exchange rate APIs or dynamic rate lookup tables'
        });
    }

    if (calculationPatterns.some(p => p.type === 'tax_calculation')) {
        risks.push({
            category: 'regulatory_compliance',
            risk: 'Tax rates vary by jurisdiction and change over time',
            severity: 'HIGH',
            impact: 'Incorrect tax calculations affect compliance and accuracy',
            mitigation: 'Use jurisdiction-based tax calculation services'
        });
    }

    if (calculationPatterns.some(p => p.type === 'accounting_reconciliation')) {
        risks.push({
            category: 'business_logic_critical',
            risk: 'Accounting reconciliation must balance exactly',
            severity: 'HIGH',
            impact: 'Unbalanced entries cause audit failures',
            mitigation: 'Implement strict debit/credit balance validation'
        });
    }

    // E-commerce-specific risks
    if (calculationPatterns.some(p => p.type === 'order_total_calculation')) {
        risks.push({
            category: 'calculation_precision',
            risk: 'Order total rounding differences in multi-item calculations',
            severity: 'MEDIUM',
            impact: 'Minor decimal variations in order totals',
            mitigation: 'Use consistent currency rounding: round(total * 100) / 100'
        });
    }

    if (calculationPatterns.some(p => p.type === 'inventory_calculation')) {
        risks.push({
            category: 'business_logic',
            risk: 'Inventory calculations must reflect real-time stock levels',
            severity: 'HIGH',
            impact: 'Overselling or underselling due to incorrect availability',
            mitigation: 'Use real-time inventory systems and proper reservation logic'
        });
    }

    // Supply Chain-specific risks
    if (calculationPatterns.some(p => p.type === 'demand_forecasting')) {
        risks.push({
            category: 'predictive_analytics',
            risk: 'Demand forecasting accuracy depends on historical data quality',
            severity: 'HIGH',
            impact: 'Poor forecasts lead to stockouts or excess inventory',
            mitigation: 'Use multiple forecasting models and validate against actual demand'
        });
    }

    if (calculationPatterns.some(p => p.type === 'lead_time_calculation')) {
        risks.push({
            category: 'temporal_calculations',
            risk: 'Lead time calculations must account for business days and holidays',
            severity: 'MEDIUM',
            impact: 'Incorrect delivery estimates affect customer satisfaction',
            mitigation: 'Use business calendar functions and consider seasonal variations'
        });
    }

    // Procurement-specific risks
    if (calculationPatterns.some(p => p.type === 'vendor_scoring')) {
        risks.push({
            category: 'business_logic_weighting',
            risk: 'Vendor scoring weights must reflect business priorities',
            severity: 'MEDIUM',
            impact: 'Suboptimal vendor selection due to incorrect scoring',
            mitigation: 'Validate scoring criteria with procurement stakeholders'
        });
    }

    if (calculationPatterns.some(p => p.type === 'contract_compliance')) {
        risks.push({
            category: 'compliance_critical',
            risk: 'Contract compliance verification must be comprehensive',
            severity: 'HIGH',
            impact: 'Missed compliance issues lead to contract disputes',
            mitigation: 'Implement complete contract term validation and exception reporting'
        });
    }

    // Multiple array processing risk
    if (inputAnalysis.dataTypes.arrays.length > 2) {
        risks.push({
            category: 'complexity',
            risk: 'Multiple array processing increases complexity and error potential',
            severity: 'MEDIUM',
            impact: 'Higher chance of mapping errors and performance issues',
            mitigation: 'Use utility functions and careful array processing order'
        });
    }

    return risks;
}

// 🆕 ENHANCED: Validation Strategy Recommendation
function recommendValidationStrategy(complexity, domain, accuracyRisks) {
    const strategy = {
        primaryApproach: 'smart_orchestration',
        specificModes: [],
        criticalChecks: [],
        fallbackProcedures: []
    };

    // Base on complexity
    if (complexity === 'Advanced') {
        strategy.specificModes.push('validate'); // Full accuracy validation required
        strategy.criticalChecks.push('100% accuracy verification mandatory');
    } else {
        strategy.specificModes.push('quick'); // Fast validation acceptable
    }

    // Domain-specific validation strategies
    if (domain === 'healthcare') {
        strategy.criticalChecks.push('Dynamic age calculation verification');
        strategy.criticalChecks.push('Medical calculation accuracy');
        strategy.criticalChecks.push('BMI and vital signs calculation validation');
        strategy.fallbackProcedures.push('Business Logic Priority for dynamic dates');
    }

    if (domain === 'financial') {
        strategy.criticalChecks.push('Currency conversion accuracy verification');
        strategy.criticalChecks.push('Financial aggregation precision');
        strategy.criticalChecks.push('Tax calculation compliance');
        strategy.criticalChecks.push('Accounting balance validation (debits = credits)');
        strategy.fallbackProcedures.push('Live exchange rate validation for currency conversions');
        strategy.fallbackProcedures.push('Tax authority compliance verification');
    }

    if (domain === 'ecommerce') {
        strategy.criticalChecks.push('Order total calculation accuracy');
        strategy.criticalChecks.push('Discount application verification');
        strategy.criticalChecks.push('Inventory availability validation');
        strategy.criticalChecks.push('Shipping cost calculation accuracy');
        strategy.fallbackProcedures.push('Real-time inventory system integration');
        strategy.fallbackProcedures.push('Currency precision handling for order totals');
    }

    if (domain === 'supply_chain') {
        strategy.criticalChecks.push('Lead time calculation accuracy');
        strategy.criticalChecks.push('Demand forecasting validation');
        strategy.criticalChecks.push('Inventory optimization verification');
        strategy.criticalChecks.push('Quality scoring consistency');
        strategy.fallbackProcedures.push('Business calendar validation for lead times');
        strategy.fallbackProcedures.push('Historical data quality assessment');
    }

    if (domain === 'procurement') {
        strategy.criticalChecks.push('Vendor scoring calculation verification');
        strategy.criticalChecks.push('Total cost of ownership accuracy');
        strategy.criticalChecks.push('Contract compliance validation');
        strategy.criticalChecks.push('Approval workflow integrity');
        strategy.fallbackProcedures.push('Vendor criteria stakeholder validation');
        strategy.fallbackProcedures.push('Contract term completeness verification');
    }

    // Risk-based additions
    const highRisks = accuracyRisks.filter(risk => risk.severity === 'HIGH');
    if (highRisks.length > 0) {
        strategy.criticalChecks.push('Manual accuracy validation required');
        strategy.fallbackProcedures.push('Prepare for Business Logic Priority analysis');
    }

    return strategy;
}

// 🆕 ENHANCED: Performance Considerations
function analyzePerformanceFactors(inputAnalysis, outputAnalysis) {
    const factors = [];
    
    const totalFields = inputAnalysis.totalFields + outputAnalysis.totalFields;
    if (totalFields > 50) {
        factors.push({
            factor: 'high_field_count',
            impact: 'Increased processing time',
            recommendation: 'Consider utility functions for repeated operations'
        });
    }

    const maxArrayDepth = Math.max(...inputAnalysis.dataTypes.arrays.map(arr => 
        (arr.match(/\[/g) || []).length
    ));
    if (maxArrayDepth > 2) {
        factors.push({
            factor: 'deep_array_nesting',
            impact: 'Complex selector patterns required',
            recommendation: 'Use flatten() or pluck() for simplification'
        });
    }

    return factors;
}

// 🆕 ENHANCED: Error Prevention Patterns
function identifyErrorPronePatterns(inputAnalysis, outputAnalysis) {
    const patterns = [];

    // Reserved keyword usage
    const reservedFields = detectReservedKeywords([...inputAnalysis.fields, ...outputAnalysis.fields]);
    if (reservedFields.length > 0) {
        patterns.push({
            pattern: 'reserved_keywords',
            description: `${reservedFields.length} reserved keywords detected`,
            prevention: 'Use quoted field access: payload."type" instead of payload.type'
        });
    }

    // Type conversion risks
    const stringNumbers = inputAnalysis.dataTypes.strings.filter(field => 
        field.includes('id') || field.includes('code') || field.includes('number')
    );
    if (stringNumbers.length > 0) {
        patterns.push({
            pattern: 'type_conversion_risk',
            description: 'String fields that might need numeric conversion',
            prevention: 'Use safe conversion with default operators: field as Number default null (R-Genie Production Safety)'
        });
    }

    return patterns;
}

// WORKING detailed structure analysis (copied from original analyzer)
function analyzeStructureDetailed(data, prefix = '', depth = 0) {
    // 🎯 HANDLE PRESERVED XML FORMAT: Check if this is preserved XML content
    if (data && data._isXmlFormat && data._xmlContent) {
        log('ENHANCED', `📋 Analyzing preserved XML structure for: ${data._fileName}`);
        // For preserved XML, parse structure for analysis but preserve original format
        const xmlStructure = parseXmlToObject(data._xmlContent);
        // Continue with normal analysis but mark as XML
        const xmlAnalysis = analyzeStructureDetailed(xmlStructure, prefix, depth);
        xmlAnalysis._isPreservedXml = true;
        xmlAnalysis._originalXmlContent = data._xmlContent;
        xmlAnalysis._fileName = data._fileName;
        return xmlAnalysis;
    }

    const analysis = {
        fields: [],
        dataTypes: {
            strings: [],
            numbers: [],
            booleans: [],
            arrays: [],
            objects: [],
            dates: []
        },
        nestedDepth: depth,
        totalFields: 0
    };

    for (const [key, value] of Object.entries(data)) {
        const fieldPath = prefix ? `${prefix}.${key}` : key;
        analysis.fields.push(fieldPath);
        analysis.totalFields++;

        if (Array.isArray(value)) {
            analysis.dataTypes.arrays.push(fieldPath);
            if (value.length > 0) {
                const itemAnalysis = analyzeStructureDetailed(value[0], `${fieldPath}[0]`, depth + 1);
                analysis.nestedDepth = Math.max(analysis.nestedDepth, itemAnalysis.nestedDepth);
                analysis.totalFields += itemAnalysis.totalFields;
                // Merge nested field types
                Object.keys(itemAnalysis.dataTypes).forEach(type => {
                    analysis.dataTypes[type] = [...analysis.dataTypes[type], ...itemAnalysis.dataTypes[type]];
                });
            }
        } else if (typeof value === 'object' && value !== null) {
            analysis.dataTypes.objects.push(fieldPath);
            const objAnalysis = analyzeStructureDetailed(value, fieldPath, depth + 1);
            analysis.nestedDepth = Math.max(analysis.nestedDepth, objAnalysis.nestedDepth);
            analysis.totalFields += objAnalysis.totalFields;
            // Merge nested field types
            Object.keys(objAnalysis.dataTypes).forEach(type => {
                analysis.dataTypes[type] = [...analysis.dataTypes[type], ...objAnalysis.dataTypes[type]];
            });
        } else if (typeof value === 'string') {
            // Check if it's a date string
            if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
                analysis.dataTypes.dates.push(fieldPath);
            } else {
                analysis.dataTypes.strings.push(fieldPath);
            }
        } else if (typeof value === 'number') {
            analysis.dataTypes.numbers.push(fieldPath);
        } else if (typeof value === 'boolean') {
            analysis.dataTypes.booleans.push(fieldPath);
        }
    }

    return analysis;
}

// Simplified structure analysis for domain detection (top-level only)
function analyzeStructure(data, prefix = '', depth = 0) {
    // 🎯 HANDLE PRESERVED XML FORMAT: Check if this is preserved XML content
    if (data && data._isXmlFormat && data._xmlContent) {
        log('ENHANCED', `📋 Analyzing preserved XML structure for: ${data._fileName}`);
        // For preserved XML, parse structure for analysis but preserve original format
        const xmlStructure = parseXmlToObject(data._xmlContent);
        // Continue with normal analysis but mark as XML
        const xmlAnalysis = analyzeStructure(xmlStructure, prefix, depth);
        xmlAnalysis._isPreservedXml = true;
        xmlAnalysis._originalXmlContent = data._xmlContent;
        xmlAnalysis._fileName = data._fileName;
        return xmlAnalysis;
    }

    const analysis = {
        fields: [],
        dataTypes: {
            strings: [],
            numbers: [],
            booleans: [],
            arrays: [],
            objects: [],
            dates: []
        },
        nestedDepth: depth,
        totalFields: 0
    };

    for (const [key, value] of Object.entries(data)) {
        const fieldPath = prefix ? `${prefix}.${key}` : key;
        analysis.fields.push(fieldPath);
        analysis.totalFields++;

        if (Array.isArray(value)) {
            analysis.dataTypes.arrays.push(fieldPath);
        } else if (typeof value === 'object' && value !== null) {
            analysis.dataTypes.objects.push(fieldPath);
        } else if (typeof value === 'string') {
            if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
                analysis.dataTypes.dates.push(fieldPath);
            } else {
                analysis.dataTypes.strings.push(fieldPath);
            }
        } else if (typeof value === 'number') {
            analysis.dataTypes.numbers.push(fieldPath);
        } else if (typeof value === 'boolean') {
            analysis.dataTypes.booleans.push(fieldPath);
        }
    }

    return analysis;
}

function detectReservedKeywords(fields) {
    const reservedWords = [
        'if', 'else', 'unless', 'using', 'as', 'is', 'null', 'true', 'false',
        'default', 'case', 'fun', 'input', 'output', 'ns', 'type', 'import',
        'var', 'and', 'or', 'throw', 'do', 'for', 'yield', 'enum', 'private', 'async'
    ];
    
    return fields.filter(field => {
        const fieldName = field.split('.').pop().split('[')[0];
        return reservedWords.includes(fieldName.toLowerCase());
    });
}

// 🆕 ENHANCED: Main analysis function with all new capabilities
async function performEnhancedAnalysis(inputFile, expectedOutputFile, transformationNotesFile = null) {
    // Read transformation notes if available
    let transformationNotes = '';
    if (transformationNotesFile && fs.existsSync(transformationNotesFile)) {
        transformationNotes = fs.readFileSync(transformationNotesFile, 'utf8');
        log('ENHANCED', `📝 Transformation notes loaded from: ${transformationNotesFile}`);
    }

    // Read and parse files (supports both JSON and XML)
    log('INFO', '📖 Reading and parsing input files...');
    // 🎯 PRESERVE XML FORMAT: For input/output examples, preserve XML format for transformations
    const inputData = await parseDataFile(inputFile, true); // preserveXmlFormat = true for input examples
    const expectedOutputData = await parseDataFile(expectedOutputFile, true); // preserveXmlFormat = true for output examples

    // Analyze structures using the original detailed analyzer
    log('INFO', '🔍 Analyzing input structure...');
    const inputAnalysis = analyzeStructureDetailed(inputData);
    
    log('INFO', '🔍 Analyzing expected output structure...');
    const outputAnalysis = analyzeStructureDetailed(expectedOutputData);

    // 🆕 Enhanced analysis capabilities
    log('ENHANCED', '🎯 Detecting business domain...');
    const domainAnalysis = detectBusinessDomain(inputAnalysis, outputAnalysis, transformationNotes);

    log('ENHANCED', '📋 Extracting business rules...');
    const businessRules = extractBusinessRules(transformationNotes);

    log('ENHANCED', '🔢 Detecting calculation patterns...');
    const calculationPatterns = detectCalculationPatterns(inputAnalysis, outputAnalysis, domainAnalysis.primaryDomain);

    log('ENHANCED', '⚠️  Assessing accuracy risks...');
    const accuracyRisks = assessAccuracyRisks(inputAnalysis, outputAnalysis, calculationPatterns, businessRules);

    log('ENHANCED', '🎯 Recommending validation strategy...');
    const validationStrategy = recommendValidationStrategy('Advanced', domainAnalysis.primaryDomain, accuracyRisks);

    log('ENHANCED', '⚡ Analyzing performance factors...');
    const performanceFactors = analyzePerformanceFactors(inputAnalysis, outputAnalysis);

    log('ENHANCED', '🚨 Identifying error-prone patterns...');
    const errorPronePatterns = identifyErrorPronePatterns(inputAnalysis, outputAnalysis);

    log('ENHANCED', '🚀 Generating enhanced DataWeave function suggestions...');
    const businessLogic = inferBusinessLogic(inputAnalysis, outputAnalysis);
    const enhancedFunctionSuggestions = suggestDataWeaveFunctions(inputAnalysis, outputAnalysis, businessLogic);
    const moduleImports = getModuleImportSuggestions(inputAnalysis, outputAnalysis, businessLogic);

    log('ENHANCED', '🔍 Detecting XML processing context...');
    const xmlContext = detectXmlOutputContext(inputAnalysis, outputAnalysis, transformationNotes, inputFile, expectedOutputFile);
    const xmlProcessingPatterns = getXmlProcessingPatterns(xmlContext, inputAnalysis, outputAnalysis);

    return {
        inputAnalysis,
        outputAnalysis,
        domainAnalysis,
        businessRules,
        businessLogic,
        calculationPatterns,
        accuracyRisks,
        validationStrategy,
        performanceFactors,
        errorPronePatterns,
        enhancedFunctionSuggestions,
        moduleImports,
        xmlContext,
        xmlProcessingPatterns,
        transformationNotes
    };
}

async function main() {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
        console.log("🎯 R-Genie Enhanced Requirements Analyzer v2.0");
        console.log("═══════════════════════════════════════════════");
        console.log("");
        console.log("USAGE:");
        console.log("  Single Example:");
        console.log("    node requirements-analyzer-enhanced.js <input-file> <expected-output-file> [transformation-notes]");
        console.log("");
        console.log("  Multiple Examples:");
        console.log("    node requirements-analyzer-enhanced.js --multi-example --input-examples \"input1.json,input2.json\" --output-examples \"output1.json,output2.json\" [transformation-notes]");
        console.log("");
        console.log("  Multiple Input Files:");
        console.log("    node requirements-analyzer-enhanced.js --multi-input --input-files \"payload.json,variables.json,attributes.json\" --output-file expected.json [transformation-notes]");
        console.log("");
        console.log("  Mapping Sheet Only:");
        console.log("    node requirements-analyzer-enhanced.js --mapping-only <mapping-file> [transformation-notes]");
        console.log("");
        console.log("EXAMPLES:");
        console.log("  node requirements-analyzer-enhanced.js input.json expected-output.json transformation-notes.txt");
        console.log("  node requirements-analyzer-enhanced.js --multi-example --input-examples \"ex1.json,ex2.json\" --output-examples \"out1.json,out2.json\"");
        console.log("  node requirements-analyzer-enhanced.js --mapping-only mappings.csv transformation-notes.txt");
        process.exit(1);
    }

    // Handle different invocation modes
    if (args[0] === '--multi-example') {
        await handleMultiExampleMode(args);
    } else if (args[0] === '--multi-input') {
        await handleMultiInputMode(args);
    } else if (args[0] === '--mapping-only') {
        handleMappingOnlyMode(args);
    } else {
        // Single example mode (original behavior)
        const inputFile = args[0];
        const expectedOutputFile = args[1];
        const transformationNotesFile = args[2] || null;
        await handleSingleExampleMode(inputFile, expectedOutputFile, transformationNotesFile);
    }
    
    // Ensure clean exit after any mode completion (fallback)
    // Note: Each handler should have its own process.exit(0), but this ensures cleanup
}

// 🆕 Single Example Mode Handler (original behavior)
async function handleSingleExampleMode(inputFile, expectedOutputFile, transformationNotesFile) {
    log('INFO', '🎯 Starting enhanced requirements analysis...');
    log('INFO', `📁 Input: ${inputFile}`);
    log('INFO', `📁 Expected Output: ${expectedOutputFile}`);
    if (transformationNotesFile) {
        log('INFO', `📝 Transformation Notes: ${transformationNotesFile}`);
    }
    console.log("");

    try {
        const analysis = await performEnhancedAnalysis(inputFile, expectedOutputFile, transformationNotesFile);

        console.log("");
        log('SUCCESS', '✅ Enhanced requirements analysis completed successfully!');
        console.log("");
        
        // Enhanced output display
        console.log(`${colors.bright}🎯 BUSINESS DOMAIN ANALYSIS${colors.reset}`);
        console.log("═══════════════════════════════════════════════");
        console.log(`🏢 Primary Domain: ${colors.cyan}${analysis.domainAnalysis.primaryDomain.toUpperCase()}${colors.reset} (${Math.round(analysis.domainAnalysis.confidence * 100)}% confidence)`);
        console.log(`🔍 Detected Terms: ${analysis.domainAnalysis.detectedTerms.join(', ')}`);
        console.log("");

        if (analysis.calculationPatterns.length > 0) {
            console.log(`${colors.bright}🔢 CALCULATION PATTERNS DETECTED${colors.reset}`);
            console.log("═══════════════════════════════════════════════");
            analysis.calculationPatterns.forEach(pattern => {
                console.log(`   • ${colors.yellow}${pattern.type.toUpperCase()}${colors.reset}: ${pattern.description}`);
                console.log(`     Risk Level: ${pattern.riskLevel} | Recommendation: ${pattern.recommendation}`);
            });
            console.log("");
        }

        if (analysis.accuracyRisks.length > 0) {
            console.log(`${colors.bright}⚠️  ACCURACY RISK ASSESSMENT${colors.reset}`);
            console.log("═══════════════════════════════════════════════");
            analysis.accuracyRisks.forEach(risk => {
                console.log(`   • ${colors.red}${risk.severity}${colors.reset}: ${risk.risk}`);
                console.log(`     Impact: ${risk.impact}`);
                console.log(`     Mitigation: ${risk.mitigation}`);
            });
            console.log("");
        }

        console.log(`${colors.bright}🎯 VALIDATION STRATEGY RECOMMENDATION${colors.reset}`);
        console.log("═══════════════════════════════════════════════");
        console.log(`📊 Primary Approach: ${analysis.validationStrategy.primaryApproach}`);
        console.log(`🔧 Recommended Modes: ${analysis.validationStrategy.specificModes.join(', ')}`);
        if (analysis.validationStrategy.criticalChecks.length > 0) {
            console.log(`✅ Critical Checks:`);
            analysis.validationStrategy.criticalChecks.forEach(check => {
                console.log(`   • ${check}`);
            });
        }
        console.log("");

        console.log(`${colors.bright}🚀 ENHANCED DATAWEAVE FUNCTION SUGGESTIONS${colors.reset}`);
        console.log("═══════════════════════════════════════════════");
        console.log(`📊 Core Functions: ${colors.cyan}${analysis.enhancedFunctionSuggestions.length}${colors.reset} suggested`);
        console.log(`📦 Module Imports: ${colors.cyan}${analysis.moduleImports.length}${colors.reset} modules recommended`);
        
        if (analysis.moduleImports.length > 0) {
            console.log("");
            console.log(`${colors.yellow}📦 RECOMMENDED MODULES:${colors.reset}`);
            analysis.moduleImports.forEach(mod => {
                console.log(`   • ${colors.green}${mod.module}${colors.reset} (${mod.functions.length} functions)`);
                mod.functions.slice(0, 3).forEach(func => {
                    console.log(`     - ${func.name}: ${func.description}`);
                });
                if (mod.functions.length > 3) {
                    console.log(`     ... and ${mod.functions.length - 3} more functions`);
                }
            });
        }
        console.log("");

        // XML Processing Patterns (context-aware)
        if (analysis.xmlContext && (analysis.xmlContext.hasXmlInput || analysis.xmlContext.hasXmlOutput) && analysis.xmlProcessingPatterns) {
            console.log(`${colors.bright}🔍 XML PROCESSING PATTERNS DETECTED${colors.reset}`);
            console.log("═══════════════════════════════════════════════");
            console.log(`📥 XML Input: ${analysis.xmlContext.hasXmlInput ? colors.green + 'YES' + colors.reset : 'NO'}`);
            console.log(`📤 XML Output: ${analysis.xmlContext.hasXmlOutput ? colors.green + 'YES' + colors.reset : 'NO'}`);
            console.log(`🎯 XML Complexity: ${colors.yellow}${analysis.xmlContext.xmlComplexity.toUpperCase()}${colors.reset}`);
            console.log(`📊 Requires Arrays: ${analysis.xmlContext.requiresArrays ? colors.green + 'YES' + colors.reset : 'NO'}`);
            console.log(`🏷️  Requires Attributes: ${analysis.xmlContext.requiresAttributes ? colors.green + 'YES' + colors.reset : 'NO'}`);
            console.log(`🌐 Requires Namespaces: ${analysis.xmlContext.requiresNamespaces ? colors.green + 'YES' + colors.reset : 'NO'}`);
            console.log("");

            if (analysis.xmlProcessingPatterns.patterns.length > 0) {
                console.log(`${colors.yellow}🚨 CRITICAL XML PATTERNS:${colors.reset}`);
                analysis.xmlProcessingPatterns.patterns.forEach(pattern => {
                    console.log(`   • ${colors.red}${pattern.priority.toUpperCase()}${colors.reset}: ${pattern.name.replace(/_/g, ' ').toUpperCase()}`);
                    console.log(`     ${pattern.description}`);
                    console.log(`     Syntax: ${colors.cyan}${pattern.syntax}${colors.reset}`);
                    if (pattern.examples && pattern.examples.length > 0) {
                        console.log(`     Example: ${colors.green}${pattern.examples[0]}${colors.reset}`);
                    }
                });
                console.log("");
            }

            if (analysis.xmlProcessingPatterns.antiPatterns.length > 0) {
                console.log(`${colors.yellow}❌ XML ANTI-PATTERNS TO AVOID:${colors.reset}`);
                analysis.xmlProcessingPatterns.antiPatterns.forEach(antiPattern => {
                    console.log(`   • ${antiPattern.description}`);
                    console.log(`     ❌ Wrong: ${colors.red}${antiPattern.wrongPattern}${colors.reset}`);
                    console.log(`     ✅ Correct: ${colors.green}${antiPattern.correctPattern}${colors.reset}`);
                });
                console.log("");
            }

            if (analysis.xmlProcessingPatterns.troubleshooting.length > 0) {
                console.log(`${colors.yellow}🔧 XML TROUBLESHOOTING SOLUTIONS:${colors.reset}`);
                analysis.xmlProcessingPatterns.troubleshooting.forEach(trouble => {
                    console.log(`   • Issue: ${colors.red}${trouble.issue}${colors.reset}`);
                    trouble.solutions.forEach(solution => {
                        console.log(`     Solution: ${colors.green}${solution.approach.replace(/_/g, ' ')}${colors.reset}`);
                        console.log(`     Code: ${colors.cyan}${solution.code.split('\\n')[0]}${colors.reset}`);
                    });
                });
                console.log("");
            }
        }

        // Save enhanced analysis
        const enhancedAnalysis = {
            metadata: {
                timestamp: new Date().toISOString(),
                inputFile,
                expectedOutputFile,
                transformationNotesFile,
                analysisVersion: "2.0.0-enhanced"
            },
            ...analysis
        };

        const outputFile = `${path.dirname(inputFile)}/requirements-analysis-enhanced.json`;
        fs.writeFileSync(outputFile, JSON.stringify(enhancedAnalysis, null, 2));
        log('SUCCESS', `📁 Enhanced analysis saved to: ${outputFile}`);

        log('SUCCESS', '🎯 Agent can now use enhanced analysis for superior DataWeave generation!');
        
        // Ensure clean exit after successful completion
        process.exit(0);
        
    } catch (error) {
        log('ERROR', `❌ Enhanced analysis failed: ${error.message}`);
        process.exit(1);
    }
}

// 🆕 Multi-Example Mode Handler
async function handleMultiExampleMode(args) {
    log('INFO', '🎯 Starting multi-example requirements analysis...');
    
    // Parse arguments
    let inputExamples = [];
    let outputExamples = [];
    let transformationNotesFile = null;
    
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--input-examples' && args[i + 1]) {
            inputExamples = args[i + 1].split(',').map(f => f.trim());
            i++;
        } else if (args[i] === '--output-examples' && args[i + 1]) {
            outputExamples = args[i + 1].split(',').map(f => f.trim());
            i++;
        } else if (args[i] && !args[i].startsWith('--')) {
            transformationNotesFile = args[i];
        }
    }
    
    if (inputExamples.length === 0 || outputExamples.length === 0) {
        log('ERROR', '❌ Multi-example mode requires --input-examples and --output-examples');
        process.exit(1);
    }
    
    if (inputExamples.length !== outputExamples.length) {
        log('ERROR', '❌ Number of input examples must match number of output examples');
        process.exit(1);
    }
    
    log('INFO', `📊 Processing ${inputExamples.length} example pairs`);
    inputExamples.forEach((input, i) => {
        log('INFO', `   ${i + 1}. ${input} -> ${outputExamples[i]}`);
    });
    
    if (transformationNotesFile) {
        log('INFO', `📝 Transformation Notes: ${transformationNotesFile}`);
    }
    console.log("");
    
    try {
        const multiAnalysis = await performMultiExampleAnalysis(inputExamples, outputExamples, transformationNotesFile);
        
        console.log("");
        log('SUCCESS', '✅ Multi-example requirements analysis completed successfully!');
        
        // Display aggregated results
        displayMultiExampleResults(multiAnalysis);
        
        // Save consolidated analysis
        const outputFile = `${path.dirname(inputExamples[0])}/requirements-analysis-multi-enhanced.json`;
        fs.writeFileSync(outputFile, JSON.stringify(multiAnalysis, null, 2));
        log('SUCCESS', `📁 Multi-example analysis saved to: ${outputFile}`);
        
    } catch (error) {
        log('ERROR', `❌ Multi-example analysis failed: ${error.message}`);
        process.exit(1);
    }
}

// 🆕 Multi-Input Mode Handler
async function handleMultiInputMode(args) {
    log('INFO', '🎯 Starting multi-input requirements analysis...');
    
    // Parse arguments
    let inputFiles = [];
    let outputFile = null;
    let transformationNotesFile = null;
    
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--input-files' && args[i + 1]) {
            inputFiles = args[i + 1].split(',').map(f => f.trim());
            i++;
        } else if (args[i] === '--output-file' && args[i + 1]) {
            outputFile = args[i + 1];
            i++;
        } else if (args[i] && !args[i].startsWith('--')) {
            transformationNotesFile = args[i];
        }
    }
    
    if (inputFiles.length === 0 || !outputFile) {
        log('ERROR', '❌ Multi-input mode requires --input-files and --output-file');
        process.exit(1);
    }
    
    log('INFO', `📊 Processing ${inputFiles.length} input files`);
    inputFiles.forEach((input, i) => {
        const inputType = detectInputType(input);
        log('INFO', `   ${i + 1}. ${input} (${inputType})`);
    });
    log('INFO', `📤 Output: ${outputFile}`);
    
    if (transformationNotesFile) {
        log('INFO', `📝 Transformation Notes: ${transformationNotesFile}`);
    }
    console.log("");
    
    try {
        const multiInputAnalysis = await performMultiInputAnalysis(inputFiles, outputFile, transformationNotesFile);
        
        console.log("");
        log('SUCCESS', '✅ Multi-input requirements analysis completed successfully!');
        
        // Display results
        displayMultiInputResults(multiInputAnalysis);
        
        // Save analysis
        const outputDir = path.dirname(outputFile);
        const analysisFile = `${outputDir}/requirements-analysis-multi-input-enhanced.json`;
        fs.writeFileSync(analysisFile, JSON.stringify(multiInputAnalysis, null, 2));
        log('SUCCESS', `📁 Multi-input analysis saved to: ${analysisFile}`);
        
    } catch (error) {
        log('ERROR', `❌ Multi-input analysis failed: ${error.message}`);
        process.exit(1);
    }
}

// 🆕 Detect input file type (payload, variables, attributes)
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

// 🆕 Perform multi-input analysis
async function performMultiInputAnalysis(inputFiles, outputFile, transformationNotesFile) {
    const inputAnalyses = [];
    
    // Analyze each input file
    for (let index = 0; index < inputFiles.length; index++) {
        const inputFile = inputFiles[index];
        log('INFO', `🔍 Analyzing input ${index + 1}/${inputFiles.length}: ${path.basename(inputFile)}`);
        
        const inputType = detectInputType(inputFile);
        // 🎯 PRESERVE XML FORMAT: For input files, preserve XML format for transformations
        const inputData = await parseDataFile(inputFile, true); // preserveXmlFormat = true for input files
        const analysis = analyzeStructure(inputData);
        
        analysis.inputType = inputType;
        analysis.inputFile = inputFile;
        analysis.priority = determinePriority(inputType);
        
        inputAnalyses.push(analysis);
    }
    
    // Analyze expected output
    // 🎯 PRESERVE XML FORMAT: For output files, preserve XML format for transformations
    const outputData = await parseDataFile(outputFile, true); // preserveXmlFormat = true for output files
    const outputAnalysis = analyzeStructure(outputData);
    
    // Cross-analyze relationships
    const relationshipAnalysis = analyzeInputOutputRelationships(inputAnalyses, outputAnalysis);
    
    // Generate DataWeave patterns
    const dataWeavePatterns = generateMultiInputDataWeavePatterns(inputAnalyses, outputAnalysis, relationshipAnalysis);
    
    return {
        metadata: {
            timestamp: new Date().toISOString(),
            inputFiles,
            outputFile,
            transformationNotesFile,
            analysisVersion: "2.0.0-multi-input",
            inputCount: inputFiles.length
        },
        scenario: 'multi_input_single_output',
        inputAnalyses,
        outputAnalysis,
        relationshipAnalysis,
        dataWeavePatterns,
        recommendations: generateMultiInputRecommendations(inputAnalyses, outputAnalysis, relationshipAnalysis),
        validationStrategy: {
            primaryApproach: 'multi_input_validation',
            specificModes: ['syntax', 'accuracy', 'integration'],
            criticalChecks: ['Input file availability', 'Variable binding', 'Data integration', 'Field mapping accuracy'],
            fallbackProcedures: ['Single input fallback', 'Mock data substitution']
        }
    };
}

// 🆕 Determine input priority for DataWeave execution order
function determinePriority(inputType) {
    const priorities = {
        'payload': 1,      // Main data source
        'variables': 2,    // Secondary data
        'attributes': 3,   // Metadata
        'configuration': 4, // Settings
        'context': 5,      // Environment
        'unknown': 6       // Lowest priority
    };
    
    return priorities[inputType] || 6;
}

// 🆕 Analyze relationships between inputs and output
function analyzeInputOutputRelationships(inputAnalyses, outputAnalysis) {
    const relationships = {
        fieldMappings: [],
        crossReferences: [],
        calculations: [],
        mergePatterns: [],
        priority: []
    };
    
    // Sort inputs by priority
    const sortedInputs = [...inputAnalyses].sort((a, b) => a.priority - b.priority);
    
    // Analyze field mappings from each input to output
    sortedInputs.forEach(inputAnalysis => {
        const mappings = findFieldMappings(inputAnalysis.fields, outputAnalysis.fields);
        relationships.fieldMappings.push({
            inputType: inputAnalysis.inputType,
            inputFile: inputAnalysis.inputFile,
            mappings: mappings,
            confidence: mappings.length > 0 ? mappings.reduce((sum, m) => sum + m.similarity, 0) / mappings.length : 0
        });
    });
    
    // Detect cross-references between inputs
    for (let i = 0; i < sortedInputs.length; i++) {
        for (let j = i + 1; j < sortedInputs.length; j++) {
            const crossRefs = findCrossReferences(sortedInputs[i], sortedInputs[j]);
            if (crossRefs.length > 0) {
                relationships.crossReferences.push({
                    input1: sortedInputs[i].inputFile,
                    input2: sortedInputs[j].inputFile,
                    references: crossRefs
                });
            }
        }
    }
    
    // Suggest merge patterns
    relationships.mergePatterns = suggestMergePatterns(sortedInputs, outputAnalysis);
    
    return relationships;
}

// 🆕 Find field mappings between input and output
function findFieldMappings(inputFields, outputFields) {
    const mappings = [];
    
    inputFields.forEach(inputField => {
        outputFields.forEach(outputField => {
            const similarity = calculateFieldSimilarity(inputField, outputField);
            if (similarity > 0.6) {
                mappings.push({
                    source: inputField,
                    target: outputField,
                    similarity,
                    mappingType: similarity === 1.0 ? 'direct' : 'transformed'
                });
            }
        });
    });
    
    return mappings.sort((a, b) => b.similarity - a.similarity);
}

// 🆕 Calculate field name similarity
function calculateFieldSimilarity(field1, field2) {
    const name1 = field1.toLowerCase().replace(/[._-]/g, '');
    const name2 = field2.toLowerCase().replace(/[._-]/g, '');
    
    if (name1 === name2) return 1.0;
    
    // Check if one contains the other
    if (name1.includes(name2) || name2.includes(name1)) return 0.8;
    
    // Simple edit distance approximation
    const maxLen = Math.max(name1.length, name2.length);
    const minLen = Math.min(name1.length, name2.length);
    
    if (maxLen === 0) return 1.0;
    
    let matches = 0;
    for (let i = 0; i < minLen; i++) {
        if (name1[i] === name2[i]) matches++;
    }
    
    return matches / maxLen;
}

// 🆕 Find cross-references between inputs
function findCrossReferences(input1, input2) {
    const crossRefs = [];
    
    input1.fields.forEach(field1 => {
        input2.fields.forEach(field2 => {
            if (calculateFieldSimilarity(field1, field2) > 0.7) {
                crossRefs.push({
                    field1,
                    field2,
                    relationship: 'similar_field'
                });
            }
        });
    });
    
    return crossRefs;
}

// 🆕 Suggest merge patterns
function suggestMergePatterns(inputs, output) {
    const patterns = [];
    
    // Suggest payload as primary
    const payloadInput = inputs.find(i => i.inputType === 'payload');
    if (payloadInput) {
        patterns.push({
            type: 'payload_primary',
            description: 'Use payload as primary data source, merge other inputs as needed',
            primaryInput: payloadInput.inputFile,
            secondaryInputs: inputs.filter(i => i.inputType !== 'payload').map(i => i.inputFile)
        });
    }
    
    // Suggest object merging
    if (inputs.length > 1) {
        patterns.push({
            type: 'object_merge',
            description: 'Merge all inputs into single object structure',
            mergeStrategy: '++',
            inputOrder: inputs.sort((a, b) => a.priority - b.priority).map(i => i.inputFile)
        });
    }
    
    // Suggest variable substitution
    const variablesInput = inputs.find(i => i.inputType === 'variables');
    if (variablesInput && payloadInput) {
        patterns.push({
            type: 'variable_substitution',
            description: 'Use variables to populate dynamic values in payload transformation',
            variableSource: variablesInput.inputFile,
            targetPayload: payloadInput.inputFile
        });
    }
    
    return patterns;
}

// 🆕 Generate DataWeave patterns for multi-input scenarios
function generateMultiInputDataWeavePatterns(inputAnalyses, outputAnalysis, relationshipAnalysis) {
    const patterns = {
        inputDeclarations: [],
        variableDeclarations: [],
        transformationLogic: [],
        mergeExpressions: []
    };
    
    // Generate input declarations
    inputAnalyses.forEach((input, index) => {
        const inputName = input.inputType === 'payload' ? 'payload' : input.inputType;
        const fileFormat = detectFileFormat(input.inputFile);
        
        patterns.inputDeclarations.push({
            name: inputName,
            file: input.inputFile,
            format: fileFormat,
            declaration: index === 0 ? 
                `input ${inputName} application/${fileFormat}` :
                `input ${inputName} application/${fileFormat} from classpath("${path.basename(input.inputFile)}")`
        });
    });
    
    // Generate variable declarations
    const variablesInput = inputAnalyses.find(i => i.inputType === 'variables');
    if (variablesInput) {
        patterns.variableDeclarations.push({
            source: 'variables',
            declarations: generateVariableDeclarations(variablesInput)
        });
    }
    
    // Generate transformation logic
    patterns.transformationLogic = generateTransformationLogic(inputAnalyses, outputAnalysis, relationshipAnalysis);
    
    // Generate merge expressions
    if (inputAnalyses.length > 1) {
        patterns.mergeExpressions = generateMergeExpressions(inputAnalyses, relationshipAnalysis);
    }
    
    return patterns;
}

// 🆕 Generate variable declarations from variables input
function generateVariableDeclarations(variablesInput) {
    const declarations = [];
    
    variablesInput.fields.forEach(field => {
        declarations.push({
            name: field,
            declaration: `var ${field} = variables.${field}`,
            usage: `Use \${${field}} for dynamic value substitution`
        });
    });
    
    return declarations;
}

// 🆕 Generate transformation logic
function generateTransformationLogic(inputAnalyses, outputAnalysis, relationshipAnalysis) {
    const logic = [];
    
    // Primary payload transformation
    const payloadInput = inputAnalyses.find(i => i.inputType === 'payload');
    if (payloadInput) {
        logic.push({
            type: 'primary_transformation',
            description: 'Transform primary payload data',
            expression: 'payload map ((item, index) -> { /* transformation logic */ })'
        });
    }
    
    // Variable integration
    const variablesInput = inputAnalyses.find(i => i.inputType === 'variables');
    if (variablesInput) {
        logic.push({
            type: 'variable_integration',
            description: 'Integrate variables into transformation',
            expression: 'Use variables.fieldName for dynamic values'
        });
    }
    
    // Attribute enrichment
    const attributesInput = inputAnalyses.find(i => i.inputType === 'attributes');
    if (attributesInput) {
        logic.push({
            type: 'attribute_enrichment',
            description: 'Enrich data with attributes',
            expression: 'Merge attributes using ++ operator'
        });
    }
    
    return logic;
}

// 🆕 Generate merge expressions
function generateMergeExpressions(inputAnalyses, relationshipAnalysis) {
    const expressions = [];
    
    relationshipAnalysis.mergePatterns.forEach(pattern => {
        switch (pattern.type) {
            case 'payload_primary':
                expressions.push({
                    pattern: 'payload_primary',
                    expression: 'payload ++ variables ++ attributes',
                    description: 'Merge payload with supplementary data'
                });
                break;
                
            case 'object_merge':
                expressions.push({
                    pattern: 'object_merge',
                    expression: pattern.inputOrder.map(input => 
                        inputAnalyses.find(i => i.inputFile === input)?.inputType || 'input'
                    ).join(' ++ '),
                    description: 'Sequential object merging by priority'
                });
                break;
                
            case 'variable_substitution':
                expressions.push({
                    pattern: 'variable_substitution',
                    expression: 'payload with variables for dynamic fields',
                    description: 'Variable substitution in payload transformation'
                });
                break;
        }
    });
    
    return expressions;
}

// 🆕 Generate multi-input recommendations
function generateMultiInputRecommendations(inputAnalyses, outputAnalysis, relationshipAnalysis) {
    const recommendations = [];
    
    // Input organization recommendations
    recommendations.push({
        type: 'organization',
        message: `Organize ${inputAnalyses.length} input files by priority: ${inputAnalyses.sort((a, b) => a.priority - b.priority).map(i => i.inputType).join(' → ')}`,
        action: 'Use recommended input declaration order in DataWeave script'
    });
    
    // Merge strategy recommendations
    if (relationshipAnalysis.mergePatterns.length > 0) {
        const primaryPattern = relationshipAnalysis.mergePatterns[0];
        recommendations.push({
            type: 'merge_strategy',
            message: `Recommended merge pattern: ${primaryPattern.type}`,
            action: primaryPattern.description
        });
    }
    
    // Variable usage recommendations
    const variablesInput = inputAnalyses.find(i => i.inputType === 'variables');
    if (variablesInput) {
        recommendations.push({
            type: 'variables',
            message: 'Variables detected for dynamic value substitution',
            action: 'Use variable declarations for parameterized transformations'
        });
    }
    
    // Cross-reference recommendations
    if (relationshipAnalysis.crossReferences.length > 0) {
        recommendations.push({
            type: 'cross_reference',
            message: 'Cross-references detected between input files',
            action: 'Consider data consistency validation between related inputs'
        });
    }
    
    return recommendations;
}

// 🆕 Display multi-input results
function displayMultiInputResults(multiInputAnalysis) {
    console.log(`${colors.bright}📊 MULTI-INPUT ANALYSIS SUMMARY${colors.reset}`);
    console.log("═══════════════════════════════════════════════");
    console.log(`📁 Input Files: ${colors.cyan}${multiInputAnalysis.metadata.inputCount}${colors.reset}`);
    
    multiInputAnalysis.inputAnalyses.forEach((input, index) => {
        console.log(`   ${index + 1}. ${colors.yellow}${input.inputType.toUpperCase()}${colors.reset}: ${path.basename(input.inputFile)} (${input.totalFields} fields)`);
    });
    
    console.log(`📤 Output File: ${colors.green}${path.basename(multiInputAnalysis.outputAnalysis.fileName || multiInputAnalysis.metadata.outputFile)}${colors.reset} (${multiInputAnalysis.outputAnalysis.totalFields} fields)`);
    console.log("");
    
    if (multiInputAnalysis.relationshipAnalysis.mergePatterns.length > 0) {
        console.log(`${colors.bright}🔗 RECOMMENDED MERGE PATTERNS${colors.reset}`);
        console.log("═══════════════════════════════════════════════");
        multiInputAnalysis.relationshipAnalysis.mergePatterns.forEach((pattern, index) => {
            console.log(`   ${index + 1}. ${colors.magenta}${pattern.type.toUpperCase()}${colors.reset}: ${pattern.description}`);
        });
        console.log("");
    }
    
    if (multiInputAnalysis.dataWeavePatterns.inputDeclarations.length > 0) {
        console.log(`${colors.bright}📝 DATAWEAVE INPUT DECLARATIONS${colors.reset}`);
        console.log("═══════════════════════════════════════════════");
        multiInputAnalysis.dataWeavePatterns.inputDeclarations.forEach(decl => {
            console.log(`   ${colors.cyan}${decl.declaration}${colors.reset}`);
        });
        console.log("");
    }
}

// 🆕 Mapping-Only Mode Handler
function handleMappingOnlyMode(args) {
    const mappingFile = args[1];
    const transformationNotesFile = args[2] || null;
    
    if (!mappingFile) {
        log('ERROR', '❌ Mapping-only mode requires a mapping file');
        process.exit(1);
    }
    
    log('INFO', '🎯 Starting mapping-only requirements analysis...');
    log('INFO', `📋 Mapping File: ${mappingFile}`);
    if (transformationNotesFile) {
        log('INFO', `📝 Transformation Notes: ${transformationNotesFile}`);
    }
    console.log("");
    
    try {
        // Use the mapping sheet analyzer
        const mappingAnalyzer = require('../utilities/03-01-15_Mapping_Analyzer.js');
        const mappingAnalysis = mappingAnalyzer.performMappingAnalysis(mappingFile, transformationNotesFile);
        
        // Convert mapping analysis to enhanced analysis format
        const enhancedAnalysis = convertMappingToEnhancedAnalysis(mappingAnalysis);
        
        console.log("");
        log('SUCCESS', '✅ Mapping-only requirements analysis completed successfully!');
        
        // Display results
        displayMappingOnlyResults(enhancedAnalysis);
        
        // Save analysis
        const outputFile = `${path.dirname(mappingFile)}/requirements-analysis-mapping-enhanced.json`;
        fs.writeFileSync(outputFile, JSON.stringify(enhancedAnalysis, null, 2));
        log('SUCCESS', `📁 Mapping analysis saved to: ${outputFile}`);
        
    } catch (error) {
        log('ERROR', `❌ Mapping-only analysis failed: ${error.message}`);
        process.exit(1);
    }
}

// 🆕 Multi-Example Analysis Function
async function performMultiExampleAnalysis(inputFiles, outputFiles, transformationNotesFile) {
    const exampleAnalyses = [];
    
    // Analyze each example pair
    for (let i = 0; i < inputFiles.length; i++) {
        log('INFO', `🔍 Analyzing example ${i + 1}/${inputFiles.length}...`);
        const analysis = await performEnhancedAnalysis(inputFiles[i], outputFiles[i], transformationNotesFile);
        analysis.exampleIndex = i + 1;
        analysis.inputFile = inputFiles[i];
        analysis.outputFile = outputFiles[i];
        exampleAnalyses.push(analysis);
    }
    
    // Aggregate patterns across examples
    const aggregatedAnalysis = aggregateMultiExamplePatterns(exampleAnalyses);
    
    return {
        metadata: {
            timestamp: new Date().toISOString(),
            inputFiles,
            outputFiles,
            transformationNotesFile,
            analysisVersion: "2.0.0-multi-example",
            exampleCount: inputFiles.length
        },
        scenario: 'multi_example',
        individualAnalyses: exampleAnalyses,
        aggregatedAnalysis,
        confidenceScore: calculateMultiExampleConfidence(exampleAnalyses)
    };
}

// 🆕 Aggregate patterns across multiple examples
function aggregateMultiExamplePatterns(analyses) {
    const aggregated = {
        domainAnalysis: aggregateDomainAnalysis(analyses),
        businessRules: aggregateBusinessRules(analyses),
        calculationPatterns: aggregateCalculationPatterns(analyses),
        accuracyRisks: aggregateAccuracyRisks(analyses),
        functionSuggestions: aggregateFunctionSuggestions(analyses),
        consistencyAnalysis: analyzeConsistency(analyses)
    };
    
    return aggregated;
}

// Helper functions for aggregation
function aggregateDomainAnalysis(analyses) {
    const domainCounts = {};
    analyses.forEach(analysis => {
        const domain = analysis.domainAnalysis.primaryDomain;
        domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    });
    
    const primaryDomain = Object.keys(domainCounts).reduce((a, b) => 
        domainCounts[a] > domainCounts[b] ? a : b
    );
    
    return {
        primaryDomain,
        confidence: domainCounts[primaryDomain] / analyses.length,
        consistency: Object.keys(domainCounts).length === 1 ? 'high' : 'medium'
    };
}

function aggregateBusinessRules(analyses) {
    const allRules = [];
    analyses.forEach(analysis => {
        allRules.push(...analysis.businessRules.rules);
    });
    return [...new Set(allRules)];
}

function aggregateCalculationPatterns(analyses) {
    const patternCounts = {};
    analyses.forEach(analysis => {
        analysis.calculationPatterns.forEach(pattern => {
            const key = pattern.type;
            patternCounts[key] = (patternCounts[key] || 0) + 1;
        });
    });
    
    return Object.entries(patternCounts).map(([type, count]) => ({
        type,
        frequency: count / analyses.length,
        consistency: count === analyses.length ? 'high' : 'medium'
    }));
}

function aggregateAccuracyRisks(analyses) {
    const riskCounts = {};
    analyses.forEach(analysis => {
        analysis.accuracyRisks.forEach(risk => {
            const key = risk.category;
            riskCounts[key] = (riskCounts[key] || 0) + 1;
        });
    });
    
    return Object.entries(riskCounts).map(([category, count]) => ({
        category,
        frequency: count / analyses.length,
        severity: count >= analyses.length * 0.7 ? 'high' : 'medium'
    }));
}

function aggregateFunctionSuggestions(analyses) {
    const functionCounts = {};
    analyses.forEach(analysis => {
        analysis.enhancedFunctionSuggestions.forEach(func => {
            functionCounts[func] = (functionCounts[func] || 0) + 1;
        });
    });
    
    return Object.entries(functionCounts)
        .sort(([,a], [,b]) => b - a)
        .map(([func, count]) => ({
            function: func,
            frequency: count / analyses.length,
            priority: count >= analyses.length * 0.7 ? 'high' : 'medium'
        }));
}

function analyzeConsistency(analyses) {
    const consistency = {
        domains: new Set(analyses.map(a => a.domainAnalysis.primaryDomain)).size === 1,
        fieldCounts: analyses.every(a => Math.abs(a.inputAnalysis.totalFields - analyses[0].inputAnalysis.totalFields) <= 2),
        dataTypes: analyses.every(a => a.inputAnalysis.dataTypes.arrays.length === analyses[0].inputAnalysis.dataTypes.arrays.length)
    };
    
    const score = Object.values(consistency).filter(Boolean).length / Object.keys(consistency).length;
    
    return {
        ...consistency,
        overallScore: score,
        level: score >= 0.8 ? 'high' : score >= 0.5 ? 'medium' : 'low'
    };
}

function calculateMultiExampleConfidence(analyses) {
    const avgConfidence = analyses.reduce((sum, analysis) => 
        sum + analysis.domainAnalysis.confidence, 0) / analyses.length;
    
    const consistencyBonus = analyzeConsistency(analyses).overallScore * 0.2;
    
    return Math.min(avgConfidence + consistencyBonus, 1.0);
}

// 🆕 Convert mapping analysis to enhanced analysis format
function convertMappingToEnhancedAnalysis(mappingAnalysis) {
    return {
        metadata: {
            ...mappingAnalysis.metadata,
            analysisVersion: "2.0.0-mapping-enhanced"
        },
        scenario: 'mapping_sheet_only',
        mappingAnalysis,
        // Create synthetic input/output analysis
        inputAnalysis: createSyntheticAnalysis(mappingAnalysis.syntheticStructures.input),
        outputAnalysis: createSyntheticAnalysis(mappingAnalysis.syntheticStructures.output),
        // Map to enhanced format
        domainAnalysis: {
            primaryDomain: 'general',
            confidence: 0.6,
            detectedTerms: extractTermsFromMappings(mappingAnalysis.mappings)
        },
        businessRules: {
            rules: mappingAnalysis.analysis.businessRules.map(r => r.rule),
            calculations: mappingAnalysis.analysis.calculations.map(c => c.rule),
            requirements: []
        },
        enhancedFunctionSuggestions: mappingAnalysis.functionSuggestions.map(f => f.name),
        validationStrategy: {
            primaryApproach: 'syntax_only',
            specificModes: ['validate'],
            criticalChecks: ['Syntax validation only - no accuracy testing available'],
            fallbackProcedures: ['Manual testing with sample data required']
        }
    };
}

function createSyntheticAnalysis(structure) {
    const fields = [];
    const dataTypes = {
        strings: [],
        numbers: [],
        booleans: [],
        arrays: [],
        objects: [],
        dates: []
    };
    
    function extractFields(obj, prefix = '') {
        Object.entries(obj).forEach(([key, value]) => {
            const fieldPath = prefix ? `${prefix}.${key}` : key;
            fields.push(fieldPath);
            
            if (Array.isArray(value)) {
                dataTypes.arrays.push(fieldPath);
            } else if (typeof value === 'object' && value !== null) {
                dataTypes.objects.push(fieldPath);
                extractFields(value, fieldPath);
            } else if (typeof value === 'string') {
                if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
                    dataTypes.dates.push(fieldPath);
                } else {
                    dataTypes.strings.push(fieldPath);
                }
            } else if (typeof value === 'number') {
                dataTypes.numbers.push(fieldPath);
            } else if (typeof value === 'boolean') {
                dataTypes.booleans.push(fieldPath);
            }
        });
    }
    
    extractFields(structure);
    
    return {
        fields,
        dataTypes,
        totalFields: fields.length,
        nestedDepth: Math.max(...fields.map(f => f.split('.').length))
    };
}

function extractTermsFromMappings(mappings) {
    return [...new Set(mappings.flatMap(m => 
        [m.sourceField, m.targetField].flatMap(f => 
            f.toLowerCase().split(/[._-]/)
        )
    ))].filter(term => term.length > 2);
}

// 🆕 Display functions for different modes
function displayMultiExampleResults(multiAnalysis) {
    console.log(`${colors.bright}📊 MULTI-EXAMPLE ANALYSIS SUMMARY${colors.reset}`);
    console.log("═══════════════════════════════════════════════");
    console.log(`📈 Examples Analyzed: ${colors.cyan}${multiAnalysis.metadata.exampleCount}${colors.reset}`);
    console.log(`🎯 Primary Domain: ${colors.cyan}${multiAnalysis.aggregatedAnalysis.domainAnalysis.primaryDomain.toUpperCase()}${colors.reset}`);
    console.log(`📊 Confidence Score: ${colors.green}${Math.round(multiAnalysis.confidenceScore * 100)}%${colors.reset}`);
    console.log(`🔄 Consistency Level: ${colors.yellow}${multiAnalysis.aggregatedAnalysis.consistencyAnalysis.level.toUpperCase()}${colors.reset}`);
    console.log("");
    
    if (multiAnalysis.aggregatedAnalysis.calculationPatterns.length > 0) {
        console.log(`${colors.bright}🔢 AGGREGATED CALCULATION PATTERNS${colors.reset}`);
        console.log("═══════════════════════════════════════════════");
        multiAnalysis.aggregatedAnalysis.calculationPatterns.forEach(pattern => {
            console.log(`   • ${colors.yellow}${pattern.type.toUpperCase()}${colors.reset}: ${Math.round(pattern.frequency * 100)}% frequency (${pattern.consistency} consistency)`);
        });
        console.log("");
    }
}

function displayMappingOnlyResults(enhancedAnalysis) {
    console.log(`${colors.bright}📋 MAPPING-ONLY ANALYSIS SUMMARY${colors.reset}`);
    console.log("═══════════════════════════════════════════════");
    console.log(`📊 Total Mappings: ${colors.cyan}${enhancedAnalysis.mappingAnalysis.analysis.totalMappings}${colors.reset}`);
    console.log(`🔗 Direct Mappings: ${colors.green}${enhancedAnalysis.mappingAnalysis.analysis.directMappings}${colors.reset}`);
    console.log(`🔄 Transformations: ${colors.yellow}${enhancedAnalysis.mappingAnalysis.analysis.transformations}${colors.reset}`);
    console.log(`🎯 Complexity: ${colors.magenta}${enhancedAnalysis.mappingAnalysis.analysis.complexity.toUpperCase()}${colors.reset}`);
    console.log("");
    
    console.log(`${colors.bright}⚠️  MAPPING-ONLY LIMITATIONS${colors.reset}`);
    console.log("═══════════════════════════════════════════════");
    console.log(`   • ${colors.red}No accuracy validation possible${colors.reset} - sample data required for testing`);
    console.log(`   • ${colors.yellow}Syntax validation only${colors.reset} - business logic cannot be verified`);
    console.log(`   • ${colors.blue}Manual testing required${colors.reset} - create sample data to validate transformation`);
    console.log("");
}

if (require.main === module) {
    main().catch(error => {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    });
}

// 🔄 LEGACY COMPATIBILITY: Original analyzer functions for backwards compatibility
function inferBusinessLogic(inputAnalysis, outputAnalysis) {
    const businessRules = [];
    const calculations = [];
    const transformationPatterns = [];

    // Detect aggregation patterns
    const inputArrays = inputAnalysis.dataTypes.arrays;
    const outputNumbers = outputAnalysis.dataTypes.numbers;
    
    if (inputArrays.length > 0 && outputNumbers.length > 0) {
        calculations.push("aggregation_operations");
        transformationPatterns.push("array_to_summary_transformation");
    }

    // Detect nested object processing
    if (inputAnalysis.nestedDepth > 2) {
        transformationPatterns.push("complex_nested_processing");
        businessRules.push("hierarchical_data_handling");
    }

    // Detect potential join/lookup operations
    if (inputArrays.length > 1) {
        businessRules.push("multi_entity_relationships");
        transformationPatterns.push("cross_reference_logic");
    }

    // Detect date processing
    if (inputAnalysis.dataTypes.dates.length > 0) {
        calculations.push("date_calculations");
        businessRules.push("temporal_logic");
    }

    return {
        businessRules,
        calculations,
        transformationPatterns
    };
}

function estimateComplexity(inputAnalysis, outputAnalysis, businessLogic) {
    let complexity = 0;
    
    // Field count factor
    complexity += Math.min(inputAnalysis.totalFields / 10, 3);
    complexity += Math.min(outputAnalysis.totalFields / 10, 3);
    
    // Nesting depth factor
    complexity += Math.min(inputAnalysis.nestedDepth, 3);
    
    // Array processing factor
    complexity += inputAnalysis.dataTypes.arrays.length * 0.5;
    
    // Business logic factor
    complexity += businessLogic.businessRules.length * 0.5;
    complexity += businessLogic.calculations.length * 0.3;
    
    if (complexity <= 2) return "Simple";
    if (complexity <= 5) return "Moderate";
    if (complexity <= 8) return "Complex";
    return "Advanced";
}

// 🚀 ENHANCED: Comprehensive DataWeave Functions with Modules & Syntax
function suggestDataWeaveFunctions(inputAnalysis, outputAnalysis, businessLogic) {
    const suggestions = {
        coreFunction: [],
        imports: [],
        modules: []
    };

    // 📊 CORE FUNCTIONS (No imports needed)
    const coreFunction = [];
    
    // Array Core Functions
    if (inputAnalysis.dataTypes.arrays.length > 0) {
        coreFunction.push(
            { name: "map", syntax: "array map ((item, index) -> transformation)", example: "[1,2,3] map ((item) -> item * 2)", description: "Transform each element in an array" },
            { name: "filter", syntax: "array filter ((item) -> boolean_condition)", example: "[1,2,3,4] filter ((item) -> item > 2)", description: "Filter array elements based on condition" },
            { name: "reduce", syntax: "array reduce ((item, accumulator) -> result)", example: "[1,2,3] reduce ((item, acc) -> acc + item)", description: "Reduce array to single value through iteration" },
            { name: "sizeOf", syntax: "sizeOf(array_or_object_or_string)", example: "sizeOf([1,2,3]) // Returns 3", description: "Get size/length of collection or string" },
            { name: "isEmpty", syntax: "isEmpty(value)", example: "isEmpty([]) // Returns true", description: "Check if collection or string is empty" },
            { name: "flatten", syntax: "flatten(nested_array)", example: "flatten([[1,2], [3,4]]) // Returns [1,2,3,4]", description: "Flatten nested arrays into single level" }
        );
    }

    // Aggregation Functions
    if (businessLogic.calculations.includes("aggregation_operations")) {
        coreFunction.push(
            { name: "sumBy", syntax: "array sumBy ((item) -> numeric_expression)", example: "orders sumBy ((order) -> order.total)", description: "Sum numeric values from array elements" },
            { name: "maxBy", syntax: "array maxBy ((item) -> comparable_expression)", example: "products maxBy ((product) -> product.price)", description: "Find element with maximum value" },
            { name: "minBy", syntax: "array minBy ((item) -> comparable_expression)", example: "employees minBy ((emp) -> emp.salary)", description: "Find element with minimum value" },
            { name: "groupBy", syntax: "array groupBy ((item) -> grouping_key)", example: "customers groupBy ((customer) -> customer.region)", description: "Group array elements by key" },
            { name: "distinctBy", syntax: "array distinctBy ((item) -> unique_key)", example: "users distinctBy ((user) -> user.email)", description: "Remove duplicates based on key" }
        );
    }

    // Object Manipulation
    if (inputAnalysis.dataTypes.objects.length > 0 || outputAnalysis.dataTypes.objects.length > 0) {
        coreFunction.push(
            { name: "pluck", syntax: "array pluck field_name", example: "users pluck $.name", description: "Extract specific field from array of objects" },
            { name: "mapObject", syntax: "object mapObject ((value, key) -> {(new_key): new_value})", example: "user mapObject ((v,k) -> {(upper(k)): v})", description: "Transform object keys and/or values" },
            { name: "filterObject", syntax: "object filterObject ((value, key) -> boolean_condition)", example: "user filterObject ((v,k) -> k != 'password')", description: "Filter object properties based on condition" },
            { name: "keysOf", syntax: "keysOf(object)", example: "keysOf({name: 'John', age: 30})", description: "Get array of object keys" },
            { name: "valuesOf", syntax: "valuesOf(object)", example: "valuesOf({name: 'John', age: 30})", description: "Get array of object values" }
        );
    }

    // Multi-entity processing
    if (businessLogic.businessRules.includes("multi_entity_relationships")) {
        coreFunction.push(
            { name: "joinBy", syntax: "leftArray joinBy ((left) -> key) rightArray joinBy ((right) -> key)", example: "orders joinBy $.customerId customers joinBy $.id", description: "Join two arrays based on matching keys" },
            { name: "leftJoin", syntax: "leftArray leftJoin ((left) -> key) rightArray joinBy ((right) -> key)", example: "customers leftJoin $.id orders joinBy $.customerId", description: "Left join preserving all left elements" },
            { name: "outerJoin", syntax: "leftArray outerJoin ((left) -> key) rightArray joinBy ((right) -> key)", example: "products outerJoin $.categoryId categories joinBy $.id", description: "Outer join preserving all elements from both arrays" }
        );
    }

    // Type Conversions and Safety
    if (inputAnalysis.dataTypes.numbers.length > 0 || inputAnalysis.dataTypes.strings.length > 0) {
        coreFunction.push(
            { name: "as", syntax: "value as DataType", example: "'123' as Number, '2023-01-01' as Date", description: "Type coercion with error on failure" },
            { name: "default", syntax: "expression default null", example: "user.age default null, user.name default null (R-Genie NULL-FIRST: always use null unless transformation notes require specific default)", description: "Provide fallback value for null/undefined - R-Genie standard is 'default null'" },
            { name: "if-else", syntax: "if (condition) expression1 else expression2", example: "if (age >= 18) 'Adult' else 'Minor'", description: "Conditional expressions" },
            { name: "try-else", syntax: "try expression1 else expression2", example: "try (price as Number) else null", description: "Error handling with fallback" }
        );
    }

    return getSuggestedFunctionsForCompatibility(coreFunction, inputAnalysis, outputAnalysis, businessLogic);
}

// 🆕 ENHANCED: XML Processing Pattern Detection (supports both input and output)
function detectXmlOutputContext(inputAnalysis, outputAnalysis, transformationNotes = '', inputFile = '', expectedOutputFile = '') {
    const isXmlTransformation = {
        hasXmlInput: false,
        hasXmlOutput: false,
        xmlPatterns: [],
        xmlComplexity: 'simple',
        requiresNamespaces: false,
        requiresAttributes: false,
        requiresArrays: false
    };

    // Check file formats directly
    if (inputFile && detectFileFormat(inputFile) === 'xml') {
        isXmlTransformation.hasXmlInput = true;
        log('ENHANCED', '🔍 XML input file detected');
    }
    
    if (expectedOutputFile && detectFileFormat(expectedOutputFile) === 'xml') {
        isXmlTransformation.hasXmlOutput = true;
        log('ENHANCED', '🔍 XML output file detected');
    }

    // Check for XML in field names and notes
    const allText = (transformationNotes + ' ' + [...inputAnalysis.fields, ...outputAnalysis.fields].join(' ')).toLowerCase();
    
    // XML indicators from attributes in field names
    const hasXmlAttributes = [...inputAnalysis.fields, ...outputAnalysis.fields].some(field => field.startsWith('@'));
    if (hasXmlAttributes) {
        isXmlTransformation.hasXmlInput = true;
        isXmlTransformation.requiresAttributes = true;
        log('ENHANCED', '🏷️ XML attributes detected in field structure');
    }
    
    // XML output indicators from transformation notes
    if (allText.includes('xml') || allText.includes('namespace') || allText.includes('attribute') || 
        allText.includes('element') || allText.includes('soap') || allText.includes('xpath')) {
        isXmlTransformation.hasXmlOutput = true;
    }

    // XML complexity detection
    if (allText.includes('namespace') || allText.includes('soap') || allText.includes('xmlns')) {
        isXmlTransformation.requiresNamespaces = true;
        isXmlTransformation.xmlComplexity = 'complex';
    }

    if (allText.includes('attribute') || allText.includes('@')) {
        isXmlTransformation.requiresAttributes = true;
    }

    if (inputAnalysis.dataTypes.arrays.length > 0 && isXmlTransformation.hasXmlOutput) {
        isXmlTransformation.requiresArrays = true;
        isXmlTransformation.xmlComplexity = 'moderate';
    }

    return isXmlTransformation;
}

// 🆕 ENHANCED: XML-Specific Pattern Recommendations (supports input and output)
function getXmlProcessingPatterns(xmlContext, inputAnalysis, outputAnalysis) {
    if (!xmlContext.hasXmlInput && !xmlContext.hasXmlOutput) return null;

    const xmlPatterns = {
        category: "xml_processing",
        priority: "high",
        patterns: [],
        antiPatterns: [],
        bestPractices: [],
        troubleshooting: []
    };

    // XML Input Declaration Pattern
    if (xmlContext.hasXmlInput) {
        xmlPatterns.patterns.push({
            name: "xml_input_declaration",
            priority: "critical",
            description: "ALWAYS declare XML input format in DataWeave header",
            syntax: "input payload application/xml",
            examples: [
                "%dw 2.0\ninput payload application/xml\noutput application/json",
                "%dw 2.0\ninput payload application/xml\noutput application/xml"
            ],
            reasoning: "Required for DataWeave to parse XML input correctly"
        });
    }

    // Core XML Array Handling Patterns
    if (xmlContext.requiresArrays || xmlContext.hasXmlInput) {
        xmlPatterns.patterns.push({
            name: "multivalue_selectors",
            priority: "critical",
            description: "ALWAYS use multivalue selectors (.*) as FIRST CHOICE for XML arrays",
            syntax: "payload.catalog.*product map (product) -> { /* transformation */ }",
            examples: [
                "payload.orders.*order filter ($.@status == \"ACTIVE\")",
                "payload.customers.*customer distinctBy ($.@id)",
                "payload.inventory.*item orderBy ($.@priority)"
            ],
            reasoning: "XML-native approach that handles single/multiple elements correctly"
        });

        xmlPatterns.antiPatterns.push({
            name: "avoid_valuesof_first",
            description: "AVOID valuesOf() as first choice for XML arrays",
            wrongPattern: "valuesOf(payload.catalog) map (product) -> { /* transformation */ }",
            correctPattern: "payload.catalog.*product map (product) -> { /* transformation */ }"
        });
    }

    // XML Attribute Handling
    if (xmlContext.requiresAttributes) {
        xmlPatterns.patterns.push({
            name: "attribute_extraction",
            priority: "critical", 
            description: "ALWAYS use @ prefix for XML attribute access",
            syntax: "product.@id, product.@category, product.price.@currency",
            examples: [
                "{ productId: product.@id, category: product.@category }",
                "product.@category default null",
                "(product.@status default null) != null"
            ],
            reasoning: "Required syntax for accessing XML attributes"
        });
    }

    // XML Namespace Handling
    if (xmlContext.requiresNamespaces) {
        xmlPatterns.patterns.push({
            name: "namespace_handling",
            priority: "high",
            description: "Proper namespace and complex XML element access",
            syntax: "payload.\"ns1:product\".@\"ns1:id\", payload.\"soap:Envelope\".\"soap:Body\"",
            examples: [
                "payload.order.@xmlns.ns0",
                "payload.\"soap:Envelope\".\"soap:Body\".\"ns1:ProductResponse\".*\"ns1:Product\"",
                "payload.customer.@xmlns"
            ],
            reasoning: "Handle namespaced XML elements and SOAP structures"
        });
    }

    // XML Troubleshooting Patterns
    xmlPatterns.troubleshooting.push({
        name: "single_vs_multiple_elements",
        issue: "Cannot coerce Object to Array (XML single vs multiple elements)",
        solutions: [
            {
                approach: "multivalue_selector",
                code: "payload.catalog.*product map (...)",
                description: "Always treats as array, handles single/multiple correctly"
            },
            {
                approach: "safe_array_conversion", 
                code: `(payload.catalog.product match {
    case arr is Array -> arr
    case obj is Object -> [obj]
    else -> []
}) map (...)`,
                description: "Force array conversion with type matching"
            }
        ]
    });

    xmlPatterns.troubleshooting.push({
        name: "collapsed_elements",
        issue: "You called the function 'map' with Object (XML collapsed elements)",
        solutions: [{
            approach: "multivalue_selector",
            code: "payload.specifications.*spec map (...)",
            description: "Use multivalue selector instead of direct element access"
        }]
    });

    // XML Best Practices
    xmlPatterns.bestPractices = [
        "Priority Order: 1) Multivalue Selectors First, 2) Attribute Access with @, 3) Type Conversion with defaults",
        "Always validate XML structure before processing complex transformations",
        "Cache XML selections for large data processing: var products = payload.catalog.*product",
        "Use quoted syntax for namespaced elements: payload.\"ns1:element\"",
        "Extract text values with type conversion: spec as String, price as Number default null"
    ];

    return xmlPatterns;
}

// 🆕 ENHANCED: Module-specific function suggestions with import syntax
function getModuleImportSuggestions(inputAnalysis, outputAnalysis, businessLogic) {
    const moduleImports = [];

    // String Module Functions
    if (inputAnalysis.dataTypes.strings.length > 0 || outputAnalysis.dataTypes.strings.length > 0) {
        moduleImports.push({
            module: "dw::core::Strings",
            functions: [
                { name: "capitalize", syntax: "import capitalize from dw::core::Strings\ncapitalize(string)", example: "capitalize('hello world') // 'Hello World'", description: "Capitalize first letter of each word" },
                { name: "camelize", syntax: "import camelize from dw::core::Strings\ncamelize(string)", example: "camelize('hello-world') // 'helloWorld'", description: "Convert to camelCase" },
                { name: "dasherize", syntax: "import dasherize from dw::core::Strings\ndasherize(string)", example: "dasherize('HelloWorld') // 'hello-world'", description: "Convert to kebab-case" },
                { name: "underscore", syntax: "import underscore from dw::core::Strings\nunderscore(string)", example: "underscore('HelloWorld') // 'hello_world'", description: "Convert to snake_case" },
                { name: "pluralize", syntax: "import pluralize from dw::core::Strings\npluralize(string)", example: "pluralize('cat') // 'cats'", description: "Convert to plural form" },
                { name: "singularize", syntax: "import singularize from dw::core::Strings\nsingularize(string)", example: "singularize('cats') // 'cat'", description: "Convert to singular form" },
                { name: "wrapWith", syntax: "import wrapWith from dw::core::Strings\nwrapWith(string, wrapper)", example: "wrapWith('hello', '**') // '**hello**'", description: "Wrap string with specified characters" },
                { name: "withMaxSize", syntax: "import withMaxSize from dw::core::Strings\nwithMaxSize(string, maxSize)", example: "withMaxSize('hello world', 5) // 'hello'", description: "Truncate string to maximum size" }
            ]
        });
    }

    // Arrays Module Functions
    if (inputAnalysis.dataTypes.arrays.length > 0) {
        moduleImports.push({
            module: "dw::core::Arrays",
            functions: [
                { name: "countBy", syntax: "import countBy from dw::core::Arrays\narray countBy ((item) -> grouping_key)", example: "users countBy ((user) -> user.status)", description: "Count elements grouped by key" },
                { name: "divideBy", syntax: "import divideBy from dw::core::Arrays\narray divideBy chunkSize", example: "[1,2,3,4,5,6] divideBy 2 // [[1,2], [3,4], [5,6]]", description: "Divide array into chunks of specified size" },
                { name: "drop", syntax: "import drop from dw::core::Arrays\narray drop numberOfElements", example: "[1,2,3,4,5] drop 2 // [3,4,5]", description: "Remove first n elements from array" },
                { name: "dropWhile", syntax: "import dropWhile from dw::core::Arrays\narray dropWhile ((item) -> condition)", example: "[1,2,3,4,5] dropWhile ((item) -> item < 3)", description: "Drop elements while condition is true" },
                { name: "every", syntax: "import every from dw::core::Arrays\narray every ((item) -> boolean_condition)", example: "[2,4,6] every ((item) -> item mod 2 == 0)", description: "Check if all elements match condition" },
                { name: "firstWith", syntax: "import firstWith from dw::core::Arrays\narray firstWith ((item) -> condition)", example: "users firstWith ((user) -> user.active == true)", description: "Find first element matching condition" },
                { name: "indexOf", syntax: "import indexOf from dw::core::Arrays\narray indexOf element", example: "[1,2,3,2] indexOf 2 // 1", description: "Find index of first occurrence" },
                { name: "lastIndexOf", syntax: "import lastIndexOf from dw::core::Arrays\narray lastIndexOf element", example: "[1,2,3,2] lastIndexOf 2 // 3", description: "Find index of last occurrence" },
                { name: "partition", syntax: "import partition from dw::core::Arrays\narray partition ((item) -> boolean_condition)", example: "[1,2,3,4,5] partition ((item) -> item mod 2 == 0)", description: "Split array into two based on condition" },
                { name: "slice", syntax: "import slice from dw::core::Arrays\narray slice fromIndex until toIndex", example: "[1,2,3,4,5] slice 1 until 4 // [2,3,4]", description: "Extract portion of array" },
                { name: "some", syntax: "import some from dw::core::Arrays\narray some ((item) -> boolean_condition)", example: "[1,2,3] some ((item) -> item > 2)", description: "Check if any element matches condition" },
                { name: "splitAt", syntax: "import splitAt from dw::core::Arrays\narray splitAt index", example: "[1,2,3,4,5] splitAt 2 // {l: [1,2], r: [3,4,5]}", description: "Split array at specified index" },
                { name: "splitWhere", syntax: "import splitWhere from dw::core::Arrays\narray splitWhere ((item) -> condition)", example: "[1,2,3,4,5] splitWhere ((item) -> item == 3)", description: "Split array where condition is met" },
                { name: "take", syntax: "import take from dw::core::Arrays\narray take numberOfElements", example: "[1,2,3,4,5] take 3 // [1,2,3]", description: "Take first n elements from array" },
                { name: "takeWhile", syntax: "import takeWhile from dw::core::Arrays\narray takeWhile ((item) -> condition)", example: "[1,2,3,4,5] takeWhile ((item) -> item < 4)", description: "Take elements while condition is true" }
            ]
        });
    }

    // Objects Module Functions  
    if (inputAnalysis.dataTypes.objects.length > 0 || outputAnalysis.dataTypes.objects.length > 0) {
        moduleImports.push({
            module: "dw::core::Objects",
            functions: [
                { name: "divideBy", syntax: "import divideBy from dw::core::Objects\nobject divideBy fieldNames", example: "user divideBy ['name', 'email']", description: "Divide object into two based on field names" },
                { name: "entrySet", syntax: "import entrySet from dw::core::Objects\nentrySet(object)", example: "entrySet({name: 'John', age: 30})", description: "Convert object to array of key-value pairs" },
                { name: "everyEntry", syntax: "import everyEntry from dw::core::Objects\nobject everyEntry ((value, key) -> condition)", example: "scores everyEntry ((v,k) -> v >= 60)", description: "Check if all entries match condition" },
                { name: "mergeWith", syntax: "import mergeWith from dw::core::Objects\nobject1 mergeWith object2", example: "{a: 1} mergeWith {b: 2} // {a: 1, b: 2}", description: "Merge two objects" },
                { name: "nameSet", syntax: "import nameSet from dw::core::Objects\nnameSet(object)", example: "nameSet({name: 'John', age: 30}) // ['name', 'age']", description: "Get set of object field names" },
                { name: "someEntry", syntax: "import someEntry from dw::core::Objects\nobject someEntry ((value, key) -> condition)", example: "user someEntry ((v,k) -> k == 'email')", description: "Check if any entry matches condition" },
                { name: "takeWhile", syntax: "import takeWhile from dw::core::Objects\nobject takeWhile ((value, key) -> condition)", example: "user takeWhile ((v,k) -> k != 'password')", description: "Take entries while condition is true" }
            ]
        });
    }

    // Date/Time Module Functions
    if (inputAnalysis.dataTypes.dates.length > 0) {
        moduleImports.push({
            module: "dw::core::Dates",
            functions: [
                { name: "atBeginningOfDay", syntax: "import atBeginningOfDay from dw::core::Dates\natBeginningOfDay(dateTime)", example: "atBeginningOfDay(now()) // Start of current day", description: "Get start of day for given date" },
                { name: "atBeginningOfHour", syntax: "import atBeginningOfHour from dw::core::Dates\natBeginningOfHour(dateTime)", example: "atBeginningOfHour(now()) // Start of current hour", description: "Get start of hour for given date" },
                { name: "atBeginningOfMonth", syntax: "import atBeginningOfMonth from dw::core::Dates\natBeginningOfMonth(dateTime)", example: "atBeginningOfMonth(now()) // Start of current month", description: "Get start of month for given date" },
                { name: "atBeginningOfWeek", syntax: "import atBeginningOfWeek from dw::core::Dates\natBeginningOfWeek(dateTime)", example: "atBeginningOfWeek(now()) // Start of current week", description: "Get start of week for given date" },
                { name: "atBeginningOfYear", syntax: "import atBeginningOfYear from dw::core::Dates\natBeginningOfYear(dateTime)", example: "atBeginningOfYear(now()) // Start of current year", description: "Get start of year for given date" },
                { name: "daysBetween", syntax: "import daysBetween from dw::core::Dates\ndaysBetween(date1, date2)", example: "daysBetween(|2023-01-01|, |2023-01-31|) // 30", description: "Calculate days between two dates" },
                { name: "format", syntax: "import format from dw::core::Dates\nformat(dateTime, formatString)", example: "format(now(), 'yyyy-MM-dd HH:mm:ss')", description: "Format date/time as string" },
                { name: "isLeapYear", syntax: "import isLeapYear from dw::core::Dates\nisLeapYear(year)", example: "isLeapYear(2024) // true", description: "Check if year is leap year" },
                { name: "toLocalDate", syntax: "import toLocalDate from dw::core::Dates\ntoLocalDate(dateTime)", example: "toLocalDate(now()) // Local date only", description: "Extract date part from datetime" },
                { name: "toLocalDateTime", syntax: "import toLocalDateTime from dw::core::Dates\ntoLocalDateTime(zonedDateTime)", example: "toLocalDateTime(now()) // Local datetime", description: "Convert to local datetime" },
                { name: "toTimeZone", syntax: "import toTimeZone from dw::core::Dates\ntoTimeZone(dateTime, timezone)", example: "toTimeZone(now(), 'UTC')", description: "Convert datetime to specified timezone" }
            ]
        });
    }

    // Math Module Functions
    if (inputAnalysis.dataTypes.numbers.length > 0 || businessLogic.calculations.length > 0) {
        moduleImports.push({
            module: "dw::core::Math",
            functions: [
                { name: "abs", syntax: "import abs from dw::core::Math\nabs(number)", example: "abs(-5) // 5", description: "Absolute value" },
                { name: "ceil", syntax: "import ceil from dw::core::Math\nceil(number)", example: "ceil(4.3) // 5", description: "Round up to nearest integer" },
                { name: "floor", syntax: "import floor from dw::core::Math\nfloor(number)", example: "floor(4.8) // 4", description: "Round down to nearest integer" },
                { name: "max", syntax: "import max from dw::core::Math\nmax(numbers_array)", example: "max([1,2,3,4,5]) // 5", description: "Find maximum value in array" },
                { name: "min", syntax: "import min from dw::core::Math\nmin(numbers_array)", example: "min([1,2,3,4,5]) // 1", description: "Find minimum value in array" },
                { name: "pow", syntax: "import pow from dw::core::Math\npow(base, exponent)", example: "pow(2, 3) // 8", description: "Raise number to power" },
                { name: "random", syntax: "import random from dw::core::Math\nrandom()", example: "random() // Random number 0-1", description: "Generate random number" },
                { name: "randomInt", syntax: "import randomInt from dw::core::Math\nrandomInt(maxValue)", example: "randomInt(100) // Random int 0-99", description: "Generate random integer" },
                { name: "round", syntax: "import round from dw::core::Math\nround(number)", example: "round(4.6) // 5", description: "Round to nearest integer" },
                { name: "sqrt", syntax: "import sqrt from dw::core::Math\nsqrt(number)", example: "sqrt(16) // 4", description: "Square root" }
            ]
        });
    }

    // Crypto Module Functions (for security/hashing needs)
    if (inputAnalysis.dataTypes.strings.some(field => field.includes('password') || field.includes('secret') || field.includes('token')) ||
        outputAnalysis.dataTypes.strings.some(field => field.includes('hash') || field.includes('encrypted'))) {
        moduleImports.push({
            module: "dw::crypto::Hash",
            functions: [
                { name: "MD5", syntax: "import MD5 from dw::crypto::Hash\nMD5(string)", example: "MD5('hello') // MD5 hash", description: "Generate MD5 hash" },
                { name: "SHA1", syntax: "import SHA1 from dw::crypto::Hash\nSHA1(string)", example: "SHA1('hello') // SHA1 hash", description: "Generate SHA1 hash" },
                { name: "SHA256", syntax: "import SHA256 from dw::crypto::Hash\nSHA256(string)", example: "SHA256('hello') // SHA256 hash", description: "Generate SHA256 hash" }
            ]
        });
    }

    // UUID Module Functions (for ID generation)
    if (outputAnalysis.dataTypes.strings.some(field => field.includes('id') || field.includes('uuid') || field.includes('guid'))) {
        moduleImports.push({
            module: "dw::core::UUID",
            functions: [
                { name: "uuid", syntax: "import uuid from dw::core::UUID\nuuid()", example: "uuid() // Random UUID", description: "Generate random UUID" }
            ]
        });
    }

    // URL Module Functions (for URL processing)
    if (inputAnalysis.dataTypes.strings.some(field => field.includes('url') || field.includes('uri') || field.includes('link')) ||
        outputAnalysis.dataTypes.strings.some(field => field.includes('url') || field.includes('uri') || field.includes('encoded'))) {
        moduleImports.push({
            module: "dw::core::URL",
            functions: [
                { name: "encodeURI", syntax: "import encodeURI from dw::core::URL\nencodeURI(string)", example: "encodeURI('hello world') // 'hello%20world'", description: "Encode URI components" },
                { name: "decodeURI", syntax: "import decodeURI from dw::core::URL\ndecodeURI(encodedString)", example: "decodeURI('hello%20world') // 'hello world'", description: "Decode URI components" },
                { name: "encodeURIComponent", syntax: "import encodeURIComponent from dw::core::URL\nencodeURIComponent(string)", example: "encodeURIComponent('hello&world')", description: "Encode URI component" },
                { name: "decodeURIComponent", syntax: "import decodeURIComponent from dw::core::URL\ndecodeURIComponent(encodedString)", example: "decodeURIComponent('hello%26world')", description: "Decode URI component" }
            ]
        });
    }

    // Types Module Functions (for type checking and conversion)
    if (inputAnalysis.totalFields > 20 || inputAnalysis.nestedDepth > 3) {
        moduleImports.push({
            module: "dw::core::Types",
            functions: [
                { name: "isArrayType", syntax: "import isArrayType from dw::core::Types\nisArrayType(typeOf(value))", example: "isArrayType(typeOf([1,2,3])) // true", description: "Check if value is array type" },
                { name: "isObjectType", syntax: "import isObjectType from dw::core::Types\nisObjectType(typeOf(value))", example: "isObjectType(typeOf({a: 1})) // true", description: "Check if value is object type" },
                { name: "isStringType", syntax: "import isStringType from dw::core::Types\nisStringType(typeOf(value))", example: "isStringType(typeOf('hello')) // true", description: "Check if value is string type" },
                { name: "isNumberType", syntax: "import isNumberType from dw::core::Types\nisNumberType(typeOf(value))", example: "isNumberType(typeOf(123)) // true", description: "Check if value is number type" }
            ]
        });
    }

    return moduleImports;
}

// 🔄 COMPATIBILITY: Helper function to maintain backwards compatibility
function getSuggestedFunctionsForCompatibility(coreFunction, inputAnalysis, outputAnalysis, businessLogic) {
    const moduleImports = getModuleImportSuggestions(inputAnalysis, outputAnalysis, businessLogic);
    
    // Build simple array for legacy compatibility
    const allFunctions = [...coreFunction.map(f => f.name)];
    moduleImports.forEach(mod => {
        allFunctions.push(...mod.functions.map(f => f.name));
    });

    return allFunctions;
}

function generateTransformationPlan(inputAnalysis, outputAnalysis) {
    const plan = {
        phases: [],
        estimatedSteps: 0,
        riskFactors: [],
        recommendations: []
    };

    // Phase 1: Data extraction and flattening
    if (inputAnalysis.nestedDepth > 2) {
        plan.phases.push({
            phase: "data_extraction",
            description: "Extract and flatten nested structures",
            functions: ["flatten", "map", "pluck"]
        });
        plan.estimatedSteps += 2;
    }

    // Phase 2: Data processing and calculations
    if (outputAnalysis.dataTypes.numbers.length > inputAnalysis.dataTypes.numbers.length) {
        plan.phases.push({
            phase: "calculations",
            description: "Perform aggregations and business calculations",
            functions: ["sumBy", "sizeOf", "groupBy"]
        });
        plan.estimatedSteps += 3;
    }

    // Phase 3: Output structuring
    plan.phases.push({
        phase: "output_structuring", 
        description: "Structure final output according to expected format",
        functions: ["map", "filter", "conditional logic"]
    });
    plan.estimatedSteps += 2;

    // Risk assessment
    if (inputAnalysis.nestedDepth > 3) {
        plan.riskFactors.push("Deep nesting may require complex selector patterns");
    }
    
    if (inputAnalysis.dataTypes.arrays.length > 3) {
        plan.riskFactors.push("Multiple arrays may require careful join logic");
    }

    // Recommendations
    plan.recommendations.push("Use safe default operators for type conversions");
    plan.recommendations.push("Implement utility functions for reusable calculations");
    
    if (inputAnalysis.dataTypes.dates.length > 0) {
        plan.recommendations.push("Use now() function for dynamic date calculations");
    }

    return plan;
}

module.exports = {
    // 🚀 Enhanced functions (primary interface)
    performEnhancedAnalysis,
    detectBusinessDomain,
    extractBusinessRules,
    detectCalculationPatterns,
    assessAccuracyRisks,
    recommendValidationStrategy,
    getModuleImportSuggestions,
    detectXmlOutputContext,
    getXmlProcessingPatterns,
    
    // 🔄 Legacy compatibility functions (for backwards compatibility)
    analyzeStructure: analyzeStructureDetailed,
    detectReservedKeywords,
    inferBusinessLogic,
    estimateComplexity,
    suggestDataWeaveFunctions,
    generateTransformationPlan
};
