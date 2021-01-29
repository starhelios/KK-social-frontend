import {
  EXPERIENCE_SET_DATE_FILTER,
  EXPERIENCE_SET_BOOKINGS,
  EXPERIENCE_SET_COMPLETED_BOOKINGS,
} from "../types/experienceTypes";

const getInitialState = () => ({
  startDate: "",
  endDate: "",
  bookings: [],
  completedBookings: [],
});

function experienceReducer(state = getInitialState(), { type, payload }) {
  switch (type) {
    case EXPERIENCE_SET_DATE_FILTER:
      return {
        ...state,
        startDate: payload.startDate,
        endDate: payload.endDate,
      };
    case EXPERIENCE_SET_BOOKINGS:
      return {
        ...state,
        bookings: payload,
      };
    case EXPERIENCE_SET_COMPLETED_BOOKINGS:
      return {
        ...state,
        completedBookings: payload,
      };
    default:
      return state;
  }
}

export default experienceReducer;
