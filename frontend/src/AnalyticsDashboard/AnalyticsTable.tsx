import React from "react";

const AnalyticsTable: React.FC<any> = ({ items, type }) => {
  console.log(type, items);
  return (
    <div className="p-4" style={{ overflowY: "auto", maxHeight: "350px" }}>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
              Category
            </th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
              Title
            </th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
              Amount
            </th>
            {/* <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
              Type
            </th> */}
          </tr>
        </thead>
        <tbody>
          {items
            .filter((item: any) => item.type === type)
            .map((item: any, index: any) => (
              <tr
                key={index}
                className="bg-white border border-gray-200 rounded-3xl mb-4 last:mb-0"
              >
                <td className="py-2 px-4">{item.category}</td>
                <td className="py-2 px-4">{item.title}</td>
                <td className="py-2 px-4">{item.amount}</td>
                {/* <td className="py-2 px-4">{item.type}</td> */}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnalyticsTable;
