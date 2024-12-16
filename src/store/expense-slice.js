import { createSlice } from "@reduxjs/toolkit";

const initialExpensesState = {
    expenses: [],
    totalExpense: 0,
};

const expenseSlice = createSlice({
    name: "expenses",
    initialState: initialExpensesState,
    reducers: {
        addExpense(state, action) {
            state.expenses.push(action.payload);
            state.totalExpense += parseFloat(action.payload.amount);
        },
        setExpenses(state, action) {
            state.expenses = action.payload;
            state.totalExpense = action.payload.reduce((total, exp) => total + parseFloat(exp.amount), 0);
        },
        deleteExpense(state, action) {
            const id = action.payload;
            const expenseToDelete = state.expenses.find((exp) => exp.id === id);
            if (expenseToDelete) {
                state.totalExpense -= parseFloat(expenseToDelete.amount);
            }
            state.expenses = state.expenses.filter((expense) => expense.id !== id);
        },
        editExpense(state, action) {
            const { id, updatedExpense } = action.payload;
            const index = state.expenses.findIndex((expense) => expense.id === id);
            if (index !== -1) {
                const oldExpense = state.expenses[index];
                state.totalExpense =
                    state.totalExpense - parseFloat(oldExpense.amount) + parseFloat(updatedExpense.amount);
                state.expenses[index] = { ...updatedExpense, id };
            }
        },
    },
});

export const expenseActions = expenseSlice.actions;

export default expenseSlice;