import axios from "axios";

export const Api = (method, url, data) => {
  let apiConfig = {
    method: method,
    url: url,
    data: data,
  };
  return axios(apiConfig)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
