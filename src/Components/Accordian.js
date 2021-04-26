import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import CreateTask from "./CreateTask";
import { useStateValue } from "../StateProvider";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

export default function Accordian({ tasks, taskID }) {
  const classes = useStyles();
  const [storeValue, dispatch] = useStateValue();
  const [expanded, setExpanded] = useState(storeValue.open_accordian);

  useEffect(() => {
    // setExpanded(storeValue.open_accordian);
    handleChange("panel3");
  }, [storeValue.open_accordian]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    dispatch({
      type: "SET_ACCORDIAN_UPDATE_STATUS",
      payload: isExpanded ? panel : false,
    });
  };

  return (
    <div className={classes.root}>
      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary
          expandIcon={<AddIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography className={classes.heading}>
            TASKS({tasks.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CreateTask tasks={tasks} taskID={""} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
