import requestAPI from "../utils/request";

export const experienceServices = {
  createExperience,
  getAll,
  filterExperience,
  getById,
  getByUserId,
  getAllByUserId,
};

function createExperience(data) {
  return requestAPI
    .post(
      `/v1/experiences`,
      { ...data, userId: localStorage.getItem("userId") },
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

function getExperiencesByUser(userId) {
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
