import { createSelector } from 'reselect';

const authReducer = (state) => state.authReducer;

export const getAuthenticated = createSelector(
  authReducer,
  (state) => state.isAuthenticated
);

export const getAvatarUrl = createSelector(
  authReducer,
  (state) => state.avatarUrl
);

export const getUserInfo = createSelector(
  authReducer,
  (state) => state.userInfo
);