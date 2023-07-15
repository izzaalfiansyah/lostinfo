import axios from "axios";

const http = axios.create({
  baseURL: "http://192.168.164.31:8000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default http;
