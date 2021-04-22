import requestAPI from "../utils/request";

export const authServices = {
  login,
  googleLogin,
  register,
  forgotPassword,
  resetPassword,
  logout,
  updateUserInfo,
  getUserInfo,
  changePassword,
  getHosts,
  getHostInfo,
  sendContactData
};

function login(data) {
  return requestAPI.post("/v1/auth/login", data).then((res) => {
    return res;
  });
}

function generateCsrfToken() {
  return requestAPI.get("/v1/auth/csrf").then((res) => {
    return res;
  });
}

function googleLogin(data) {
  return requestAPI.post("/v1/auth/google-login", data).then((res) => {
    return res;
  });
}

function register(data) {
  return requestAPI.post("/v1/auth/register", data).then((res) => {
    return res;
  });
}

function forgotPassword(data) {
  return requestAPI.post("/v1/auth/forgot-password", data).then((res) => {
    return res;
  });
}

function resetPassword(token, data) {
  return requestAPI
    .post(`/v1/auth/reset-password?token=${token}`, data)
    .then((res) => {
      return res;
    });
}

function changePassword(data) {
  return requestAPI.post(`/v1/auth/change-password`, data).then((res) => {
    return res;
  });
}

function logout(data) {
  return requestAPI.post("/v1/auth/logout", data).then((res) => {
    return res;
  });
}

function updateUserInfo(userId, data) {
  return requestAPI
    .patch(`/v1/users/${userId}`, data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    })
    .then((res) => {
      return res;
    });
}

function getUserInfo(userId) {
  return requestAPI
    .get(`/v1/users/${userId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    })
    .then((res) => {
      return res;
    });
}

function getHostInfo(userId) {
  return requestAPI.get(`/v1/hosts/${userId}`).then((res) => {
    return res;
  });
}

function getHosts() {
  return requestAPI.get(`/v1/hosts`).then((res) => {
    return res;
  });
}

function sendContactData(data) {
  return requestAPI.post(`/v1/auth/contactUs`, data).then((res) => {
    return res;
  })
}