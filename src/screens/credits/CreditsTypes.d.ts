interface Library {
  name: string;
  version: string;
  licenseInfo: LicenseInfo;
}

interface LicenseInfo {
  licenses: string;
  repository: string;
  licenseUrl: string;
  parents: string;
}
