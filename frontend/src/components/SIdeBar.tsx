/* eslint-disable @typescript-eslint/no-unused-expressions */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSearch,
  faChalkboardTeacher,
  faBell,
  faTicketAlt,
  faSignOutAlt,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, type JSX } from "react";

interface MenuItem {
  name: string;
  icon: unknown;
  path?: string;
  isLogout?: boolean;
}

function SideBar(): JSX.Element {
  const [username] = useState<string | null>(localStorage.getItem("username"));
  const [role] = useState<string | null>(localStorage.getItem("role"));
  const location = useLocation();
  const pathname = location.pathname.toLowerCase();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  let menuItems: MenuItem[] = [];

  switch (role) {
    case "manager":
      menuItems = [
        { name: "Dashboard", icon: faUser, path: "/manager/dashboard" },
        {
          name: "Manage Users",
          icon: faChalkboardTeacher,
          path: "/manager/users",
        },
        { name: "Projects", icon: faTicketAlt, path: "/manager/projects" },
        { name: "Tasks", icon: faSearch, path: "/manager/tasks" },
        { name: "Reports", icon: faBell, path: "/manager/reports" },
      ];
      break;
    case "team_lead":
      menuItems = [
        { name: "Dashboard", icon: faUser, path: "/teamlead/dashboard" },
        { name: "My Team", icon: faChalkboardTeacher, path: "/teamlead/team" },
        { name: "Tasks", icon: faSearch, path: "/teamlead/tasks" },
        { name: "Reports", icon: faBell, path: "/teamlead/reports" },
      ];
      break;
    case "team_member":
      menuItems = [
        { name: "Dashboard", icon: faUser, path: "/teammember/dashboard" },
        { name: "My Tasks", icon: faSearch, path: "/teammember/tasks" },
        { name: "Progress", icon: faBell, path: "/teammember/progress" },
      ];
      break;
    case "client":
      menuItems = [
        { name: "Overview", icon: faUser, path: "/client/overview" },
        { name: "Reports", icon: faBell, path: "/client/reports" },
        { name: "Tasks", icon: faSearch, path: "/client/tasks" },
      ];
      break;
  }

  menuItems.push({ name: "Logout", icon: faSignOutAlt, isLogout: true });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/");
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const getCurrentPageName = (): string => {
    const item = menuItems.find(
      (item) => item.path && pathname.includes(item.path.toLowerCase())
    );
    return item?.name ?? "Home";
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#2E4661] p-4 flex justify-between items-center">
        <button onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} className="text-white text-2xl" />
        </button>
        <div className="flex-1 text-center text-white font-semibold text-lg">
          {getCurrentPageName()}
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`bg-[#2E4661] p-4 w-64 h-screen fixed top-0 z-40 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:relative md:block`}
      >
        {/* Close Button for Mobile */}
        <div className="flex justify-end md:hidden">
          <button onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faTimes} className="text-white text-2xl" />
          </button>
        </div>

        {/* User Info (Visible on All Views Now) */}
        <div className="flex flex-row items-center mt-4">
          <div className="bg-[#0084da] rounded-full p-4 inline-block">
            <FontAwesomeIcon icon={faUser} className="text-4xl text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-white text-xl font-bold">{username}</h1>
            <p className="text-white text-sm capitalize">{role}</p>
          </div>
        </div>

        {/* Current Page Info (Only in Mobile) */}

        {/* Search Bar (Only on Desktop) */}
        <div className="relative mt-6 hidden md:block">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            className="bg-white rounded-3xl w-full h-9 pl-10 pr-4 text-sm focus:outline-none"
            placeholder="Search"
          />
        </div>

        {/* Menu */}
        <ul className="mt-6 space-y-2">
          {menuItems.map((item) => {
            const isActive =
              item.path && pathname.includes(item.path.toLowerCase());
            return (
              <li
                key={item.name}
                onClick={() => {
                  item.isLogout
                    ? handleLogout()
                    : item.path && navigate(item.path);
                  setIsOpen(false);
                }}
                className={`flex items-center h-10 pl-4 pr-2 rounded-2xl cursor-pointer ${
                  isActive ? "bg-[#0084da]" : "bg-[#2E4661]"
                } text-white hover:bg-[#0084da] transition-all duration-150`}
              >
                <FontAwesomeIcon icon={item.icon} className="mr-3" />
                <span>{item.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default SideBar;
