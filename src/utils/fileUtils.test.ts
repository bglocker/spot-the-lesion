import { compareFiles, getFileNames, removeExtension } from "./fileUtils";

describe("compareFiles", () => {
  it("correctly identifies when file a is lower than file b", () => {
    const fileA = { name: "a" } as File;
    const fileB = { name: "b" } as File;

    const res = compareFiles(fileA, fileB);

    expect(res).toBe(-1);
  });

  it("correctly identifies when file a is equivalent to file b", () => {
    const fileA = { name: "a" } as File;
    const fileB = { name: "a" } as File;

    const res = compareFiles(fileA, fileB);

    expect(res).toBe(0);
  });

  it("correctly identifies when file a is greater than file b", () => {
    const fileA = { name: "b" } as File;
    const fileB = { name: "a" } as File;

    const res = compareFiles(fileA, fileB);

    expect(res).toBe(1);
  });
});

describe("getFileNames", () => {
  it("correctly works for one file", () => {
    const fileA = { name: "a" } as File;

    const files = [fileA];

    const fileNames = getFileNames(files);

    expect(fileNames).toBe("a");
  });

  it("correctly separates multiple files", () => {
    const fileA = { name: "a" } as File;
    const fileB = { name: "b" } as File;

    const files = [fileA, fileB];

    const fileNames = getFileNames(files);

    expect(fileNames).toBe("a; b");
  });

  it("returns empty string for empty input array", () => {
    const files = [];

    const fileNames = getFileNames(files);

    expect(fileNames).toBe("");
  });
});

describe("removeExtension", () => {
  it("correctly removes the extension from single-extension files", () => {
    const fileName = "file.extension";

    const fileNameNoExtension = removeExtension(fileName);

    expect(fileNameNoExtension).toBe("file");
  });

  it("correctly removes the extension from multiple-extension files", () => {
    const fileName = "file.ext.ens.ion";

    const fileNameNoExtension = removeExtension(fileName);

    expect(fileNameNoExtension).toBe("file.ext.ens");
  });

  it("returns the given string for files with no extension", () => {
    const fileName = "file";

    const fileNameNoExtension = removeExtension(fileName);

    expect(fileNameNoExtension).toBe("file");
  });
});
