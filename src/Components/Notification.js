import React, { useEffect } from "react";
import { Button, Snackbar, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useStateValue } from "../StateProvider";

export default function Notification() {
  const [storeValue, dispatch] = useStateValue();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (storeValue.show_notification) setOpen(storeValue.show_notification);
  }, [storeValue.show_notification]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch({
      type: "SET_SHOW_NOTIFICATION_FLAG",
      payload: false,
    });
    dispatch({
      type: "SET_NOTIFICATION_MESSAGE",
      payload: "",
    });
    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={storeValue.notification_message}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}
