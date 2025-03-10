import { useState, useEffect } from "react";
import axios from "axios";

const TeamManagement = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ Fetch Team Data
  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      console.log("Fetching team data...");
      const response = await axios.get("https://erp-r0hx.onrender.com/api/employee/");
      console.log("API Response:", response.data);

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid or empty response from the API");
      }

      // ✅ Fetch total sales for each employee
      const updatedTeam = await Promise.all(
        response.data.map(async (member) => {
          const totalSales = await fetchTotalSales(member._id);
          return {
            id: member._id || "N/A",
            name: member.user?.name || "N/A",
            email: member.user?.email || "N/A",
            designation: member.designation || "N/A",
            totalSales: totalSales || 0,
          };
        })
      );

      setTeam(updatedTeam);
      setError(""); // Clear error on successful fetch
    } catch (err) {
      console.error("❌ Error fetching team data:", err.message || err);
      setError("Failed to fetch team data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Total Sales Data
  const fetchTotalSales = async (employeeId) => {
    try {
      const response = await axios.get(`https://erp-r0hx.onrender.com/api/totalSales/${employeeId}`);
      return response.data.totalSales || 0;
    } catch (err) {
      console.error("❌ Error fetching total sales:", err);
      return 0;
    }
  };

  // ✅ Refresh Data After Add/Edit/Delete
  const handleRefresh = () => {
    fetchTeamData();
  };

  // ✅ Pagination Logic
  const totalPages = Math.ceil(team.length / itemsPerPage);
  const paginatedData = team.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg overflow-auto">
      <h3 className="text-lg font-semibold mb-4">Team Management</h3>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          {/* ✅ Team Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-gray-700 min-w-[600px]">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                  <th className="py-3 px-6">Full Name</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">Designation</th>
                  <th className="py-3 px-6">Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((member, index) => (
                  <tr key={member.id || index} className="border-b border-gray-200">
                    <td className="py-3 px-6 whitespace-nowrap">{member.name}</td>
                    <td className="py-3 px-6 whitespace-nowrap">{member.email}</td>
                    <td className="py-3 px-6 font-bold text-blue-600 whitespace-nowrap">{member.designation}</td>
                    <td className="py-3 px-6 text-green-600 whitespace-nowrap">{member.totalSales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Pagination Controls */}
          <div className="flex justify-center mt-4 space-x-2">
            <button
              className={`px-3 py-1 rounded-md ${currentPage === 1 ? "bg-gray-200" : "bg-blue-700 text-white"}`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? "bg-blue-700 text-white" : "bg-gray-100"}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className={`px-3 py-1 rounded-md ${currentPage === totalPages ? "bg-gray-200" : "bg-blue-700 text-white"}`}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TeamManagement;
