import axios from "axios";
import config from "../config.json";

const instance = axios.create({
  baseURL: "http://localhost:3001/",
  timeout: 4000,
  headers: {}
});
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
