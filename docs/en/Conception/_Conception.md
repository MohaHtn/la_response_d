# Design Report - Decentralized Digital Library

## 1. System Overview

### 1.1 General Architecture
The system is designed with a modern web architecture with client/server separation:
- **Frontend**: React application with Vite (client/)
- **Backend**: Python REST API with FastAPI (server/)
- **AI Processing**: Integration with Mistral AI for OCR and content analysis

### 1.2 System Objectives
- Digitization and automatic processing of PDF documents
- Intelligent content analysis (metadata, security, appropriateness)
- Conversion to Markdown format for archiving and consultation
- Modern web interface for document management

## 2. Server Architecture

### 2.1 Modular Structure
```
server/src/
├── app/
│   ├── api/          # External integrations (Mistral AI)
│   ├── domain/       # Business logic (currently empty)
│   ├── infra/        # Infrastructure (currently empty)
│   ├── main.py       # FastAPI entry point
│   └── routes.py     # Endpoint definitions
└── cli/              # Command line tools
```

### 2.2 Technical Stack
- **Web framework**: FastAPI (Python)
- **AI and OCR**: Mistral AI (Pixtral and OCR models)
- **Output format**: Markdown with LaTeX support
- **CORS**: Configured to allow cross-origin requests

### 2.3 API Entry Points

#### Main endpoint: `/api/send-book`
- **Method**: POST
- **Input**: PDF file via multipart/form-data
- **Output**: Complete JSON with OCR, analyses and markdown

#### Health endpoint: `/health`
- **Method**: GET
- **Output**: API status

## 3. Intelligent Document Processing

### 3.1 Processing Pipeline (pixtral.py)
The system implements a sophisticated pipeline:

1. **Upload and OCR**
   - Secure upload to Mistral AI
   - OCR with text and image extraction
   - Mathematical formula support (LaTeX)

2. **Metadata Extraction**
   - Document title
   - Author(s)
   - Publication date
   - Publisher
   - Automatic description

3. **Security Analysis**
   - Prompt injection detection
   - Hidden system command identification
   - Risk level assessment (low/medium/high)

4. **Content Analysis**
   - Inappropriate content detection
   - Legality verification
   - Severity classification

5. **Markdown Generation**
   - All pages merging
   - Image integration (base64 or files)
   - Consistent formatting

### 3.2 Image Management
Two supported modes:
- **Embedded**: Base64 images in markdown
- **File-based**: Images saved to disk with references

## 4. CLI Modules (Command Line Interface)

### 4.1 Available Tools
- `ocr.py`: Direct OCR processing
- `deposit.py`: Document deposit
- `moderate.py`: Content moderation
- `export_md.py`: Markdown export
- `format_small_book.py`: Small book formatting

### 4.2 Modular Architecture
CLI tools enable batch processing and task automation.

## 5. Security and Validation

### 5.1 File Validation
- PDF extension verification
- Robust error handling
- PDF files only limitation

### 5.2 Integrated Security Analysis
- Automatic malicious content detection
- Security prompt analysis
- AI risk assessment

### 5.3 API Key Management
- Centralized configuration in `apikey.json`
- Secure credential loading

## 6. Standardized Response Format

### 6.1 JSON Response Structure
```json
{
  "ocr": {
    "pages": [...],
    "model": "mistral-ocr-latest",
    "usage_info": {...}
  },
  "metadata": {
    "title": "...",
    "author": "...",
    "date": "...",
    "publisher": "...",
    "description": "..."
  },
  "security_analysis": {
    "has_security_prompts": false,
    "detected_prompts": [],
    "risk_level": "low",
    "details": "..."
  },
  "content_analysis": {
    "is_appropriate": true,
    "content_warnings": [],
    "severity": "none",
    "details": "..."
  },
  "markdown": "...",
  "processing_info": {
    "file_name": "...",
    "total_pages": 5,
    "total_text_length": 1234
  }
}
```

## 7. Identified Improvement Points

### 7.1 Architecture
- **Domain layer**: Currently empty, to be developed for business logic
- **Infrastructure layer**: To be implemented for persistence and external services
- **Tests**: No tests identified in current code

### 7.2 Features
- **Database**: No persistence currently
- **Authentication**: Not implemented
- **User management**: To be developed
- **Cache**: No OCR result caching

### 7.3 Performance
- **Asynchronous processing**: For large documents
- **Processing queue**: To manage load
- **Compression**: Of images and content

## 8. Frontend Integration

### 8.1 API Communication
- Simple REST endpoints
- Standardized JSON format
- Consistent error handling

### 8.2 File Upload
- multipart/form-data support
- Server-side validation
- Real-time feedback (to be implemented)

## 9. Compliance and Governance

### 9.1 Copyright Compliance
- Automatic content analysis
- Protected material detection
- Moderation workflow

### 9.2 Privacy
- No permanent storage on Mistral
- Local management of sensitive documents
- Content analysis for data protection

## 10. Technical Roadmap

### 10.1 Phase 1 (Current)
- ✅ OCR and basic processing
- ✅ AI content analysis
- ✅ Functional REST API

### 10.2 Phase 2 (Upcoming)
- 🔄 Data persistence
- 🔄 Complete user interface
- 🔄 Authentication system

### 10.3 Phase 3 (Future)
- 📋 Batch processing
- 📋 Advanced search API
- 📋 Git integration for versioning
- 📋 Multi-format export

---
