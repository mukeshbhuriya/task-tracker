import axios from "axios";

const API = process.env.REACT_APP_API || "http://localhost:5000";

axios.defaults.baseURL = API;

// Load token on initial axios load
const savedToken = localStorage.getItem("token");
if (savedToken) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + savedToken;
}

export default axios;
