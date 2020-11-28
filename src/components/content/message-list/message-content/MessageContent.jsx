import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";
import { bindActionCreators, compose } from "redux";
import {
  getEmailMessage,
  modifyMessages
} from "../actions/message-list.actions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import MessageToolbar from "../message-toolbar/MessageToolbar";

import "./messageContent.scss";

import axios from "axios";

const MessageContent = (props) => {
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [modal, setModal] = useState();
  const [bodyWithSummary, setBodyWithSummary] = useState('');
  const [bodyWithoutSummary, setBodyWithoutSummary] =useState('');
  const [activeSummary, setActiveSummary] = useState(false);
  const [activeBody, setActiveBody] = useState('');

  const iframeRef = React.createRef();

  useEffect(() => {
    const messageId = props.match.params.id;
    props.getEmailMessage(messageId);
  }, []);
  let answer = axios.post('http://192.168.1.23:8000/summary/', {"text": props.emailMessageResult.plain}).then(response => {
      return response.data
  })
  // console.log(answer)
  // Wasn't sure how to split componentDidMount and componentDidUpdate within a single useEffect call and get it to work so here it is split into two useEffect calls.
  useEffect(() => {
    // const { emailMessageResult } = props;
    // axios.post('http://192.168.1.23:8000/summary/', {"text": props.emailMessageResult.plain}).then(response => {
    //     if (!emailMessageResult.loading) {
    //       if (!emailMessageResult.failed) {
    //         if (iframeRef.current) {
    //             // console.log(response.data)
    //             const { body } = iframeRef.current.contentWindow.document;
    //             body.style.margin = "0px";
    //             body.style.fontFamily = "Arial, Helvetica, sans-serif";
    //             body.style.fontSize = "13px";
    //             setBodyWithSummary("<h3>Краткое содержание:</h3>\n<br>"+ response.data.join("</br><br>")+ "</br>" + props.emailMessageResult.body)
    //             setBodyWithoutSummary(props.emailMessageResult.body);
    //             setActiveBody(props.emailMessageResult.body);
    //             // console.log('bodyWithoutSummary: ');
    //             // console.log(bodyWithSummary);
    //             body.innerHTML = props.emailMessageResult.body;
                
    //             // nfnf
    //         }
    //       } else {
    //         if (!errorMessage) {
    //           setErrorMessage(emailMessageResult.error.result.error.message);
    //           setModal(true);
    //         }
    //       }
    //     }
    // })
    const { emailMessageResult } = props;
     axios.post('http://192.168.1.23:8000/summary/', {"text": props.emailMessageResult.plain}).then(response => {
      
        //  axios.post('http://192.168.1.23:8000/dates/', {"text": props.emailMessageResult.plain}).then(response_dates => {
             // let [bodya, setBody] = useState();
             console.log('lsjfklsjf;asdjf')
             var bodya = props.emailMessageResult.body
             
            //  for (const date of response_dates.data.dates) {
            //      // console.log(bodya)
            //      const s = `<a href=https://calendar.google.com target="_blank"/><span style="color:green">${date}</span></a>`
            //      var bodya = bodya.replace(date, s)
            //      // var bodya = some
            //      console.log('первый')
            //  }
            //  for (const number of response_dates.data.numbers) {
            //      // console.log(bodya)
            //      const s = `<span style="color:red">${number}</span>`
            //      var bodya = bodya.replace(number, s)
            //      // var bodya = some
            //      console.log('второй')
            //  }
           
             // const bodya = props.emailMessageResult.body.replace("Здравствуйте", '<span style="background-color:green">Здравствуйте</span>')
             // console.log(bodya)
             console.log(emailMessageResult.loading)
             console.log(emailMessageResult.failed)
             if (!emailMessageResult.loading) {
              if (!emailMessageResult.failed) {
                if (iframeRef.current) {
                    // console.log(response.data)
                    console.log('третий')
                    const { body } = iframeRef.current.contentWindow.document;
                    body.style.margin = "0px";
                    body.style.fontFamily = "Arial, Helvetica, sans-serif";
                    body.style.fontSize = "13px";
                    setBodyWithSummary("<div style='border: 4px solid black'><h3>Краткое содержание:</h3>\n<br>"+ response.data.join("</br><br>")+ "</div></br>" + props.emailMessageResult.body)
                    setBodyWithoutSummary(props.emailMessageResult.body);
                    console.log('нужный лог')
                    console.log(props.emailMessageResult.body)
                    body.innerHTML = "From: " + props.emailMessageResult.fromEmail + "\n\n" + bodya;
    
                }
              } else {
                if (!errorMessage) {
                  setErrorMessage(emailMessageResult.error.result.error.message);
                 //  console.log('нужный лог')
                  setModal(true);
                }
              }
            }
             
        //  })

        //  if (!emailMessageResult.loading) {
        //   if (!emailMessageResult.failed) {
        //     if (iframeRef.current) {
        //         // console.log(response.data)
        //         console.log('третий')
        //         const { body } = iframeRef.current.contentWindow.document;
        //         body.style.margin = "0px";
        //         body.style.fontFamily = "Arial, Helvetica, sans-serif";
        //         body.style.fontSize = "13px";
        //         setBodyWithSummary("<h3>Краткое содержание:</h3>\n<br>"+ response.data.join("</br><br>")+ "</br>" + props.emailMessageResult.body)
        //         setBodyWithoutSummary(props.emailMessageResult.body);
        //         console.log('нужный лог')
        //         console.log(props.emailMessageResult.body)
        //         body.innerHTML = "From: " + props.emailMessageResult.fromEmail + "\n\n" + bodya;

        //     }
        //   } else {
        //     if (!errorMessage) {
        //       setErrorMessage(emailMessageResult.error.result.error.message);
        //      //  console.log('нужный лог')
        //       setModal(true);
        //     }
        //   }
        // }
     })
  }, [props.emailMessageResult])

  function changeActiveSummary() {
    // if (activeSummary) {
    //   setActiveSummary(false);
    //   setActiveBody('мама');
    //   console.log(activeBody);
    // }else{
    //   setActiveSummary(true);
    //   setActiveBody('папа');
    //   console.log(activeBody);
    // }
    if (activeSummary) {
      setActiveSummary(false)
      const { body } = iframeRef.current.contentWindow.document;
      body.style.margin = "0px";
      body.style.fontFamily = "Arial, Helvetica, sans-serif";
      body.style.fontSize = "13px";
      body.innerHTML = bodyWithoutSummary;
    }else{
      setActiveSummary(true)
      const { body } = iframeRef.current.contentWindow.document;
      body.style.margin = "0px";
      body.style.fontFamily = "Arial, Helvetica, sans-serif";
      body.style.fontSize = "13px";
      body.innerHTML = bodyWithSummary;
    }
    
    
  }

  const renderSpinner = () => {
    return (
      <div className="d-flex h-100 justify-content-center align-items-center  ">
        <FontAwesomeIcon icon={faSpinner} spin size="5x" />
      </div>
    );
  }

  const renderErrorModal = () => {
    return <Redirect to="/notfound" />;
  }

  const modifyMessage = (addLabelIds, removeLabelIds) => {
    const id = props.emailMessageResult.result.id;
    const actionParams = {
      ...(addLabelIds && { addLabelIds }),
      ...(removeLabelIds && { removeLabelIds })
    };
    props.modifyMessages({ ids: [id], ...actionParams });
    props.history.goBack();
  }

  if (props.emailMessageResult.loading) {
    return renderSpinner();
  }
  // console.log(props.emailMessageResult.plain)
  return (
    <React.Fragment>
      <MessageToolbar
        onClick={modifyMessage}
        messageResult={props.emailMessageResult}
        onSummaryClick = {changeActiveSummary}
      />
      <div className="d-flex justify-content-center align-items-center message-content">
        {props.emailMessageResult.loading ? renderSpinner() : null}
        {errorMessage ? (
          renderErrorModal()
        ) : (
          <iframe
            ref={iframeRef}
            title="Message contents"
            id="message-iframe"
            style={{
              display: props.emailMessageResult.loading
                ? "none"
                : "block"
            }}
          />
        )}
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = state => ({
  emailMessageResult: state.emailMessageResult
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getEmailMessage,
      modifyMessages
    },
    dispatch
  );

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MessageContent);
