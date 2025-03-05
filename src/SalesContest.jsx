import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BarChart, Bar, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import AuthContext from "./AuthContext/AuthContext"; // ✅ Import Auth Context

const leaderboardData = [
  { name: "Orxan Hüseyinov", target: "20%", achieved: "30%", image: "https://randomuser.me/api/portraits/men/1.jpg", highlight: true },
  { name: "Ayla Mammadova", target: "20%", achieved: "20%", image: "https://randomuser.me/api/portraits/women/2.jpg", highlight: false },
  { name: "Seving Aslanova", target: "20%", achieved: "20%", image: "https://randomuser.me/api/portraits/women/3.jpg", highlight: false },
];

const contestData = [
  { team: "Team Sales", contest: "Sales Contest", target: "15%", update: "Upcoming" },
  { team: "Team Marketing", contest: "Marketing Contest", target: "20%", update: "Ongoing" },
  { team: "All Employees", contest: "Best Employee Contest", target: "10%", update: "Ongoing" },
  { team: "Team Management", contest: "Management Contest", target: "20%", update: "Ongoing" },
  { team: "All Teams", contest: "Team Contest", target: "30%", update: "Complete" },
];

const contestChartData = [
  { week: "1W", value: 5 },
  { week: "2W", value: 10 },
  { week: "3W", value: 15 },
  { week: "4W", value: 20 },
  { week: "5W", value: 25 },
];

const pieChartData = [
  { name: "Marketing", value: 18, color: "#ff6347" },
  { name: "Management", value: 11, color: "#4682b4" },
  { name: "Sales", value: 9, color: "#ffa500" },
];

const SalesContest = ({ isSidebarOpen }) => {
  const { user } = useContext(AuthContext); // ✅ Get user from context
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const totalPages = Math.ceil(contestData.length / rowsPerPage);
  const displayedRows = contestData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // ✅ Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  if (!user) return null; // Prevent rendering before redirection

  return (
    <div
      className={`mt-20 p-4 md:p-6 bg-gray-100 min-h-screen transition-all duration-300 ${
        isSidebarOpen ? "lg:ml-72 lg:w-[calc(100%-18rem)]" : "w-full"
      }`}
    >
      {/* Leaderboard & Charts */}
      <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Leader Board</h3>
          <div className="flex flex-col items-center space-y-4">
            {leaderboardData.map((user, index) => (
              <div
                key={index}
                className={`flex items-center p-4 rounded-lg w-full ${
                  user.highlight ? "bg-blue-200 border border-blue-500 shadow-lg" : "bg-gray-100"
                }`}
              >
                <img src={user.image} alt={user.name} className="w-12 h-12 rounded-full border border-gray-300" />
                <div className="ml-4">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">Target: {user.target} | Achieved: {user.achieved}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Performance Progress</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={contestChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Department Participation</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Contest Table */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg mt-6 w-full">
  <h3 className="text-lg font-semibold mb-4 text-center">Contest Status</h3>

  <div className="overflow-x-auto">
    <table className="w-full text-gray-700 text-lg text-center border-collapse">
      <thead>
        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <th className="py-3 px-6 border">Team Name</th>
          <th className="py-3 px-6 border">Contest Name</th>
          <th className="py-3 px-6 border">Target</th>
          <th className="py-3 px-6 border">Contest Update</th>
        </tr>
      </thead>
      <tbody>
        {displayedRows.map((row, index) => (
          <tr key={index} className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}>
            <td className="py-3 px-6 border">{row.team}</td>
            <td className="py-3 px-6 border">{row.contest}</td>
            <td className="py-3 px-6 border">{row.target}</td>
            <td className="py-3 px-6 border">{row.update}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  <div className="flex justify-center mt-4 space-x-2">
    <button
      className={`px-4 py-2 rounded-md ${page === 1 ? "bg-gray-200" : "bg-blue-700 text-white"}`}
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
    >
      <FaChevronLeft />
    </button>
    {[...Array(totalPages)].map((_, i) => (
      <button key={i} className={`px-4 py-2 rounded-md ${page === i + 1 ? "bg-blue-700 text-white" : "bg-gray-100"}`} onClick={() => setPage(i + 1)}>
        {i + 1}
      </button>
    ))}
    <button className={`px-4 py-2 rounded-md ${page === totalPages ? "bg-gray-200" : "bg-blue-700 text-white"}`} disabled={page === totalPages} onClick={() => setPage(page + 1)}>
      <FaChevronRight />
    </button>
  </div>
</div>


    </div>
  );
};

export default SalesContest;
