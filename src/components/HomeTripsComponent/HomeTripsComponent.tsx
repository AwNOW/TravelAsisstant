import S from "./homeTripsComponent.module.css";
import "react-datepicker/dist/react-datepicker.min.css";
import image1 from "../../images/mountains3.png";
import { v4 as uuidv4 } from "uuid";

import { notificationSuccessfulTripCreation } from "../../notifications";

import React, { useState, useEffect} from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";

import { tripsSelectors, useAppSelector } from "../../store/selectors";
import { addTripAction } from "../../store/tripReducer";
import ModalComponent from "../ModalComponentEditTrip/ModalComponentEditTrip";
import { Trip } from "../../store/tripReducer";

//helper fn convert date
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const day = date.toLocaleDateString("en-US", { day: "2-digit" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.toLocaleDateString("en-US", { year: "numeric" });

  return `${day} ${month} ${year}`;
};

export const formatHumanDateRange = (
  startDate: number,
  endDate: number
): string => {
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  return `${formattedStartDate} - ${formattedEndDate}`;
};

function HomeTripsComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allTrips = useAppSelector(tripsSelectors.selectAll);

  /// dates input
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  // errors
  const [locationErrorMessage, setLocationErrorMessage] = useState(false);
  const [timeErrorMessage, setTimeErrorMessage] = useState(false);

  //autofill countries
  const [searchCountry, setSearchCountry] = useState("");
  const [autocompleteOptions, setAutocompleteOptions] = useState<any[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(true); // State to control visibility of autocomplete list

  //fetching data - country autosuggestions
  useEffect(() => {
    // If searchCountry is 2 letters or more
    if (searchCountry.length > 1 && showAutocomplete) {
      fetch(`https://restcountries.com/v3.1/name/${searchCountry}`)
        .then((res) => res.json())
        .then((data) => {
          // Update autocompleteOptions with the fetched data
          setAutocompleteOptions(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      setAutocompleteOptions([]);
    }
  }, [searchCountry, showAutocomplete]);

  // hide on window click autocomplete list
  useEffect(() => {
    const fn = () => {
      setShowAutocomplete(false);
    };
    window.addEventListener("click", fn);
    return () => window.removeEventListener("click", fn);
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.preventDefault();
    // ID creation
    const newId = uuidv4();

    //location validation
    if (searchCountry.length === 0) {
      setLocationErrorMessage(true);
      return;
    }
    setLocationErrorMessage(false);

    //date validation
    if (startDate === null || endDate === null) {
      setTimeErrorMessage(true);
      return;
    }
    setTimeErrorMessage(false);
    const storedStartDate = new Date(startDate).getTime();
    const storedEndDate = new Date(endDate).getTime();

    //action dispatch
    dispatch(
      addTripAction({
        id: newId,
        startDate: storedStartDate,
        endDate: storedEndDate,
        tripLocation: searchCountry,
      })
    );

    //navigate to itinerary route
    tripNavitaion(newId);
    notificationSuccessfulTripCreation();
  };

  const tripNavitaion = (id: string) => {
    navigate(`/itinerary/${id}`);
  };

  // trip edition
  //modal
  const [editedTrip, setEditedTripModal] = useState<Trip | undefined>(undefined);

  return (
    <div className={S.main}>
      <form className={S.creationForm} onSubmit={onSubmit}>
        <div className={S.inputBox}>
          <label className={S.label}>Location</label>
          <div className={S.inputContainer}>
            <div onClick={(e) => e.stopPropagation()}>
              <input
                className={S.fromInput}
                type="search"
                value={searchCountry}
                onChange={(e) => {
                  setSearchCountry(e.target.value);
                }}
                onFocus={() => {
                  setShowAutocomplete(true);
                }}
                onClick={() => {
                  setShowAutocomplete(true);
                }}
                placeholder="Country..."
              />
              {/* Render autocomplete options */}
              {showAutocomplete && autocompleteOptions.length > 0 && (
                <ul className={S.autocompleteList}>
                  {autocompleteOptions.slice(0, 3).map((country) => (
                    <li
                      className={S.autocompleteListItem}
                      key={country.name.common}
                      onClick={() => {
                        setSearchCountry(country.name.common);
                        setShowAutocomplete(false);
                      }}
                    >
                      <button className={S.countryNameBtn}>
                        {country.name.common}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {locationErrorMessage && (
            <div className={S.errorMessageContainer}>
              <div className={S.errorMessage}>Missing location!!</div>
            </div>
          )}
        </div>
        <div className={S.inputBox}>
          <label className={S.label}>Time Frame</label>
          <DatePicker
            className={S.fromInput}
            selectsRange={true}
            minDate={new Date()}
            startDate={startDate}
            endDate={endDate}
            onChange={(update: any) => {
              setDateRange(update);
            }}
          />
          {timeErrorMessage && (
            <div className={S.errorMessageContainer}>
              <div className={S.errorMessage}>Missing time frame!!</div>
            </div>
          )}
        </div>
        {/* <div className="create-trip-input">
            <label>Guests</label>
            <input type="number" className="input" />
          </div> */}
        <button type="submit" className={S.btnAddNew}>
          CREATE TRIP
        </button>
      </form>

      <ul className={S.newTripsList}>
        {allTrips.map((trip) => (
          <li
            className={S.newTripsListItem}
            key={trip.id}
            onClick={() => tripNavitaion(trip.id)}
          >
            <img className={S.image} src={image1} />

            <div className={S.tripDetails}>
              <div className={S.tripLocationTitle}>{trip.tripLocation}</div>
              <div className={S.tripTimeFrame}>
                {formatHumanDateRange(trip.startDate, trip.endDate)}
              </div>
              <button
                className={S.btnEdit}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditedTripModal(trip);
                }}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>
      <ModalComponent
        onClose={() => {
          setEditedTripModal(undefined);
        }}
        isOpen={!!editedTrip}
        tripId={editedTrip?.id}
        startDate={editedTrip?.startDate}
        endDate={editedTrip?.endDate}
        tripLocation={editedTrip?.tripLocation}
      />
    </div>
  );
}

export default HomeTripsComponent;
