
import "./App.css";
import {
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import Costs from "./components/CostsComponent/Costs";
import Trips from "./components/HomeComponent/Trips";

function App() {

  const location = useLocation();
  return (
    <>
      <div className="appHeader}">
        <div className="title">Your Personal Travel Assistant</div>
      </div>

      <nav className="main-menu">
        <Link
          to=""
          className={`menu-list-item ${
            location.pathname === "/" ? "active" : ""
          }`}
        >
          ADVENTURES
        </Link>
        <Link
          to="itinerary"
          className={`menu-list-item ${
            location.pathname === "/itinerary" ? "active" : ""
          }`}
        >
          ITINERARY
        </Link>
        <Link
          to="budget"
          className={`menu-list-item ${
            location.pathname === "/budget" ? "active" : ""
          }`}
        >
          BUDGET
        </Link>
        <Link
          to="checklists"
          className={`menu-list-item ${
            location.pathname === "/checklists" ? "active" : ""
          }`}
        >
          CHECKLISTS
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Trips />} />
        <Route path="/itinerary" element={<div>Itinerary</div>} />
        <Route path="/budget" element={<Costs />} />
        <Route path="/checklists" element={<div>Checklist</div>} />
      </Routes>
    </>
  )
}

export default App
