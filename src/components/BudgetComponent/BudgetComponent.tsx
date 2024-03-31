import S from "./BudgetComponent.module.css";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { Params } from "../SingleTripItineraryComponent/SingleTripItineraryComponent";
import {budgetSelectors, useAppSelector} from "../../store/selectors"
import NavigationComponent from "../NavigationComponent/NavigationComponent";
import ExpenseModalComponent from "../ModalComponentAddExpense/ModalComponentAddExpense";
import TotalBudgetModalComponent from "../ModalComponentAddTotalBudget/ModalComponentAddTotalBudget";



function BudgetComponent() {

  const dispatch = useDispatch();

  const tripId = useParams<Params>().tripId!;
  const selectedBudget = useAppSelector((state) =>
  budgetSelectors.selectById(state, tripId)
  );

  const setInitialBudget = (tripId) => {
      if(selectedBudget === undefined) {
        dispatch()
  }
  }


  //modals
  const [expenseModalComponentIsOpen, setExpenseModalComponentIsOpen] =
    useState(false);
  const [totalBudgetModalComponentIsOpen, setTotalBudgetModalComponentIsOpen] =
    useState(false);
  const [categoryModalComponentIsOpen, setCategoryModalComponentIsOpen] =
    useState(false);


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

  return (
    <div>
      <NavigationComponent />
      <div className={S.mainContent}>
        <div className={S.budgetSummary}>
          <button
            className={S.btnEdit}
            onClick={() => {
              setTotalBudgetModalComponentIsOpen(true);
            }}
          >
            Edit
          </button>
          <div className="budgetCalculation">
            <div>Total Remaining Budget</div>
            <div>
              <div>Currently spended</div>
              {/* <div>{selectedBudget.totalAmount ? selectedBudget.totalAmount : 0}</div> */}
            </div>

            <div>Slider</div>
          </div>
        </div>

        <button
          className={S.btnAddNew}
          onClick={() => {
            setExpenseModalComponentIsOpen(true);
          }}
        >
          ADD NEW EXPENSE
        </button>

        <div className={S.mainLists}>
          <div className={S.categories}>
            <h3>Main Categories</h3>
            <button className={""}>Add</button>
            <ul className={S.categoriesList}>
              <button>Health, insurance</button>
              <button>Eat & Drinks</button>
              <button>See & Do</button>
              <button>Transport</button>
            </ul>
          </div>

          <div className={S.costsList}>
            <ul>
              <li>Dinner</li>
              <li>Eat & drinks</li>
              <li>See & Do</li>
              <li>Transport</li>
            </ul>
          </div>
        </div>
      </div>

      <TotalBudgetModalComponent
        onClose={() => {
          setTotalBudgetModalComponentIsOpen(false);
        }}
        isOpen={totalBudgetModalComponentIsOpen}
        tripId={tripId}
      />
      {/* <CategoryModalComponent /> */}
      <ExpenseModalComponent
        onClose={() => {
          setTotalBudgetModalComponentIsOpen(false);
        }}
        isOpen={expenseModalComponentIsOpen}
        tripId={tripId}
      />
    </div>
  );
}

export default BudgetComponent;
