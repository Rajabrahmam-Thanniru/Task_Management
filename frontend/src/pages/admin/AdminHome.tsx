/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type Project = {
  _id: string;
  projectName: string;
  startDate: string;
  endDate: string;
  priority: string;
  teamLead: Record<string, any>;
  teamMembers: Record<string, any>;
  projectcomp?: number;
};

function AdminHome() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/manager/dashboard/${userId}`
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

  const handleCardClick = (project: Project) => {
    navigate(`/manager/project`, { state: { project } });
  };

  return (
    <div className="relative min-h-screen p-4 bg-cyan-100">
      <h1 className="text-xl font-semibold mb-4">Assigned Projects</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div
            key={project._id}
            onClick={() => handleCardClick(project)}
            className="cursor-pointer border border-gray-300 rounded-xl shadow-md p-4 hover:shadow-lg bg-white transition duration-200 flex justify-between items-center"
          >
            {/* Text section */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-blue-700">
                {project.projectName}
              </h2>
              <p className="text-sm text-gray-600">
                Priority: {project.priority}
              </p>
              <p className="text-sm text-gray-600">
                Team Lead:{" "}
                {project.teamLead
                  ? Object.values(project.teamLead).join(", ")
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                Start: {project.startDate}
              </p>
              <p className="text-sm text-gray-600">End: {project.endDate}</p>
            </div>

            {/* Circular progress bar */}
            <div className="w-16 h-16 ml-4">
              <CircularProgressbar
                value={project.projectcomp ?? 0}
                text={`${project.projectcomp ?? 0}%`}
                styles={buildStyles({
                  pathColor: "#3B82F6",
                  textColor: "#1F2937",
                  trailColor: "#D1D5DB",
                })}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/manager/addprojects")}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
        aria-label="Add Project"
      >
        +
      </button>
    </div>
  );
}

export default AdminHome;
