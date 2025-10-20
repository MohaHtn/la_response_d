← [Scenario Home](_Scenarios.md)

# Scenario 14: Corrupted PDF File

## Scenario Name
Corrupted PDF File

## Description
A member attempts to propose a work but the PDF file is corrupted or unreadable, preventing its processing and integration into the library.

## Actors
- **Member**: User proposing a work
- **System**: Digital library application

## Preconditions
- The member is connected and attempts to propose a work
- The uploaded file has a PDF extension
- The file is corrupted, partially damaged or non-compliant with PDF standard

## Steps
1. The member selects a PDF file to upload
2. The system receives the file and begins validation
3. The system attempts to open and read the PDF file
4. The system detects that the file is corrupted or unreadable
5. The system interrupts the upload process
6. The system displays an explicit error message:
   - "Corrupted or unreadable PDF file"
   - Technical details about the detected error
7. The system proposes solutions to the member:
   - Check the integrity of the source file
   - Re-scan or re-generate the PDF
8. The system deletes the faulty file from the system
9. The system records the incident in logs for analysis
10. The member can retry with a new corrected file

## Expected Result
The corrupted file is rejected with a clear diagnosis and advice to allow the member to correct the problem and submit again.
