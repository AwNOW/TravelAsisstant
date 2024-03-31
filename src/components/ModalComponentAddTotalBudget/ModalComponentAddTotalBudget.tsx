import S from "./modalComponentAddTotalBudget.module.css";
import { v4 as uuidv4 } from "uuid";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../../store/selectors";
import { updateBudgetAction } from "../../store/totalBugdetReducer"
import { Formik, Field, ErrorMessage, FormikHelpers, Form } from "formik";
import * as Yup from "yup";

const customStyles = {
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "350px",
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
  totalAmount: number;
}

function ModalComponent({ isOpen, onClose, tripId }: ModalProps) {
  const dispatch = useDispatch();

  //   const validationSchema = Yup.object().shape({
  //     city: Yup.string().required("City is required"),
  //     description: Yup.string()
  //       .required("Description is required")
  //       .max(50, "Cannot be longer than 50 characters"),
  //     group: Yup.string().required("Type is required"),
  //   });

  const handleFormSubmit: (
    values: AddExpenseForm,
    formikHelpers: FormikHelpers<AddExpenseForm>
  ) => void | Promise<any> = (values, { setSubmitting }) => {
    const newBudgetId = uuidv4();
    dispatch(
        updateBudgetAction({
        id: newBudgetId,
        tripId: tripId,
        totalAmount: values.totalAmount
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
        <h3 className={S.title}>Add Ativity</h3>

        <Formik
          initialValues={{
            totalAmount: 0,
          }}
          //   validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
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
                  BUDGET
                </label>
                <Field
                  type="text"
                  className={S.input}
                  placeholder=""
                  name="totalAmount"
                />
                <ErrorMessage
                  name="totalAmount"
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
