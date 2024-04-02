import S from "./BudgetComponent.module.css";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Params } from "../SingleTripItineraryComponent/SingleTripItineraryComponent";
import {
  tripsSelectors,
  getExpensesByTripId,
  selectTripTotalCost,
  useAppSelector,
  StoreState,
} from "../../store/selectors";
import NavigationComponent from "../NavigationComponent/NavigationComponent";
import ExpenseModalComponent from "../ModalComponentAddExpense/ModalComponentAddExpense";
import TotalBudgetModalComponent from "../ModalComponentAddTotalBudget/ModalComponentAddTotalBudget";
import { Expense } from "../../store/expenseReducer";
import { formatDate } from "../HomeTripsComponent/HomeTripsComponent"

// Define the type for the total trip cost
type TotalTripCost = number;

function BudgetComponent() {
  const dispatch = useDispatch();

  const tripId = useParams<Params>().tripId!;
  const selectedTrip = useAppSelector((state) =>
    tripsSelectors.selectById(state, tripId)
  );
  const expensesByTripId = useSelector<StoreState, Expense[]>((state) =>
    getExpensesByTripId(state, tripId)
  );

  const totalTripCosts = useSelector<StoreState, TotalTripCost>((state) =>
    selectTripTotalCost(state, tripId)
  );

  // useAppSelector & useSelector
  // On a runtime level, they are 100% equal. The difference is that one is untyped so the
  // state variable is unknown and needs to be manually typed by you on every single call
  // of useSelector - and you can pass in everything wrong there without causing an error.
  // useAppSelector on the other hand gets declared with your RootState in one
  // place and after that it's typesafe, ready to be used everywhere in your application.

  //modals
  const [totalBudgetModalComponentIsOpen, setTotalBudgetModalComponentIsOpen] =
    useState(false);

  const [expenseModalComponentIsOpen, setExpenseModalComponentIsOpen] =
    useState(false);

  const [categoryModalComponentIsOpen, setCategoryModalComponentIsOpen] =
    useState(false);

  const [progressWidth, setProgressWidth] = useState(0);
  const [isOverLimit, setIsOverLimit] = useState(false);

  // Update the width of the progress bar
  const updateProgressBar = () => {
    let percentage = (totalTripCosts / selectedTrip.budget) * 100;
    if (percentage > 100) {
      setIsOverLimit(true);
      percentage = 100;
      setProgressWidth(percentage);
    } else {
      setIsOverLimit(false);
      setProgressWidth(percentage);
    }
  };

  useEffect(() => {
    updateProgressBar();
  }, [totalTripCosts, selectedTrip.budget]);

  const formattedBudgetValue = (budget: number) => {
    return budget.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div>
      <NavigationComponent />
      <div className={S.mainContent}>
        <div className={S.budgetSummary}>
          <div className={S.editionSection}>
            <button
              className={S.btnEdit}
              onClick={() => {
                setTotalBudgetModalComponentIsOpen(true);
              }}
            >
              Edit
            </button>
          </div>

          <div className="budgetCalculation">
            <div className={S.titleBudgetCalculation}>
              Total Remaining Budget
            </div>
            <div className={S.moneyRatio}>
              <div className={S.totalTripCosts}>
                {formattedBudgetValue(totalTripCosts)}
              </div>
              <div className={S.totalBudget}>
                {" "}
                /{formattedBudgetValue(selectedTrip.budget)}
              </div>
            </div>
            <div className={S.mainBar}>
              <div
                className={`${S.smallBar} ${isOverLimit && S.red}`}
                style={{ width: `${progressWidth}%` }}
              >
                {isOverLimit && (
                  <div className={S.errorMsg}>The budget is exceeded!</div>
                )}
              </div>
            </div>
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
              <button className={S.btnCat}>Health, insurance</button>
              <button className={S.btnCat}>Eat & Drinks</button>
              <button className={S.btnCat}>See & Do</button>
              <button className={S.btnCat}>Transport</button>
            </ul>
          </div>

          <div className={S.costsList}>
            <ul className={S.costList}>
              {expensesByTripId
              .sort((firstItem, secondItem) => firstItem.date - secondItem.date)
              .map((expense) => (
                <li className={S.costListItem} key={expense.id}>
                  <div className={S.costComponentUpper}>
                    <div className={S.costDate}>{formatDate(expense.date)}</div>
                    <button
                      className={S.btnEdit}
                      onClick={(e) => {
                        // e.stopPropagation();
                        // setEditedTripModal(trip);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                  <div className={S.costComponentLower}>
                    <div className={S.costInformation}>
                      <div className={S.costDescription}>
                        {expense.description}
                      </div>
                      <div className={S.costCategory}>{expense.category}</div>
                    </div>
                    <div className={S.cost}>
                      {formattedBudgetValue(expense.expenseCost)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* <CategoryModalComponent /> */}
      <TotalBudgetModalComponent
        onClose={() => {
          setTotalBudgetModalComponentIsOpen(false);
        }}
        isOpen={totalBudgetModalComponentIsOpen}
        tripId={tripId}
      />

      <ExpenseModalComponent
        onClose={() => {
          setExpenseModalComponentIsOpen(false);
        }}
        isOpen={expenseModalComponentIsOpen}
        tripId={tripId}
      />
    </div>
  );
}

export default BudgetComponent;
