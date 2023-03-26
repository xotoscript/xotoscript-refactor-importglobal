const globCallback = require("glob");
const fs = require("fs").promises;
const replaceInFiles = require("replace-in-files");
const { promisify } = require("util");
const { pascalCase, paramCase, camelCase } = require("change-case");
const glob = promisify(globCallback);

const converter = pascalCase;

/**
 * parseFile
 * @comment
 */

async function parseFile(filePath) {
	const filePathArray = filePath.split("/");
    const fileName = filePathArray[filePathArray.length - 1].split('.')[0];
    const oldPathRegex = `(import.*)"(@xotosphere|\.\.\/).*\/${fileName}"`
    const newPathRegex = `$1"${filePath.replace(/\.\/packages\/xotosphere-\w+/, "@xotosphere").replace(".d.ts", "").replace(".ts", "")}"`
    await replaceImportPath({ oldImportPath: oldPathRegex, newImportPath: newPathRegex });
}

/**
 * replaceImportPath
 * @comment
 */

async function replaceImportPath ({ oldImportPath, newImportPath }) {
	const { paths } = await replaceInFiles({
		files: [ `./packages/xotosphere-client/xotosphere-client-public-panel/**/*.ts`, `./packages/xotosphere-client/xotosphere-client-public-panel/**/*.vue`],
		from: new RegExp(oldImportPath, "g"),
		to: `$1"@xotosphere/xotosphere-client-shared"`,
		saveOldFile: false,
        onlyFindPathsWithoutReplace: false
    });
	return paths;
}

async function convert () {
    const files = [...(await glob(`./packages/xotosphere-client/xotosphere-client-shared/src/**/*.ts`, {ignore: ["**/.d.ts", "__types__", "**/node_modules/**"]})),...(await glob(`./packages/xotosphere-client/xotosphere-client-shared/src/**/*.vue`))];
    const total = files.length;
    let counter = 0;
    for (const file of files) {
        counter++;
        console.log(Math.floor(100 / total * counter));
		await parseFile(file);
	}
}

(async () => {
	await convert();
})();
