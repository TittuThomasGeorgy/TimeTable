import axios from "axios";
import { serverURL } from "./config";

const http = axios.create({
  baseURL: serverURL,
  withCredentials: true, // optional
});

export default http;