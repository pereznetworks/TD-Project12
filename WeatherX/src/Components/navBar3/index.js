import React, { Component } from 'react';

import InputControls from './inputControls.js';

export default class NavBar3 extends Component {

// passing props, navState object,
// each element in object refers to a html element by true/false, render/dont render
// passing bound handler methods
// hanldeNavSubmit makes api call to back-end server
// hanldeNavClick used to render/not render: Home, GeoLocaton form, or About

  constructor(props) {
    super(props);
    this.handleNavClick = this.handleNavClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleNavSubmit = this.handleNavSubmit.bind(this);
  }

  handleNavClick(event) {
    event.preventDefault();
    this.props.handleNavClick(event);
  }

  handleInputChange(event){
      this.props.handleInputChange(event);
  }

  handleNavSubmit(event) {
    event.preventDefault();
    this.props.handleNavSubmit(event);
    this.props.handleNavClick(event);
  }

  // so were using a form element here, but not actually using any form actions ot methods
  // dont want to implement a router on this front end ...
  // so instead just using axios to make apicall to backendServer and recv data then setState variables with data

  render() {
            if (this.props.navState.home){
              return(
                <div id="navBar3" className=".middle-grid-item-1">
                  <InputControls
                    navState={this.props.navState}
                    appData={this.appData}
                    handleNavClick={this.handleNavClick}
                    handleInputChange={this.handleInputChange}
                    handleNavSubmit={this.handleNavSubmit}
                  />
                </div>
             );
            } else {
              return (
                <div id="navBar3">
                  <form id="geoLocation" action="">
                    <div className="backHome-div">
                      <input
                        type="button"
                        className="geo-button"
                        id="backHome-button"
                        title="backHome"
                        onClick={this.props.handleNavClick}></input>
                    </div>
                  </form>
                </div>
              );
            }
    }
}
