import * as yup from "yup";
import { get, isEmpty } from "lodash";
import { setIn } from "formik";

export function createUserSchema() {
  return {
    confirmPassword: yup
      .string()
      .label("Confirm Password")
      .nullable()
      .required(),
    email: yup
      .string()
      .label("Email")
      .nullable()
      .email()
      .required(),
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

export function createUserValidation() {
  return value => {
    if (isEmpty(value)) {
      return true;
    }

    let errors = {};

    if (
      !!get(value, "password") &&
      !!get(value, "confirmPassword") &&
      value.password !== value.confirmPassword
    ) {
      errors = setIn(errors, "confirmPassword", "Password must be same");
      errors = setIn(errors, "password", "Password must be same");
    }

    if (!isEmpty(errors)) {
      throw errors;
    }

    return true;
  };
}

export default createUserSchema;
