import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

export interface ExpenseCategory {
  id: string;
  description: string;
}

export const expensesCategoriesAdapter = createEntityAdapter({
  selectId: (expenseCategory: ExpenseCategory) => expenseCategory.id,
  sortComparer: (a, b) => a.description.localeCompare(b.description),
});

export const expensesCategoriesSlice = createSlice({
  name: "expensesCategories",
  initialState: expensesCategoriesAdapter.getInitialState(),
  reducers: {
    addExpensesCategoryAction: expensesCategoriesAdapter.addOne,
  },
});

export const { addExpensesCategoryAction } = expensesCategoriesSlice.actions;
