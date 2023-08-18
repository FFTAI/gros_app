import axios from "axios";
// import https from "https";
const api = axios.create({
  baseURL: process.env.VUE_APP_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// api.interceptors.request.use(
//   (config) => {
// return config
//   },
//   (error) => {
//   }
// );

// api.interceptors.response.use(
//   (response) => {
//   },
//   (error) => {
//   }
// );

export default api;
