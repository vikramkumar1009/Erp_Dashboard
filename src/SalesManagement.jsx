import { useState, useEffect, useContext } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import AuthContext from "./AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

const manualSalesData = [
  { month: "Jan", salesAmount: 90000 },
  { month: "Feb", salesAmount: 70000 },
  { month: "Mar", salesAmount: 50000 },
  { month: "Apr", salesAmount: 55000 },
  { month: "May", salesAmount: 57000 },
  { month: "Jun", salesAmount: 60000 },
  { month: "Jul", salesAmount: 59000 },
  { month: "Aug", salesAmount: 65000 },
  { month: "Sep", salesAmount: 62000 },
  { month: "Oct", salesAmount: 72000 },
  { month: "Nov", salesAmount: 75000 },
  { month: "Dec", salesAmount: 89000 },
];

const SalesManagement = ({ isSidebarOpen }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gsalesData, setGalesData] = useState(manualSalesData);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  
  const totalPages = Math.ceil(customerData.length / rowsPerPage);
  const displayedCustomers = customerData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  
  useEffect(() => {
    if (!user) return;
    fetchCustomerData();
    fetchSalesData();
  }, [user]);

  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://erp-r0hx.onrender.com/api/employee/");
      const updatedCustomers = await Promise.all(
        response.data.map(async (customer) => {
          const totalSales = await fetchTotalSales(customer._id);
          return {
            name: customer.user?.name || "N/A",
            email: customer.user?.email || "N/A",
            designation: customer.designation || "N/A",
            totalSales: totalSales || 0,
          };
        })
      );
      setCustomerData(updatedCustomers);
      setError("");
    } catch (err) {
      setError("Failed to fetch customer data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalSales = async (customerId) => {
    try {
      const response = await axios.get(`https://erp-r0hx.onrender.com/api/totalSales/`);
      return response.data.totalSales || 0;
    } catch (err) {
      return 0;
    }
  };

  const fetchSalesData = async () => {
    try {
      const response = await axios.get("https://erp-r0hx.onrender.com/api/sales/");
      setSalesData(response.data);
    } catch (err) {
      setError("Failed to fetch sales data.");
    }
  };


 // 🔹 Handle filtering sales data by month
  const handleFilter = () => {
    if (!selectedMonth) {
      setSalesData(manualSalesData);
    } else {
      const filteredData = manualSalesData.filter((data) =>
        data.month.toLowerCase().includes(selectedMonth.toLowerCase())
      );
      setSalesData(filteredData);
    }
  };

  return (
    <div className={`mt-20 p-4 md:p-6 bg-gray-100 min-h-screen transition-all duration-300 ${
      isSidebarOpen ? "lg:ml-72 lg:w-[calc(100%-18rem)]" : "w-full"
    }`}>
      <h2 className="text-2xl font-bold mb-4">Sales & Customer Details</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h3 className="text-lg font-semibold">Sales Report</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={manualSalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="salesAmount" stroke="#2563eb" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full">
          <h3 className="text-lg font-semibold">Product Sales</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-gray-700">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                  <th className="py-3 px-4 text-left">Product Name</th>
                  <th className="py-3 px-4 text-left">Quantity</th>
                  <th className="py-3 px-4 text-left">Amount</th>
                  <th className="py-3 px-4 text-left">Date of Sale</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                    <td className="py-3 px-4">{item.productName || "N/A"}</td>
                    <td className="py-3 px-4">{item.quantity}</td>
                    <td className="py-3 px-4">${item.amount || "0"}</td>
                    <td className="py-3 px-4">{new Date(item.dateOfSale).toLocaleDateString("en-GB") || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full">
          <h3 className="text-lg font-semibold">Customer Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-gray-700">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                  <th className="py-3 px-4 text-left">Full Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Designation</th>
                  <th className="py-3 px-4 text-left">Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {displayedCustomers.map((customer, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                    <td className="py-3 px-4">{customer.name}</td>
                    <td className="py-3 px-4">{customer.email}</td>
                    <td className="py-3 px-4">{customer.designation}</td>
                    <td className="py-3 px-4">{customer.totalSales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesManagement;










