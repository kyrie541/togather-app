import React from "react";
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from "mdbreact";
import { PageForm } from "../../components";
import { Formik } from "formik";

const SignInPage = () => {
  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("haha", values);
  };

  return (
    <Formik
      initialValues={{}}
      onSubmit={handleSubmit}
      // validationSchema={campaignExpectationSchema}
    >
      {formikProps => (
        <PageForm>
          <MDBContainer>
            <MDBRow>
              <MDBCol md="6">
                <form>
                  <p className="h5 text-center mb-4">Sign in</p>
                  <div className="grey-text">
                    <MDBInput
                      label="Type your email"
                      icon="envelope"
                      group
                      type="email"
                      validate
                      error="wrong"
                      success="right"
                    />
                    <MDBInput
                      label="Type your password"
                      icon="lock"
                      group
                      type="password"
                      validate
                    />
                  </div>
                  <div className="text-center">
                    <MDBBtn>Login</MDBBtn>
                  </div>
                </form>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </PageForm>
      )}
    </Formik>
  );
};

export default SignInPage;
