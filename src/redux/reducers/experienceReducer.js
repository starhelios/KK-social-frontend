import { EXPERIENCE_SET_DATE_FILTER } from '../types/experienceTypes';

const getInitialState = () => ({
  startDate: '',
  endDate: '',
});

function experienceReducer(state = getInitialState(), { type, payload }) {
  switch (type) {
    case EXPERIENCE_SET_DATE_FILTER:
      return {
        ...state,
        startDate: payload.startDate,
        endDate: payload.endDate,
      };

    default:
      return state;
  }
}

export default experienceReducer;
