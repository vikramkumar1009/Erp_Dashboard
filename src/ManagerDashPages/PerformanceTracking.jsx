import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const PerformanceTracking = () => {
  const totalsales= 300;
  const determined = 65;
  const determinedPercentage = (determined / totalsales) * 100;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
      <div className="w-32 h-32">
        <CircularProgressbar
          value={determinedPercentage}
          text={`${totalsales}`}
          styles={buildStyles({
            textColor: "#333",
            pathColor: "#2563eb",
            trailColor: "#e5e7eb",
          })}
        />
      </div>
      <p className="text-sm text-gray-600 mt-4">Total Sales</p>
      <div className="mt-4 text-center">
        <p className="text-blue-600 font-semibold">Determined: {determined} ({Math.round(determinedPercentage)}%)</p>
        <p className="text-gray-500">Needs Improvement: {totalsales - determined}</p>
      </div>
    </div>
  );
};

export default PerformanceTracking;
