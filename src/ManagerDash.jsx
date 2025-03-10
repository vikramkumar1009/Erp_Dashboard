import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext/AuthContext";// Import Auth Context
import SalesOverview from "./ManagerDashPages/SalesOverview";
import SalesContest from "./ManagerDashPages/SalesContest";
import TeamManagement from "./ManagerDashPages/TeamManagement";
import PerformanceTracking from "./ManagerDashPages/PerformanceTracking";
import SalesTable from "./ManagerDashPages/SalesTable";
import SalesChart from "./ManagerDashPages/SalesChart";
import PerformanceTrackingTeam from "./ManagerDashPages/PerformanceTrackingTeam";

const ManagerDash = ({ isSidebarOpen }) => {
  const { user } = useContext(AuthContext); // Get user from context
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/signin"); // Redirect if not logged in
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Prevents rendering before redirection
  }

  return (
    <div
      className={`mt-20 p-4 md:p-6 bg-gray-100 min-h-screen transition-all duration-300 ${
        isSidebarOpen ? "lg:ml-72 lg:w-[calc(100%-18rem)]" : "w-screen"
      }`}
    >
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
        Welcome, {user.name || "Manager"}!
      </h1>

      {/* Sales Overview Section */}
      <SalesOverview />

      {/* Sales Table & Sales Graph */}
      <div className="flex flex-col md:grid md:grid-cols-2 gap-6 mt-6">
        <div className="w-full overflow-x-auto">
          <SalesTable />
        </div>
        <div className="w-full">
          <SalesChart />
        </div>
      </div>

      {/* Sales Contest & Target Achievement */}
      <div className="flex flex-col md:grid md:grid-cols-2 gap-6 mt-6">
        <SalesContest />
        <PerformanceTracking />
      </div>

      {/* Team Management & Performance Tracking */}
      <div className="flex flex-col md:grid md:grid-cols-2 gap-6 mt-6">
        <TeamManagement />
        <PerformanceTrackingTeam />
      </div>
    </div>
  );
};

export default ManagerDash;
