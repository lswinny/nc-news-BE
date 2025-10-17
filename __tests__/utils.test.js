const {
  convertTimestampToDate,
  createLookupObj
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("createLookupObj", () => {
  test("returns a new object", () => {
    const arr = [{1: "apple", 2: "banana", 3: "mango"}, {1: "fig", 2: "pomegranate", 3: "blueberry"}]
    const key = 3
    const value = 1
    output = createLookupObj(arr, key, value)
    expect(output).toBeObject();
  });
  test("returns one key-value pair in an object when given an array of objects", () => {
    const arr = [{1: "apple", 2: "banana", 3: "mango"}]
    const key = 3
    const value = 1
    output = createLookupObj(arr, key, value)
    expected = { "mango":"apple"}
    expect(output).toBeObject(expected);
  });
    test("returns multiple key-value pair in an object when given an array of objects", () => {
    const arr = [{1: "apple", 2: "banana", 3: "mango"}, {1: "fig", 2: "pomegranate", 3: "blueberry"}]
    const key = 3
    const value = 1
    output = createLookupObj(arr, key, value)
    expected = { "mango":"apple", "blueberry":"fig" }
    expect(output).toBeObject(expected);
  });
      test("does not mutate original input", () => {
    const arr = [{1: "apple", 2: "banana", 3: "mango"}, {1: "fig", 2: "pomegranate", 3: "blueberry"}]
    const copyArr = [...arr]
    const key = 3
    const value = 1
    createLookupObj(arr, key, value)
    expect(arr).toEqual(copyArr);
  });

});