import React from "react";
import { Formik, Form } from "formik";
import { Button, Input, message } from "antd";
import { createEventSchema } from "../../validator/event";
import * as yup from "yup";
import { apiCall } from "../../services/api";

import { DatePicker, FormikFormItem, Field } from "../../components";

const EventDetailsPage = ({ history }) => {
  const validationSchema = yup.object().shape(createEventSchema());

  const handleSubmit = async (values, { setSubmitting }) => {
    apiCall("post", `/api/events`, values)
      .then(event => {
        message.success(`Event ${event.title} has been created successfully`);
        history.push("/events");
      })
      .catch(err => {
        message.error(err);
      });
  };

  return (
    <div>
      <h4>Create Event</h4>
      <Formik
        initialValues={{
          title: null,
          description: null,
          location: null,
          planStartDate: null
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {formikProps => (
          <Form>
            <FormikFormItem label="Title" name="title" required>
              <Field
                component={Input}
                disabled={formikProps.isSubmitting}
                name="title"
                placeholder="Type in title"
                size="large"
              />
            </FormikFormItem>

            <FormikFormItem label={"Description"} name="description">
              <Field
                component={Input.TextArea}
                rows={3}
                disabled={formikProps.isSubmitting}
                name="description"
                placeholder={"Type in more details"}
                size="large"
              />
            </FormikFormItem>

            <FormikFormItem label={"Location"} name="location">
              <Field
                component={Input}
                disabled={formikProps.isSubmitting}
                name="location"
                placeholder={"Type in Location"}
                size="large"
              />
            </FormikFormItem>

            <FormikFormItem label={"Event Time"} name="planStartDate" required>
              <Field
                component={DatePicker}
                type="date"
                showTime
                updateInstantly
                disabled={formikProps.isSubmitting}
                name="planStartDate"
                placeholder={"Type in Event Time"}
                size="large"
              />
            </FormikFormItem>

            <footer className="footer">
              <Button
                htmlType="submit"
                loading={formikProps.isSubmitting}
                size="large"
                type="primary"
              >
                Submit
              </Button>
            </footer>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EventDetailsPage;
