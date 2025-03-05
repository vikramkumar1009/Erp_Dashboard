import { useState, useContext } from "react";
import { FaSearch, FaBell, FaBars } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import AuthContext from "../AuthContext/AuthContext"; // Import AuthContext

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useContext(AuthContext); // Get user & logout from AuthContext
  const navigate = useNavigate();
  const location = useLocation(); // Get current URL path
  const handleLogout = () => {
    logout();
    navigate("/signin"); // Redirect to Sign In after logout
  };

  // Map route paths to display names
  const routeNames = {
    "/": "Manager Dash",
    "/sales-management": "Sales Management",
    "/sales-contest": "Sales Contest",
    "/team-management": "Team Management",
    "/performance-tracking": "Performance Tracking",
  };

   // Get the current route name based on the path
  const currentRouteName = routeNames[location.pathname] || "Dashboard"
  return (
    <>
      {/* Navbar */}
      <div className="bg-blue-900 text-white p-5 shadow-md flex justify-between items-center fixed top-0 right-0 z-50 w-full lg:w-[calc(100%-18rem)] lg:left-72 transition-all duration-300">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white text-2xl"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars />
        </button>

        {/* Title (Hidden on Small Screens) */}
        <h2 className="text-lg font-semibold hidden lg:block">{currentRouteName}</h2>

        {/* Search Bar */}
        <div className="flex items-center gap-4 w-full max-w-xl bg-white rounded-full px-4 py-2 shadow-md mx-4">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="outline-none bg-transparent w-full text-black"
          />
        </div>

        {/* Icons & User Section */}
        {/* Icons & User Section */}
        <div className="flex items-center gap-6">
          <FaBell className="text-xl cursor-pointer hover:text-yellow-300 transition duration-300" />

          {/* Show user image if logged in */}
          {user && user.image && (
            <img
              src={user.image}
              alt="User"
              className="w-10 h-10 rounded-full border border-white"
            />
          )}

          {/* Show Logout if user is signed in, otherwise show Sign In & Register */}
          {user ? (
            <button onClick={handleLogout} className="text-white font-semibold">
              Logout
            </button>
          ) : (
            <>
              <Link to="/signin" className="text-white font-semibold">
                Log In
              </Link>
              <Link to="/signup" className="text-white font-semibold">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
    </>
  );
};

export default Navbar;