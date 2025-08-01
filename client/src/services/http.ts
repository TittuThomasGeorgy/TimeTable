import axios from "axios";
import { serverURL } from "../configs/config";

const http = axios.create({
  baseURL: serverURL,
});

export default http;