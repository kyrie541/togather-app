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
      .matches(
        /^[-\w\.\$@\*\!]{1,30}$/,
        "Space and Special Character is not allowed."
      )
      .label("Username")
      .min(8)
      .nullable()
      .required()
  };
}

export function createUserValidation(value) {
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
    return errors;
  }

  return true;
}

export default createUserSchema;
