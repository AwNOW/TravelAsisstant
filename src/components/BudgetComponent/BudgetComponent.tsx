import React, { useState } from "react";
import { useDispatch } from "react-redux";

function Costs() {
  const [cost, setCost] = useState<number>(0);

  // const dispatch = useDispatch();

  // const handleInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = event.target.value;
  //   // Validate input using regex to allow only numbers and up to 2 decimal places
  //   if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
  //     setBudget(value);
  //   }
  // };

  // const formattedBudgetValue = isNaN(parseFloat(budget))
  //   ? "$0.00"
  //   : parseFloat(budget).toLocaleString("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 2,
  //     });

  // const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   console.log(budget);
  //   e.preventDefault();;
  // };

  return (<div></div>);
}

export default Costs;
