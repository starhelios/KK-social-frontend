import requestAPI from '../utils/request';

export const categoryServices = {
  searchCategory,
};

function searchCategory(keyword) {
  return requestAPI
    .get(`/v1/categories/search?q=${keyword}`)
    .then((res) => {
      return res;
    });
}
