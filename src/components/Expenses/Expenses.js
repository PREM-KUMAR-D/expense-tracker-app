import React, { useState, useEffect, useCallback } from "react";
import classes from "./Expenses.module.css";

const ExpenseTracker = () => {
    const [expenses, setExpenses] = useState([]);
    const [formData, setFormData] = useState({
        amount: "",
        description: "",
        category: "Food",
    });
    const [isFormVisible, setIsFormVisible] = useState(true);

    const fetchExpenses = async () => {
        try {
            const res = await fetch(`${fireBaseUrl}/expense-${email.replace('.','-')}.json`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch expenses.");
            }

            const data = await res.json();
            setExpenses(data || []);
        } catch (error) {
            console.error("Error fetching expenses:", error.message);
        }
    };




    const email = localStorage.getItem("email");
    
    const fireBaseUrl = process.env.REACT_APP_FIRE_BASE_URL;
    
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
        setExpenses((prevExpenses) => [...prevExpenses, newExpense]);


        setFormData({ amount: "", description: "", category: "Food" });


        saveExpensesToFile([...expenses, newExpense]);
    };

    const handleDelete = (id) => {
        const updatedExpenses = expenses.filter((expense) => expense.id !== id);
        setExpenses(updatedExpenses);
        saveExpensesToFile(updatedExpenses);
    };

    const handleEdit = (id) => {
        const expenseToEdit = expenses.find((expense) => expense.id === id);
        setFormData(expenseToEdit);
        const updatedExpenses = expenses.filter((expense) => expense.id !== id);
        setExpenses(updatedExpenses);
        saveExpensesToFile(updatedExpenses);
        setIsFormVisible(true);
    };

    const saveExpensesToFile = async (data) => {
        try {
            const res = await fetch(`${fireBaseUrl}/expense-${email.replace('.','-')}.json`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error("Failed to save expenses.");
            }
        } catch (error) {
            console.error("Error saving expenses:", error.message);
        }
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
                <h2>Expense List</h2>
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
        </div>
    );
};

export default ExpenseTracker;
