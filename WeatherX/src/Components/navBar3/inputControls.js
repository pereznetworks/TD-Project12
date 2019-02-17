import React, { Component } from 'react';

export default class InputControls extends Component {

  constructor(props) {
    super(props);
    this.inputPlaceHolder = "type a City, State or City, Country";
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

  render(){

    if (this.props.navState.noBlankInputMsg){
      this.inputPlaceHolder = "Please enter a location"
    }
    if (this.props.navState.controlsForm){
        return(
              <form id="inputControls" action="">
                <i className="wi wi-celsius" id="tempC"
                  title="Celsius"
                  onClick={this.handleNavClick}></i>
                <i className="wi wi-fahrenheit" id="tempF"
                  title="Fahrenheit"
                  onClick={this.handleNavClick}></i>
                <input
                  type="button"
                  id="addLocation"
                  title="Add Location"
                  onClick={this.handleNavClick}/>
              </form>
        );

      } else {

        return(
              <form id="inputControls" action="">
                <input
                  type="button"
                  value=""
                  className="geo-button"
                  id="geoLocation-Submit"
                  title="Find Me"
                  onClick={this.handleNavSubmit}/>
                <input
                  type="text"
                  id="geoCoding-TextInput"
                  placeholder={this.inputPlaceHolder}
                  onChange={this.handleInputChange}/>
                <input
                  type="submit"
                  defaultValue=" "
                  id="geoCoding-TextSubmit"
                  title="Submit Search"
                  onClick={this.handleNavSubmit}
                  onSubmit={this.handleNavSubmit}/>
              </form>
        );
      }
   }
}