import { range } from "../../utils/arrayUtils";

describe("Range", () => {
  it("works for positive start, stop and step", () => {
    expect(range(1, 2, 1)).toStrictEqual([1]);
    expect(range(1, 3, 1)).toStrictEqual([1, 2]);
    expect(range(0, 3, 1)).toStrictEqual([0, 1, 2]);
  });

  it("works for negative start, stop, but positive step", () => {
    expect(range(-2, -1, 1)).toStrictEqual([-2]);
    expect(range(-3, -1, 1)).toStrictEqual([-3, -2]);
  });

  it("works for negative start, positive stop and positive step", () => {
    expect(range(-2, 1, 1)).toStrictEqual([-2, -1, 0]);
    expect(range(-1, 2, 1)).toStrictEqual([-1, 0, 1]);
  });

  it("works for multiple step sizes", () => {
    expect(range(1, 6, 2)).toStrictEqual([1, 3, 5]);
    expect(range(1, 16, 5)).toStrictEqual([1, 6, 11]);
  });

  it("does not work for negative step size or 0", () => {
    expect(() => {
      range(1, 6, 0);
    }).toThrowError();
    expect(() => {
      range(1, 6, -2);
    }).toThrowError();
  });
});
