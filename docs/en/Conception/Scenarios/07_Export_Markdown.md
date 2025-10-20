← [Scenario Home](_Scenarios.md)

# Scenario 7: Export a Work to Markdown Format

## Scenario Name
Export a Work to Markdown Format

## Description
A member exports a work whose text has been recognized by OCR to a structured Markdown file with the help of an AI agent.

## Actors
- **Member**: Authenticated user wishing to export a work
- **System**: Digital library application
- **OCR AI**: (Pixtral)

## Preconditions
- The member is logged into their account
- The work has undergone successful OCR processing
- The member has access to the work
- The work's text is available in the database

## Steps
1. The member consults an available work
2. The system verifies access rights to the work
3. The system retrieves the structured text from OCR
4. The system applies Markdown formatting (titles, paragraphs, lists)
5. The system preserves the original structure (chapters, sections)
6. The system generates header metadata (title, author, export date)
7. The system offers download of the .md file
8. The member downloads the Markdown file
9. The system records the export in the member's history

## Expected Result
The member obtains a structured and readable Markdown file of the work with preservation of the original layout.
