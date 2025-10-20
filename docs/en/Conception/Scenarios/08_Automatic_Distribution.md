← [Scenario Home](_Scenarios.md)

# Scenario 8: Automatic Distribution of Public Domain Works

## Scenario Name
Automatic Distribution of Public Domain Works

## Description
The system automatically distributes works that have become public domain to all members with shared disk space.

## Actors
- **System**: Digital library application (automatic process)
- **Members**: Librarians/Administrators of the library

## Preconditions
- Works have entered the public domain (copyright expiration)

## Steps
1. The system periodically executes a copyright verification in the dedicated folder
2. The system identifies works whose rights have expired
3. The system automatically moves these works to "fond_commun"
4. The system updates the metadata
5. The system indicates that the work is available
6. The system updates local search indexes

## Expected Result
Newly public domain works are automatically distributed to participating members, enriching their local collection.
