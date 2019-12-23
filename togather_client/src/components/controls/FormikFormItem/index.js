import * as React from "react";
import { Form } from "antd";
import { compose } from "recompose";
import { connect } from "formik";
import { find, get, isNil } from "lodash";
import { hasType } from "../../../helpers";

import styles from "./styles.module.css";

function getValue(props, name, eligiblePropertyNames) {
  const prop = get(props, name);

  if (typeof prop === "object") {
    return find(prop, (val, key) => {
      return eligiblePropertyNames.length > 0
        ? eligiblePropertyNames.includes(key) && !isNil(val)
        : !isNil(val);
    });
  }

  return prop;
}

const FormikFormItem = ({
  children,
  eligiblePropertyNames,
  formik,
  required,
  name,
  ...props
}) => {
  if (!name) {
    return (
      <Form.Item className={styles.root} required={required} {...props}>
        {children}
      </Form.Item>
    );
  }

  const path = name ? `${name}.` : name;
  const value = getValue(formik.values, name, eligiblePropertyNames);
  const touch = getValue(formik.touched, name, eligiblePropertyNames);
  const error = getValue(formik.errors, name, eligiblePropertyNames);

  const help = touch && !!error ? error : undefined;
  const validateStatus = touch && !!error ? "error" : "success";
  const requiredBaseOnFormikValidationSchema =
    hasType(formik.validationSchema, name, "required", value) ||
    eligiblePropertyNames.some(eligiblePropertyName =>
      hasType(
        formik.validationSchema,
        `${path}${eligiblePropertyName}`,
        "required",
        value
      )
    ) ||
    hasType(formik.validationSchema, `${path}value`, "required", value); // @todo remove this quick hack

  return (
    <Form.Item
      className={styles.root}
      help={help}
      validateStatus={validateStatus}
      required={
        typeof required === "boolean"
          ? required
          : requiredBaseOnFormikValidationSchema
      }
      {...props}
    >
      {children}
    </Form.Item>
  );
};
FormikFormItem.defaultProps = {
  eligiblePropertyNames: []
};

export default compose(connect)(FormikFormItem);
