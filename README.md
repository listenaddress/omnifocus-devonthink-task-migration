# omnifocus-devonthink-task-migration
A script to migrate tasks from an OmniFocus Document to folders that can be imported into DEVONThink

## Migration flow
1. Export your OmniFocus as an OmniFocus Document
2. Add that document to this repo's root folder
3. Run `sh migration.sh` (Answer "n" to any prompts)
4. Drag two folders just created into DEVONThink: Files and Projects

## Demo
https://www.youtube.com/watch?v=y3cWLih-OOU

## Notes
- This only works with embedded OmniFocus files right now.
- Depending on your context, OmniFocus may give you a document with a different structure. alternate-migration.sh and migration.sh support two different structures. 
