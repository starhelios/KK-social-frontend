import { createSelector } from "reselect";

const experienceReducer = (state) => state.experienceReducer;

export const getStartDate = createSelector(
  experienceReducer,
  (state) => state.startDate
);
export const getEndDate = createSelector(
  experienceReducer,
  (state) => state.endDate
);
export const getBookings = createSelector(
  experienceReducer,
  (state) => state.bookings
);
export const getCompletedBookings = createSelector(
  experienceReducer,
  (state) => state.completedBookings
);
