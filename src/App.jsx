import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./component/Sidebar";
import Navbar from "./component/Navbar";
import ManagerDash from "./ManagerDash";
import PerformanceTrackingMain from "./PerformanceTrackingMain";
import SalesContest from "./SalesContest";
import SalesManagement from "./SalesManagement";
import Team_management from "./Team_management";
import Signin from "./Signin";
import SignUp from "./SignUp";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <AppContent isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
    </Router>
  );
}

function AppContent({ isSidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/signin" || location.pathname === "/signup";

  return (
    <div className="flex">
      {/* Conditionally render Sidebar */}
      {!isAuthPage && (
        <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1">
        {/* Conditionally render Navbar */}
        {!isAuthPage && (
          <Navbar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}

        <Routes>
          <Route path="/" element={<ManagerDash isSidebarOpen={isSidebarOpen} />} />
          <Route path="/performance-tracking" element={<PerformanceTrackingMain isSidebarOpen={isSidebarOpen} />} />
          <Route path="/sales-contest" element={<SalesContest isSidebarOpen={isSidebarOpen} />} />
          <Route path="/sales-management" element={<SalesManagement isSidebarOpen={isSidebarOpen} />} />
          <Route path="/team-management" element={<Team_management isSidebarOpen={isSidebarOpen} />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;