import React, { useState } from "react";
import "./header.scss";
import {getMessageListReq} from "../../api/index.jsx"
import Signout from "../signout/Signout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faQuestion, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import debounce from "lodash/debounce";
// import { render } from "node-sass";


// class NameForm extends React.Component
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {displayProp: 'none', anыwer: ''};
    // const [displayProp, setDisplayProp] = useState('none');

    this.handleChange = (event) => this.setState({value: event.target.value});
    this.handleSubmit = handleSubmitFunction
    this.closeAnswer = closeAnswerFunction


    function closeAnswerFunction() {
      // this.setState({displayProp: 'none', answer: ''})
      this.setState({displayProp: 'none', answer: ''})
    }

    // handleChange(event) {
    //   this.setState({value: event.target.value});
    // }
    // this.handleSubmit = this.handleSubmit.bind(this);

    // const [askQuery, setAskQuery] = useState('');

    function handleSubmitFunction(question) {
      
      const maxResults = 5;
      let q = '';
      // const [answ, setAnsw] = useState('kjh')
      getMessageListReq( { question, maxResults , q} ).then(response => this.setState({displayProp: '', answer: response}));
      console.log(this.state.answer)
    }

    const handleSearchClick = (evt) => {
      if (props.searhQuery !== "") {
        performSearch();
      }
    }

    const handleInputChange = (evt) => {
      props.setSearchQuery(evt.target.value);
      performSearch();
    }

    const performSearch = debounce(() => {
      const searchParams = {}
      if (!props.searchQuery || props.searchQuery === "") {
        searchParams.labelIds = ["INBOX"];
      }
      props.getLabelMessages({...searchParams})
    }, 1000);

    const userInfo = props.googleUser.wt;
    const email = userInfo.cu;
    const fullName = userInfo.Ad;
    const picUrl = userInfo.hK;



  }

  render() {
    return (
      <header className="d-flex p-3 align-content-center align-items-center header">
        <div className="header-logo justify-content-center">
          <Link to="/inbox"><img style = {{width: '100px'}} src={require("./Logo.png")} /></Link>
        </div>
        

        <div className="header-search">
          <div className="input-group w-75 ml-1 mr-auto">
            <input
              type="search"
              className="form-control border-light question"
              placeholder="Ask question"
              // value={askQuery}
              // onChange={() => setAskQuery(self.value)}
              value={this.state.value} onChange={this.handleChange}
            >
            </input>
            <div className="input-group-append" onClick={() => this.handleSubmit(this.state.value)}>
              <button
                className="btn btn-light btn-outline-light bg-white text-dark"
                type="button"
              >
                <FontAwesomeIcon icon={faQuestion} />
              </button>
            </div>
            {/* <input
              type="search"
              className="form-control border-light"
              placeholder="Search mail"
              value={props.searchQuery}
              onChange={handleInputChange}
            /> */}
            {/* <div className="input-group-append" onClick={handleSearchClick}>
              <button
                className="btn btn-light btn-outline-light bg-white text-dark"
                type="button"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div> */}
            <div style={{
              background: 'white', 
              padding: '1rem',
              width: "100%", 
              position: 'absolute', 
              zIndex:'1000', 
              top: '3rem', 
              display: this.state.displayProp,
              borderRadius: "10px",
              border:  '1px solid',
              color: 'black',
              textAlign: "center"
              }}>
              {this.state.answer}
              <button onClick = {this.closeAnswer.bind(this)} style = {{border: '0px', background: '#00000000', position: 'absolute', top: 0, right:0}}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
          <div>
            <span className="user-name" title={this.props.googleUser.wt.cu}>
              {this.props.googleUser.wt.Ad}
            </span>

            <img className="mx-2 profile-pic" src={this.props.googleUser.wt.hK} alt="" />
          </div>
        </div>

        <Signout onSignout={this.props.onSignout} />
      </header>
    );
  }
}

export default Header;
