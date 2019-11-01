import * as React from "react";
import flatten from "flat";
import { Button, notification } from "antd";
import { compose } from "recompose";
import { connect, Form } from "formik";
import { isEmpty, map, mapValues, mergeWith } from "lodash";

import styles from "./styles.module.css";

export const PageForm = ({
  actionButtonsEnabled,
  createButtonLabel,
  history,
  isNew,
  formik,
  updateButtonLabel,
  children,
  disabled = true,
  includeFooter
}) => {
  const innerIsNew = () => {
    return typeof isNew !== "undefined" ? isNew : !formik.values["@id"];
  };

  const handleCancel = () => {
    history.goBack();
  };

  const handleSubmit = ev => {
    ev.persist();

    // @todo performance improvements!
    const { errors, initialValues, touched, values } = formik;
    const invalidValues = flatten.unflatten(
      mapValues(flatten(errors), () => undefined)
    );
    const mergeCustomizer = (_, srcValue) => {
      if (Array.isArray(srcValue)) {
        return srcValue;
      }

      return undefined;
    };

    // Be careful when using `mergeWith`, it will overwrite the source
    const finalTouched = mergeWith(
      {},
      initialValues,
      invalidValues,
      touched,
      mergeCustomizer
    );
    const finalValues = mergeWith(
      {},
      initialValues,
      invalidValues,
      values,
      mergeCustomizer
    );

    formik.setFormikState(
      {
        touched: finalTouched,
        values: finalValues
      },
      () => {
        if (showErrorNotification && !isEmpty(formik.errors)) {
          showErrorNotification();
        }

        if (onSubmit) {
          onSubmit(ev);
        } else {
          formik.handleSubmit(ev);
        }
      }
    );
  };

  const showErrorNotification = () => {
    const errors = map(flatten(formik.errors)).filter(error => !isEmpty(error));

    notification.error({
      description: map(errors, (error, key) => (
        <p className={styles.errorItem} key={key}>
          {error}
        </p>
      )),
      message: "Error Summary"
    });
  };

  return (
    <Form onSubmit={handleSubmit} autoComplete="off">
      <div className={styles.content}>{children}</div>
      {includeFooter && (
        <footer className={styles.footer}>
          <Button
            disabled={formik.isSubmitting}
            onClick={handleCancel}
            className={styles.button}
          >
            Cancel
          </Button>

          <Button
            disabled={
              (!actionButtonsEnabled ? disabled : false) ||
              !formik.dirty ||
              formik.isSubmitting
            }
            onClick={formik.handleReset}
            className={styles.button}
          >
            Reset
          </Button>

          <Button
            disabled={
              (!actionButtonsEnabled ? disabled : false) || !formik.dirty
            }
            htmlType="submit"
            loading={formik.isSubmitting}
            className={styles.button}
            type="primary"
          >
            {innerIsNew
              ? createButtonLabel || "Create"
              : updateButtonLabel || "Update"}
          </Button>
        </footer>
      )}
    </Form>
  );
};

export default compose(connect)(PageForm);
