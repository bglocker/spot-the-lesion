import libraries from "../screens/credits/libraries.json";

const pkgRegex = /(.+)@(.+)$/;

/**
 * Given an NPM Package, get the name and version
 *
 * @param pkg NPM Package string
 *
 * @return Name and version of the given package
 */
const getPackageNameAndVersion = (pkg: string): [string, string] => {
  const name = pkg.replace(pkgRegex, "$1");
  const version = pkg.replace(pkgRegex, "$2");

  return [name, version];
};

/**
 * Processes the imported libraries json, returning an array of Libraries
 *
 * @return Array of Library
 */
const getLibraries = (): Library[] => {
  return Object.keys(libraries).map((key) => {
    const [name, version] = getPackageNameAndVersion(key);

    return {
      name,
      version,
      licenseInfo: libraries[key],
    };
  });
};

export { getPackageNameAndVersion, getLibraries };
