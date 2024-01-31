import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

export interface Trip {
  id: string;
  startDate: number;
  endtDate: number;
  tripLocation: string;
}

const tripsAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: (trip: Trip) => trip.id,

  // Note that sorting only kicks in when state is changed
  // via one of the CRUD functions below (for example, addOne(), updateMany()).
  sortComparer: (a, b) => a.startDate - b.startDate,
});

export const tripsSlice = createSlice({
  name: "trips",
  initialState: tripsAdapter.getInitialState(),
  reducers: {
    addTrip: tripsAdapter.addOne,
  },
});

export const { addTrip } = tripsSlice.actions;
