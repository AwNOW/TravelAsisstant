import { rootReducer } from "./index";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { tripsAdapter } from "./tripReducer";
import { activitiesAdapter } from "./activityReducer";
import { budgetAdapter } from "./totalBugdetReducer";
import { createSelector } from "@reduxjs/toolkit";

export type StoreState = ReturnType<typeof rootReducer>;

export const tripsSelectors = tripsAdapter.getSelectors<StoreState>(
  (state) => state.trips
);

export const activitiesSelectors = activitiesAdapter.getSelectors<StoreState>(
  (state) => state.activities
);

export const budgetSelectors = budgetAdapter.getSelectors<StoreState>(
  (state) => state.budget
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
    [activitiesSelectors.selectAll, selectTripId],
    (activities, tripId) => activities.filter((activity) => activity.tripId === tripId)
);


export const activitiesInOneDaySelector = createSelector;

export const useAppSelector: TypedUseSelectorHook<StoreState> = useSelector;

export const mySelector = (state: StoreState) => state;
