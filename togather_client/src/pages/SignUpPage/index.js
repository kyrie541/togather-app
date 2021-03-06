import React from "react";
import * as yup from "yup";
import { Formik, Form } from "formik";
import { Button, Icon, Input, message } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { authUser } from "../../actions/auth";
import { FormikFormItem, Field } from "../../components";
import { createUserSchema, createUserValidation } from "../../validator/user";

const SignUpPage = ({ action, history }) => {
  const validationSchema = yup.object().shape(createUserSchema());

  const handleSubmit = async (values, { setSubmitting }) => {
    action
      .authUser("signup", values)
      .then(() => {
        message.success(`Sign up successfully!`);
        history.push("/");
      })
      .catch(err => {
        if (!!err.message) {
          message.error(err.message);
        } else {
          message.error("Something went wrong, please try again later");
        }
        return;
      });
  };

  return (
    <Formik
      initialValues={{
        email: null,
        username: null,
        password: null,
        confirmPassword: null
      }}
      onSubmit={handleSubmit}
      validate={createUserValidation}
      validationSchema={validationSchema}
    >
      {formikProps => (
        <Form>
          <FormikFormItem label="Email" name="email" required>
            <Field
              component={Input}
              disabled={formikProps.isSubmitting}
              forceLowerCase
              name="email"
              placeholder="Type in email"
              prefix={
                <Icon type="mail" style={{ color: "rgba(0, 0, 0, 0.25)" }} />
              }
              size="large"
              type="email"
            />
          </FormikFormItem>

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

          <FormikFormItem
            label={"Confirm Password"}
            name="confirmPassword"
            required
          >
            <Field
              component={Input}
              disabled={formikProps.isSubmitting}
              name="confirmPassword"
              placeholder={"Type in password again"}
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
              Sign Up
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

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(
    {
      authUser
    },
    dispatch
  )
});

export default connect(undefined, mapDispatchToProps)(SignUpPage);
