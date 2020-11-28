import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import NotFound from "../not-found/NotFound";

import MessageList from "../content/message-list/MessageList";
import MessageContent from "../content/message-list/message-content/MessageContent";

import { Route, Switch, withRouter } from "react-router-dom";

import { getLabels } from "../sidebar/sidebar.actions";

import {
  getLabelMessages,
  emptyLabelMessages,
  toggleSelected,
  setPageTokens,
  addInitialPageToken,
  clearPageTokens,
  setSearchQuery
} from "../content/message-list/actions/message-list.actions";

import { selectLabel } from '../sidebar/sidebar.actions';
import { signOut } from '../../api/authentication';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";


const Main = (props) => {
  const [signedInUser, setSignedInUser] = useState();

  useEffect(() => {
    /* Label list is fetched from here
    so that we can declare Routes by labelId
    before rendering anything else */
    getLabelList();
  }, []);

  useEffect(() => {
    setSignedInUser(props.signedInUser);

    const { labels } = props.labelsResult;
    const { pathname } = props.location;
    const selectedLabel = labels.find(el => el.selected);
    const labelPathMatch = labels.find(el => el.id.toLowerCase() === pathname.slice(1));
    if (!selectedLabel) {
      if (labelPathMatch && props.searchQuery === "") {
        props.selectLabel(labelPathMatch.id);
      }
    }
    else {
      if (labelPathMatch && selectedLabel.id !== labelPathMatch.id) {
        props.selectLabel(labelPathMatch.id);
      }
    }
  }, [props.signedInUser]);

  const navigateToNextPage = (token) => {
    const searchParam = props.location.search;
    const currentToken = searchParam.indexOf("?") === 0 ? searchParam.slice(1) : "";
    props.setPageTokens({
      prevPageToken: currentToken
    });
    props.history.push(token);
  }

  const navigateToPrevPage = (token) => {
    props.history.push(token);
  }

  const loadLabelMessages = (label, listOfGoodLabels) => {
    const currentSearchQuery = props.searchQuery;
    props.clearPageTokens();
    props.selectLabel(label.id);

    const newPathToPush = `/${label.id.toLowerCase()}`;

    // if (currentSearchQuery && currentSearchQuery !== "") {
      props.setSearchQuery("");
      const {pathname} = props.location;
      // if (newPathToPush === pathname) {
        // let listOfGoodLabels = 'чудолог';
        // console.log('loadLabelMessages')
        // console.log(label.id)
        let labelIds = [label.id]
        // console.log(labelIds)
        if (labelIds[0].length == 0){
          labelIds = ['INBOX']
        }
        let q = ''
        let pageToken = ''
        getLabelMessages({ labelIds, q, pageToken ,listOfGoodLabels});
        // console.log(getLabelMessages({labelIds: [label.id] }));
        // props.history.push(`/${label.id.toLowerCase()}`);
        return;
      // }
    // }

    props.history.push(`/${label.id.toLowerCase()}`);
  }


  const getLabelList = () => {
    props.getLabels();
  }

  const getLabelMessages = ({ labelIds, q, pageToken ,listOfGoodLabels}) => {
    props.emptyLabelMessages();
    // let listOfGoodLabels = 'чудолог';
    // console.log('getLabelMessages')
    // console.log(listOfGoodLabels)
    // console.log(listOfGoodLabels)
    props.getLabelMessages({labelIds, q, pageToken,listOfGoodLabels});
  }


  const addInitialPageToken = (token) => {
    props.addInitialPageToken(token);
  }

  const renderLabelRoutes = (props) => {
    const { labelsResult } = props;
    return labelsResult.labels.map(el => (
      <Route
        key={el.id + '_route'}
        exact
        path={"/" + el.id}
        render={routeProps => {
          return (
            <MessageList
              {...routeProps}
              getLabelMessages={getLabelMessages}
              messagesResult={props.messagesResult}
              toggleSelected={props.toggleSelected}
              navigateToNextPage={navigateToNextPage}
              navigateToPrevPage={navigateToPrevPage}
              pageTokens={props.pageTokens}
              addInitialPageToken={addInitialPageToken}
              parentLabel={labelsResult.labels.find(el => el.id === routeProps.match.path.slice(1))}
              searchQuery={props.searchQuery}
            />
          )
        }}
      />
    ));
  }

  const renderSpinner = () => {
    return (
      <div className="d-flex h-100 align-items-center justify-content-center">
        <FontAwesomeIcon icon={faSpinner} spin size="5x" />
      </div>
    )
  }

  const onSignout = () => {
    signOut().then(_ => {
      props.history.replace('inbox');
      window.location.reload(true);
    })
  }

  const renderInboxViewport = () => {

    if (props.labelsResult.labels.length < 1) {
      return renderSpinner();
    }
    // console.log(props)
    // console.log(props.googleUser)
    return (
      <Fragment>
        <Header googleUser={props.googleUser}
          onSignout={onSignout}
          setSearchQuery={props.setSearchQuery}
          getLabelMessages={getLabelMessages}
          searchQuery={props.searchQuery}
        />
        <section className="main hbox space-between">
          <Sidebar
            googleUser={props.googleUser}
            getLabelList={getLabelList}
            pathname={props.location.pathname}
            labelsResult={props.labelsResult}
            onLabelClick={loadLabelMessages}
          />
          <article className="d-flex flex-column position-relative">
            <Switch>
              {renderLabelRoutes(props)}
              <Route
                exact
                path="/notfound"
                component={NotFound}
              />
              <Route
                exact
                path="/:id([a-zA-Z0-9]+)"
                component={MessageContent}
              />
            </Switch>
          </article>
        </section>
      </Fragment>
    );
  }

  return renderInboxViewport();
}

const mapStateToProps = state => ({
  labelsResult: state.labelsResult,
  messagesResult: state.messagesResult,
  pageTokens: state.pageTokens,
  searchQuery: state.searchQuery
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getLabels,
      getLabelMessages,
      emptyLabelMessages,
      toggleSelected,
      selectLabel,
      setPageTokens,
      addInitialPageToken,
      clearPageTokens,
      setSearchQuery
    },
    dispatch
  );

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Main);
