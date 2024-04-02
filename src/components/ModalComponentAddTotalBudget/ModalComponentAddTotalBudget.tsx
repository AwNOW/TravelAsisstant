import S from "./modalComponentAddTotalBudget.module.css";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, ErrorMessage, FormikHelpers, Form } from "formik";
import CurrencyInput from 'react-currency-input-field';
import * as Yup from "yup";

import { editTripAction } from "../../store/tripReducer";
import { useAppSelector, tripsSelectors } from "../../store/selectors";

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

  const selectedTrip = useAppSelector((state) =>
    tripsSelectors.selectById(state, tripId)
  );

  const handleFormSubmit: (
    values: AddExpenseForm,
    formikHelpers: FormikHelpers<AddExpenseForm>
  ) => void | Promise<any> = (values, { setSubmitting }) => {
    dispatch(
      editTripAction({
        ...selectedTrip,
        budget: Number(values.totalAmount),
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
            totalAmount: selectedTrip.budget,
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
                  type="number"
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
