/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Formik, Form, Field } from "formik";

function TeamMembers() {
  const { state } = useLocation();
  const userId = state?.member?.id;

  const [memberData, setMemberData] = useState<any>(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/teamlead/teammember/${userId}`
        );
        const data = await res.json();
        setMemberData(data);
      } catch (error) {
        console.error("Failed to fetch member data:", error);
      }
    };

    if (userId) {
      fetchMember();
    }
  }, [userId]);

  if (!userId)
    return <div className="p-4 text-red-600">No member ID provided.</div>;
  if (!memberData)
    return <div className="p-4 text-blue-600">Loading member details...</div>;

  const initialValues = {
    name: memberData.name || "",
    email: memberData.email || "",
    role: memberData.role || "",
    id: memberData._id || "",
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Team Member Details
      </h2>
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        <Form className="space-y-4">
          <FieldSection label="Name" name="name" readOnly />
          <FieldSection label="Email" name="email" readOnly />
          <FieldSection label="Role" name="role" readOnly />
          <FieldSection label="ID" name="id" readOnly />
        </Form>
      </Formik>
    </div>
  );
}

const FieldSection = ({
  label,
  name,
  type = "text",
  readOnly = false,
}: {
  label: string;
  name: string;
  type?: string;
  readOnly?: boolean;
}) => (
  <div>
    <label className="block font-semibold">{label}</label>
    <Field
      name={name}
      type={type}
      readOnly={readOnly}
      className="w-full border p-2 rounded bg-gray-100"
    />
  </div>
);

export default TeamMembers;
