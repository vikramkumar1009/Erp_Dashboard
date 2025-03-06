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
  const [selectedMonth, setSelectedMonth] = useState("");

  // Pagination state
  const [customerPage, setCustomerPage] = useState(1);
  const [productPage, setProductPage] = useState(1);
  const rowsPerPage = 5;


  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }
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
      console.log("📊 Sales Data:", response.data);

      // Find quantity for each productName
      const productCounts = response.data.reduce((acc, item) => {
        acc[item.productName] = (acc[item.productName] || 0) + 1;
        return acc;
      }, {});

      // Add quantity field based on productName count
      const updatedSalesData = response.data.map((item) => ({
        ...item,
        quantity: productCounts[item.productName] || 1, // Assign quantity based on product name
      }));

      setSalesData(updatedSalesData);
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching sales data:", err);
      setError("Failed to fetch sales data.");
      setLoading(false);
    }
  };

  // Pagination logic
  const totalCustomerPages = Math.ceil(customerData.length / rowsPerPage);
  const totalProductPages = Math.ceil(salesData.length / rowsPerPage);

  const displayedCustomers = customerData.slice((customerPage - 1) * rowsPerPage, customerPage * rowsPerPage);
  const displayedProducts = salesData.slice((productPage - 1) * rowsPerPage, productPage * rowsPerPage);

  return (
    <div className={`mt-20 p-4 md:p-6 bg-gray-100 min-h-screen transition-all duration-300 ${
      isSidebarOpen ? "lg:ml-72 lg:w-[calc(100%-18rem)]" : "w-full"
    }`}>
      <h2 className="text-2xl font-bold mb-4">Sales & Customer Details</h2>

      {/* Sales Graph */}
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

      {/* Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        
        {/* Product Sales Table */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full h-[400px]">
          <h3 className="text-lg font-semibold mb-4">Product Sales</h3>
          <div className="overflow-y-auto max-h-[300px]">
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
                {displayedProducts.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                    <td className="py-3 px-4">{item.productName || "N/A"}</td>
                    <td className="py-3 px-4 text-center">{item.quantity}</td>
                    <td className="py-3 px-4 text-center">${item.amount || "0"}</td>
                    <td className="py-3 px-4 text-center">{new Date(item.dateOfSale).toLocaleDateString("en-GB") || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-center mt-1 space-x-2">
  <button
    onClick={() => setProductPage((prev) => Math.max(prev - 1, 1))}
    disabled={productPage === 1}
    className="px-3 py-2 text-sm rounded-md bg-blue-700 text-white disabled:bg-gray-300"
  >
    Prev
  </button>

  {[...Array(totalProductPages)].map((_, i) => (
    <button
      key={i}
      onClick={() => setProductPage(i + 1)}
      className={`px-3 py-2 text-sm rounded-md ${
        productPage === i + 1 ? "bg-blue-700 text-white" : "bg-gray-100"
      }`}
    >
      {i + 1}
    </button>
  ))}

  <button
    onClick={() => setProductPage((prev) => Math.min(prev + 1, totalProductPages))}
    disabled={productPage === totalProductPages}
    className="px-3 py-2 text-sm rounded-md bg-blue-700 text-white disabled:bg-gray-300"
  >
    Next
  </button>
</div>

        </div>

        {/* Customer Details Table */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full h-[400px] overflow-hidden">
  <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
  <div className="overflow-y-auto max-h-[300px]">
    <table className="w-full text-gray-700 border-collapse">
      <thead className="sticky top-0 bg-gray-200 shadow">
        <tr className="text-gray-600 uppercase text-sm">
          <th className="py-3 px-4 text-left">Full Name</th>
          <th className="py-3 px-4 text-left">Email</th>
          <th className="py-3 px-4 text-left">Designation</th>
          <th className="py-3 px-4 text-left">Total Sales</th>
        </tr>
      </thead>
      <tbody>
        {displayedCustomers.map((customer, index) => (
          <tr key={index} className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}>
            <td className="py-2 px-4 truncate">{customer.name}</td>
            <td className="py-2 px-4 truncate">{customer.email || "N/A"}</td>
            <td className="py-2 px-4 truncate">{customer.designation}</td>
            <td className="py-2 px-4 text-center">{customer.totalSales}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Pagination Controls */}
  <div className="flex justify-center mt-2 space-x-2">
  <button
    onClick={() => setCustomerPage((prev) => Math.max(prev - 1, 1))}
    disabled={customerPage === 1}
    className="px-3 py-2 text-sm rounded-md bg-blue-700 text-white disabled:bg-gray-300"
  >
    Prev
  </button>

  {[...Array(totalCustomerPages)].map((_, i) => (
    <button
      key={i}
      onClick={() => setCustomerPage(i + 1)}
      className={`px-3 py-2 text-sm rounded-md ${
        customerPage === i + 1 ? "bg-blue-700 text-white" : "bg-gray-100"
      }`}
    >
      {i + 1}
    </button>
  ))}

  <button
    onClick={() => setCustomerPage((prev) => Math.min(prev + 1, totalCustomerPages))}
    disabled={customerPage === totalCustomerPages}
    className="px-3 py-2 text-sm rounded-md bg-blue-700 text-white disabled:bg-gray-300"
  >
    Next
  </button>
</div>

</div>



      </div>
    </div>
  );
};

export default SalesManagement;
