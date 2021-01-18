import axios from 'axios';
import { API_ENDPOINT } from './utils';

let isAlreadyFetchingAccessToken = false;

// This is the list of waiting requests that will retry after the JWT refresh complete
let subscribers = [];

async function resetTokenAndReattemptRequest(error) {
  try {
    const { response: errorResponse } = error;
    // Your own mechanism to get the refresh token to refresh the JWT token
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      // We can't refresh, throw the error anyway
      return Promise.reject(error);
    }
    /* Proceed to the token refresh procedure
    We create a new Promise that will retry the request,
    clone all the request configuration from the failed
    request in the error object. */
    const retryOriginalRequest = new Promise((resolve) => {
      /* We need to add the request retry to the queue
    since there another request that already attempt to
    refresh the token */
      addSubscriber((access_token) => {
        errorResponse.config.headers.Authorization = 'Bearer ' + access_token;
        resolve(axios(errorResponse.config));
      });
    });
    if (!isAlreadyFetchingAccessToken) {
      isAlreadyFetchingAccessToken = true;
      const response = await requestAPI({
        method: 'post',
        url: `${API_ENDPOINT}/v1/auth/refresh-tokens`,
        data: {
          refreshToken: refreshToken,
        },
      });

      if (!response.data) {
        return Promise.reject(error);
      }
      console.log('request success and data added.');
      const newAccessToken = response.data.access.token;
      const newRefreshToken = response.data.refresh.token;
      // save the newly refreshed token for other requests to use
      localStorage.setItem('access_token', newAccessToken);
      localStorage.setItem('refresh_token', newRefreshToken);

      isAlreadyFetchingAccessToken = false;
      onAccessTokenFetched(newAccessToken);
    }
    return retryOriginalRequest;
  } catch (err) {
    return Promise.reject(err);
  }
}

function onAccessTokenFetched(access_token) {
  // When the refresh is successful, we start retrying the requests one by one and empty the queue
  subscribers.forEach((callback) => callback(access_token));
  subscribers = [];
}

function addSubscriber(callback) {
  subscribers.push(callback);
}

const isHandlerEnabled = (config = {}) => {
  return config.hasOwnProperty('handlerEnabled') && !config.handlerEnabled
    ? false
    : true;
};

function isTokenExpiredError(errorResponse) {
  // Your own logic to determine if the error is due to JWT token expired returns a boolean value
  if (errorResponse.status === 401) {
    return true;
  }

  return false;
}

const errorHandler = (error) => {
  console.log('error happened');
  console.log(error);
  if (isHandlerEnabled(error.config)) {
    console.log('handler enabled');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorResponse = error.response;
      console.log(error.response.config.url.includes('refresh-tokens'));
      if (
        error.response.config.url.includes('refresh-tokens') &&
        error.response.status === 401
      ) {
        console.log('error reload');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_info');
        localStorage.removeItem('userId');
        window.location.reload();
      }
      if (error.response.status !== 401) {
        // error server

        return error.response;
      } else {
        if (isTokenExpiredError(errorResponse)) {
          console.log('error no reload token epxier');
          return resetTokenAndReattemptRequest(error);
        }
      }
    } else if (error.request) {
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log(error.message);
    }
    console.log(error.config);
  }
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_info');
  localStorage.removeItem('userId');
  window.location.reload();

  return Promise.reject({ ...error });
};

const successHandler = (response) => {
  if (isHandlerEnabled(response.config)) {
    // Handle responses
  }
  return response;
};

const requestAPI = axios.create({
  baseURL: API_ENDPOINT,
});

requestAPI.interceptors.response.use(
  (response) => successHandler(response),
  (error) => errorHandler(error)
);

export default requestAPI;
