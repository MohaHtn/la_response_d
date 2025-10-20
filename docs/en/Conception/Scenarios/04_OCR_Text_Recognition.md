← [Scenario Home](_Scenarios.md)

# Scenario 4: Text Recognition of a Work (OCR)

## Scenario Name
Text Recognition of a Work (OCR)

## Description
The system uses artificial intelligence to extract and recognize text contained in a PDF file, enabling search and export to Markdown.

## Actors
- **System**: Digital library application
- **OCR AI**: (Pixtral)
- **Librarian**: Can manually trigger the process

## Preconditions
- A PDF work is present in the system
- API keys for AI services are configured
- The PDF file is readable and not corrupted

## Steps
1. The system detects a new PDF file to process
2. The system sends the PDF to the AI API
3. The AI analyzes the PDF and extracts text and images
4. The AI identifies the layout (titles, paragraphs, tables, images)
5. The system aggregates results from all pages
6. The system structures the text in Markdown format
7. The system saves the extracted text in the database
8. The system updates the work status (OCR performed)

## Expected Result
The work has a searchable text version and exportable to Markdown with layout preservation.
