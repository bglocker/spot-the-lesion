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
 * Processes a libraries json, returning an array of Library objects
 *
 * @param libraries Libraries json to process
 *
 * @return Array of Library objects
 */
const getLibrariesArray = (libraries: Record<string, LicenseInfo>): Library[] => {
  return Object.keys(libraries).map((key) => {
    const [name, version] = getPackageNameAndVersion(key);

    return {
      name,
      version,
      licenseInfo: libraries[key],
    };
  });
};

export { getPackageNameAndVersion, getLibrariesArray };
