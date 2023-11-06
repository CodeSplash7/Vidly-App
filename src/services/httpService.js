import axios from "axios";
import config from "../config.json";

const instance = axios.create({
  baseURL: config.apiEndPoint,
  timeout: 4000,
  headers: {}
});

// Runs on every response from the server
instance.interceptors.response.use(null, (error) => {
  console.log(error);
});

export default {
  get: instance.get,
  post: instance.post,
  put: instance.put,
  delete: instance.delete,
  patch: instance.patch
};
