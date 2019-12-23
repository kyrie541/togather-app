import * as yup from "yup";

export function createLoginSchema() {
  return {
    password: yup
      .string()
      .label("Password")
      .min(8)
      .nullable()
      .required(),
    username: yup
      .string()
      .label("Username")
      .nullable()
      .required()
  };
}

export default createLoginSchema;
