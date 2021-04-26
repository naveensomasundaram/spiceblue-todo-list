import react, { useState, useEffect } from "react";
import "./Styles/App.css";
import { useStateValue } from "./StateProvider";
import Dashboard from "./Components/Dashboard";
import axios from "./shared/axios";
import Loader from "./shared/loader";

function App() {
  const [storeValue, dispatch] = useStateValue();

  const fetchUserToken_headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const getClientSecret = async () => {
      dispatch({
        type: "SET_LOADER_FLAG",
        payload: true,
      });

      // API CALL: 1.Getting Access Token
      const fetchUserToken = await axios({
        method: "post",
        headers: fetchUserToken_headers,
        url: `login`,
        data: { email: "smithcheryl@yahoo.com", password: "12345678" },
      });
      const user_token = fetchUserToken.data.results.token;

      // API CALL: 2.Getting User ID from access token
      const fetchUserDetails_headers = {
        Authorization: "Bearer " + user_token,
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const fetchUserDetails = await axios({
        method: "get",
        headers: fetchUserDetails_headers,
        url: `user`,
      });

      dispatch({
        type: "SET_USER_TOKEN",
        payload: fetchUserToken.data.results,
      });
      dispatch({
        type: "SET_USER_DETAILS",
        payload: fetchUserDetails.data.results,
      });
      dispatch({
        type: "SET_RELOAD_STATUS_FLAG",
        payload: true,
      });
      dispatch({
        type: "SET_LOADER_FLAG",
        payload: false,
      });
    };
    getClientSecret();
  }, []);

  useEffect(async () => {
    if (storeValue.reload_task_list) {
      dispatch({
        type: "SET_LOADER_FLAG",
        payload: true,
      });

      // API CALL:  1.2 Getting All Task
      const fetchUserTasks_headers = {
        Authorization: "Bearer " + storeValue.user_token.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const fetchUserTasks = await axios({
        method: "get",
        headers: fetchUserTasks_headers,
        url: `task/lead_58be137bfde045e7a0c8d107783c4598`,
      });

      dispatch({
        type: "SET_USER_TASKS",
        payload: fetchUserTasks.data.results,
      });
      dispatch({
        type: "SET_RELOAD_STATUS_FLAG",
        payload: false,
      });
      dispatch({
        type: "SET_LOADER_FLAG",
        payload: false,
      });
    }
  }, [storeValue.reload_task_list]);

  return (
    <>
      {storeValue.show_loader && <Loader />}
      {!storeValue.show_loader && <Dashboard />}
    </>
  );
}

export default App;
