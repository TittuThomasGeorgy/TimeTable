import axios from "axios";
import { serverURL } from "./config";

const http = axios.create({
  baseURL: serverURL,
});

export default http;