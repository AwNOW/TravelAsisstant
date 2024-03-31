import {
  combineReducers,
  applyMiddleware,
  compose,
  createStore,
  Store,
  StoreEnhancer,
  Reducer,
} from "redux";
import { tripsSlice } from "./tripReducer";
import { activitiesSlice } from "./activityReducer";
import { expensesSlice } from "./expenseReducer";
import { expensesCategoriesSlice } from "./expenseCategoryReducer";
import { budgetSlice } from "./totalBugdetReducer";
import reduxLogger from "redux-logger";

// `combineReducers` combines all the reducer functions into one big reducer
// function, which is typically called `rootReducer`. This is the most important
// part of this file.

export const rootReducer = combineReducers({
  trips: tripsSlice.reducer,
  activities: activitiesSlice.reducer,
  budget: budgetSlice.reducer,
  expenses: expensesSlice.reducer,
  expenseCategory: expensesCategoriesSlice.reducer,
});

// `enhancer` allows you to alter the store and add functionality such as the
// Redux DevTools and logger (similar to morgan) middleware
let enhancer: StoreEnhancer;

if (process.env.NODE_ENV !== "production") {
  const composeEnhancers =
    (window as any)._REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  // Include thunk in applyMiddleware
  enhancer = composeEnhancers(applyMiddleware(reduxLogger));
} else {
  // In production, only include thunk middleware
  enhancer = applyMiddleware();
}
// `createStore` creates a store object literal {}
// `preloadedState`--not important for now--is mainly used for hydrating state
// from the server.
// For `enhancer`, see above.
// `configureStore` is the variable you will use in your root index.js to give
// the Redux store access to the full application.
const configureStore = (preloadedState?: any): Store => {
  const store = createStore(rootReducer, preloadedState, enhancer);

  // Log the entire store state to the console
  console.log("Initial State:", store.getState());

  return store;
};

export default configureStore;
