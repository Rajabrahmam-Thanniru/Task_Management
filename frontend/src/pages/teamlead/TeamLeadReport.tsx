import React from "react";
import { Formik, Form, Field } from "formik";
import axios from "axios";

function TeamLeadReport() {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Team Lead Report</h1>

      <Formik
        initialValues={{ managerId: "", projectName: "", report: "" }}
        onSubmit={async (values, { resetForm }) => {
          try {
            await axios.post("http://localhost:5000/teamlead/report", values);
            alert("Report submitted successfully!");
            resetForm();
          } catch (error) {
            console.error("Error submitting report:", error);
            alert("Failed to submit report");
          }
        }}
      >
        {() => (
          <Form className="space-y-4">
            <div>
              <label className="block mb-1">Manager ID</label>
              <Field
                name="managerId"
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter Manager ID"
              />
            </div>

            <div>
              <label className="block mb-1">Project Name</label>
              <Field
                name="projectName"
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter Project Name"
              />
            </div>

            <div>
              <label className="block mb-1">Report</label>
              <Field
                name="report"
                as="textarea"
                rows="4"
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter your report"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Submit Report
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default TeamLeadReport;
