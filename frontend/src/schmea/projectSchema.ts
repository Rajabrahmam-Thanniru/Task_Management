import * as Yup from "yup";

export const projectSchema = Yup.object({
  projectName: Yup.string().required("Project name is required"),
  description: Yup.string(),
  clientName: Yup.string(),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date must be after start date"),
  priority: Yup.string().required("Select priority"),
  teamLeadId: Yup.string().required("Team lead is required"),
  estimatedHours: Yup.number()
    .typeError("Estimated hours must be a number")
    .positive("Must be a positive number")
    .required("Estimated hours is required"),
});
