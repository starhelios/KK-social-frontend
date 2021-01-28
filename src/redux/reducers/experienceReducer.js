import {
  EXPERIENCE_SET_DATE_FILTER,
  EXPERIENCE_SET_BOOKINGS,
} from "../types/experienceTypes";

const getInitialState = () => ({
  startDate: "",
  endDate: "",
  bookings: [],
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
    default:
      return state;
  }
}

export default experienceReducer;
