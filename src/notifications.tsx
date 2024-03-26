import { Store } from "react-notifications-component";

//notification HomeTripsComponent
export const notificationSuccessfulTripCreation = () => {
  Store.addNotification({
    title: "Wonderful!",
    message: "The new adventure created!",
    type: "success",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  });
};

//notification HomeTripsComponent
export const notificationSuccessfulActivityCreation = () => {
    Store.addNotification({
      title: "Wonderful!",
      message: "The new activity added!",
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
    });
  };

//notification ModalComponentEditTrip
export const notificationTripRemoved = () => {
  Store.addNotification({
    message: "The trip has been permamently removed.",
    type: "danger",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  });
};

export const notificationTripEdited = () => {
  Store.addNotification({
    message: "The trip has been updated!",
    type: "success",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  });
};

export const notificationTripEditionNoChanges = () => {
  Store.addNotification({
    message: "No changes have been made.",
    type: "info",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  });
};

//notification ModalComponentEditActivity
export const notificationActivityRemoved = () => {
  Store.addNotification({
    message: "The activity has been canceled.",
    type: "danger",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  });
};

export const notificationActivityEdited = () => {
  Store.addNotification({
    message: "The trip has been updated!",
    type: "success",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  });
};

// export const notificationActivityEditionNoChanges = () => {
//   Store.addNotification({
//     message: "No changes have been made.",
//     type: "info",
//     insert: "top",
//     container: "top-right",
//     animationIn: ["animate__animated", "animate__fadeIn"],
//     animationOut: ["animate__animated", "animate__fadeOut"],
//     dismiss: {
//       duration: 5000,
//       onScreen: true,
//     },
//   });
// };
