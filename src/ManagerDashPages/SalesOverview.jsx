const SalesOverview = () => {
    const data = [
      { title: "Total Revenue", value: "$100,000" },
      { title: "Total Products Sold", value: "3400" },
      { title: "Best Selling Category", value: "Insurance" },
      { title: "Best Selling Product", value: "Life Insurance" },
    ];
  
  
    return (
      <div className="grid grid-cols-4 gap-4 mb-6">
        
        {data.map((item, index) => (
          <div key={index} className="p-4 bg-white shadow-lg rounded-lg text-center">
            <p className="text-gray-500">{item.title}</p>
            <h2 className="text-xl font-bold">{item.value}</h2>
          </div>
        ))}
      </div>
    );
  };
  
  export default SalesOverview;
  