# R-Genie MuleSoft Mapping Generator

An AI-powered mapping sheet generator built on MuleSoft that creates comprehensive Excel mapping documentation from input/output examples with optional Boomi mapping sheet integration.

![R-Genie Logo](https://via.placeholder.com/200x100/4f46e5/ffffff?text=R-Genie)

## 🚀 Features

- **AI-Powered Analysis**: Uses Google Gemini models to analyze data structures with intelligent mode selection
- **Multiple Generation Modes**: Velocity, Balanced, Precision, and Reasoning modes optimized for Gemini models
- **Boomi Integration**: Optional support for existing Boomi mapping sheets as enhancement input
- **Excel Output**: Generates comprehensive Excel files with multiple sheets for different aspects
- **Web Interface**: Built-in web UI for easy interaction and configuration
- **Multi-Format Support**: Handles JSON, XML, and CSV data formats
- **Error Handling**: Robust error handling with fallback mechanisms
- **RESTful API**: Clean API endpoints for integration with other systems

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Generation Modes](#generation-modes)
- [Architecture](#architecture)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🔧 Prerequisites

- **MuleSoft Anypoint Studio** 7.14.0 or later
- **Mule Runtime** 4.9.0 or later
- **Java** 8 or 11
- **Maven** 3.6.0 or later
- **Google Gemini API Key** (required):
  - Get your API key from [Google AI Studio](https://makersuite.google.com/)

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd r-genie-mulesoft-mapping-generator
```

### 2. Import into Anypoint Studio

1. Open Anypoint Studio
2. File → Import → Anypoint Studio Project from File System
3. Select the project folder
4. Click Finish

### 3. Configure Dependencies

```bash
mvn clean compile
```

### 4. Set Up API Keys

1. Copy the secure configuration template:
   ```bash
   cp src/main/resources/application-secure.yaml.example src/main/resources/application-secure.yaml
   ```

2. Edit `application-secure.yaml` and add your Gemini API key:
   ```yaml
   gemini:
     api:
       key: "your-gemini-api-key-here"
   ```

## ⚙️ Configuration

### Environment Variables

You can also set the Gemini API key using environment variables:

```bash
export GEMINI_API_KEY="your-gemini-api-key"
```

### Application Properties

Key configuration files:

- `application-dev.yaml` - Development settings
- `application-secure.yaml` - API keys (create from template)
- `generation-modes.yaml` - AI model configurations

### File Output Configuration

```yaml
file:
  output:
    defaultDirectory: "/tmp/r-genie-output"
    workingDirectory: "/tmp/r-genie-temp"
    allowCustomPath: true
    maxFileSize: "50MB"
```

## 🖥️ Usage

### 1. Start the Application

From Anypoint Studio:
1. Right-click the project
2. Run As → Mule Application

Or from command line:
```bash
mvn mule:run
```

### 2. Access the Web Interface

Open your browser and navigate to:
```
http://localhost:8081
```

### 3. Generate Mapping Sheet

1. **Enter Input Data**: Paste your source data structure (JSON/XML)
2. **Enter Expected Output**: Paste your target data structure
3. **Add Context (Optional)**: Provide additional business context or requirements
4. **Upload Boomi File (Optional)**: Upload existing Boomi mapping Excel file for enhancement
5. **Select Generation Mode**: Choose from Velocity, Balanced, Precision, or Reasoning
6. **Configure Output**: Set filename and target directory (optional)
7. **Generate**: Click Generate Mapping Sheet

### 4. API Usage

You can also use the REST API directly:

```bash
curl -X POST http://localhost:8081/api/generate-mapping \
  -H "Content-Type: application/json" \
  -d '{
    "inputData": "{\"customer\": {\"name\": \"John\", \"email\": \"john@email.com\"}}",
    "expectedOutput": "{\"person\": {\"fullName\": \"John\", \"contactEmail\": \"john@email.com\"}}",
    "generationMode": "balanced",
    "contextInstructions": "Map customer data to person format",
    "excelFilename": "customer-mapping",
    "targetDirectory": "/path/to/output"
  }'
```

## 📖 API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Web interface |
| `GET` | `/health` | Health check |
| `POST` | `/api/generate-mapping` | Generate mapping sheet |
| `GET` | `/api/modes` | List generation modes |

### Generate Mapping Request

```json
{
  "inputData": "string (required)",
  "expectedOutput": "string (required)", 
  "generationMode": "velocity|balanced|precision|reasoning (required)",
  "contextInstructions": "string (optional)",
  "excelFilename": "string (optional)",
  "targetDirectory": "string (optional)"
}
```

### Response Format

```json
{
  "success": true,
  "message": "Mapping sheet generated successfully",
  "data": {
    "filename": "mapping-sheet-2024-01-15_14-30-22.xlsx",
    "filePath": "/tmp/r-genie-output/mapping-sheet-2024-01-15_14-30-22.xlsx",
    "fileSize": 45632,
    "generationMode": "balanced",
    "processingTime": 5420,
    "mappingsGenerated": 12
  },
  "timestamp": "2024-01-15T14:30:22.123Z",
  "requestId": "req-123e4567-e89b-12d3-a456-426614174000"
}
```

## 🎯 Generation Modes

### 🏃 Velocity Mode
- **Speed**: Fast (60s timeout)
- **Model**: Gemini-2.0-Flash-Lite-001
- **Use Case**: Quick prototyping, simple mappings
- **Output**: Basic field mappings with standard documentation

### ⚖️ Balanced Mode
- **Speed**: Moderate (90s timeout)
- **Model**: Gemini-2.5-Flash
- **Use Case**: Production mappings, comprehensive analysis
- **Output**: Detailed mappings with business rules

### 🎯 Precision Mode
- **Speed**: Slower (120s timeout)
- **Model**: Gemini-2.5-Pro
- **Use Case**: Critical business mappings, compliance requirements
- **Output**: Extensive documentation with validation rules

### 🧠 Advanced Reasoning Mode
- **Speed**: Slowest (300s timeout)
- **Model**: Gemini-2.5-Pro
- **Use Case**: Complex enterprise scenarios, legacy integration
- **Output**: Deep analytical reasoning with multi-step logic

## 🏗️ Architecture

### MuleSoft Flow Structure

```
┌─────────────────────┐
│   Web Interface     │
│   (Static Files)    │
└─────────┬───────────┘
          │
┌─────────▼───────────┐
│   API Gateway       │
│   (HTTP Listener)   │
└─────────┬───────────┘
          │
┌─────────▼───────────┐
│   Input Validation  │
│   (Data Validation) │
└─────────┬───────────┘
          │
┌─────────▼───────────┐
│   LLM Service       │
│   (Multi-Provider)  │
└─────────┬───────────┘
          │
┌─────────▼───────────┐
│   Excel Generation  │
│   (Apache POI)      │
└─────────┬───────────┘
          │
┌─────────▼───────────┐
│   File Operations   │
│   (File Connector)  │
└─────────────────────┘
```

### Key Components

- **Main Flow**: `r-genie-mapping-generator.xml`
- **Subflows**: `subflows.xml`
- **LLM Integration**: `llm-service.xml`
- **Global Config**: `global.xml`
- **Error Handling**: `error.xml`

## 🛠️ Development

### Project Structure

```
r-genie-mulesoft-mapping-generator/
├── src/main/
│   ├── mule/                          # MuleSoft flows
│   │   ├── r-genie-mapping-generator.xml
│   │   ├── subflows.xml
│   │   ├── llm-service.xml
│   │   ├── global.xml
│   │   └── error.xml
│   └── resources/
│       ├── webapp/                    # Web interface
│       │   └── index.html
│       ├── prompts/                   # AI prompt templates
│       │   └── mapping-sheet-generator.txt
│       ├── application-dev.yaml       # Development config
│       ├── application-secure.yaml.example
│       └── generation-modes.yaml      # AI model configs
├── pom.xml                           # Maven dependencies
├── mule-artifact.json                # MuleSoft artifact config
└── README.md
```

### Adding New LLM Providers

1. Create a new subflow in `llm-service.xml`
2. Add HTTP request configuration in `global.xml`
3. Update `generation-modes.yaml` with provider settings
4. Add API key configuration to secure properties

### Customizing Prompt Templates

Edit `src/main/resources/prompts/mapping-sheet-generator.txt` to modify the AI prompt template. Use placeholders like `{{INPUT_DATA}}` for dynamic content.

## 🔍 Troubleshooting

### Common Issues

#### 1. API Key Errors
**Error**: `INVALID_API_KEY`
**Solution**: Verify API keys in `application-secure.yaml` or environment variables

#### 2. File Permission Errors
**Error**: `FILE_ACCESS_DENIED`
**Solution**: Check write permissions for the target directory

#### 3. LLM Service Timeout
**Error**: `HTTP:TIMEOUT`
**Solution**: Try a faster generation mode (Velocity) or check API service status

#### 4. JSON Parsing Errors
**Error**: `JSON_PARSE_ERROR`
**Solution**: Validate input/output data format in a JSON validator

### Debug Mode

Enable debug logging by setting log level in `log4j2.xml`:

```xml
<Logger name="org.mule.extension.http" level="DEBUG"/>
<Logger name="com.rgenie" level="DEBUG"/>
```

### Health Check

Monitor application health:
```bash
curl http://localhost:8081/health
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow MuleSoft best practices
- Add appropriate logging and error handling
- Update documentation for new features
- Test with multiple AI providers
- Validate Excel output format

## 📝 License

This project is under development. All rights reserved.

## 🙏 Acknowledgments

- MuleSoft Community for excellent documentation
- OpenAI, Anthropic, Google, and Salesforce for AI services
- Apache POI for Excel generation capabilities
- Contributors and beta testers

## 📞 Support

Contact the R-GENIE development team for support.

---

**Made with ❤️ for the MuleSoft and AI Community**