import "./index.css";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import CostsList from "./CostsList";


function Costs() {
  const [budget, setBudget] = useState<string>("");

  const dispatch = useDispatch();

  const handleInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Validate input using regex to allow only numbers and up to 2 decimal places
    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
      setBudget(value);
    }
  };

  const formattedBudgetValue = isNaN(parseFloat(budget))
    ? "$0.00"
    : parseFloat(budget).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log(budget);
    e.preventDefault();;
  };

  return (
    <div className="budget-planner-component">
      <div className="main-budget-panel">
        <div className="total-budget mini-component">
          <form onSubmit={onSubmit} className="total-budget">
            <button type="submit" className="btn-edit">
              Edit
            </button>
            <div>Total Remaining Budget:</div>
            <input
              type="number"
              placeholder="$0.00"
            />
          </form>
        </div>
      </div>
      <div className="expenses-categories">
        <div className="expenses-categories-title">Main Categories</div>
        <ul className="expenses-categories-list">
          <li className="expenses-categories-list">
            <div className="expenses-categories-list-item-title">
              Health, insurance
            </div>
            <div className="expenses-categories-list-item-total-money-spent"></div>
          </li>
          <li className="expenses-categories-list">
            <div className="expenses-categories-list-item-title">
              Eat & Drink
            </div>
            <div className="expenses-categories-list-item-total-money-spent"></div>
          </li>
          <li className="expenses-categories-list">
            <div className="expenses-categories-list-item-title">See & Do</div>
            <div className="expenses-categories-list-item-total-money-spent"></div>
          </li>
          <li className="expenses-categories-list">
            <div className="expenses-categories-list-item-title">Transport</div>
            <div className="expenses-categories-list-item-total-money-spent"></div>
          </li>
        </ul>
      </div>
      <form>
        <input type="text" placeholder="Type to search..." />
      </form>
      <CostsList />
    </div>
  );
}

export default Costs;
