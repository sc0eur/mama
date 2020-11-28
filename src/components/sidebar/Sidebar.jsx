import React, { useEffect, useState } from "react";

import ComposeMessage from "../compose-message/ComposeMessage1";
import PerfectScrollbar from "react-perfect-scrollbar";

import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";

import {
  faInbox,
  faEnvelope,
  faTrash,
  faCircle,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";

import LabelItem from "./LabelItem";
import LabelsItem from "./LabelsItem";

import { getForbiddenIds, getForbiddenIdsCache } from "../../api/index.jsx"




import "./sidebar.scss";
import axios from "axios";

const Sidebar = (props) => {
  const [selectedLabel, setSelectedLabel] = useState();
  const [finalLabels, setFinalLabels] = useState(props.labelsResult.labels);
  const [sortedLabels, setSortedLabels] = useState([]);
  const [displaySaveProp, setDisplaySaveProp] = useState('none');
  const [displayAddProp, setDisplayAddProp] = useState('');
  const [displaySortProp, setSortProp] = useState('none');
  const [inputVal, setInputVal] = useState('');
  const [labelIndexDict, setLabelIndexDict] = useState({})

  useEffect(() => {
    
    axios.post('http://192.168.1.23:8000/labels/', {"id": props.googleUser.wt.NT}).then(result => {
      setSelectedLabel(props.pathname)
      
      setSortedLabels(result.data)
      console.log(sortedLabels)

    })
  }, [props.pathname])

  const navigateToLabelList = (evt, labelId, labelName) => {
    const label = props.labelsResult.labels.find(el => el.id === labelId);
    console.log('теперь лог тут')
    console.log(label)
    

    var maxResults = 20
    var userIndex = props.googleUser.wt.NT
    var labels = []
    for (var i = 0;i < sortedLabels.length; i++){
      labels = [...labels, sortedLabels[i].name]
    }
    console.log('лог тут')
    // getForbiddenIds( {maxResults , labels, userIndex}).then(response => console.log(response))
    getForbiddenIdsCache( {maxResults , labels, userIndex}).then(response => props.onLabelClick(label || { id: "" }, response[labelName]))

  }

  const navigateToList = (evt, labelId) => {
    const label = props.labelsResult.labels.find(el => el.id === labelId);
    props.onLabelClick(label || { id: "" });
  }

  const deleteLabel = (id) => {
    // console.log(id)
    var oldLabels = sortedLabels
    oldLabels = oldLabels.filter(item => (item.id != id));
    setSortedLabels(oldLabels)
  }
  const renderItems = (labelList) => {
    if (labelList.length === 0) {
      return <div />;
    }

    const labels = labelList.reduce((acc, el) => {
      acc.push(el);
      return acc;
    }, []);

    const labelGroups = groupBy(labels, "type");

    // const visibleLabels = labelGroups.user
    // const visibleLabels = []
    // const sortedLabels = sortBy(visibleLabels, "name");



            // {renderLabels(sortedLabels)}

    return (
      <React.Fragment>
        {renderFolders(labelGroups.system)}
        {renderLabels(sortedLabels)}
      </React.Fragment>
    );
  }

  const renderFolders = (labels) => {
    const inboxLabel = {
      ...labels.find(el => el.id === "INBOX"),
      name: "Inbox",
      icon: faInbox
    };
    const sentLabel = {
      ...labels.find(el => el.id === "SENT"),
      messagesUnread: 0,
      name: "Sent",
      icon: faEnvelope
    };
    const trashLabel = {
      ...labels.find(el => el.id === "TRASH"),
      messagesUnread: 0,
      name: "Trash",
      icon: faTrash
    };
    const spamLabel = {
      ...labels.find(el => el.id === "SPAM"),
      name: "Spam",
      icon: faExclamationCircle
    };

    const folders = [inboxLabel, sentLabel, trashLabel, spamLabel];

    return (
      <React.Fragment>
        <li key="olders-nav-title" className="pl-2 nav-title">
          Folders
        </li>
        {folders.map(el => {
          const iconProps = { icon: el.icon, size: "lg" };
          return (
            <LabelItem
              key={el.id + "_label"}
              onClick={navigateToList}
              name={el.name}
              id={el.id}
              messagesUnread={el.messagesUnread}
              iconProps={iconProps}
              selected={el.selected}
            />
          );
        })}
      </React.Fragment>
    );
  }

  const renderLabels = (labels) => {
    return (
      <React.Fragment>
        <li key="olders-nav-title" className="pl-2 nav-title">
          Labels
        </li>
        {labels.map(el => {
          // const iconProps = {
          //   icon: faCircle,
          //   color: el.color ? el.color.backgroundColor : "gainsboro",
          //   size: "sm"
          // };
          return (
            <LabelsItem
              key={el.id + "_label"}
              onClick={navigateToLabelList}
              name={el.name}
              id={el.id}
              onDeleteClick={deleteLabel}
              // messagesUnread={el.messagesUnread}
              // iconProps={iconProps}
              // selected={el.selected}
            />
          );
        })}
      </React.Fragment>
    );
  }
  function addSortedLabel(label) {
    if (label.length > 0) {
      if (sortedLabels.length == 0) {
        setSortedLabels(sortedLabels => [...sortedLabels,{id: 1, name: label }])
      }else{
        setSortedLabels(sortedLabels => [...sortedLabels,{id: sortedLabels[sortedLabels.length-1].id + 1, name: label }])
      }

      setDisplaySaveProp('none')
      setDisplayAddProp('')
      setInputVal('')
    }
    setSortProp('')


  }

  function classifyLabels(){
    var labels = []
    for (var i = 0;i < sortedLabels.length; i++){
      labels = [...labels, sortedLabels[i].name]
    }
    // console.log(labels)
    var maxResults = 20
    var userIndex = props.googleUser.wt.NT

    console.log('лог тут')
    getForbiddenIds( {maxResults , labels, userIndex}).then(response => console.log(response))
    getForbiddenIds( {maxResults , labels, userIndex}).then(response => setLabelIndexDict(response))

    setSortProp('none')
    // console.log('user')
    // console.log(props.googleUser.wt.NT)
    
  }

  function showNameSelectionWindow() {
    setDisplaySaveProp('')
    setDisplayAddProp('none')
  }


  return (
    <nav className="d-flex flex-column text-truncate left-panel">
      <div className="compose-panel">
        <div className="d-flex justify-content-center p-2 compose-btn">
          <ComposeMessage
            subject=""
            to=""
          >
            <button className="btn btn-dark align-self-center w-75 font-weight-bold">
              Send
            </button>
          </ComposeMessage>
        </div>
      </div>
      <PerfectScrollbar
        component="ul"
        className="d-flex flex-column border-0 m-0 sidebar"
      >
        {renderItems(finalLabels)}
        
        {/* <button onClick = {() => addSortedLabel()} className="btn btn-dark align-self-center w-75 font-weight-bold add-label-button">
              + Add label
          </button> */}
        <div style={{height: '0.6rem',display: displaySaveProp}}></div>
        <input type="text" style={{float: 'left', marginLeft: '0.4rem', marginRight: '0.4rem'}} style={{display: displaySaveProp}} value={inputVal} onChange={(event) => {
            setInputVal(event.target.value);
					}}/>
        <div style={{height: '0.6rem'}}></div>
        {/* <button style={{float: 'left', align: 'center'}}>sldfj</button> */}
        <button onClick = {() => addSortedLabel(inputVal)} className="btn btn-dark align-self-center w-75 font-weight-bold add-label-button" style={{display: displaySaveProp}}>
            Save label
        </button>
        <button onClick = {() => showNameSelectionWindow()} className="btn btn-dark align-self-center w-75 font-weight-bold add-label-button" style={{display: displayAddProp}}>
            + Add label
        </button>
        <div style={{height: '0.6rem',display: displaySortProp}}></div>
        <button onClick = {() => classifyLabels()} className="btn btn-dark align-self-center w-75 font-weight-bold add-label-button" style={{display: displaySortProp}}>
             Sort
        </button>
      </PerfectScrollbar>
    </nav>
  );
}

export default Sidebar;
