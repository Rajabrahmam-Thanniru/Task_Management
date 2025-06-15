/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";

function ShowDetails() {
  const { state } = useLocation();
  const project = state?.project;
  const navigate = useNavigate();
  const managerId = state?.managerId;
  const projectName = project?.projectName;

  const [assignedData, setAssignedData] = useState<any>(null);
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    const fetchAssignedTasks = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/teamlead/sendtasks?managerId=${managerId}&projectName=${projectName}`
        );
        const data = await response.json();
        setAssignedData(data);
      } catch (error) {
        console.error("Failed to fetch assigned tasks:", error);
      }
    };

    if (managerId && projectName) {
      fetchAssignedTasks();
    }
  }, [managerId, projectName]);

  if (!project)
    return <div className="p-4 text-red-600">No project data found.</div>;
  if (!assignedData)
    return <div className="p-4 text-blue-600">Loading task assignments...</div>;

  const teamLead = Object.values(project.teamLead || {}).join(", ");

  const teamMembersWithTasks = Object.entries(project.teamMembers || {}).map(
    ([memberId, memberName]: [string, any]) => {
      const assignedTask =
        assignedData?.teamMembers?.find((tm: any) => tm.name === memberName)
          ?.task || "";

      return { id: memberId, name: memberName, task: assignedTask };
    }
  );

  const initialValues = {
    projectName: project.projectName,
    startDate: project.startDate,
    endDate: project.endDate,
    priority: project.priority,
    manager: project.manager,
    teamLead,
    teamMembers: teamMembersWithTasks.map((tm) => tm.task),
  };

  const handleSubmit = async (values: any) => {
    const updatedTasks = values.teamMembers.map(
      (task: string, index: number) => ({
        id: teamMembersWithTasks[index].id,
        name: teamMembersWithTasks[index].name,
        task,
      })
    );

    try {
      const response = await fetch(
        "http://localhost:5000/teamlead/updatetasks",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            managerId,
            projectName,
            teamMembers: updatedTasks,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Tasks updated successfully!");
        setEdited(false); // Reset flag
      } else {
        alert(`Error: ${result.message || "Failed to update tasks."}`);
      }
    } catch (error) {
      console.error("Error submitting updated tasks:", error);
      alert("Failed to connect to the server.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Project Details</h1>

      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, handleChange }) => (
          <Form className="space-y-4">
            <FieldSection label="Project Name" name="projectName" readOnly />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldSection
                label="Start Date"
                name="startDate"
                type="date"
                readOnly
              />
              <FieldSection
                label="End Date"
                name="endDate"
                type="date"
                readOnly
              />
            </div>
            <FieldSection label="Priority" name="priority" readOnly />
            <FieldSection label="Manager" name="manager" readOnly />

            <div>
              <label className="block font-semibold">Team Lead</label>
              <input
                type="text"
                value={teamLead}
                className="w-full border p-2 rounded bg-gray-100"
                readOnly
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Team Members & Tasks
              </label>
              <div className="space-y-2">
                {teamMembersWithTasks.map((member, index) => (
                  <div
                    key={member.id}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                  >
                    <input
                      type="text"
                      value={member.name}
                      readOnly
                      className="w-full border p-2 rounded bg-gray-100"
                    />
                    <input
                      type="text"
                      name={`teamMembers[${index}]`}
                      value={values.teamMembers[index]}
                      onChange={(e) => {
                        handleChange(e);
                        setEdited(true); // Enable submit button on change
                      }}
                      placeholder="Not Assigned"
                      className="w-full border p-2 rounded"
                    />
                  </div>
                ))}
              </div>
            </div>

            {edited && (
              <button
                type="submit"
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Submit Changes
              </button>
            )}
          </Form>
        )}
      </Formik>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Go Back
      </button>
    </div>
  );
}

const FieldSection = ({
  label,
  name,
  type = "text",
  value,
  readOnly = false,
}: {
  label: string;
  name?: string;
  type?: string;
  value?: string;
  readOnly?: boolean;
}) => (
  <div>
    <label className="block font-semibold">{label}</label>
    {name ? (
      <Field
        name={name}
        type={type}
        className="w-full border p-2 rounded bg-gray-100"
        readOnly={readOnly}
      />
    ) : (
      <input
        type={type}
        value={value}
        className="w-full border p-2 rounded bg-gray-100"
        readOnly={readOnly}
      />
    )}
  </div>
);

export default ShowDetails;
