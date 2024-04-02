import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

export interface Expense {
  id: string;
  tripId: string;
  expenseCost: number;
  description: string;
  date: number;
  isPaid: boolean;
  category: string;
}

export const expensesAdapter = createEntityAdapter({
  selectId: (expense: Expense) => expense.id,
  sortComparer: (a, b) => a.date - b.date,
});

export const expensesSlice = createSlice({
  name: "expenses",
  initialState: expensesAdapter.getInitialState(),
  reducers: {
    addExpenseAction: expensesAdapter.addOne,
  },
});

export const { addExpenseAction } = expensesSlice.actions;
