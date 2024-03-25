import S from "./ModalComponentEditTrip.module.css";
import { MouseEventHandler } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import {
  notificationTripRemoved,
  notificationTripEdited,
  notificationTripEditionNoChanges,
} from "../../notifications";
import { getActivitiesByTripId } from "../../store/selectors";
import { Activity } from "../../store/activitiesReducer";
import { removeActivitiesAction } from "../../store/activitiesReducer";

import { StoreState } from "../../store/selectors";
import {
  editTripAction,
  removeTripAction,
} from "../../store/tripCreationReducer";

import {
  Formik,
  Field,
  ErrorMessage,
  FormikValues,
  FormikHelpers,
  Form,
  useField,
} from "formik";
import * as Yup from "yup";

function timestampToDateWithZeroTime(timestamp: number) {
  // Create a new Date object from the timestamp
  const date = new Date(timestamp);

  // Set hours, minutes, seconds, and milliseconds to zero
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}

const customStylesModal = {
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "600px",
    maxWidth: "450px",
    width: "100%",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
} as const;

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string | undefined;
  startDate: number | undefined;
  endDate: number | undefined;
  tripLocation: string | undefined;
}

interface UpdateTripForm {
  country: string;
  tripTimeFrames: [Date, Date];
}

function ModalComponent({
  isOpen,
  onClose,
  tripId,
  startDate,
  endDate,
  tripLocation,
}: ModalProps) {
  const activitiesByTripId = useSelector<StoreState, Activity[]>((state) =>
    getActivitiesByTripId(state, tripId!)
  );

  const activitiesIdsArray = (arr: Activity[]) => {
    let newArr: string[] = [];
    arr.forEach((activity: { id: string }) => {
      newArr.push(activity.id);
    });
    return newArr;
  };

  const validationSchema = Yup.object().shape({
    country: Yup.string().required("New location is required"),
    tripTimeFrames: Yup.array()
      .required("Start date is required")
      .test(
        "date-range",
        "Incorrect timeframe.",
        function (tripTimeFrames: [Date, Date] | any[]) {
          const [startDate, endDate] = tripTimeFrames as [Date, Date];
          const yesterday = new Date(Date.now() - 86400000);
          return startDate > yesterday && startDate <= endDate;
        }
      )
      .test(
        "date-range",
        "You want to remove day(s) with already planned activities. Please delete the activities and then change the tour timeframes.",
        function (tripTimeFrames: [Date, Date] | any[]) {
          if (activitiesByTripId.length === 0) {
            return true; // No activities, everything okay
          }

          const [tripStartDate, tripEndDate] = tripTimeFrames as [Date, Date];

          // Check if any activity overlaps with the new trip time frame
          const isIncludedInNewTimeframe = activitiesByTripId.some(
            (activity: any) => {
              const activityStartDate = timestampToDateWithZeroTime(
                activity.startActivityDate
              );
              const activityEndDate = timestampToDateWithZeroTime(
                activity.endActivityDate
              );
              // Check if the activity overlaps with the new trip time frame
              return (
                (tripStartDate <= activityEndDate &&
                  tripEndDate >= activityStartDate) ||
                (tripEndDate >= activityStartDate &&
                  tripStartDate <= activityEndDate)
              );
            }
          );

          return isIncludedInNewTimeframe;
        }
      ),
  });

  const dispatch = useDispatch();

  const handleFormSubmit: (
    values: UpdateTripForm,
    formikHelpers: FormikHelpers<UpdateTripForm>
  ) => void | Promise<any> = (values, { setSubmitting }) => {
    if (
      tripId !== undefined &&
      startDate !== undefined &&
      endDate !== undefined &&
      tripLocation !== undefined
    ) {
      if (
        values.country === tripLocation &&
        values.tripTimeFrames[0].getTime() === startDate &&
        values.tripTimeFrames[1].getTime() === endDate
      ) {
        notificationTripEditionNoChanges();
      } else {
        notificationTripEdited();
      }
      dispatch(
        editTripAction({
          id: tripId,
          startDate: values.tripTimeFrames[0].getTime(),
          endDate: values.tripTimeFrames[1].getTime(),
          tripLocation: values.country,
        })
      );
    }
    setSubmitting(false);
    onClose(); // Close the modal after dispatching action
  };

  const removeTrip: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (tripId !== undefined) {
      dispatch(removeTripAction(tripId));
      dispatch(removeActivitiesAction(activitiesIdsArray(activitiesByTripId)));
      onClose();
      notificationTripRemoved();
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => {
          onClose();
        }}
        style={customStylesModal}
      >
        <h3 className={S.title}>Update Your Trip</h3>

        <Formik
          initialValues={{
            country: tripLocation!,
            tripTimeFrames: [new Date(startDate!), new Date(endDate!)],
          }}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ handleSubmit, values, setFieldTouched, setValues, isValid }) => (
            <Form onSubmit={handleSubmit} className={S.form}>
              <div className={S.inputBox}>
                <label className={S.label} htmlFor="country">
                  NEW TRIP DESTINATION
                </label>
                <Field
                  type="text"
                  className={S.input}
                  placeholder="Location"
                  name="country"
                />
                <ErrorMessage
                  name="country"
                  component="div"
                  className={S.error}
                />
              </div>
              <div className={S.inputBox}>
                <label className={S.label}>TIME FRAME</label>
                <Field
                  as={DatePicker}
                  name="tripTimeFrames"
                  type="date"
                  className={S.input}
                  selectsRange={true}
                  // minDate={new Date()}
                  startDate={values.tripTimeFrames[0]}
                  endDate={values.tripTimeFrames[1]}
                  onChange={(update: [Date, Date]) => {
                    // console.log(update);
                    // setDateRange(update)
                    setFieldTouched("tripTimeFrames", true);
                    setValues((values) => ({
                      ...values,
                      tripTimeFrames: update,
                    }));
                  }}
                />
                <ErrorMessage
                  name="tripTimeFrames"
                  component="div"
                  className={S.error}
                />
              </div>

              <button
                type="button"
                className={S.btnDeleteTrip}
                onClick={(e) => {
                  removeTrip(e);
                }}
              >
                DELETE TRIP
              </button>
              <button type="submit" className={S.btnAddNew} disabled={!isValid}>
                UPDATE
              </button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
}

export default ModalComponent;
