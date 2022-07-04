import sum from "../src/sum.js";

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});

test("null"),
  () => {
    const n = 1;
    expect(n).toBeNull();
    expect(n).toBeDefined();
  };
