import { useState } from "react";
import {
  FaSearch,
  FaUserCircle,
  FaBell,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import profile from "./assets/profile.png";

export default function LandingPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 relative overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-blue-900 text-white p-6 shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out h-full flex flex-col justify-between z-200 overflow-y-auto md:relative`}
      >
        <div>
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h1 className="text-2xl font-bold">ERP Dashboard</h1>
            <FaTimes
              className="text-white text-2xl cursor-pointer"
              onClick={() => setIsSidebarOpen(false)}
            />
          </div>
          <nav className="space-y-3">
            
            
              <button className="w-full text-left py-3 px-4 hover:bg-blue-700 rounded">
                Home
              </button>
           
           <a href="http://my-app-xyg2.vercel.app">
              <button className="w-full text-left py-3 px-4 hover:bg-blue-700 rounded">
                Admin Panel
              </button>
              </a> 
           
              <Link to="/managerdash">
              <button className="w-full text-left py-3 px-4 hover:bg-blue-700 rounded">
                Manager Dashboard
              </button>
           
              </Link>
              <a href="#"> 
              <button className="w-full text-left py-3 px-4 hover:bg-blue-700 rounded">
                Employee Portal
              </button>
              </a>
          </nav>
        </div>
       
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-blue-50 p-4 md:p-8 overflow-auto w-full transition-all duration-300 ${isSidebarOpen ? 'md:ml-72' : 'ml-0'}`">
        {/* Navbar */}
        <div className="fixed top-0 left-0 right-0 md:left-72 bg-blue-900 text-white p-4 shadow flex justify-between items-center z-50">
          <FaBars
            className="text-2xl cursor-pointer md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          />
          <h2 className="text-lg font-semibold">Welcome to ERP System</h2>
          <div className="hidden md:flex items-center gap-4">
            <FaBell className="text-xl cursor-pointer" />
            <img
              src={profile}
              alt="User"
              className="w-8 h-8 rounded-full border"
            />
          </div>
        </div>

        {/* Push Content Below Navbar */}
        <div className="mt-16 md:mt-20">
          {/* Hero Section */}
          <div className="text-center py-12 px-4 md:px-12 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-md">
            <h1 className="text-5xl font-extrabold">
              Empowering Your Business
            </h1>
            <p className="text-lg mt-4 max-w-2xl mx-auto">
              An intuitive ERP system designed to streamline administration,
              enhance management, and empower employees.
            </p>
            <button className="mt-6 px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-gray-100">
              Get Started
            </button>
          </div>

          {/* Features Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold text-blue-900">
                Admin Panel
              </h3>
              <p className="text-gray-600 mt-2">
                Manage users, permissions, and company settings effortlessly.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold text-blue-900">
                Manager Dashboard
              </h3>
              <p className="text-gray-600 mt-2">
                Track employee performance, manage projects, and analyze
                reports.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold text-blue-900">
                Employee Portal
              </h3>
              <p className="text-gray-600 mt-2">
                Access schedules, tasks, and communication tools in one place.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
