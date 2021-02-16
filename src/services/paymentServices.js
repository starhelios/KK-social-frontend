import requestAPI from "../utils/request";

export const paymentsServices = {
  generateAccountLink,
  GenerateIntentForChargeCustomerExperience,
  savePaymentMethods,
  SaveTransactionInDB,
  deletePaymentMethod,
  deletePayment,
};

function savePaymentMethods(data) {
  const userId = localStorage.getItem("userId");
  return requestAPI
    .post(
      `/v1/payments/methods/card`,
      { data: data },
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

function generateAccountLink() {
  const userId = localStorage.getItem("userId");
  return requestAPI
    .get(`/v1/payments/generate/account_link`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    })
    .then((res) => {
      return res;
    });
}

function deletePaymentMethod(data) {
  const userId = localStorage.getItem("userId");
  return requestAPI
    .post(
      `/v1/payments/delete-payment-method`,
      { ...data },
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

function deletePayment(pmId) {
  const userId = localStorage.getItem("userId");
  return requestAPI
    .post(
      `/v1/payments/delete-payment`,
      { pmId, userId },
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

function GenerateIntentForChargeCustomerExperience(data) {
  const userId = localStorage.getItem("userId");
  return requestAPI
    .post(
      `/v1/payments/charge-generate-intent/experience`,
      { ...data },
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

function SaveTransactionInDB(data) {
  const userId = localStorage.getItem("userId");
  return requestAPI
    .post(
      `/v1/payments/save-transaction`,
      { ...data },
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
