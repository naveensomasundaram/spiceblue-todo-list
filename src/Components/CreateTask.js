import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Select,
  FormControl,
  Grid,
  TextField,
  InputLabel,
  MenuItem,
  Tooltip,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import ScheduleIcon from "@material-ui/icons/Schedule";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from "@material-ui/pickers";
import { format } from "date-fns";
import axios from "../shared/axios";
import { useStateValue } from "../StateProvider";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: "100%",
  },
  ButtonformControl: {
    margin: theme.spacing(1),
    width: "100%",
  },
  margin: {
    margin: theme.spacing(1),
    float: "right",
  },
  saveIcon: {
    margin: theme.spacing(1),
    float: "right",
    backgroundColor: "lightgreen",
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

function CreateTask({ tasks, taskID }) {
  const classes = useStyles();
  const [storeValue, dispatch] = useStateValue();

  // form values..
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState(new Date());
  const [taskTime, setTaskTime] = useState(new Date().getTime());
  const [assignedUser, setAssignedUser] = useState("");
  const [formMode, setFormMode] = useState("INSERT");
  const assignedUsersList = Array.from(
    new Set(tasks.map((task) => task.assigned_user))
  );

  useEffect(() => {
    if (storeValue.taskID_to_edit) {
      if (storeValue.user_tasks) {
        let task = storeValue.user_tasks.filter(
          (task) => task.id === storeValue.taskID_to_edit
        )[0];
        if (task) {
          setFormMode("EDIT");
          setTaskDescription(task.task_msg);
          setTaskDate(new Date(task.task_date));
          setTaskTime(new Date(task.task_time));
          setAssignedUser(task.assigned_user);
        }
      }
      console.log("storeValue.taskID_to_edit => ", storeValue.taskID_to_edit);
    }
  }, [storeValue.taskID_to_edit]);

  const convertTimeToSeconds = (taskTime) => {
    var currentTime = new Date(taskTime);
    var hms =
      currentTime.getHours() +
      " : " +
      currentTime.getMinutes() +
      " : " +
      currentTime.getSeconds();
    var a = hms.split(":");
    return +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
  };

  const resetForm = () => {
    setTaskDescription("");
    setTaskDate(new Date());
    setTaskTime(new Date().getTime());
    setAssignedUser("");
    dispatch({
      type: "SET_TASKID_TO_EDIT",
      payload: null,
    });
  };

  const upsertTask = async () => {
    let data = {
      assigned_user: assignedUser,
      task_date: format(new Date(taskDate), "yyyy-MM-dd"),
      task_time: convertTimeToSeconds(taskTime),
      is_completed: 0,
      time_zone: new Date(taskDate).getTimezoneOffset(),
      task_msg: taskDescription,
    };

    dispatch({
      type: "SET_LOADER_FLAG",
      payload: true,
    });

    if (formMode === "INSERT") {
      const createTaskAPI_headers = {
        Authorization: "Bearer " + storeValue.user_token.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const createTaskAPI = await axios({
        method: "post",
        headers: createTaskAPI_headers,
        url: `task/lead_58be137bfde045e7a0c8d107783c4598`,
        data: data,
      });
      let response = createTaskAPI.data;

      if (
        response.code === 201 &&
        response.status.toLowerCase() === "success"
      ) {
        dispatch({
          type: "SET_SHOW_NOTIFICATION_FLAG",
          payload: true,
        });
        dispatch({
          type: "SET_NOTIFICATION_MESSAGE",
          payload: response.message,
        });
        dispatch({
          type: "SET_RELOAD_STATUS_FLAG",
          payload: true,
        });
        resetForm();
      }
      dispatch({
        type: "SET_LOADER_FLAG",
        payload: false,
      });
    } else if (formMode === "EDIT") {
      const updateTaskAPI_headers = {
        Authorization: "Bearer " + storeValue.user_token.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const updateTaskAPI = await axios({
        method: "PUT",
        headers: updateTaskAPI_headers,
        url: `task/lead_58be137bfde045e7a0c8d107783c4598/${storeValue.taskID_to_edit}`,
        data: data,
      });
      let response = updateTaskAPI.data;

      if (
        response.code === 202 &&
        response.status.toLowerCase() === "success"
      ) {
        dispatch({
          type: "SET_SHOW_NOTIFICATION_FLAG",
          payload: true,
        });
        dispatch({
          type: "SET_NOTIFICATION_MESSAGE",
          payload: response.message,
        });
        dispatch({
          type: "SET_RELOAD_STATUS_FLAG",
          payload: true,
        });
        resetForm();
      }
      dispatch({
        type: "SET_LOADER_FLAG",
        payload: false,
      });
    }
  };

  const deleteTask = async () => {
    dispatch({
      type: "SET_LOADER_FLAG",
      payload: true,
    });

    const deleteTaskAPI_headers = {
      Authorization: "Bearer " + storeValue.user_token.token,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const deleteTaskAPI = await axios({
      method: "DELETE",
      headers: deleteTaskAPI_headers,
      url: `task/lead_58be137bfde045e7a0c8d107783c4598/${storeValue.taskID_to_edit}`,
    });
    let response = deleteTaskAPI.data;
    if (response.status.toLowerCase() === "success" && response.code === 204) {
      dispatch({
        type: "SET_SHOW_NOTIFICATION_FLAG",
        payload: true,
      });
      dispatch({
        type: "SET_NOTIFICATION_MESSAGE",
        payload: response.message,
      });
      dispatch({
        type: "SET_RELOAD_STATUS_FLAG",
        payload: true,
      });
    }
    console.log("deleteTaskAPI =>", response);
    dispatch({
      type: "SET_LOADER_FLAG",
      payload: false,
    });
    // {"status": "success", "code": 204, "message": "Deleted successfully", "results": {}}
  };

  const handleDateChange = (date) => {
    setTaskDate(date);
  };

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="task-description"
            name="task-description"
            label="Task Description"
            fullWidth
            autoComplete="task-description"
            onChange={(e) => setTaskDescription(e.target.value)}
            value={taskDescription}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              required
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              id="date-picker-inline"
              label="Date"
              value={taskDate}
              onChange={(date) => setTaskDate(new Date(date))}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardTimePicker
              required
              autoOk
              label="Time"
              value={taskTime}
              onChange={handleDateChange}
              onChange={(time) => setTaskTime(time)}
              keyboardIcon={<ScheduleIcon />}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Assigned User</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
            >
              {assignedUsersList.map((user, index) => (
                <MenuItem value={user} key={index}>
                  {user}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <div className={classes.ButtonformControl}>
            <Button
              variant="contained"
              color={"lightgreen"}
              className={classes.saveIcon}
              onClick={(e) => upsertTask()}
            >
              {formMode === "EDIT" ? "Update" : "Save"}
            </Button>
            <Button className={classes.margin} onClick={(e) => resetForm()}>
              Cancel
            </Button>
            <div style={{ float: "left" }}>
              {formMode === "EDIT" && (
                <IconButton aria-label="settings">
                  <Tooltip title="Delete Task" aria-label="Delete Task">
                    <DeleteIcon onClick={(e) => deleteTask()} />
                  </Tooltip>
                </IconButton>
              )}
            </div>
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default CreateTask;
