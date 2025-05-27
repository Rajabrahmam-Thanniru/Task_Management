import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AdminHome from "./pages/admin/AdminHome";
import TeamLeadHome from "./pages/teamlead/TeamLeadHome";
import TeamMemHome from "./pages/teammem/TeamMemHome";
import ClientHome from "./pages/client/ClientHome";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/AdminHome" element={<AdminHome />} />
      <Route path="/TeamLeadHome" element={<TeamLeadHome />} />
      <Route path="/TeamMemeberHome" element={<TeamMemHome />} />
      <Route path="/ClientHome" element={<ClientHome />} />
    </Routes>
  );
}

export default App;
