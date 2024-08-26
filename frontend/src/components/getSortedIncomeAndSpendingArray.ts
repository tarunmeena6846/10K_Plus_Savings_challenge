function getIconForCategory(category) {
  // Define your category-to-icon mapping here
  const icons = {
    "Health and Fitness": "./health.svg",
    "Debt Repayment": "./debt.svg",
    "Savings and Investments": "./saving.svg",
    Housing: "./housing.svg",
    Entertainment: "./entertainment.svg",
    Food: "./food.svg",

    // Add more categories and their corresponding icons
  };
  return icons[category] || "./expense.svg"; // Default icon if the category is not found
}

export const getIncomeAndExpenseArray = async (
  itemsList,
  setCategoryWiseIncome,
  setCategoryWiseSpendings
) => {
  console.log(itemsList);
  const categorySpendingsArray = itemsList
    .filter((item) => item.type === "Expense")
    .reduce((acc, item) => {
      const existingCategory = acc.find(
        (category) => category.category === item.category
      );

      if (existingCategory) {
        existingCategory.amount += item.amount || 0;
      } else {
        acc.push({
          category: item.category,
          amount: item.amount || 0,
          icon: getIconForCategory(item.category),
        });
      }

      return acc;
    }, [])
    .sort((a, b) => b.amount - a.amount);

  const categoryIncomeArray = itemsList
    .filter((item) => item.type === "Income")
    .reduce((acc, item) => {
      const existingCategory = acc.find(
        (category) => category.category === item.category
      );

      if (existingCategory) {
        existingCategory.amount += item.amount || 0;
      } else {
        acc.push({
          category: item.category,
          amount: item.amount || 0,
        });
      }

      return acc;
    }, [])
    .sort((a, b) => b.amount - a.amount);

  setCategoryWiseSpendings(categorySpendingsArray);
  setCategoryWiseIncome(categoryIncomeArray);
};
