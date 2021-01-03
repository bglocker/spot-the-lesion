/**
 * Given two Files, compares their names
 *
 * @param a First file to compare
 * @param b Second file to compare
 *
 * @return Negative value if a < b, zero if equal, and positive value otherwise
 */
const compareFiles = (a: File, b: File): number => a.name.localeCompare(b.name);

/**
 * Get the names of the files in an array of Files
 *
 * @param files Array of Files to retrieve the names from
 *
 * @return String of file names, separated by ';'
 */
const getFileNames = (files: File[]): string => files.map((file) => file.name).join("; ");

/**
 * Given a file name, returns the string without the extension
 *
 * @param fileName File name to remove the extension from
 *
 * @return File name without extension
 */
const removeExtension = (fileName: string): string => fileName.replace(/(.*)\.[^.]+$/, "$1");

export { compareFiles, getFileNames, removeExtension };
