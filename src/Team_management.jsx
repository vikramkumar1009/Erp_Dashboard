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

  // Fetch Employees & Total Sales
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://erp-r0hx.onrender.com/api/employee/");
      const employeesData = response.data || [];

      // Fetch total sales for each employee
      const updatedEmployees = await Promise.all(
        employeesData.map(async (employee) => {
          const totalSales = await fetchTotalSales(employee._id);
          return { ...employee, totalSales };
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

  // Fetch Total Sales for Employees
  const fetchTotalSales = async (employeeId) => {
    try {
      const response = await axios.get(`https://erp-r0hx.onrender.com/api/sales/${employeeId}`);
      return response.data.totalSales || 0;
    } catch (err) {
      console.error(`❌ Error fetching total sales for Employee ID ${employeeId}:`, err);
      return 0;
    }
  };

  // Refresh Data on Add, Edit, Delete
  const handleRefresh = async () => {
    await fetchEmployees();
  };

  // Filter Employees
  const filteredEmployees = employees.filter((emp) =>
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
    <div>
      <main
        className={`mt-20 p-4 md:p-6 bg-gray-100 min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-72 lg:w-[calc(100%-18rem)]" : "w-full"
        }`}
      >
        <div className="mt-5">
          {/* Search & Filters */}
          <div className="md:flex md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              />
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="">All Departments</option>
                <option value="Marketing">Marketing</option>
                <option value="Program Tester">Program Tester</option>
              </select>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <button className="bg-white rounded-3xl text-black hover:bg-blue-600 px-4 py-2" onClick={() => setModalType("add")}>
                Add Employee
              </button>
              <button className="bg-white rounded-3xl text-black hover:bg-red-600 px-4 py-2" onClick={() => setModalType("delete")}>
                Delete Employee
              </button>
              <button className="bg-white rounded-3xl text-black hover:bg-yellow-600 px-4 py-2" onClick={() => setModalType("edit")}>
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
          <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-lg mt-6">
            <h3 className="text-md font-semibold mb-4">Team Members</h3>
            {loading ? (
              <p className="text-center">Loading employees...</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-gray-700 min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-4 text-left">ID</th>
                        <th className="py-3 px-4 text-left">Full Name</th>
                        <th className="py-3 px-4 text-left">Email</th>
                        <th className="py-3 px-4 text-left">Designation</th>
                        <th className="py-3 px-4 text-left">Total Sales</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                      {paginatedEmployees.map((emp, index) => (
                        <tr
                          key={emp._id}
                          className={`border-b border-gray-200 hover:bg-gray-200 ${
                            index % 2 === 0 ? "bg-blue-50" : "bg-gray-50"
                          }`}
                        >
                          <td className="py-3 px-4 whitespace-nowrap">{emp._id}</td>
                          <td className="py-3 px-4">{emp.user?.name || "N/A"}</td>
                          <td className="py-3 px-4">{emp.user?.email || "N/A"}</td>
                          <td className="py-3 px-4">{emp.designation || "N/A"}</td>
                          <td className="py-3 px-4 font-bold text-blue-600">${emp.totalSales || "0"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-4 space-x-2">
                  <button className="px-4 py-2 bg-blue-700 text-white rounded-lg" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
                    Prev
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`px-4 py-2 rounded-lg ${currentPage === i + 1 ? "bg-blue-700 text-white" : "bg-gray-200"}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button className="px-4 py-2 bg-blue-700 text-white rounded-lg" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
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
