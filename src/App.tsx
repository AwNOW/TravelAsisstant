import S from "./App.module.css";
import {
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import HomeTripsComponent from "./components/HomeTripsComponent/HomeTripsComponent";
import SingleTripItineraryComponent from "./components/SingleTripItineraryComponent/SingleTripItineraryComponent";
import Budget from "./components/BudgetComponent/BudgetComponent";

export function App() {

  return (
    <>
      <div className={S.appHeader}>
        <header className={S.title}>Your Personal Travel Assistant</header>
      </div>

      <Routes>
        <Route path="/" element={<HomeTripsComponent />} />
        <Route path={"/itinerary/:tripId"} element={<SingleTripItineraryComponent />}/>
        <Route path={"/budget/:tripId"} element={<Budget/>} />
        <Route path={"/checklists/:tripId"} element={<div>checklists</div>} />
        <Route path="*" element={<div>dupa</div>} />
      </Routes>
    </>
  )
}

export default App;
