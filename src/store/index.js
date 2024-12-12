import { createSlice, configureStore, combineReducers } from "@reduxjs/toolkit";

const initialAuthState = {
  isAuthenticated: false,
};

const initialExpensesState = {
  expenses: [],
  totalExpense: 0,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
  },
});

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

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  expenses: expenseSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export const authActions = authSlice.actions;
export const expenseActions = expenseSlice.actions;

export default store;