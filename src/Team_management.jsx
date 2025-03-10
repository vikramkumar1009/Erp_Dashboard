import { useState, useEffect, useContext } from "react";
import axios from "axios";
import EmployeeModel from "./EmployeeModel";
import AuthContext from "./AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

function Team_Management({ isSidebarOpen }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }
    fetchEmployees();
  }, [user]);

  // Fetch Employees & Incentives
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://erp-r0hx.onrender.com/api/employee/");
      const employeesData = response.data || [];

      // Fetch incentives for each employee
      const updatedEmployees = await Promise.all(
        employeesData.map(async (employee) => {
          return { ...employee };
        })
      );

      setEmployees(updatedEmployees);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Incentives for Employees
  const fetchIncentives = async (employeeId) => {
    try {
      const response = await axios.get(`https://erp-r0hx.onrender.com/api/incentiveSlab/${employeeId}`);
      return response.data || [];
    } catch (err) {
      console.error("❌ Error fetching incentives:", err);
      return [];
    }
  };

  // Refresh Data on Add, Edit, Delete
  const handleRefresh = async () => {
    await fetchEmployees();
  };

  // Filter Employees
  const filteredEmployees = employees.filter(
    (emp) =>
      emp?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterDepartment ? emp?.department === filterDepartment : true)
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * employeesPerPage,
    currentPage * employeesPerPage
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <main
        className={`mt-20 p-4 md:p-6 transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-72 lg:w-[calc(100%-18rem)]" : "w-screen"
        }`}
      >
        <div className="flex flex-col">
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 mb-6">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full md:w-64"
              />
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full md:w-48"
              >
                <option value="">All Departments</option>
                <option value="Marketing">Marketing</option>
                <option value="Program Tester">Program Tester</option>
              </select>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <button
                className="bg-white rounded-3xl text-black hover:bg-blue-600 px-4 py-2 w-full md:w-auto"
                onClick={() => setModalType("add")}
              >
                Add Employee
              </button>
              <button
                className="bg-white rounded-3xl text-black hover:bg-red-600 px-4 py-2 w-full md:w-auto"
                onClick={() => setModalType("delete")}
              >
                Delete Employee
              </button>
              <button
                className="bg-white rounded-3xl text-black hover:bg-yellow-600 px-4 py-2 w-full md:w-auto"
                onClick={() => setModalType("edit")}
              >
                Edit Employee
              </button>
            </div>
          </div>

          {/* Employee Modal */}
          {modalType && (
            <EmployeeModel
              modalType={modalType}
              onClose={() => setModalType(null)}
              employees={employees}
              setEmployees={setEmployees}
              onRefresh={handleRefresh}
            />
          )}

          {/* Team Management Table */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {/* Heading */}
            <h3 className="text-xl font-semibold mb-6 text-center text-gray-800">Team Members</h3>

            {/* Loading State */}
            {loading ? (
              <p className="text-center text-lg text-gray-600">Loading employees...</p>
            ) : (
              <>
                {/* Table Container */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-gray-700 text-sm md:text-lg bg-gray-50 shadow-md rounded-lg font-[Inter]">
                    <thead className="sticky top-0 bg-blue-700 text-white uppercase text-sm md:text-md leading-normal">
                      <tr>
                        <th className="py-3 px-4 text-left">ID</th>
                        <th className="py-3 px-4 text-left">Full Name</th>
                        <th className="py-3 px-4 text-left">Email</th>
                        <th className="py-3 px-4 text-left">Designation</th>
                        <th className="py-3 px-4 text-left">Total Sales</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-800 text-sm md:text-md">
                      {paginatedEmployees.map((emp, index) => (
                        <tr
                          key={emp._id}
                          className={`border-b border-gray-300 hover:bg-gray-200 transition-all duration-300 ${
                            index % 2 === 0 ? "bg-blue-50" : "bg-white"
                          }`}
                        >
                          <td className="py-3 px-4 whitespace-nowrap">{emp._id}</td>
                          <td className="py-3 px-4">{emp.user?.name || "N/A"}</td>
                          <td className="py-3 px-4">{emp.user?.email || "N/A"}</td>
                          <td className="py-3 px-4">{emp.designation || "N/A"}</td>
                          <td className="py-3 px-4 font-bold text-blue-600 text-center">${emp.totalSales || "0"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-6 space-x-3">
                  <button
                    className={`px-4 py-2 text-sm md:text-lg rounded-lg ${
                      currentPage === 1 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-700 text-white hover:bg-blue-800"
                    }`}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Prev
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`px-4 py-2 text-sm md:text-lg rounded-lg ${
                        currentPage === i + 1 ? "bg-blue-700 text-white" : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className={`px-4 py-2 text-sm md:text-lg rounded-lg ${
                      currentPage === totalPages ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-700 text-white hover:bg-blue-800"
                    }`}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Team_Management;
