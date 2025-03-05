import { useState, useEffect, useContext } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import AuthContext from "./AuthContext/AuthContext";

const EmployeeModel = ({ modalType, onClose, employees, setEmployees }) => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    designation: "",
    incentive: "",
  });

  const [searchId, setSearchId] = useState("");
  const [foundEmployee, setFoundEmployee] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    setFormData({
      name: "",
      email: "",
      password: "",
      designation: "",
      incentive: "",
    });
    setSearchId("");
    setFoundEmployee(null);
  }, [modalType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fetch employee by ID for Edit/Delete
  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://erp-r0hx.onrender.com/api/employee/${searchId}`);

      if (response.data) {
        setFoundEmployee(response.data);
        setFormData({
          name: response.data.user?.name || "",
          email: response.data.user?.email || "",
          password: "", // Do not show password for security
          designation: response.data.designation || "N/A",
          incentive: response.data.incentive?.join(", ") || "", // Convert array to string
        });
      } else {
        setError("Employee not found.");
      }
    } catch (err) {
      console.error("Error fetching employee:", err);
      setError("Employee not found.");
    }
  };

  // Save Changes (Add / Edit)
  const handleSave = async () => {
    try {
      let response;
      const updatedData = {
        name: formData.name,
        email: formData.email,
        designation: formData.designation,
        incentive: formData.incentive.split(",").map((item) => item.trim()), // Convert string to array
      };

      if (formData.password.trim()) {
        updatedData.password = formData.password; // Only update password if entered
      }

      if (modalType === "add") {
        response = await axios.post("https://erp-r0hx.onrender.com/api/employee/register", updatedData);
        setEmployees([...employees, response.data]);
      } else if (modalType === "edit" && foundEmployee) {
        response = await axios.put(`https://erp-r0hx.onrender.com/api/employee/${searchId}`, updatedData);
        setEmployees(employees.map((emp) => (emp._id === searchId ? response.data : emp)));
      }

      onClose();
    } catch (err) {
      console.error("❌ Error saving employee:", err);
      if (err.response) {
        setError(`Error: ${err.response.data?.message || "Failed to save employee."}`);
      } else {
        setError("Network error. Please try again.");
      }
    }
  };

  // Delete Employee
  const handleDelete = async () => {
    try {
      const token = user?.token; // Ensure user token is available

      const response = await axios.delete(`https://erp-r0hx.onrender.com/api/employee/${searchId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token if required
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setEmployees(employees.filter((emp) => emp._id !== searchId));
        setFoundEmployee(null);
        onClose();
      } else {
        setError("Failed to delete employee.");
      }
    } catch (err) {
      console.error("Error deleting employee:", err);
      setError("Failed to delete employee. Check your permissions.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70 backdrop-blur-md">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-96 max-w-md relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
          <FaTimes size={20} />
        </button>

        {/* Modal Title */}
        <h3 className="text-lg font-semibold mb-6 text-center">
          {modalType === "add" ? "ADD EMPLOYEE" : modalType === "edit" ? "EDIT EMPLOYEE" : "DELETE EMPLOYEE"}
        </h3>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        {/* Search Section for Edit/Delete */}
        {(modalType === "edit" || modalType === "delete") && !foundEmployee ? (
          <>
            <input
              type="text"
              placeholder="Enter Employee ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full p-3 mb-3 border border-gray-300 rounded text-center"
            />
            <button onClick={handleSearch} className="w-full px-6 py-2 mb-3 rounded bg-blue-900 text-white hover:bg-blue-700">
              SEARCH
            </button>
          </>
        ) : modalType === "delete" ? (
          <>
            <p className="text-center text-gray-700">
              Are you sure you want to delete employee <b>{foundEmployee?.user?.name}</b>?
            </p>
            <button onClick={handleDelete} className="w-full px-6 py-2 mt-3 rounded bg-red-500 text-white hover:bg-red-600">
              DELETE
            </button>
          </>
        ) : (
          <>
            {/* Independent Form for Add/Edit */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-3 mb-3 border border-gray-300 rounded text-center"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 mb-3 border border-gray-300 rounded text-center"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New Password (Optional)"
              className="w-full p-3 mb-3 border border-gray-300 rounded text-center"
            />
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Designation"
              className="w-full p-3 mb-3 border border-gray-300 rounded text-center"
            />
            <input
              type="text"
              name="incentive"
              value={formData.incentive}
              onChange={handleChange}
              placeholder="Incentives (comma-separated)"
              className="w-full p-3 mb-3 border border-gray-300 rounded text-center"
            />
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between mt-6 space-y-4 md:space-y-0 md:space-x-4">
          <button onClick={onClose} className="px-6 py-2 rounded bg-gray-300 hover:bg-gray-400 w-full">
            CANCEL
          </button>
          {modalType !== "delete" && (
            <button onClick={handleSave} className="px-6 py-2 rounded bg-blue-900 hover:bg-blue-700 text-white w-full">
              SAVE
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeModel;
