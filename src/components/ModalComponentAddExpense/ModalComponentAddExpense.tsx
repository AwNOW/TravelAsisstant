import S from "./ModalComponentAddExpense.module.css";
import { v4 as uuidv4 } from "uuid";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
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
  tripId: string;
}

interface AddExpenseForm {
  description: string;
  category: string;
  date: Date;
  isPaid: boolean;
}

function ModalComponent({ isOpen, onClose, tripId }: ModalProps) {
  const dispatch = useDispatch();

  const handleFormSubmit: (
    values: AddExpenseForm,
    formikHelpers: FormikHelpers<AddExpenseForm>
  ) => void | Promise<any> = (values, { setSubmitting }) => {
    const newExpenseId = uuidv4();
    // dispatch(
    //   addActivityAction({
    //     id: newExpenseId,
    //     tripId: tripId,
    //     startActivityDate: Number(values.startActivityDate),
    //     endActivityDate: Number(values.endActivityDate),
    //     city: values.city,
    //     description: values.description,
    //     isChecked: false,
    //     group: values.group,
    //   })
    // );

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
            description: "",
            category: "",
            date: new Date(),
            isPaid: false,
          }}
          //   validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          //new
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({
            handleSubmit,
            values,
            setFieldTouched,
            setValues,
            isValid,
            errors,
          }) => (
            <Form onSubmit={handleSubmit} className={S.form}>
              <div className={S.inputBox}>
                <label className={S.label} htmlFor="city">
                  DESCRIPTION
                </label>
                <Field
                  type="text"
                  className={S.input}
                  placeholder=""
                  name="description"
                />
                {/* <ErrorMessage name="city" component="div" className={S.error} /> */}
              </div>

              <div className={S.inputBox}>
                <label className={S.label} htmlFor="group">
                  CATEGORY
                </label>
                <Field name="category" as="select" className={S.selectInput}>
                  <option value="documents">Essential Documents</option>
                  <option value="food">Eat & Drink</option>
                  <option value="activities">See & Do</option>
                  <option value="transport">Transport</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="" disabled hidden>
                    Select an Option{" "}
                  </option>
                </Field>

                {/* <ErrorMessage
                  name="category"
                  component="div"
                  className={S.error}
                /> */}
              </div>

              {/* <div className={S.inputBox}>
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
              </div> */}

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
