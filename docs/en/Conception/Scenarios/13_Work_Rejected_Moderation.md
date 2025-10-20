← [Scenario Home](_Scenarios.md)

# Scenario 13: Work Rejected by Moderation

## Scenario Name
Work Rejected by Moderation

## Description
A librarian rejects a work proposed by a member during the moderation process due to copyright issues or inappropriate content.

## Actors
- **Librarian**: User with moderation rights
- **Member**: User who proposed the work
- **System**: Digital library application

## Preconditions
- A work is under moderation in the "a_moderer" directory
- The librarian examines the work
- The work presents problems (copyright, inappropriate content, insufficient quality)

## Steps
1. The librarian examines a work pending moderation
2. The librarian identifies a blocking problem (rights violation, illegal content)
3. The librarian selects "Reject work"
4. The system asks to specify the rejection reason from a predefined list
5. The librarian selects the reason and adds detailed comments
6. The system removes the work from the "a_moderer" directory
7. The system archives the rejected work with its metadata for traceability
8. The system sends a detailed notification to the member with:
   - The rejection reason
   - The librarian's comments
   - Possible actions (correction, appeal)
9. The system updates moderation statistics
10. The member receives the rejection notification email

## Expected Result
The non-compliant work is rejected with clear justification and the member is informed of appeal possibilities.
