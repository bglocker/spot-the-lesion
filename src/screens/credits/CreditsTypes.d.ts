interface License {
  licenses: string;
  repository: string;
  licenseUrl: string;
  parents: string;
}

interface ProcessedLicense {
  name: string;
  version: string;
  licenseSpecs: ILicense;
}
