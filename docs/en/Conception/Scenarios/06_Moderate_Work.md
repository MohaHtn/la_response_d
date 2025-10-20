← [Scenario Home](_Scenarios.md)

# Scenario 6: Moderate a Work

## Scenario Name
Moderate a Work

## Description
A librarian examines a work proposed by a member, verifies its compliance, enriches its metadata and decides on its validation or rejection.

## Actors
- **Librarian**: User with moderation rights
- **System**: Digital library application
- **OCR AI**: (Pixtral)

## Preconditions
- The librarian is logged in with moderation rights
- One or more works are pending in the "a_moderer" directory
- The work has been submitted by a member with basic metadata

## Steps
1. The librarian accesses the list of works to moderate
2. The librarian selects a work to examine
3. The system displays the work with its current metadata
4. The librarian consults the work content (PDF preview)
5. The librarian verifies copyright and legality with AI assistance
6. The librarian enriches metadata (ISBN, detailed description, keywords)
7. The librarian corrects any input errors
8. The librarian makes a decision: Validate, Reject, or Request modifications
9. If validation: the system moves the work to the appropriate directory
10. If rejection: the system notifies the member with justification
11. The system updates the work status and moderation history

## Expected Result
The work is either validated and available to members, or rejected with justification.
