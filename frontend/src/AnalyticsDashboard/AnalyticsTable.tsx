import React, { useState } from "react";
import { formatAmount } from "./Landing";

const AnalyticsTable: React.FC<any> = ({
  items,
  // type,
  setIsChecked,
  selectedEntry,
  setSelectedEntry,
}) => {
  console.log(items);
  // console.log(typeof items[0].amount);
  // const [isChecked, setIsChecked] = useState(false);
  const [selectAllEnabled, setSelectAllEnabled] = useState(false);
  // const [selectedEntry, setSelectedEntry] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const handleCheckboxChange = (taskId, titile) => {
    console.log(titile);
    setIsChecked(true);
    if (selectAllEnabled) {
      setSelectAllEnabled(false);
    }
    if (selectedEntry.includes(taskId)) {
      // If task is already marked as completed, remove it from the array
      setSelectedEntry(selectedEntry.filter((id) => id !== taskId));
    } else {
      // If task is not marked as completed, add it to the array
      setSelectedEntry([...selectedEntry, taskId]);
    }
  };
  // const handleChange = (e: any) => {
  //   setSelectedMonth(e.target.value);
  // };
  const indexOfLastStock = currentPage * itemsPerPage;
  const indexOfFirstStock = indexOfLastStock - itemsPerPage;

  const currentItems = items?.slice(indexOfFirstStock, indexOfLastStock);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    // console.log(currentPage, isChecked);
    setIsChecked(isChecked);
    setSelectAllEnabled(!selectAllEnabled);
    if (isChecked) {
      const allItemsId = currentItems
        // .filter((task) => task.type === type)
        .map((task: any) => task._id);

      console.log(allItemsId);
      setSelectedEntry(allItemsId);
    } else {
      setSelectedEntry([]);
    }
  };

  console.log(selectedEntry);
  return (
    <div className="mt-4 ">
      <table className="table-auto w-full">
        <thead className="bg-[#111f36] text-white">
          <tr>
            <th className="px-4 py-2 text-left">
              <input
                type="checkbox"
                className="focus:ring-red-50"
                checked={selectAllEnabled}
                onChange={handleSelectAll}
              />
            </th>
            <th className="py-2 px-4 text-left text-sm font-semibold">Item</th>
            <th className="py-2 px-4 text-left text-sm font-semibold">Date</th>
            <th className="py-2 px-4 text-left text-sm font-semibold">
              Category
            </th>

            <th className="py-2 px-4 text-left text-sm font-semibold">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems
            // .filter((item: any) => item.type === type)
            .map((item: any, index: any) => (
              <tr key={index} className="bg-white border-b border-gray-200">
                <td className="py-2 px-4">
                  <input
                    type="checkbox"
                    checked={selectedEntry.includes(item._id)}
                    onChange={() => handleCheckboxChange(item._id, item.title)}
                  />
                </td>
                <td className="py-2 px-4">{item.title}</td>
                <td className="py-2 px-4">{item.date.split("T")[0]}</td>
                <td className="py-2 px-4">{item.category}</td>
                <td className="py-2 px-4">${formatAmount(item.amount)}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="flex justify-center items-center mt-4 space-x-2">
        {/* {items.length} */}
        {items && (
          <div>
            {[...Array(Math.ceil(items.length / itemsPerPage))].map(
              (_, index) => (
                <button
                  key={index}
                  className="px-4 mr-2 py-2 bg-blue-500 text-white rounded-md"
                  onClick={() => {
                    paginate(index + 1);
                    setSelectAllEnabled(false);
                    setIsChecked(false);
                  }}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsTable;
