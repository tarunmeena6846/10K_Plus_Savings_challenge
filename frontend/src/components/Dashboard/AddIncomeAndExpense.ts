export const handleAddIncome = async (
  item: String,
  category: string,
  amount: number,
  date: Date,
  type: String
) => {
  console.log("item", item, type);
  // Add logic to handle adding income
  const respose = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/data/save-item`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        item: item,
        category: category === "" ? "uncategorised" : category,
        income: amount,
        expense: 0,
        date: date,
        type: type,
        itemType: "Income",
      }),
    }
  );

  if (!respose.ok) {
    throw new Error("Network response is not ok");
  }

  respose.json().then((data) => {
    console.log("data at add income", data);
  });
  console.log("Add income logic here");
};

export const handleAddExpense = async (
  item: String,
  category: string,
  amount: number,
  date: Date,
  type: String
) => {
  // Handle adding expense here
  const respose = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/data/save-item`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        item: item,
        category: category === "" ? "uncategorised" : category,
        income: 0,
        expense: amount,
        date: date,
        type: type,
        itemType: "Expense",
      }),
    }
  );

  if (!respose.ok) {
    throw new Error("Network response is not ok");
  }

  respose.json().then((data) => {
    console.log("data at add income", data);
  });
  // console.log("Adding expense:", newItem, newCategory, newAmount, newDate);
};
