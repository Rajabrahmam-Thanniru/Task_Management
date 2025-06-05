import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { projectSchema } from "../../schmea/projectSchema";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

function AddProjects() {
  const userId = localStorage.getItem("userId");
  const [users, setUsers] = useState<
    { _id: string; name: string; role: string }[]
  >([]);
  const [teamMembers, setTeamMembers] = useState<
    { _id: string; name: string }[]
  >([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const initialValues = {
    projectName: "",
    description: "",
    clientName: "",
    startDate: "",
    endDate: "",
    priority: "Medium",
    teamLeadId: "",
    estimatedHours: "",
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/manager/teamleads")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  const addTeamMember = () => {
    const member = users.find((u) => u._id === selectedMemberId);
    if (member && !teamMembers.some((m) => m._id === member._id)) {
      setTeamMembers((prev) => [
        ...prev,
        { _id: member._id, name: member.name },
      ]);
      setSelectedMemberId("");
    }
  };

  const removeMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m._id !== id));
  };

  const inputClass =
    "w-full bg-transparent outline-none focus:ring-0 placeholder-gray-500";

  const teamLeads = users.filter((u) => u.role === "team_lead");
  const membersOnly = users.filter((u) => u.role === "team_member");
  const availableMembers = membersOnly.filter(
    (m) => !teamMembers.some((tm) => tm._id === m._id)
  );

  return (
    <div className="p-6 max-w-3xl mx-auto bg-[#ccf6ff]">
      <h1 className="text-2xl font-bold mb-6">Add Project</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={projectSchema}
        onSubmit={(values, { resetForm }) => {
          const teamLead = users.find((u) => u._id === values.teamLeadId);
          const teamMembersMap = teamMembers.reduce((acc, curr) => {
            acc[curr._id] = curr.name;
            return acc;
          }, {} as Record<string, string>);

          const payload = {
            ...values,
            teamLead: teamLead ? { [teamLead._id]: teamLead.name } : {},
            teamMembers: teamMembersMap,
          };

          console.log("✅ Submitted:", payload);
          // axios.post("/your-endpoint", payload).then(...).catch(...)
          axios
            .post("http://localhost:5000/manager/postproject", {
              userId: userId, // or another identifier for the owner
              projectId: values.projectName.replace(/\s+/g, "_").toLowerCase(), // sample unique id logic
              projectData: payload,
              collection: "manager", // or your actual collection name
            })
            .then((res) => {
              console.log("✅ Server Response:", res.data);
              resetForm();
              setTeamMembers([]);
            })
            .catch((err) => {
              console.error(
                "❌ Failed to submit:",
                err.response?.data || err.message
              );
            });

          resetForm();
          setTeamMembers([]);
        }}
      >
        <Form className="space-y-4">
          <div className="bg-white shadow-md rounded-xl p-4">
            <Field
              name="projectName"
              placeholder="Project Name"
              className={inputClass}
            />
            <ErrorMessage
              name="projectName"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="bg-white shadow-md rounded-xl p-4">
            <Field
              name="description"
              as="textarea"
              placeholder="Project Description"
              className={`${inputClass} h-24`}
            />
          </div>

          <div className="bg-white shadow-md rounded-xl p-4">
            <Field
              name="clientName"
              placeholder="Client Name"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-white shadow-md rounded-xl p-4 flex-1">
              <label className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <Field type="date" name="startDate" className={inputClass} />
              <ErrorMessage
                name="startDate"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="bg-white shadow-md rounded-xl p-4 flex-1">
              <label className="block text-sm font-medium mb-1">End Date</label>
              <Field type="date" name="endDate" className={inputClass} />
              <ErrorMessage
                name="endDate"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl p-4">
            <Field as="select" name="priority" className={inputClass}>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </Field>
          </div>

          <div className="bg-white shadow-md rounded-xl p-4">
            <Field as="select" name="teamLeadId" className={inputClass}>
              <option value="">Select Team Lead</option>
              {teamLeads.map((lead) => (
                <option key={lead._id} value={lead._id}>
                  {lead.name}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="teamLeadId"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="bg-white shadow-md rounded-xl p-4">
            <Field
              name="estimatedHours"
              type="number"
              placeholder="Estimated Hours"
              className={inputClass}
            />
            <ErrorMessage
              name="estimatedHours"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Team Members Section */}
          <div className="bg-white shadow-md rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className={`${inputClass} border-b pb-1`}
              >
                <option value="">Select Team Member</option>
                {availableMembers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={addTeamMember}
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {teamMembers.map((member) => (
                <div
                  key={member._id}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {member.name}
                  <button
                    type="button"
                    onClick={() => removeMember(member._id)}
                    className="text-blue-800 hover:text-red-500"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
          >
            Submit Project
          </button>
        </Form>
      </Formik>
    </div>
  );
}

export default AddProjects;
