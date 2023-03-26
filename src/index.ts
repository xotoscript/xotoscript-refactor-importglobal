// Import necessary Node.js modules
import { glob } from 'glob'; // glob is a library that allows you to find all the pathnames matching a specified pattern according to the rules used by the Unix shell
import replaceInFiles from "replace-in-files"; // replace-in-files is a library for performing find-and-replace operations across multiple files
import { settings } from './settings'; // Import settings from a local file

/**
 * parseFile
 * @comment A function that takes a file path as an argument, splits it to extract the file name, replaces the old path with a new path, and calls replaceImportPath function.
 */
async function parseFile(filePath: string) {
	// get file name from path
	const filePathArray = filePath.split("/");
    const fileName = filePathArray[filePathArray.length - 1].split('.')[0];

	// create regex to update all imports to have the right path
    const oldPathRegex = `(import.*)"(${settings.org}|\.\.\/|\.).*\/${fileName}"`;
    await replaceImportPath({ oldImportPath: oldPathRegex });
}

/**
 * replaceImportPath
 * @comment A function that takes an old import path and a new import path as arguments and uses replaceInFiles library to replace the old import path with the new import path across multiple files.
 */
async function replaceImportPath ({ oldImportPath }: {oldImportPath: string}) {
	const { paths } = await replaceInFiles({
		files: settings.projectFilesPathGlob,
		from: new RegExp(oldImportPath, "g"), 
		to: `$1"${settings.org}/${settings.sharedLib}"`,
		saveOldFile: false, 
        onlyFindPathsWithoutReplace: false 
    });
	
	// Returns the paths of the files in which the replacement was performed
	return paths; 
}

async function convert () {
	// Finds all TypeScript and Vue files in a specific directory while ignoring some subdirectories and file extensions
    const files = (await Promise.all(settings.projectFilesPathGlob.map(settingsGlob => glob(settingsGlob, {ignore: ["**/.d.ts", "__types__", "**/node_modules/**"]})))).flat(); 

	// Counts the total number of files
    const total = files.length;

	// Initializes a counter for tracking the progress
    let counter = 0;
	
	// Loops through each file
    for (const file of files) {

		// Increments the counter
        counter++; 

		// Logs the progress percentage to the console
        console.log(Math.floor(100 / total * counter)); 

		// Calls the parseFile function to replace the old import path with the new import path in the file
		await parseFile(file); 
	}
}

(async () => {
	
	// Calls the convert function to find and replace the old import path with the new import path in all the files
	await convert(); 
})();
