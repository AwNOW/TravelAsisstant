import S from "./ModalComponentAddExpense.module.css";
import { v4 as uuidv4 } from "uuid";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, ErrorMessage, FormikHelpers, Form } from "formik";
import { addExpenseAction } from "../../store/expenseReducer";
import * as Yup from "yup";

const customStyles = {
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "500px",
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
//object is treated as a constant, where neither its properties nor their
//values can be reassigned. This is crucial in maintaining the immutability of the
//customStyles object, preventing unintended modifications to its properties or values
//during runtime, thus enhancing code predictability and stability.



// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
}

interface AddExpenseForm {
  expenseCost: number;
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
    dispatch(
      addExpenseAction({
        id: newExpenseId,
        tripId: tripId,
        expenseCost: values.expenseCost,
        date:  values.date.getTime(),
        isPaid: values.isPaid,
        description: values.description,
        category: values.category,
      })
    );

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
        <h1 className={S.title}>New Expense</h1>

        <Formik
          initialValues={{
            expenseCost: 0,
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
                <Field type="number" className={S.input} name="expenseCost" />
                {/* <ErrorMessage name="city" component="div" className={S.error} /> */}
              </div>

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
                  <option value="Documents">Essential Documents</option>
                  <option value="Food">Eat & Drink</option>
                  <option value="Activities">See & Do</option>
                  <option value="Transport">Transport</option>
                  <option value="Accommodation">Accommodation</option>
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

              <div className={S.inputBox}>
                <label className={S.label}>Select Date</label>
                <Field
                  as={DatePicker}
                  name="date"
                  type="date"
                  className={S.input}
                  showIcon
                  selected={values.date}
                  onChange={(date: Date) => {
                    console.log(date);
                    setFieldTouched("date", true);
                    setValues((values) => ({
                      ...values,
                      date: date,
                    }));
                  }}
                />
                <ErrorMessage name="date" component="div" className={S.error} />
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
