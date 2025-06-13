/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function ProjectDetails() {
  const { state } = useLocation();
  const project = state?.project;
  const navigate = useNavigate();
  const userid = localStorage.getItem("userId");

  if (!project) {
    return <div className="p-4">Project data not available.</div>;
  }

  const teamLeadName = Object.values(project.teamLead).join(", ");
  const teamMemberNames: string[] = Object.values(
    project.teamMembers
  ) as string[];

  const initialValues = {
    totalTasks: "",
    teamLeadTask: "",
    teamMemberTasks: teamMemberNames.map(() => ""),
  };

  const validationSchema = Yup.object({
    totalTasks: Yup.number()
      .required("Total tasks required")
      .min(1, "Must be at least 1"),
    teamLeadTask: Yup.string().required("Task for team lead is required"),
    teamMemberTasks: Yup.array()
      .of(Yup.string().required("Task required"))
      .min(1, "At least one task is required"),
  });

  const handleSubmit = async (values: any) => {
    const payload = {
      userId: userid,
      projectName: project.projectName,
      totalTasks: parseInt(values.totalTasks),
      teamLead: {
        name: teamLeadName,
        task: values.teamLeadTask,
      },
      teamMembers: teamMemberNames.map((name: string, index: number) => ({
        name,
        task: values.teamMemberTasks[index],
      })),
    };

    try {
      const response = await fetch("http://localhost:5000/manager/addtasks/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Tasks assigned successfully");
        navigate(-1);
      } else {
        alert("Failed to assign tasks");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Project Details</h1>

      <div className="space-y-4 bg-white p-6 rounded shadow-md">
        <div>
          <label className="block font-semibold">Project Name</label>
          <input
            type="text"
            value={project.projectName}
            readOnly
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Start Date</label>
            <input
              type="date"
              value={project.startDate}
              readOnly
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">End Date</label>
            <input
              type="date"
              value={project.endDate}
              readOnly
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold">Priority</label>
          <input
            type="text"
            value={project.priority}
            readOnly
            className="w-full border p-2 rounded"
          />
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form className="space-y-4">
              <div>
                <label className="block font-semibold">Total Tasks</label>
                <Field
                  name="totalTasks"
                  type="number"
                  className="w-full border p-2 rounded"
                />
                <ErrorMessage
                  name="totalTasks"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>

              {/* Team Lead Task */}
              <div>
                <label className="block font-semibold">Team Lead</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={teamLeadName}
                    readOnly
                    className="w-full border p-2 rounded"
                  />
                  <Field
                    name="teamLeadTask"
                    placeholder="Task for Team Lead"
                    className="w-full border p-2 rounded"
                  />
                </div>
                <ErrorMessage
                  name="teamLeadTask"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>

              {/* Team Members Task */}
              <div>
                <label className="block font-semibold mb-2">Team Members</label>
                {teamMemberNames.map((member: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-2 mb-2"
                  >
                    <input
                      type="text"
                      value={member}
                      readOnly
                      className="w-full border p-2 rounded"
                    />
                    <Field
                      name={`teamMemberTasks[${index}]`}
                      placeholder={`Task for ${member}`}
                      className="w-full border p-2 rounded"
                    />
                    <ErrorMessage
                      name={`teamMemberTasks[${index}]`}
                      component="div"
                      className="text-red-600 text-sm"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
              >
                Submit Tasks
              </button>
            </Form>
          )}
        </Formik>

        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default ProjectDetails;
