import * as yup from "yup";

export function hasType(schema, path, type, value = "") {
  try {
    return yup
      .reach(schema, path, value)
      .describe()
      .tests.find(val => val.name === type);
  } catch (err) {
    // Do nothing
  }

  return false;
}
