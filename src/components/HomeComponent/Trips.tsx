import "./index.css";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTrip } from "../../store/tripCreationReducer";

// export interface Trip {
//     id: string;
//     startDate: number;
//     endtDate: number;
//     tripLocation: string;
//   }

function Costs() {
  const dispatch = useDispatch();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      addTrip({ id: "s", startDate: 2, endtDate: 3, tripLocation: "lol" })
    );
  };

  return (
    <div className="main-component">
      <div className="trip-creation-form">
        <form onSubmit={onSubmit}>
          <div className="create-trip-input">
            <label>Location</label>
            <input
              placeholder="Which country will you visit?"
              className="input"
            />
          </div>
          <div className="create-trip-input">
            <label>Time Frames</label>
            <input
              placeholder="03 Jan 2024 - 04 Jan 2024"
              className="input"
            />
          </div>
          <div className="create-trip-input">
            <label>Guests</label>
            <input
              type="number"
              className="input"
            />
          </div>

          <button type="submit" className="btn-add-new">
            CREATE TRIP
          </button>
        </form>
      </div>
    </div>
  );
}

export default Costs;
