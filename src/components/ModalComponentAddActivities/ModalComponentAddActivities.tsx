import S from "./ModalComponentAddActivities.module.css";
import { v4 as uuidv4 } from "uuid";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { addActivityAction } from "../../store/activityReducer";
import { StoreState } from "../../store/selectors";
import { getActivitiesByTripId } from "../../store/selectors";
import { Activity } from "../../store/activityReducer";
import { notificationSuccessfulActivityCreation } from "../../notifications"
import { Formik, Field, ErrorMessage, FormikHelpers, Form } from "formik";
import * as Yup from "yup";


const customStyles = {
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "850px",
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
  startTripDate: number;
  endTripDate: number;
  tripId: string;
}

interface AddActivitiesForm {
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
  startTripDate,
  endTripDate,
  tripId,
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
      .min(new Date(startTripDate), "Date cannot be in the past")
      .min(new Date(), "Date cannot be in the past")
      .max(
        new Date(endTripDate + 86400000),
        "Chosen date cannot be after the end of the trip."
      )
      .typeError("Please provide a valid date")
      .test(
        "date-range",
        "Activity date range overlaps with existing activities",
        function (startActivityDate: Date) {
          const endActivityDate = this.resolve(
            Yup.ref("startActivityDate")
          ) as Date;
          return !isOverlapping(startActivityDate, endActivityDate);
        }
      ),
    endActivityDate: Yup.date()
      .required("Start date is required")
      .min(Yup.ref("startActivityDate"), "Incorrect date")
      .max(
        new Date(endTripDate + 86400000),
        "Chosen date cannot be after the end of the trip."
      )
      .test(
        "date-range",
        "Activity date range overlaps with existing activities",
        function (endActivityDate: Date) {
          const startActivityDate = this.resolve(
            Yup.ref("startActivityDate")
          ) as Date;
          return !isOverlapping(startActivityDate, endActivityDate);
        }
      ),
  });

  const activitiesByTripId = useSelector<StoreState, Activity[]>((state) =>
    getActivitiesByTripId(state, tripId)
  );

  const isOverlapping = (
    newStartActivityDate: Date,
    newEndActivityDate: Date,
  ) => {
    return activitiesByTripId.some((activity) => {


      const activityStart = new Date(activity.startActivityDate);
      const activityEnd = new Date(activity.endActivityDate);

      return (
        (newStartActivityDate >= activityStart &&
          newStartActivityDate <= activityEnd) ||
        (newEndActivityDate >= activityStart &&
          newEndActivityDate <= activityEnd) ||
        (activityStart >= newStartActivityDate &&
          activityStart <= newEndActivityDate) ||
        (activityEnd >= newStartActivityDate &&
          activityEnd <= newEndActivityDate)
      );
    });
  };

  const handleFormSubmit: (
    values: AddActivitiesForm,
    formikHelpers: FormikHelpers<AddActivitiesForm>
  ) => void | Promise<any> = (values, { setSubmitting }) => {
    const newActivityId = uuidv4();
    dispatch(
      addActivityAction({
        id: newActivityId,
        tripId: tripId,
        startActivityDate: Number(values.startActivityDate),
        endActivityDate: Number(values.endActivityDate),
        city: values.city,
        description: values.description,
        isChecked: false,
        group: values.group,
      })
    );
    notificationSuccessfulActivityCreation();
    setSubmitting(false);
    onClose(); // Close the modal after dispatching action
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
        <h3 className={S.title}>Add Ativity</h3>

        <Formik
          initialValues={{
            city: "",
            description: "",
            group: "",
            startActivityDate: new Date(startTripDate),
            endActivityDate: new Date(startTripDate),
            endDateIsRequired: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          //new
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({
            handleSubmit,
            setFieldValue, // dont work properly :C (use setFields)
            values,
            setFieldTouched,
            setValues,
            isValid,
            errors,
          }) => (
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
                  value={!values.endDateIsRequired ? "" : values.endActivityDate}
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

              <button type="submit" className={S.btnAddNew}>
                ADD
              </button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
}

export default ModalComponent;
