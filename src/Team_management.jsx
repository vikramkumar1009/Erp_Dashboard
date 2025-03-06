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
          
          return { ...employee};
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
          <div className="bg-white p-6 rounded-lg shadow-lg mt-6 w-full">
  {/* Heading */}
  <h3 className="text-xl font-semibold mb-6 text-center text-gray-800">Team Members</h3>

  {/* Loading State */}
  {loading ? (
    <p className="text-center text-lg text-gray-600">Loading employees...</p>
  ) : (
    <>
      {/* Table Container */}
      <div className="overflow-x-auto w-full">
  <table className="w-full border-collapse text-gray-700 text-lg bg-gray-50 shadow-md rounded-lg font-[Inter]">
    <thead>
      <tr className="bg-blue-700 text-white uppercase text-md leading-normal">
        <th className="py-4 px-6 text-left">ID</th>
        <th className="py-4 px-6 text-left">Full Name</th>
        <th className="py-4 px-6 text-left">Email</th>
        <th className="py-4 px-6 text-left">Designation</th>
        <th className="py-4 px-6 text-left">Total Sales</th>
      </tr>
    </thead>
    <tbody className="text-gray-800 text-md">
      {paginatedEmployees.map((emp, index) => (
        <tr
          key={emp._id}
          className={`border-b border-gray-300 hover:bg-gray-200 transition-all duration-300 ${
            index % 2 === 0 ? "bg-blue-50" : "bg-white"
          }`}
        >
          <td className="py-4 px-6 whitespace-nowrap">{emp._id}</td>
          <td className="py-4 px-6">{emp.user?.name || "N/A"}</td>
          <td className="py-4 px-6">{emp.user?.email || "N/A"}</td>
          <td className="py-4 px-6">{emp.designation || "N/A"}</td>
          <td className="py-4 px-6 font-bold text-blue-600 text-center">${emp.totalSales || "0"}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-3">
        <button
          className={`px-5 py-2 text-lg rounded-lg ${
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
            className={`px-5 py-2 text-lg rounded-lg ${
              currentPage === i + 1 ? "bg-blue-700 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className={`px-5 py-2 text-lg rounded-lg ${
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
