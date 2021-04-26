import axios from "axios";

const instance = axios.create({
  baseURL: "https://stage.api.sloovi.com/",
});

export default instance;
