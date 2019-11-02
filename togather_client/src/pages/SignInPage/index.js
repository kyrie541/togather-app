import * as React from "react";
import * as yup from "yup";
import { FormikFormItem, Field } from "../../components";
import { Formik, Form } from "formik";
import { Button, Icon, Input } from "antd";
import { createLoginSchema } from "../../validator/login";

import "./styles.module.css";

const SignInPage = () => {
  const validationSchema = yup.object().shape(createLoginSchema());

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("submit", values);
  };

  return (
    <Formik
      initialValues={{ username: null, password: null }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {formikProps => (
        <Form>
          <FormikFormItem label="Username" name="username" required>
            <Field
              component={Input}
              disabled={formikProps.isSubmitting}
              forceLowerCase
              name="username"
              placeholder="Type in username"
              prefix={
                <Icon type="user" style={{ color: "rgba(0, 0, 0, 0.25)" }} />
              }
              size="large"
            />
          </FormikFormItem>

          <FormikFormItem label={"Password"} name="password" required>
            <Field
              component={Input}
              disabled={formikProps.isSubmitting}
              name="password"
              placeholder={"Type in password"}
              prefix={
                <Icon type="lock" style={{ color: "rgba(0, 0, 0, 0.25)" }} />
              }
              size="large"
              type="password"
            />
          </FormikFormItem>

          <footer className="footer">
            <Button
              htmlType="submit"
              loading={formikProps.isSubmitting}
              size="large"
              // style={{ width: "100%" }}
              type="primary"
            >
              Log In
            </Button>

            {/* <div className={styles.additionalActions}>
              <div />
              <Link to="/forgot-password">
                Forgot Password
              </Link>
            </div> */}
          </footer>
        </Form>
      )}
    </Formik>
  );
};

export default SignInPage;
