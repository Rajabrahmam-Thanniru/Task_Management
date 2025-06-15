/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyTeam() {
  const [teamData, setTeamData] = useState<any[]>([]);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/teamlead/myteam/${userId}`
        );
        const data = await res.json();
        setTeamData(data);
      } catch (error) {
        console.error("Failed to fetch team data:", error);
      }
    };

    fetchTeam();
  }, []);

  const handleCardClick = (member: any) => {
    navigate("/teamlead/team-member", { state: { member } });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">My Team</h1>

      {teamData.map((project, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Project: {project.projectName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {project.teamMembers.map((member: any) => (
              <div
                key={member.id}
                className="cursor-pointer bg-white border border-gray-300 shadow-md rounded-lg p-4 hover:shadow-lg transition"
                onClick={() => handleCardClick(member)}
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-600">ID: {member.id}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyTeam;
