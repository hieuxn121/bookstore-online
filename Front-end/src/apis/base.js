import axios from "axios";
import { METHOD } from "../constants";
import { getData } from "../utils/localStorage";

const baseURL = "http://14.225.207.183:8888/api";
const cancelToken = axios.CancelToken;
const source = cancelToken.source();

const baseRequest = async (method, url, sendData = {}) => {
  const token = getData("token");
  try {
    const { status, data } = await axios({
      baseURL,
      method,
      url,
      data: sendData,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cancelToken: source.token,
    });
    return { status, data };
  } catch ({ response: { status, data } }) {
    return { status, data };
  }
};

const get = (url) => baseRequest(METHOD.GET, url);
const post = (url, data) => baseRequest(METHOD.POST, url, data);
const put = (url, data) => baseRequest(METHOD.PUT, url, data);
const del = (url, data) => baseRequest(METHOD.DELETE, url, data);

export { get, post, put, del };
