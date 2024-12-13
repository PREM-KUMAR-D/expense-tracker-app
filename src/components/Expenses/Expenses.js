import React, { useState,useCallback,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { expenseActions } from "../../store";
import classes from "./Expenses.module.css";

const ExpenseTracker = () => {
  const dispatch = useDispatch();
  const { expenses, totalExpense } = useSelector((state) => state.expenses);

  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "Food",
  });
  const [isFormVisible, setIsFormVisible] = useState(true);

  const email = localStorage.getItem("email");
  const fireBaseUrl = process.env.REACT_APP_FIRE_BASE_URL;

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${fireBaseUrl}/expense-${email.replace(".", "-")}.json`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch expenses.");
      }

      const data = await res.json();
      dispatch(expenseActions.setExpenses(data || []));
    } catch (error) {
      console.error("Error fetching expenses:", error.message);
    }
  };

  const expenseCb = useCallback(fetchExpenses, [email]);

  useEffect(() => {
    fetchExpenses();
  }, [email, expenseCb]);

  const toggleFormVisibility = () => {
    setIsFormVisible((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) {
      alert("Please fill out all fields!");
      return;
    }

    const newExpense = { ...formData, id: Date.now() };
    dispatch(expenseActions.addExpense(newExpense));
    setFormData({ amount: "", description: "", category: "Food" });
  };

  const handleDelete = (id) => {
    dispatch(expenseActions.deleteExpense(id));
  };

  const handleEdit = (id) => {
    const expenseToEdit = expenses.find((expense) => expense.id === id);
    setFormData(expenseToEdit);
    dispatch(expenseActions.deleteExpense(id));
    setIsFormVisible(true);
  };

  const downloadCSV = () => {
    const csvHeader = "Amount,Description,Category\n";
    const csvRows = expenses
      .map((expense) => `${expense.amount},${expense.description},${expense.category}`)
      .join("\n");

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={classes.wrapper}>
      <button className={classes.toggleBtn} onClick={toggleFormVisibility}>
        {isFormVisible ? "Close Form" : "Open Form"}
      </button>

      {isFormVisible && (
        <form className={classes.form} onSubmit={handleSubmit}>
          <div className={classes.formGroup}>
            <label htmlFor="amount">Money Spent:</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
              required
            />
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              required
            />
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="Food">Food</option>
              <option value="Petrol">Petrol</option>
              <option value="Salary">Salary</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button type="submit" className={classes.submitBtn}>
            Add Expense
          </button>
        </form>
      )}

      <div className={classes.expenseList}>
        <h2>Expense List (Total: {totalExpense})</h2>
        {expenses.length === 0 ? (
          <p>No expenses added yet!</p>
        ) : (
          <ul>
            {expenses.map((expense) => (
              <li key={expense.id}>
                <strong>Amount:</strong> {expense.amount} | <strong>Description:</strong> {expense.description} | <strong>Category:</strong> {expense.category}
                <button
                  className={classes.editBtn}
                  onClick={() => handleEdit(expense.id)}
                >
                  Edit
                </button>
                <button
                  className={classes.deleteBtn}
                  onClick={() => handleDelete(expense.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {totalExpense > 10000 && (
        <div className={classes.premiumFeatures}>
          <button
            className={classes.premiumBtn}
            onClick={() => alert("Welcome to Premium!")}
          >
            Premium
          </button>
          <button className={classes.downloadBtn} onClick={downloadCSV}>
            Download as CSV
          </button>
        </div>
      )}
    </div>
  );
};
  
  export default ExpenseTracker;
  