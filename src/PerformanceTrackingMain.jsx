import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { FaEllipsisV } from "react-icons/fa";
import AuthContext from "./AuthContext/AuthContext"; // ✅ Import Auth Context
import AlertBox from "./AlertBox";

const yearlySalesData = [
  { month: "Jan", target: 1000, achieved: 800 },
  { month: "Feb", target: 1200, achieved: 900 },
  { month: "Mar", target: 1500, achieved: 1100 },
  { month: "Apr", target: 1000, achieved: 950 },
  { month: "May", target: 1300, achieved: 1200 },
  { month: "Jun", target: 1400, achieved: 1300 },
  { month: "Jul", target: 1700, achieved: 1500 },
  { month: "Aug", target: 1800, achieved: 1600 },
  { month: "Sep", target: 1600, achieved: 1400 },
  { month: "Oct", target: 1500, achieved: 1300 },
  { month: "Nov", target: 1700, achieved: 1500 },
  { month: "Dec", target: 2000, achieved: 1800 },
];

const incentiveData = [
  { month: "Jan", value: 400 },
  { month: "Feb", value: 600 },
  { month: "Mar", value: 500 },
  { month: "Apr", value: 900 },
];

const quarterlyPerformance = [
  { team: "TEAM 1", achieved: "$20,000", target: "$25,000", rate: "80%", incentives: "$20,000" },
  { team: "TEAM 2", achieved: "$17,000", target: "$18,000", rate: "70%", incentives: "$17,000" },
  { team: "TEAM 3", achieved: "$28,000", target: "$30,000", rate: "81%", incentives: "$28,000" },
  { team: "TEAM 4", achieved: "$14,000", target: "$15,000", rate: "85%", incentives: "$14,000" },
  { team: "TEAM 5", achieved: "$17,000", target: "$20,000", rate: "70%", incentives: "$17,000" },
];

const deperformingEmployees = [
  "Parviz Aslanov",
  "Seving Aslanova",
  "Ceyhun Aslanov",
  "Ayla Mammadova",
  "Orxan Hüseyinov",
];

const PerformanceTrackingMain = ({ isSidebarOpen }) => {
  const { user } = useContext(AuthContext); // ✅ Get user from AuthContext
  const navigate = useNavigate();

  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  // ✅ Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  if (!user) return null; // Prevent rendering before redirection

  const openAlert = (employee) => {
    setSelectedEmployee(employee);
    setAlertOpen(true);
  };

  return (
    <div
      className={`mt-20 p-4 md:p-6 bg-gray-100 min-h-screen transition-all duration-300 ${
        isSidebarOpen ? "lg:ml-72 lg:w-[calc(100%-18rem)]" : "w-full"
      }`}
    >
      {/* Header */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">INDIVIDUAL AND TEAM SALES AGAINST TARGET (YEARLY)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={yearlySalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="target" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="achieved" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quarterly Performance Table */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg mt-6">
        <h3 className="text-lg font-semibold mb-4">TEAMS QUARTERLY PERFORMANCE</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-gray-700 text-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                <th className="py-3 px-6">TEAM NO</th>
                <th className="py-3 px-6">Sales Achieved</th>
                <th className="py-3 px-6">Target Assigned</th>
                <th className="py-3 px-6">Achievement Rate</th>
                <th className="py-3 px-6">Incentives Earned</th>
                <th className="py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quarterlyPerformance.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                  <td className="py-3 px-6">{row.team}</td>
                  <td className="py-3 px-6">{row.achieved}</td>
                  <td className="py-3 px-6">{row.target}</td>
                  <td className="py-3 px-6">{row.rate}</td>
                  <td className="py-3 px-6">{row.incentives}</td>
                  <td className="py-3 px-6"><FaEllipsisV /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incentive Distribution & Deperforming Employees */}
      <div className="flex flex-col md:grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Incentive Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={incentiveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Deperforming Employees</h3>
          {deperformingEmployees.map((employee, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg mb-2">
              <p>{employee}</p>
              <button className="bg-red-500 text-white text-xs px-2 py-1 rounded" onClick={() => openAlert(employee)}>
                ALERT
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Modal */}
      {alertOpen && <AlertBox selectedEmployee={selectedEmployee} onClose={() => setAlertOpen(false)} />}
    </div>
  );
};

export default PerformanceTrackingMain;
