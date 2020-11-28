import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faQuestion, faTimes } from "@fortawesome/free-solid-svg-icons";
const LabelsItem = (props) => {

  const onClick = (evt) => {
    props.onClick(evt, props.id, props.name);
  }

  const { name } = props;
//   const iconProps = props.iconProps;

//   let selected = props.selected ? " selected" : "";

//   const messagesUnreadLocale = messagesUnread.toLocaleString();
  return (
    <li
    //   className={`text-truncate text-left text-dark pl-4 pr-5 py-2 border-0 ${selected}`}
    className={`text-truncate text-left text-dark pl-4 pr-5 py-2 border-0 `}
        
      title={
        // name + (messagesUnread > 0 ? ` (${messagesUnreadLocale})` : "")
        name
      }
    >

      {/* <FontAwesomeIcon size="sm" /> */}
      {/* <button onClick = {props.deleteLabel} style={{border: '0px', backgroundColor: '#00000000', position: 'absolute', right: '4px'}}> */}
      <button onClick = {() => props.onDeleteClick(props.id)} style={{border: '0px', backgroundColor: '#00000000', position: 'absolute', right: '4px'}}>

        <FontAwesomeIcon icon={faTimes} />
      </button>
      
      <span onClick={onClick}>{name}</span>

      {/* {messagesUnread > 0 ? (
        <div className={"msg-count"}>{messagesUnreadLocale}</div>
      ) : null} */}
    </li>
  );
}

export default LabelsItem;
