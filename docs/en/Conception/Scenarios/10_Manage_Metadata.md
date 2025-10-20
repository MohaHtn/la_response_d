← [Scenario Home](_Scenarios.md)

# Scenario 10: Manage Work Metadata

## Scenario Name
Manage Work Metadata via Web Application and AI

## Description
A librarian or authorized member uses the web application to modify and enrich 
the metadata of a work. 
The integrated AI automatically proposes metadata extracted from the book file (PDF, image, etc.), 
which the librarian can validate or correct to improve discoverability and classification.

## Actors
- **Librarian**: User with metadata modification rights
- **Contributing Member**: Member who proposed the original work
- **System**: Digital library web application
- **AI**: Artificial intelligence module for automatic metadata extraction

## Preconditions
- The librarian has the necessary rights to modify metadata
- The work exists in the system
- The work has existing basic metadata or an available source file

## Steps
1. The librarian accesses the detailed work record via the web application
2. The librarian clicks on "Edit metadata"
3. The system displays the metadata editing form
4. The AI analyzes the book file and automatically proposes metadata (title, author, description, keywords, ISBN, etc.)
5. The moderator validates, completes or corrects the AI suggestions
6. The librarian can add additional categories
7. The librarian can correct the publication date
8. The librarian can add edition information
9. The librarian can modify the work's language
10. The system validates the format of entered data (ISBN, dates)
11. The librarian saves the modifications
12. The system updates the search index
13. The system records the modification history with timestamps

## Expected Result
The work's metadata is enriched through AI and human validation, improving discoverability in the library.
