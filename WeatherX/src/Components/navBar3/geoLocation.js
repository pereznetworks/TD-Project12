import React, { Component } from 'react';
// import ReactMap from "react-mapbox-gl";
// import logo from '../imgs/logo.svg';

export default class GeoLocation extends Component {

  constructor(props) {
    super(props);
    this.handleNavClick = this.handleNavClick.bind(this);
    this.handleNavSubmit = this.handleNavSubmit.bind(this);
  }

  handleNavClick(e){
    this.props.handleNavClick(e);
  }

  handleNavSubmit(e){
    this.props.handleNavSubmit(e);
    this.props.handleNavClick(e);
  }

  render() {
    return(
            <div className="geolocation-div">
              <input
                type="button"
                className="geo-button"
                id="geoLocation-Submit"
                title="Find Me"
                onClick={this.props.handleNavSubmit}></input>
            </div>
    );
  }
}

// <label
//   className="geo-button-label"
//   id="geoLocation-Label"
//   title="Find Me"
//   onClick={this.props.handleNavSubmit}>
//  Find Me
// </label>