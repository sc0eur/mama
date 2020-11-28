import React, { useState } from "react";
import "./header.scss";
import {getMessageListReq} from "../../api/index.jsx"
import Signout from "../signout/Signout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import debounce from "lodash/debounce";
// import { render } from "node-sass";


// class NameForm extends React.Component
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = (event) => this.setState({value: event.target.value});
    this.handleSubmit = handleSubmitFunction

    // handleChange(event) {
    //   this.setState({value: event.target.value});
    // }
    // this.handleSubmit = this.handleSubmit.bind(this);

    // const [askQuery, setAskQuery] = useState('');

    function handleSubmitFunction(question) {
      console.log(question.toString());
      const maxResults = 2;
      let q = '';
      getMessageListReq( { question, maxResults , q} ).then(response => console.log(response));
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

    // console.log(props.googleUser)
    const userInfo = props.googleUser.wt;
    const email = userInfo.cu;
    const fullName = userInfo.Ad;
    const picUrl = userInfo.hK;
    // console.log(fullName)

  // console.log(props)
  }


  // console.log(userInfo)




  render() {
    return (
      <header className="d-flex p-3 align-content-center align-items-center header">
        <div className="header-logo justify-content-center">
          <Link to="/inbox">MAMA</Link>
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
