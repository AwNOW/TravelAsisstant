import { rootReducer } from "./index";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { tripsAdapter } from "./tripReducer";
import { activitiesAdapter } from "./activityReducer";
import { expensesAdapter } from "./expenseReducer";
import { createSelector } from "@reduxjs/toolkit";

export type StoreState = ReturnType<typeof rootReducer>;

export const tripsSelectors = tripsAdapter.getSelectors<StoreState>(
  (state) => state.trips
);

export const activitiesSelectors = activitiesAdapter.getSelectors<StoreState>(
  (state) => state.activities
);

export const expensesSelectors = expensesAdapter.getSelectors<StoreState>(
  (state) => state.expenses
);

export const funkcjazMemo1 = createSelector(
  [activitiesSelectors.selectAll],
  (activities) => {
    return activities;
  }
);

export const getAllActivities = activitiesSelectors.selectAll;
const selectTripId = (state:StoreState, tripId:string):string => tripId

export const getActivitiesByTripId = createSelector(
    [getAllActivities, selectTripId],
    (activities, tripId) => activities.filter((activity) => activity.tripId === tripId)
);

export const getAllExpenses = expensesSelectors.selectAll;

export const getExpensesByTripId = createSelector(
  [getAllExpenses, selectTripId],
  (expenses, tripId) => expenses.filter((expenses) => expenses.tripId === tripId)
);

// https://borstch.com/blog/development/redux-toolkits-createselector-techniques-for-handling-large-data-sets
export const selectTripTotalCost = createSelector(
  [getExpensesByTripId],
  tripExpenses => tripExpenses.reduce((total, item) => total + item.expenseCost, 0)
);


export const activitiesInOneDaySelector = createSelector;

export const useAppSelector: TypedUseSelectorHook<StoreState> = useSelector;

export const mySelector = (state: StoreState) => state;
