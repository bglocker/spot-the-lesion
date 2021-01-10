import { getLibrariesArray, getPackageNameAndVersion } from "./creditsUtils";

describe("getPackageNameAndVersion", () => {
  it("works correctly for valid package strings", () => {
    const pkg = "package@1.2.3";

    const nameVersionTuple = getPackageNameAndVersion(pkg);

    expect(nameVersionTuple).toStrictEqual(["package", "1.2.3"]);
  });

  it("returns the unmodified string for invalid package strings", () => {
    const pkg = "package.version";

    const nameVersionTuple = getPackageNameAndVersion(pkg);

    expect(nameVersionTuple).toStrictEqual(["package.version", "package.version"]);
  });

  it("returns empty strings for empty package string", () => {
    const pkg = "";

    const nameVersionTuple = getPackageNameAndVersion(pkg);

    expect(nameVersionTuple).toStrictEqual(["", ""]);
  });
});

describe("getLibrariesArray", () => {
  it("correctly creates the libraries array", () => {
    const licenseInfo: LicenseInfo = {
      licenses: "licenses string",
      repository: "repository URL",
      licenseUrl: "license URL",
      parents: "parents string",
    };

    const libraries = { "package@1.2.3": licenseInfo };

    const librariesArray = getLibrariesArray(libraries);

    expect(librariesArray).toStrictEqual([{ name: "package", version: "1.2.3", licenseInfo }]);
  });

  it("returns empty array for empty input json", () => {
    const libraries = {};

    const librariesArray = getLibrariesArray(libraries);

    expect(librariesArray).toStrictEqual([]);
  });
});
