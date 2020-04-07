import axios from "axios";
import * as actionTypes from "./actionTypes";

// References the add message action type
// which is this addMessage here and we have the
// setMessages.

// The addMessage take one message and then
// the setMessages takes a bunch of messages.

// Those of actions are redux actions and what these
// two we can then take a look at the reducers and
// we have them being handled by messages
// which is located in reducers file-directory.
export const addMessage = message => {
  return {
    type: actionTypes.ADD_MESSAGE,
    message: message
  };
};

export const setMessages = messages => {
  return {
    type: actionTypes.SET_MESSAGES,
    messages: messages
  };
};

const getUserChatsSuccess = chats => {
  return {
    type: actionTypes.GET_CHATS_SUCCESS,
    chats: chats
  };
};

export const getUserChats = (username, token) => {
  return dispatch => {
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios
      .get(`http://127.0.0.1:8000/chat/?username=${username}`)
      .then(res => dispatch(getUserChatsSuccess(res.data)));
  };
};