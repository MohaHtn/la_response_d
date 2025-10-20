← [Scenario Home](_Scenarios.md)

# Scenario 3: Digitize and Propose a Work

## Scenario Name
Digitize and Propose a Work

## Description
A member digitizes a physical work in PDF format and proposes it for sharing in the digital library.

## Actors
- **Member**: Authenticated user wishing to share a work
- **System**: Digital library application

## Preconditions
- The member is logged into their account
- The member has a PDF file of the digitized work
- The work respects the constraints defined by the library

## Steps
1. The member accesses the "Propose a work" section
2. The member selects the PDF file to upload
3. The system verifies the file format and size
4. The member enters basic metadata (title, author, publication year)
5. The member indicates the copyright status (public domain, copyrighted, unknown)
6. The system generates a unique identifier for the work
7. The system gives the file to AI to verify metadata and content
8. If AI detects an anomaly, the file is sent to the "a_moderer" folder for manual verification
9. The system records metadata in the database
10. The system sends a notification to the member confirming (or not) the submission
11. The system notifies librarians of the new work to moderate, if needed

## Expected Result
The work is stored in the moderation directory and awaiting validation by a librarian.
