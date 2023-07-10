### script overview

the script allows to fix all paths in your project after a refactor following a speicifc logic

### how it works
the script uses several node.js modules to perform the conversion. here is a summary of the steps involved:

parse file: this function takes a file path as an argument and parses the file to extract the file name. it then uses the file name to create a regular expression that will match the existing import path. it then replaces the existing import path with a new, standardized import path using the replaceinfiles function.

replace import path: this function takes two arguments - oldimportpath and newimportpath. it uses the replaceinfiles function to find all instances of the old import path and replace it with the new import path.

convert: this function searches for all the files that need to be converted using the glob module. it then iterates over each file and calls the parsefile function to replace the import paths in each file.

➡️ how to use it
to use this script, you should follow these steps:

1. clone the repository that contains the script.

2. install the required dependencies using the ```yarn install``` command.

3. modify the settings file as necessary to configure the script.

4. run the script using the node command.
