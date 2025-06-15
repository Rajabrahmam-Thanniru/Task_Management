/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import axios from "axios";

interface TeamMember {
  name: string;
  task: string;
  taskCount: number;
}

interface TeamLead {
  name: string;
  task: string;
  taskCount: number;
}

interface Project {
  projectName: string;
  totalTasks: number;
  projectComplete: number;
  teamLead: TeamLead;
  teamMembers: TeamMember[];
  managerId: string;
}

function TeamLeadTasks() {
  const [taskData, setTaskData] = useState<Project[]>([]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/teamlead/tasks/6834088257019db4abe61e42"
      );
      setTaskData(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleMarkCompleted = async (
    managerId: string,
    projectName: string
  ) => {
    try {
      await axios.put("http://localhost:5000/teamlead/markcompleted", {
        managerId,
        projectName,
      });
      fetchTasks(); // Refresh the data
    } catch (error) {
      console.error("Failed to mark as completed:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Team Lead Tasks</h1>

      {taskData.map((project) => (
        <div
          key={project.projectName}
          className="mb-10 border rounded p-4 shadow-md bg-white"
        >
          <h2 className="text-xl font-semibold mb-2">
            Project: {project.projectName}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Total Tasks: {project.totalTasks} | Completed:{" "}
            {project.projectComplete}
          </p>

          {/* Team Lead Card */}
          <div className="border-2 border-blue-500 p-4 rounded bg-blue-50 mb-4">
            <h3 className="font-medium text-blue-800">
              Team Lead: {project.teamLead.name}
            </h3>
            <p>Task: {project.teamLead.task}</p>
            <button
              className={`mt-2 px-4 py-1 rounded ${
                project.teamLead.taskCount === 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white"
              }`}
              onClick={() =>
                handleMarkCompleted(project.managerId, project.projectName)
              }
              disabled={project.teamLead.taskCount === 1}
            >
              {project.teamLead.taskCount === 1
                ? "Completed"
                : "Mark Completed"}
            </button>
          </div>

          {/* Team Members Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.teamMembers.map((member: any, index: number) => (
              <div key={index} className="border p-4 rounded shadow-sm">
                <h4 className="font-semibold">{member.name}</h4>
                <p>Task: {member.task}</p>
                <p>
                  Status:
                  <span
                    className={
                      member.taskCount === 0
                        ? "text-red-500 ml-2"
                        : "text-green-600 ml-2"
                    }
                  >
                    {member.taskCount === 0 ? "Not Completed" : "Completed"}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TeamLeadTasks;
