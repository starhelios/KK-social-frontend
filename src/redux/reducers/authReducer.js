import {
  AUTH_SET_AUTHENTICATED,
  AUTH_SET_USER_INFO,
  AUTH_SET_CSRF_TOKEN,
} from "../types/authTypes";

const getInitialState = () => ({
  isAuthenticated: false,
  avatarUrl: "",
  userInfo: null,
});

function authReducer(state = getInitialState(), { type, payload }) {
  switch (type) {
    case "SAVE_AVATAR":
      return {
        ...state,
        avatarUrl: payload,
      };
    case AUTH_SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: payload,
      };
    case AUTH_SET_USER_INFO:
      return {
        ...state,
        userInfo: payload,
      };
    case AUTH_SET_CSRF_TOKEN:
      return {
        ...state,
        csrf: payload,
      };
    default:
      return state;
  }
}

export default authReducer;
