export const initialState = {
  user_token: null,
  user_details: null,
  user_tasks: [],
  show_notification: false,
  notification_message: "",
  reload_task_list: false,
  taskID_to_edit: null,
  show_loader: false,
  open_accordian: false,
};

// Selector
export const getBasketTotal = (basket) => {
  let result = basket?.reduce(
    (amount, item) => parseInt(item.price) + parseInt(amount),
    0
  );
  return result;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER_TOKEN":
      return { ...state, user_token: action.payload };
    case "SET_USER_DETAILS":
      return { ...state, user_details: action.payload };
    case "SET_USER_TASKS":
      return { ...state, user_tasks: action.payload };
    case "SET_SHOW_NOTIFICATION_FLAG":
      return { ...state, show_notification: action.payload };
    case "SET_NOTIFICATION_MESSAGE":
      return { ...state, notification_message: action.payload };
    case "SET_RELOAD_STATUS_FLAG":
      return { ...state, reload_task_list: action.payload };
    case "SET_TASKID_TO_EDIT":
      return { ...state, taskID_to_edit: action.payload };
    case "SET_LOADER_FLAG":
      return { ...state, show_loader: action.payload };
    case "SET_ACCORDIAN_UPDATE_STATUS":
      return { ...state, open_accordian: action.payload };
    default:
      return state;
  }
};

export default reducer;
