import S from "./modalComponentEditActivity.module.css";
import Modal from "react-modal";
import { MouseEventHandler } from "react";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../../store/selectors";
import { getActivitiesByTripId } from "../../store/selectors";
import {
  Activity,
  removeActivityAction,
  editActivityAction,
} from "../../store/activitiesReducer";
import {
  notificationActivityRemoved,
  notificationActivityEdited,
  notificationActivityEditionNoChanges,
} from "../../notifications";
import { Formik, Field, ErrorMessage, FormikHelpers, Form } from "formik";
import * as Yup from "yup";

const customStyles = {
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "840px",
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
  activityId: string | undefined;
  tripId: string | undefined;
  activityLocation: string | undefined;
  activityDescription: string | undefined;
  startActivityDate: number | undefined;
  endActivityDate: number | undefined;
  group: string | undefined;
}

interface EditActivitiesForm {
  city: string;
  description: string;
  group: string;
  startActivityDate: Date;
  endActivityDate: Date;
  endDateIsRequired: boolean;
}

function ModalComponent({
  isOpen,
  onClose,
  activityId,
  tripId,
  startActivityDate,
  endActivityDate,
  activityLocation,
  activityDescription,
  group,
}: ModalProps) {
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    city: Yup.string().required("City is required"),
    description: Yup.string()
      .required("Description is required")
      .max(50, "Cannot be longer than 50 characters"),
    group: Yup.string().required("Type is required"),
    startActivityDate: Yup.date()
      .required("Start date is required")
      .min(new Date(), "Date cannot be in the past")
      .max(
        new Date(),
        "Date cannot be after the end of the trip"
      )
      .typeError('Please provide a valid date')
      .test(
        "date-range",
        "Activity date range overlaps with existing activities",
        function (startActivityDate:Date) {
          const endActivityDate = this.resolve(Yup.ref('startActivityDate')) as Date;
          return !isOverlapping(startActivityDate, endActivityDate);
        }
      ),
    endActivityDate: Yup.date()
      .required("Start date is required")
      .min(Yup.ref("startActivityDate"), "Incorrect date")
      .max(
        new Date(86400000),
        "Date cannot be after the end of the trip"
      )
      .test(
        "date-range",
        "Activity date range overlaps with existing activities",
        function (endActivityDate:Date) {
          const startActivityDate = this.resolve(Yup.ref('startActivityDate')) as Date;
          return !isOverlapping(startActivityDate, endActivityDate);
        }
      ),
  });

  const activitiesByTripId = useSelector<StoreState, Activity[]>((state) =>
    getActivitiesByTripId(state, tripId!)
  );

  const isOverlapping = (
    NewStartActivityDate: Date,
    NewEndActivityDate: Date
  ) => {
    return activitiesByTripId.some((activity) => {
      const activityStart = new Date(activity.startActivityDate);
      const activityEnd = new Date(activity.endActivityDate);

      return (
        (NewStartActivityDate >= activityStart &&
          NewStartActivityDate <= activityEnd) ||
        (NewEndActivityDate >= activityStart &&
          NewEndActivityDate <= activityEnd) ||
        (activityStart >= NewStartActivityDate &&
          activityStart <= NewEndActivityDate) ||
        (activityEnd >= NewStartActivityDate &&
          activityEnd <= NewEndActivityDate)
      );
    });
  };

  const handleFormSubmit: (
    values: EditActivitiesForm,
    formikHelpers: FormikHelpers<EditActivitiesForm>
  ) => void | Promise<any> = (values, { setSubmitting }) => {
    if (
      activityId !== undefined &&
      tripId !== undefined &&
      startActivityDate !== undefined &&
      endActivityDate !== undefined
    ) {
      dispatch(
        editActivityAction({
          id: activityId,
          tripId: tripId,
          startActivityDate: Number(values.startActivityDate),
          endActivityDate: Number(values.endActivityDate),
          city: values.city,
          description: values.description,
          isChecked: false,
          group: values.group,
        })
      );
    }

    setSubmitting(false);
    onClose(); // Close the modal after dispatching action
  };

  const removeActivity: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (activityId !== undefined) {
      dispatch(removeActivityAction(activityId));
      onClose();
      notificationActivityRemoved();
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => {
          onClose();
        }}
        style={customStyles}
      >
        <h3 className={S.title}>Update Ativity</h3>

        <Formik
          initialValues={{
            city: activityLocation!,
            description: activityDescription!,
            group: group!,
            startActivityDate: new Date(startActivityDate!),
            endActivityDate: new Date(endActivityDate!),
            endDateIsRequired: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          //new
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ handleSubmit, values, setFieldTouched, setValues, isValid }) => (
            <Form onSubmit={handleSubmit} className={S.form}>
              <div className={S.inputBox}>
                <label className={S.label} htmlFor="city">
                  CITY
                </label>
                <Field
                  type="text"
                  className={S.input}
                  placeholder="Location"
                  name="city"
                />
                <ErrorMessage name="city" component="div" className={S.error} />
              </div>

              <div className={S.inputBox}>
                <label className={S.label} htmlFor="group">
                  TYPE
                </label>
                <Field name="group" as="select" className={S.selectInput}>
                  <option value="travel">TRAVEL</option>
                  <option value="accommodation">ACCOMMODATION</option>
                  <option value="food">FOOD</option>
                  <option value="activity">ACTIVITY</option>
                  <option value="" disabled hidden>
                    Select an Option{" "}
                  </option>
                </Field>

                <ErrorMessage
                  name="group"
                  component="div"
                  className={S.error}
                />
              </div>

              <div className={S.inputBox}>
                <label className={S.label} htmlFor="description">
                  ADDITIONAL INFORMATION
                </label>

                <Field
                  as="textarea"
                  className={S.formTextarea}
                  placeholder="More.."
                  name="description"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className={S.error}
                />
              </div>

              <div className={S.inputBox}>
                <label className={S.labelDate}>START</label>
                <Field
                  as={DatePicker}
                  name="startActivityDate"
                  type="date"
                  className={S.input}
                  selected={values.startActivityDate}
                  value={values.startActivityDate}
                  onChange={(date: any) => {
                    setFieldTouched("startActivityDate", true);
                    setValues((values) => ({
                      ...values,
                      startActivityDate: date,
                      endActivityDate: date,
                    }));
                  }}
                  showTimeSelect
                  timeFormat="p"
                  timeIntervals={15}
                  dateFormat="Pp"
                />
                <ErrorMessage
                  name="startActivityDate"
                  component="div"
                  className={S.error}
                />
              </div>

              <div className={S.inputBox}>
                <label className={S.labelDate}>END</label>
                <Field
                  disabled={!values.endDateIsRequired}
                  as={DatePicker}
                  name="endActivityDate"
                  type="date"
                  className={S.input}
                  selected={values.endActivityDate}
                  value={
                    !values.endDateIsRequired ? "" : values.endActivityDate
                  }
                  onChange={(date: any) => {
                    setFieldTouched("endActivityDate", true);
                    setValues((values) => ({
                      ...values,
                      endActivityDate: date,
                    }));
                  }}
                  showTimeSelect
                  timeFormat="p"
                  timeIntervals={15}
                  dateFormat="Pp"
                />
                <label className={S.checkbox}>
                  <Field
                    type="checkbox"
                    name="endDateIsRequired"
                    className={S.checkboxInput}
                  />
                  Choose end date
                </label>
                <ErrorMessage
                  name="endActivityDate"
                  component="div"
                  className={S.error}
                />
              </div>

              <button
                type="button"
                className={S.btnDeleteactivity}
                onClick={(e) => {
                  removeActivity(e);
                }}
              >
                DELETE ACTIVITY
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
