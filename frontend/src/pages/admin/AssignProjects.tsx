import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

function AssignProjects() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/manager/addprojects");
  };

  return (
    <div className="relative min-h-screen p-4">
      <h1 className="text-xl font-semibold mb-4">Assign Project</h1>

      {/* Floating button */}
      <button
        onClick={handleClick}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
        aria-label="Add Project"
      >
        <FaPlus />
      </button>
    </div>
  );
}

export default AssignProjects;
