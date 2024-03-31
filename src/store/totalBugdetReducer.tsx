import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

export interface Budget {
  id: string;
  tripId: string;
  totalAmount: number;
}

export const budgetAdapter = createEntityAdapter({
  selectId: (budget: Budget) => budget.id,
  sortComparer: (a,b) => a.totalAmount - b.totalAmount,
});



export const budgetSlice = createSlice({
  name: "budget",
  initialState: budgetAdapter.getInitialState(),
  reducers: {
    updateBudgetAction: budgetAdapter.upsertOne,
  },
});

export const { updateBudgetAction } = budgetSlice.actions;
