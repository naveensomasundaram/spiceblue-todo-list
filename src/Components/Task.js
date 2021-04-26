import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import {
  Card,
  CardHeader,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-ui/core";

import { red } from "@material-ui/core/colors";
import EditIcon from "@material-ui/icons/Edit";
import { format } from "date-fns";
import { useStateValue } from "../StateProvider";

const useStyles = makeStyles((theme) => ({
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function Task({ task }) {
  const classes = useStyles();
  const [storeValue, dispatch] = useStateValue();

  const updateTaskIDToEdit = () => {
    dispatch({
      type: "SET_TASKID_TO_EDIT",
      payload: task.id,
    });
    dispatch({
      type: "SET_ACCORDIAN_UPDATE_STATUS",
      payload: true,
    });
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {task.assigned_user[0]}
          </Avatar>
        }
        action={
          <>
            <IconButton aria-label="settings">
              <Tooltip title="Edit Task" aria-label="Edit Task">
                <EditIcon onClick={(e) => updateTaskIDToEdit()} />
              </Tooltip>
            </IconButton>
            {/* <IconButton style={{ paddingLeft: "10px" }}>
              <Tooltip title="Task Completed" aria-label="Task Completed">
                <DoneIcon />
              </Tooltip>
            </IconButton> */}
          </>
        }
        title={task.task_msg}
        subheader={format(new Date(task.task_date), "MM/dd/yyyy")}
      />
    </Card>
  );
}
