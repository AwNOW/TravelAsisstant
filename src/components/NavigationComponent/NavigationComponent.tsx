import S from "./NavigationComponent.module.css";
import { Link, useLocation, useParams } from "react-router-dom";

function NavigationComponent() {
  const location = useLocation();
  const { tripId } = useParams();

  return (
    <div>
      <nav className={S.mainMenu}>
        <Link
          to="/"
          className={`${S.menuListItem} ${
            location.pathname === "/" ? S.active : ""
          }`}
        >
          ADVENTURES
        </Link>
        <Link
          to={`/itinerary/${tripId}`}
          className={`${
            location.pathname === `/itinerary/${tripId}`
              ? S.menuListItemActive
              : S.menuListItem
          }`}
        >
          ITINERARY
        </Link>
        <Link
          to={`/budget/${tripId}`}
          className={`${
            location.pathname === `/budget/${tripId}`
              ? S.menuListItemActive
              : S.menuListItem
          }`}
        >
          BUDGET
        </Link>
        <Link
          to={`/checklists/${tripId}`}
          className={`${
            location.pathname === `/checklists/${tripId}`
              ? S.menuListItemActive
              : S.menuListItem
          }`}
        >
          CHECKLISTS
        </Link>
      </nav>
    </div>
  );
}

export default NavigationComponent;
