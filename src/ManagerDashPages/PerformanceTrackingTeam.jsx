import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const data = [
  { name: "Excellent", value: 65, color: "#2563eb" },
  { name: "Satisfactory", value: 25, color: "#facc15" },
  { name: "Needs Improvement", value: 10, color: "#ef4444" },
];

const PerformanceTrackingTeam = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4">Performance Tracking</h3>
      <PieChart width={250} height={250}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default PerformanceTrackingTeam;
