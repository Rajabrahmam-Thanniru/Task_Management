import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import AdminHome from "./pages/admin/AdminHome";
import TeamLeadHome from "./pages/teamlead/TeamLeadHome";
import TeamMemHome from "./pages/teammem/TeamMemHome";
import ClientHome from "./pages/client/ClientHome";
import SideBar from "./components/SIdeBar";

import ManageUsers from "./pages/admin/ManageUsers";
import Reports from "./pages/admin/Report";
import Tasks from "./pages/admin/Tasks";
import MyTask from "./pages/teammem/MyTask";
import MyProgress from "./pages/teammem/MyProgress";
import ShowProgress from "./pages/client/ShowProgress";
import TeamLeadTasks from "./pages/teamlead/TeamLeadTasks";
import TeamLeadReport from "./pages/teamlead/TeamLeadReport";
import MyTeam from "./pages/teamlead/MyTeam";
import AddProjects from "./pages/admin/AddProjects";
import type { JSX } from "react";
import ProjectDetails from "./pages/admin/projectdetails";
import ShowDetails from "./pages/teamlead/showdetails";
import TeamMembers from "./pages/teamlead/teammember";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/" />;
}

function App() {
  const location = useLocation();
  const hideNavOnRoutes = [
    "/",
    "/manager/addprojects",
    "/manager/project",
    "/teamlead/projectdetails",
    "/teamlead/team-member",
  ];
  const showSidebar = !hideNavOnRoutes.includes(
    location.pathname.toLowerCase()
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {showSidebar && <SideBar />}
      <div className="flex-1">
        <Routes>
          {/* manager routes */}
          <Route path="/" element={<Login />} />
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute>
                <AdminHome />
              </ProtectedRoute>
            }
          />

          <Route path="/manager/users" element={<ManageUsers />} />
          <Route path="manager/reports" element={<Reports />} />
          <Route path="/manager/tasks" element={<Tasks />} />
          <Route path="/manager/addprojects" element={<AddProjects />} />
          <Route path="/manager/project" element={<ProjectDetails />} />

          {/* team lead routes*/}
          <Route
            path="/teamlead/dashboard"
            element={
              <ProtectedRoute>
                <TeamLeadHome />
              </ProtectedRoute>
            }
          />
          <Route path="/teamlead/tasks" element={<TeamLeadTasks />} />
          <Route path="/teamlead/reports" element={<TeamLeadReport />} />
          <Route path="/teamlead/team" element={<MyTeam />} />
          <Route path="/teamlead/projectdetails" element={<ShowDetails />} />
          <Route path="/teamlead/team-member" element={<TeamMembers />} />

          {/* team memeber routes */}
          <Route
            path="/teammember/dashboard"
            element={
              <ProtectedRoute>
                <TeamMemHome />
              </ProtectedRoute>
            }
          />
          <Route path="/teammember/tasks" element={<MyTask />} />
          <Route path="/teammember/progress" element={<MyProgress />} />

          {/* client routes */}
          <Route
            path="/client/overview"
            element={
              <ProtectedRoute>
                <ClientHome />
              </ProtectedRoute>
            }
          />
          <Route path="/client/tasks" element={<Tasks />} />
          <Route path="/client/progress" element={<ShowProgress />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
