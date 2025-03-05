import { useState, useEffect, useContext } from "react";
import axios from "axios";
import EmployeeModel from "./EmployeeModel";
import AuthContext from "./AuthContext/AuthContext";

const TeamManagement = () => {
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalType, setModalType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchEmployees(); // ✅ Fetch all employees on page load
  }, []);

  // ✅ Fetch Employees
  const fetchEmployees = async () => {
    try {
      console.log("Fetching team data...");
      const response = await axios.get("https://erp-r0hx.onrender.com/api/employee/");
      const employeeData = response.data || [];

      // Fetch incentives for each employee
      const updatedEmployees = await Promise.all(
        employeeData.map(async (employee) => {
          const incentives = await fetchIncentives(employee._id);
          return { ...employee, incentiveSlab: incentives };
        })
      );

      setEmployees(updatedEmployees);
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching employees:", err.message);
      setError("Failed to fetch employee data.");
      setLoading(false);
    }
  };

  // ✅ Fetch Incentives
  const fetchIncentives = async (employeeId) => {
    try {
      const response = await axios.get(`https://erp-r0hx.onrender.com/api/incentiveSlab/${employeeId}`);
      return response.data || []; // ✅ If no data, return empty array
    } catch (err) {
      console.error(`❌ Error fetching incentives for ${employeeId}:`, err.response?.status);

      // ✅ Handle 404 (Not Found) gracefully
      if (err.response?.status === 404) {
        return [];
      }

      return []; // ✅ Return empty array for any other error
    }
  };

  // ✅ Refresh Data on Add/Edit/Delete
  const refreshData = () => {
    setLoading(true);
    fetchEmployees(); // ✅ Fetch fresh data
  };

  // ✅ Pagination Logic
  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const paginatedData = employees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Team Management</h3>

      {/* Add/Edit/Delete Buttons */}
      <div className="flex justify-end mb-4 space-x-3">
        <button onClick={() => setModalType("add")} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Employee
        </button>
        <button onClick={() => setModalType("edit")} className="bg-yellow-600 text-white px-4 py-2 rounded">
          Edit Employee
        </button>
        <button onClick={() => setModalType("delete")} className="bg-red-600 text-white px-4 py-2 rounded">
          Delete Employee
        </button>
      </div>

      {/* Employee Modal */}
      {modalType && (
        <EmployeeModel
          modalType={modalType}
          onClose={() => setModalType(null)}
          employees={employees}
          setEmployees={setEmployees}
          refreshData={refreshData} // ✅ Refresh data after changes
        />
      )}

      {/* Table */}
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <table className="w-full text-gray-700 border">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                <th className="py-3 px-6">Full Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Designation</th>
                <th className="py-3 px-6">Incentives</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((member, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 px-6">{member.user?.name || "N/A"}</td>
                  <td className="py-3 px-6">{member.user?.email || "N/A"}</td>
                  <td className="py-3 px-6 font-bold text-blue-600">{member.designation || "N/A"}</td>
                  <td className="py-3 px-6 text-green-600">
                    {member.incentiveSlab.length > 0 ? member.incentiveSlab.join(", ") : "No Incentives"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
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
