import {  configureStore, combineReducers } from "@reduxjs/toolkit";

import authSlice from "./auth-slice";
import expenseSlice from './expense-slice';


const rootReducer = combineReducers({
  auth: authSlice.reducer,
  expenses: expenseSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;