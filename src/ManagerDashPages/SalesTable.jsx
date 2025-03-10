import { useState, useEffect } from "react";
import axios from "axios";

const SalesTable = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    fetchSalesData();
  }, []);

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

  // Pagination Logic
  const totalPages = Math.ceil(salesData.length / itemsPerPage);
  const paginatedData = salesData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Sales Report</h3>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          {/* Sales Table */}
          <table className="w-screen text-gray-700">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                <th className="py-3 px-6">Product Name</th>
                <th className="py-3 px-6">Quantity</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Date of Sale</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 px-6">{item.productName || "N/A"}</td>
                  <td className="py-3 px-6">{item.quantity}</td> {/* Display quantity for each product */}
                  <td className="py-3 px-6">{item.amount || "0"}</td>
                  <td className="py-3 px-6">
                    {new Date(item.dateOfSale).toLocaleDateString("en-GB") || "N/A"}
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

export default SalesTable;
