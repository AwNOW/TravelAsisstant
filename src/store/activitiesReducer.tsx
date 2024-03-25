import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

export interface Activity {
  id: string;
  tripId: string;
  startActivityDate: number;
  endActivityDate: number;
  city: string;
  description: string | undefined;
  isChecked: boolean;
  group: string;
}

export const activitiesAdapter = createEntityAdapter({
  selectId: (activity: Activity) => activity.id,
  sortComparer: (a, b) => a.startActivityDate - b.endActivityDate,
});

export const activitiesSlice = createSlice({
  name: "destinations",
  initialState: activitiesAdapter.getInitialState(),
  reducers: {
    addActivityAction: activitiesAdapter.addOne,
    removeActivityAction: activitiesAdapter.removeOne,
    removeActivitiesAction: activitiesAdapter.removeMany,
    editActivityAction: activitiesAdapter.upsertOne,
  },
});

export const { addActivityAction, editActivityAction, removeActivityAction, removeActivitiesAction } = activitiesSlice.actions;
