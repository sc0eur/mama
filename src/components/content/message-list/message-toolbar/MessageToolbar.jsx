import React from "react";
import ComposeMessage from "../../../compose-message/ComposeMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faReply, faExclamation } from "@fortawesome/free-solid-svg-icons";
import { getNameEmail } from "../../../../utils";
import moment from "moment";
import { getMessageForSumm } from "../../../../api/index.jsx"
import "./messageToolbar.scss";

const MessageToolbar = (props) => {

  const getClickHandler = (action) => {
    return evt => {
      props.onClick(action);
    };
  }

  const trashHandler = getClickHandler(["TRASH"]);

  if (!props.messageResult.result) {
    return null;
  }

  const message = props.messageResult.result;
  const { messageHeaders } = message;

  let replyTo, cc, subject;

  for (let i = 0; i < messageHeaders.length; i++) {
    const header = messageHeaders[i];
    switch (header.name) {
      case "Subject":
        subject = header;
        break;
      case "From":
        if (!replyTo) {
          replyTo = header;
        }
        break;
      case "Reply-To":
        replyTo = header;
        break;
      case "Cc":
        cc = header;
        break;
      default:
        break;
    }
  }

  const nameEmail = getNameEmail(replyTo.value);
  const receivedHeader = messageHeaders.find(el => el.name === "X-Received");
  const date = receivedHeader ? receivedHeader.value
        .split(";")[1]
        .trim() : "";

  let parsedDate = moment(date);

  if (!parsedDate.isValid()) {
    parsedDate = moment(
      parseInt(props.messageResult.result.internalDate)
    );
  }
  const replyHeader = `<p>On ${parsedDate.format("MMMM Do YYYY, h:mm:ss a")} < ${nameEmail.email} > wrote:</p>`;

  const composeProps = {
    plain: props.messageResult.plain,
    subject: `Re: ${subject.value}`,
    to: nameEmail.email,
    content: "",
    ...(cc && { cc: cc.value })
  };

  return (
    <div className="d-flex justify-content-center align-items-center message-toolbar">
      <div className="action-btns">
        <div className="action-btn mr-2">
          <button className="btn" onClick={trashHandler}>
            <FontAwesomeIcon
              title="Move to Trash"
              icon={faTrash}
              size="lg"
            />
          </button>
        </div>
        <div className="action-btn mr-2">
          <ComposeMessage {...composeProps}>
            <button className="btn">
              <FontAwesomeIcon
                title="Reply"
                icon={faReply}
                size="lg"
              />
            </button>
          </ComposeMessage>
        </div>
        <div className="action-btn mr-2">
          {/* <button className="btn" onClick={trashHandler}> */}
          <button className="btn" onClick={props.onSummaryClick}>
            <FontAwesomeIcon
              title="Move to Trash"
              icon={faExclamation}
              size="lg"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageToolbar;
