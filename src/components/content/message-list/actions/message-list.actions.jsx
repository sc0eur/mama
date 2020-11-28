import { getMessageList } from "../../../../api";
import { getMessage } from "../../../../api";
import { batchModify } from "../../../../api";
import { selectLabel } from "../../../sidebar/sidebar.actions";

export const GET_MESSAGES = "GET_MESSAGES";
export const GET_MESSAGES_LOAD_IN_PROGRESS = "GET_MESSAGES_LOAD_IN_PROGRESS";
export const GET_MESSAGES_FAILED = 'GET_MESSAGES_FAILED';
export const TOGGLE_SELECTED = "TOGGLE_SELECTED";
export const MESSAGE_LOAD_IN_PROGRESS = "MESSAGE_LOAD_IN_PROGRESS";
export const MESSAGE_LOAD_SUCCESS = "MESSAGE_LOAD_SUCCESS";
export const MESSAGE_LOAD_FAIL = "MESSAGE_LOAD_FAIL";
export const EMPTY_MESSAGES = "EMPTY_MESSAGES";
export const SET_PAGE_TOKENS = "SET_PAGE_TOKENS";
export const ADD_INITIAL_PAGE_TOKEN = "ADD_INITIAL_PAGE_TOKEN";
export const CLEAR_PAGE_TOKENS = "CLEAR_PAGE_TOKENS";
export const MODIFY_MESSAGES_SUCCESS = "MODIFY_MESSAGES_SUCCESS";
export const MODIFY_MESSAGES_FAILED = "MODIFY_MESSAGES_FAILED";
export const SET_SEARCH_QUERY = "SET_SEARCH_QUERY";

var _ = require('lodash');

export const getLabelMessages = ({
  labelIds,
  q = "",
  pageToken,
  listOfGoodLabels
}) => (dispatch, getState) => {
  dispatch(setMessageListLoadInProgress());

  const state = getState();
  const {searchQuery} = state;

  if (searchQuery !== "") {
    dispatch(selectLabel("-1"));
  }

  getMessageList({ labelIds, maxResults: 20, q: searchQuery, pageToken, listOfGoodLabels }).then(response => {
  // getMessageList({ labelIds, maxResults: 20, q: searchQuery, pageToken }).then(response => {
    // console.log('тут должен быть чудолог')
    // console.log(listOfGoodLabels)
    // console.log('это нужный лог')
    console.log('good labels')
    console.log(listOfGoodLabels)
    // console.log(response.messages)
    // console.log('корень')
    // console.log(labelIds)
    // console.log(q)
    // console.log(pageToken)
    // console.log(listOfGoodLabels)
    // var res0 = _.cloneDeep(response)
    // const res1 = res0.filter(item => (listOfGoodLabels.includes(item.messages.id)))
    // console.log(response)
    // console.log(response.messages)
    // console.log(response.messages.filter(item => (listOfGoodLabels.includes(item.id))))
    
    // console.log(response)

    // console.log('res1')
    // console.log(res1)
    // ТУУУУУУУУУУУУТ у нас сообщения находятся
    if (typeof listOfGoodLabels === 'undefined') {
      // color is undefined

      dispatch({
        type: GET_MESSAGES,
        payload: response
      });
    }else {
      response.messages = response.messages.filter(item => (listOfGoodLabels.includes(item.id)))
      dispatch({
        type: GET_MESSAGES,
        payload: response
      });
    }
    dispatch(setPageTokens({
      nextPageToken: response.nextPageToken || ""
    }));
    
  }).catch(err => {
    dispatch({
      type: GET_MESSAGES_FAILED,
      payload: err
    })
  });
};

export const setSearchQuery = q => ({
  type: SET_SEARCH_QUERY,
  payload: q
})

export const setPageTokens = tokens => ({
  type: SET_PAGE_TOKENS,
  payload: tokens
});

export const emptyLabelMessages = () => ({
  type: EMPTY_MESSAGES
});

export const toggleSelected = (messageIds, selected) => ({
  type: TOGGLE_SELECTED,
  payload: {
    messageIds,
    selected
  }
});

export const getEmailMessage = messageId => dispatch => {
  dispatch(setMessageLoadInProgress());
  getMessage(messageId)
    .then(response => {
      dispatch({
        type: MESSAGE_LOAD_SUCCESS,
        payload: response
      });
    })
    .catch(error => {
      dispatch({
        type: MESSAGE_LOAD_FAIL,
        payload: error
      });
    });
};

const setMessageLoadInProgress = () => ({
  type: MESSAGE_LOAD_IN_PROGRESS
});

const setMessageListLoadInProgress = () => ({
  type: GET_MESSAGES_LOAD_IN_PROGRESS
});

export const addInitialPageToken = token => ({
  type: ADD_INITIAL_PAGE_TOKEN,
  payload: token
})

export const clearPageTokens = () => ({
  type: CLEAR_PAGE_TOKENS
})

export const modifyMessages = ({ids, addLabelIds = [], removeLabelIds = []}) => dispatch => {
  batchModify({ids, addLabelIds, removeLabelIds})
    .then(modifiedIds => {
      dispatch({
       type: MODIFY_MESSAGES_SUCCESS,
       payload: {modifiedIds, addLabelIds, removeLabelIds}
      })
    })
    .catch(error => {
      dispatch({
       type: MODIFY_MESSAGES_FAILED
      })
    })
}

