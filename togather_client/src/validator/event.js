import * as yup from "yup";

export function createEventSchema() {
  return {
    title: yup
      .string()
      .label("Title")
      .nullable()
      .required(),
    description: yup
      .string()
      .label("Description")
      .nullable(),
    location: yup
      .string()
      .label("Location")
      .nullable(),
    planStartDate: yup
      .string()
      .label("Event Time")
      .nullable()
      .required()
  };
}

export default createEventSchema;
