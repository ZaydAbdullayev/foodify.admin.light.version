import axios from "axios";
// const base_url = process.env.REACT_APP_BASE_URL;
const base_url = "https://k13cjx1h-8081.euw.devtunnels.ms";
const user = JSON.parse(localStorage.getItem("user")) || [];

const config = {
  headers: {
    Authorization: `Bearer ${user.token}`,
    "Content-Type": "application/json; multipart/form-data",
  },
};

export const ApiService = {
  async fetching(url, data) {
    const response = await axios.post(`${base_url}/${url}`, data, config);
    return response;
  },
};

export const ApiGetService = {
  async fetching(url) {
    const response = await axios.get(`${base_url}/${url}`);
    return response;
  },
};
