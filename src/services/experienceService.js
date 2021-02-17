import requestAPI from "../utils/request";

export const experienceServices = {
  createExperience,
  getAll,
  getUserBookings,
  filterExperience,
  getById,
  getByUserId,
  getAllByUserId,
  reserveExperience,
  rateSpecificExperience,
  buildUserZoomExperience,
  completeSpecificExperience,
  uploadPhoto,
};

function createExperience(data) {
  return requestAPI
    .post(
      `/v1/experiences`,
      {
        ...data,
        userId: localStorage.getItem("userId"),
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      }
    )
    .then((res) => {
      return res;
    });
}

function reserveExperience(data) {
  return requestAPI
    .post(
      "/v1/experiences/reserve",
      {
        ...data,
        userId: localStorage.getItem("userId"),
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      }
    )
    .then((res) => {
      return res;
    });
}

function uploadPhoto(data) {
  return requestAPI
    .post("/v1/experiences/uploadPhoto", data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    })
    .then((res) => {
      return res;
    });
}

function getAll() {
  return requestAPI.get(`/v1/experiences`).then((res) => {
    return res;
  });
}

function getAllByUserId(userId) {
  return requestAPI.get(`/v1/experiences?userId=${userId}`).then((res) => {
    return res;
  });
}

function getUserBookings(userId) {
  return requestAPI.get(`/v1/experiences/reserved/${userId}`).then((res) => {
    return res;
  });
}

function getByUserId(userId) {
  return requestAPI.get(`/v1/experiences?userId=${userId}`).then((res) => {
    return res;
  });
}

function getById(id) {
  return requestAPI.get(`/v1/experiences/${id}`).then((res) => {
    return res;
  });
}

function filterExperience(data) {
  return requestAPI.post(`/v1/experiences/filter`, data).then((res) => {
    return res;
  });
}

function rateSpecificExperience(experienceId, rating, userId) {
  const data = {
    experienceId,
    rating,
    userId,
  };
  return requestAPI.post("/v1/experiences/rate", data).then((res) => {
    return res;
  });
}

function buildUserZoomExperience(userId, specExperience, userRole) {
  const data = {
    userId,
    specificExperienceId: specExperience,
    userRole,
  };
  return requestAPI.post("/v1/experiences/build", data).then((res) => {
    return res;
  });
}

function completeSpecificExperience(ids) {
  return requestAPI.post("/v1/experiences/complete", { ids }).then((res) => {
    return res;
  });
}
