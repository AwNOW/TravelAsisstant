import S from "./SingleTripItineraryComponent.module.css";
import "react-datepicker/dist/react-datepicker.min.css";
import image1 from "../../images/travel.jpg";

import { useParams } from "react-router-dom";
import { useState } from "react";
import { tripsSelectors, useAppSelector } from "../../store/selectors";

import { formatHumanDateRange } from "../HomeTripsComponent/HomeTripsComponent";

import ModalComponent from "../ModalComponentAddActivities/ModalComponentAddActivities";
import NavigationComponent from "../NavigationComponent/NavigationComponent";
import ActivitiesDetailsComponent from "../ActivitiesDetailsComponent/ActivitiesDetailsComponent";

export type Params = {
  tripId: string;
};

function SingleTripItineraryComponent() {

  const tripId = useParams<Params>().tripId!;
  const selectedTrip = useAppSelector((state) =>
    tripsSelectors.selectById(state, tripId)
  );

  //modal
  const [modalIsOpen, setIsOpen] = useState(false);

  // days left
  const vacationCountdown = (tripDate: number): number => {
    const currDate = new Date().getTime();
    const timeDifference = tripDate - currDate;
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  return (
    <div>
      <NavigationComponent />
      <div className={S.mainContent}>
        <div className={S.tripCointainer}>
          <img className={S.tripImage} src={image1} />
          <div className={S.tripDetails}>
            <div>
              <div className={S.tripTitle}>{selectedTrip.tripLocation}</div>
              <div className={S.tripTimeFrame}>
                {formatHumanDateRange(
                  selectedTrip.startDate,
                  selectedTrip.endDate
                )}
              </div>
            </div>
            <div className={S.tripCounter}>
              {vacationCountdown(selectedTrip.startDate)} Days To Go!
            </div>
          </div>
        </div>
        <button
          className={S.btnAddNew}
          onClick={() => {
            setIsOpen(true);
          }}
        >
          ADD NEW ACTIVITIES
        </button>

        <ModalComponent
          onClose={() => {
            setIsOpen(false);
          }}
          isOpen={modalIsOpen}
          startTripDate={selectedTrip.startDate}
          endTripDate={selectedTrip.endDate}
          tripId={tripId}
        />

        <div className={S.itineraryContainer}>
          {
            <ActivitiesDetailsComponent
              startTripDate={selectedTrip.startDate}
              endTripDate={selectedTrip.endDate}
              tripId={tripId}
            />
          }
        </div>
      </div>
    </div>
  );
}

export default SingleTripItineraryComponent;
