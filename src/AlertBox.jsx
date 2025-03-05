import { FaTimes } from "react-icons/fa";
import PerformanceTrackingTeam from "./ManagerDashPages/PerformanceTrackingTeam";
import Layout from "./Layout/Layout";
import PerformanceTrackingMain from "./PerformanceTrackingMain";


const AlertBox = ({ selectedEmployee, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70 backdrop-blur-md">
    <div className="absolute inset-0 overflow-hidden">
      <Layout>
     <PerformanceTrackingMain/>
      </Layout>
      
    </div>
    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
<button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-red-500">
  <FaTimes size={20} />
</button>
<h3 className="text-lg font-semibold text-center mb-4">ALERT</h3>
<div className="space-y-3">
  <input type="text" value={selectedEmployee} className="w-full p-3 border border-gray-300 rounded bg-gray-100" disabled />
  <input type="text" placeholder="Team" className="w-full p-3 border border-gray-300 rounded" />
  <input type="date" placeholder="Due Date" className="w-full p-3 border border-gray-300 rounded" />
  <input type="text" placeholder="Reason" className="w-full p-3 border border-gray-300 rounded" />
  <textarea placeholder="Message" className="w-full p-3 border border-gray-300 rounded"></textarea>
</div>
<div className="flex justify-between mt-4">
  <button className="px-6 py-2 rounded bg-gray-300 hover:bg-gray-400">RESET</button>
  <button className="px-6 py-2 rounded bg-blue-900 text-white hover:bg-blue-700">SEND</button>
</div>
</div>
  </div>
  );
};

export default AlertBox;


