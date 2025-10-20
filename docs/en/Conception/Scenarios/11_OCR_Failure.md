← [Scenario Home](_Scenarios.md)

# Scenario 11: OCR Failure

## Scenario Name
OCR Failure

## Description
The text recognition process fails during processing of a PDF work, preventing extraction of textual content.

## Actors
- **System**: Digital library application
- **OCR AI**: Pixtral (in failure)
- **Librarian**: Intervenes to resolve the problem

## Preconditions
- A PDF work is undergoing OCR processing
- The PDF file exists and is accessible
- AI services are normally configured

## Steps
1. The system launches the OCR process on a PDF work
2. The system attempts to send pages to the selected AI API
3. The API returns an error (quota exceeded, service unavailable, unsupported file)
4. The system detects the OCR failure
5. The system moves it to a 'echec_analyse' folder
6. The system records the error in logs with technical details
7. The system notifies a librarian of the failure
8. The system sets the work to "OCR failed - manual intervention required" status
9. The librarian can manually restart or destroy the file if it is non-compliant
10. Notification of what was done on the document is sent to the user

## Expected Result
OCR failure is handled gracefully.
