import * as yup from "yup";

export function createLoginSchema() {
  return {
    password: yup
      .string()
      .label("Password")
      .min(8)
      .nullable()
      .required(),
    email: yup
      .string()
      .label("Email")
      .email()
      .nullable()
      .required()
  };
}

export default createLoginSchema;
