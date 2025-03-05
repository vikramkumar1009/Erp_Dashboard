const SalesContest = () => {
    const contestData = [
      { name: "John Doe", target: "100%", status: "Achieved" },
      { name: "Jane Smith", target: "90%", status: "Not Achieved" },
      { name: "Alice Brown", target: "95%", status: "Achieved" },
    ];
  
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Sales Contest Results</h3>
        <table className="w-full text-gray-700">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
              <th className="py-3 px-6">Sales Agent</th>
              <th className="py-3 px-6">Target</th>
              <th className="py-3 px-6">Performance</th>
            </tr>
          </thead>
          <tbody>
            {contestData.map((agent, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-3 px-6">{agent.name}</td>
                <td className="py-3 px-6">{agent.target}</td>
                <td className={`py-3 px-6 ${agent.status === "Achieved" ? "text-green-600" : "text-red-600"} font-bold`}>
                  {agent.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default SalesContest;
  