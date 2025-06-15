/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Project = {
  projectId: string;
  projectName: string;
  startDate: string;
  endDate: string;
  priority: string;
  taskcount: number;
  manager: string;
  managerId: string; // <-- added this
  projectcomp: number;
};

function TeamLeadHome() {
  const userId = localStorage.getItem("userId");
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/teamlead/dashboard/${userId}`
        );
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    if (userId) {
      fetchProjects();
    }
  }, [userId]);

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Assigned Projects</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {projects.map((project) => (
          <div
            key={project.projectId}
            className="bg-white shadow-md border border-gray-200 rounded-lg p-4 transition hover:shadow-lg cursor-pointer"
            onClick={() =>
              navigate("/teamlead/projectdetails", {
                state: {
                  project,
                  managerId: project.managerId, // ✅ fixed
                },
              })
            }
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-blue-700">
                {project.projectName}
              </h2>
              <div className="relative w-12 h-12">
                <svg className="absolute top-0 left-0 w-full h-full">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 20 * (1 - project.projectcomp / 100)
                    }`}
                    transform="rotate(-90 24 24)"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-green-600">
                  {project.projectcomp}%
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Priority: {project.priority}
            </p>
            <p className="text-sm text-gray-600">Manager: {project.manager}</p>
            <p className="text-sm text-gray-600">Start: {project.startDate}</p>
            <p className="text-sm text-gray-600">End: {project.endDate}</p>
            <p className="text-sm text-green-600 mt-1">
              Tasks: {project.taskcount ?? 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamLeadHome;
