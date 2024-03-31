import S from "./ActivitiesDetailsComponent.module.css";
import { getActivitiesByTripId } from "../../store/selectors";
import { StoreState } from "../../store/selectors";
import { useSelector } from "react-redux";
import { useState } from "react";


import { Activity } from "../../store/activityReducer";
import ModalComponent from "../ModalComponentEditActivity/ModalComponentEditActivity";

interface ActivitiesDetailsComponentProps {
  startTripDate: number;
  endTripDate: number;
  tripId: string;
}

function ActivitiesDetailsComponent({
  startTripDate,
  endTripDate,
  tripId,
}: ActivitiesDetailsComponentProps) {
  const activitiesByTripId = useSelector<StoreState, Activity[]>((state) =>
    getActivitiesByTripId(state, tripId)
  );

  // trip edition
  //modal
  const [editedActivity, setEditedActivity] = useState<Activity | undefined>(
    undefined
  );

  // Helper function to format time
  const formatTime = (dateString: number): string => {
    const activityDateTime = new Date(dateString);
    return activityDateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const printAllDays = (startDay: number, endDay: number) => {
    const startDate = new Date(startDay);
    const endDate = new Date(endDay);
    const currentDay = new Date(startDate);
    let datesArr = [];

    while (currentDay.getTime() <= endDate.getTime()) {
      datesArr.push(currentDay.toDateString());
      currentDay.setDate(currentDay.getDate() + 1);
    }
    return datesArr;
  };

  const allDaysDateArr: string[] = printAllDays(startTripDate, endTripDate);

  return (
    <ul className={S.daysList}>
      {allDaysDateArr.map((date, index) => {
        // Filter activities for the current day
        const activitiesForDay = activitiesByTripId.filter(
          (activity) =>
            new Date(activity.startActivityDate).toDateString() === date
        );

        return (
          <li className={S.listItem} key={index}>
            <div className={S.dateComp}>{date}</div>

            {activitiesForDay.length === 0 ? (
              <div className={S.initialItemText}>No activities planned...</div>
            ) : (
              // Iterate over activitiesByTripId and render activities for each day
              activitiesForDay.map((activity) => (
                <div className={S.activityDetailsComp} key={activity.id}>
                  <div className={S.timeComp}>
                    {formatTime(activity.startActivityDate)}
                  </div>
                  <div className={S.groupComp}>
                    {activity.group.charAt(0).toUpperCase()}
                  </div>
                  <div className={S.textComp}>
                    <div className={S.location}>
                      <div>{activity.city}</div>
                    </div>
                    <div className={S.additionalIndoComp}>
                      <div className={S.additionalInfoText}>
                        {activity.description}
                      </div>
                    </div>
                  </div>
                  <button
                    className={S.btnEdit}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditedActivity(activity);
                    }}
                  >
                    Edit
                  </button>
                </div>
              ))
            )}
          </li>
        );
      })}

      <ModalComponent
        onClose={() => {
          setEditedActivity(undefined);
        }}
        isOpen={!!editedActivity}
        startTripDate={startTripDate}
        endTripDate={endTripDate}
        activityId={editedActivity?.id}
        tripId={editedActivity?.tripId}
        activityLocation={editedActivity?.city}
        activityDescription={editedActivity?.description}
        startActivityDate={editedActivity?.startActivityDate}
        endActivityDate={editedActivity?.endActivityDate}
        group={editedActivity?.group}
      />
    </ul>
  );
}

export default ActivitiesDetailsComponent;
