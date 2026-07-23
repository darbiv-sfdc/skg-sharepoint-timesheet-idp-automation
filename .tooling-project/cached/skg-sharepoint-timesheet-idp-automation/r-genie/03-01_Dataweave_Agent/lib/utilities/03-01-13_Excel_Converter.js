#!/usr/bin/env node

/**
 * 🧞‍♂️ R-Genie Simple Excel Converter v3.0 (Streamlined)
 * Pure Excel to JSON/CSV converter for Cursor AI readability
 * 
 * @author Cheppali Shaik Sohail
 * @signature Q2hlcHBhbGlTaGFpa1NvaGFpbDE1MDgxOTkz
 * @system DataWeave Intelligence System v3.1+ - Excel Conversion Utility
 * @purpose Convert Excel files to clean JSON/CSV formats for AI consumption
 * @version 3.0.0 - Simplified for AI readability and accurate data extraction
 * 
 * Usage:
 *   node excel-converter-simple.js <excel_file> [options]
 */

const fs = require('fs');
const path = require('path');

// Note: To use this converter, install the required dependency:
// npm install exceljs

let ExcelJS;
try {
    ExcelJS = require('exceljs');
} catch (error) {
    console.error('📦 ExcelJS library not found. Install with: npm install exceljs');
    process.exit(1);
}

// Simple logging function
function log(message) {
    console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
}

class SimpleExcelConverter {
    constructor() {
        this.version = '3.0.0';
        this.supportedFormats = ['.xlsx', '.xls'];
    }

    /**
     * Main conversion entry point
     */
    async convertExcelFile(excelFile, options = {}) {
        try {
            log(`🧞‍♂️ R-Genie Simple Excel Converter v${this.version}`);
            log(`📊 Converting Excel to readable formats for AI...`);
            log(`📁 Excel File: ${excelFile}`);
            
            // Validate file
            this.validateExcelFile(excelFile);
            
            // Read Excel workbook
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(excelFile);
            
            // Convert all worksheets
            const results = await this.convertAllWorksheets(workbook, excelFile, options);
            
            // Generate simple report
            this.generateSimpleReport(results, excelFile);
            
            log('✨ Excel conversion complete!');
            return results;
            
        } catch (error) {
            log(`💥 Conversion failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Validate Excel file exists and is readable
     */
    validateExcelFile(excelFile) {
        if (!fs.existsSync(excelFile)) {
            throw new Error(`Excel file not found: ${excelFile}`);
        }
        
        const ext = path.extname(excelFile).toLowerCase();
        if (!this.supportedFormats.includes(ext)) {
            throw new Error(`Unsupported file format: ${ext}. Supported: ${this.supportedFormats.join(', ')}`);
        }
    }

    /**
     * Convert all worksheets to JSON and CSV
     */
    async convertAllWorksheets(workbook, excelFile, options) {
        const results = {
            inputFile: excelFile,
            outputFiles: [],
            worksheets: [],
            summary: {
                totalSheets: workbook.worksheets.length,
                convertedSheets: 0
            }
        };

        for (const worksheet of workbook.worksheets) {
            if (this.isEmptyWorksheet(worksheet)) {
                log(`⚠️ Skipping empty worksheet: ${worksheet.name}`);
                continue;
            }

            log(`📋 Processing worksheet: ${worksheet.name}`);
            
            const worksheetResult = {
                name: worksheet.name,
                files: {},
                rowCount: 0,
                columnCount: 0
            };

            try {
                let worksheetData = null;
                
                // Convert to JSON (by default, unless csv-only specified)
                if (!options.csvOnly) {
                    worksheetData = this.convertWorksheetToCleanJSON(worksheet);
                    const jsonFile = this.generateOutputPath(excelFile, worksheet.name, 'json');
                    fs.writeFileSync(jsonFile, JSON.stringify(worksheetData, null, 2));
                    
                    worksheetResult.files.json = jsonFile;
                    results.outputFiles.push(jsonFile);
                    log(`✅ JSON created: ${jsonFile}`);
                }

                // Convert to CSV (by default, unless json-only specified)
                if (!options.jsonOnly) {
                    const csvData = this.convertWorksheetToCleanCSV(worksheet);
                    const csvFile = this.generateOutputPath(excelFile, worksheet.name, 'csv');
                    fs.writeFileSync(csvFile, csvData);
                    
                    worksheetResult.files.csv = csvFile;
                    results.outputFiles.push(csvFile);
                    log(`✅ CSV created: ${csvFile}`);
                    
                    // Get data for metrics if not already obtained from JSON conversion
                    if (!worksheetData) {
                        worksheetData = this.convertWorksheetToCleanJSON(worksheet);
                    }
                }
                
                // Set worksheet metrics
                if (worksheetData) {
                    worksheetResult.rowCount = worksheetData.length;
                    worksheetResult.columnCount = worksheetData.length > 0 ? Object.keys(worksheetData[0]).length : 0;
                }

                results.summary.convertedSheets++;
                
            } catch (error) {
                log(`❌ Failed to convert worksheet ${worksheet.name}: ${error.message}`);
                worksheetResult.error = error.message;
            }

            results.worksheets.push(worksheetResult);
        }

        return results;
    }

    /**
     * Check if worksheet is empty
     */
    isEmptyWorksheet(worksheet) {
        let hasData = false;
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                if (cell.value !== null && cell.value !== undefined && cell.value !== '') {
                    hasData = true;
                }
            });
        });
        return !hasData;
    }

    /**
     * Convert worksheet to clean JSON array
     */
    convertWorksheetToCleanJSON(worksheet) {
        const data = [];
        let headers = [];
        let maxColumns = 0;
        let firstDataRow = 1;
        let hasHeaders = false;

        // First pass: determine structure and find max columns
        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            const rowData = [];
            
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                rowData[colNumber - 1] = this.getCellValue(cell);
                maxColumns = Math.max(maxColumns, colNumber);
            });

            // Handle sparse cells
            if (row.values && row.values.length > maxColumns) {
                for (let i = maxColumns; i < row.values.length; i++) {
                    if (row.values[i] !== undefined) {
                        rowData[i - 1] = row.values[i];
                        maxColumns = i;
                    }
                }
            }

            // Check if first row looks like headers
            if (rowNumber === 1) {
                hasHeaders = this.looksLikeHeaders(rowData);
                if (hasHeaders) {
                    headers = rowData.map((val, idx) => 
                        val && val.toString().trim() ? val.toString().trim() : `Column${idx + 1}`
                    );
                    firstDataRow = 2;
                } else {
                    // Generate column names
                    headers = Array.from({ length: maxColumns }, (_, idx) => `Column${idx + 1}`);
                }
            }

            // Collect data rows
            if (rowNumber >= firstDataRow) {
                const rowObject = {};
                for (let i = 0; i < maxColumns; i++) {
                    const header = headers[i] || `Column${i + 1}`;
                    rowObject[header] = rowData[i] !== undefined ? rowData[i] : null;
                }
                data.push(rowObject);
            }
        });

        return data;
    }

    /**
     * Convert worksheet to clean CSV
     */
    convertWorksheetToCleanCSV(worksheet) {
        const rows = [];
        let maxColumns = 0;

        // Collect all data
        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            const rowData = [];
            
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                rowData[colNumber - 1] = this.getCellValue(cell);
                maxColumns = Math.max(maxColumns, colNumber);
            });

            // Handle sparse cells
            if (row.values && row.values.length > maxColumns) {
                for (let i = maxColumns; i < row.values.length; i++) {
                    if (row.values[i] !== undefined) {
                        rowData[i - 1] = row.values[i];
                        maxColumns = i;
                    }
                }
            }

            // Ensure all rows have same number of columns
            while (rowData.length < maxColumns) {
                rowData.push(null);
            }

            rows.push(rowData);
        });

        // Convert to CSV format
        return rows.map(row => 
            row.map(cell => this.formatCsvCell(cell)).join(',')
        ).join('\n');
    }

    /**
     * Get clean cell value
     */
    getCellValue(cell) {
        if (!cell || cell.value === null || cell.value === undefined) {
            return null;
        }

        let value = cell.value;

        // Handle different cell types
        if (typeof value === 'object') {
            if (value.text !== undefined) {
                return value.text;
            }
            if (value.result !== undefined) {
                return value.result;
            }
            if (value instanceof Date) {
                return value.toISOString();
            }
            // For complex objects, stringify
            return JSON.stringify(value);
        }

        return value;
    }

    /**
     * Check if row looks like headers
     */
    looksLikeHeaders(rowData) {
        const nonEmptyValues = rowData.filter(val => val !== null && val !== undefined && val !== '');
        
        if (nonEmptyValues.length === 0) return false;
        
        // Check if values look like header names (mostly strings, not all numbers)
        const stringCount = nonEmptyValues.filter(val => 
            typeof val === 'string' && val.length > 0
        ).length;
        
        const numberCount = nonEmptyValues.filter(val => 
            typeof val === 'number'
        ).length;

        // If more strings than numbers, likely headers
        return stringCount > numberCount;
    }

    /**
     * Format cell for CSV
     */
    formatCsvCell(value) {
        if (value === null || value === undefined) {
            return '';
        }
        
        const str = value.toString();
        
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
            return '"' + str.replace(/"/g, '""') + '"';
        }
        
        return str;
    }

    /**
     * Generate output file path
     */
    generateOutputPath(inputFile, sheetName, format) {
        const dir = path.dirname(inputFile);
        const baseName = path.basename(inputFile, path.extname(inputFile));
        
        // For single sheet named "Sheet1", use base filename
        if (sheetName.toLowerCase() === 'sheet1') {
            return path.join(dir, `${baseName}.${format}`);
        }
        
        // For multiple sheets or named sheets, include sheet name
        const sanitizedSheetName = sheetName.replace(/[^a-zA-Z0-9_-]/g, '_');
        return path.join(dir, `${baseName}_${sanitizedSheetName}.${format}`);
    }

    /**
     * Generate simple conversion report
     */
    generateSimpleReport(results, originalFile) {
        console.log('\n🎯 EXCEL CONVERSION REPORT');
        console.log('═'.repeat(50));
        console.log(`📁 Original: ${originalFile}`);
        console.log(`📊 Sheets: ${results.summary.convertedSheets}/${results.summary.totalSheets} converted`);
        console.log(`📄 Output Files: ${results.outputFiles.length}`);
        
        if (results.outputFiles.length > 0) {
            console.log('\n📋 Generated Files:');
            results.outputFiles.forEach(file => {
                console.log(`   ✅ ${file}`);
            });
        }

        console.log('\n💡 CURSOR AI INTEGRATION:');
        console.log('   📊 Files are now readable by Cursor AI for analysis');
        console.log('   🎯 Use JSON files for structured data analysis');
        console.log('   📄 Use CSV files for tabular data review');
    }
}

// CLI Interface
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        console.log(`
🧞‍♂️ R-Genie Simple Excel Converter v3.0 (Streamlined for AI)

📋 USAGE:
  node excel-converter-simple.js <excel_file> [options]

🎯 OPTIONS:
  --json-only      Generate only JSON files
  --csv-only       Generate only CSV files  
  --help           Show this help message

📊 EXAMPLES:
  node excel-converter-simple.js data.xlsx                    # Both JSON and CSV (default)
  node excel-converter-simple.js mapping.xlsx --json-only     # JSON only for AI analysis
  node excel-converter-simple.js report.xlsx --csv-only       # CSV only for human review

🎯 PURPOSE:
  Convert Excel files to clean JSON/CSV formats for Cursor AI consumption.
  Default: Generates both formats - JSON for AI analysis, CSV for human review.
  No complex AI analysis - just accurate data extraction.
        `);
        process.exit(0);
    }

    const excelFile = args[0];
    const options = {
        jsonOnly: args.includes('--json-only'),
        csvOnly: args.includes('--csv-only')
    };

    // Validate mutually exclusive options
    if (options.jsonOnly && options.csvOnly) {
        console.error('❌ Error: --json-only and --csv-only cannot be used together');
        process.exit(1);
    }

    const converter = new SimpleExcelConverter();
    
    converter.convertExcelFile(excelFile, options)
        .then(results => {
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ Conversion failed:', error.message);
            process.exit(1);
        });
}

// Export for use as module
module.exports = SimpleExcelConverter;

// Run if called directly
if (require.main === module) {
    main();
}
