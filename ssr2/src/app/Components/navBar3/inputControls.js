import React, { Component } from 'react';

export default class InputControls extends Component {

  constructor(props) {
    super(props);

    this.commaBetween = /,(?=[\sA-Za-z])/g;

    this.tempActive="tempActive"
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
  }

  render(){

    if (this.props.navState.errInputMsg){
      this.inputPlaceHolder = "Please enter a location"
    } else if ( this.props.navState.noDupsMsg){
      this.inputPlaceHolder = "Please enter a DIFFERENT location"
    }
    if (this.props.navState.controlsForm){

        if (this.props.appData.fahrenheitType){
          return(
                <form id="inputControls" action="">
                  <input
                    type="text"
                    value={this.props.navState.inputValue}
                    id="geoCoding-TextInput"
                    placeholder={this.inputPlaceHolder}
                    onChange={this.handleInputChange}
                    pattern={this.commaBetween}
                    required
                    />
                  <input
                    type="submit"
                    defaultValue=" "
                    id="geoCoding-TextSubmit"
                    title="Submit Search"
                    onClick={this.handleNavSubmit}
                    onSubmit={this.handleNavSubmit}/>
                  <div className="controlsDiv">
                    <span id="tempSpacer"> </span>
                    <i className="wi wi-celsius temp" id="tempC"
                      title="Celsius"
                      onClick={this.handleNavClick}></i>
                    <span id="tempSpacer"> </span>
                    <i className="wi wi-fahrenheit tempActive" id="tempF"
                      title="Fahrenheit"
                      onClick={this.handleNavClick}></i>
                  </div>
                </form>
          );
        } else {
          return(
                <form id="inputControls" action="">
                  <input
                    type="text"
                    value={this.props.navState.inputValue}
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
                  <div className="controlsDiv">
                    <span id="tempSpacer"> </span>
                    <i className="wi wi-celsius temp" id="tempC"
                      title="Celsius"
                      onClick={this.handleNavClick}></i>
                    <span id="tempSpacer"> </span>
                    <i className="wi wi-fahrenheit tempActive" id="tempF"
                      title="Fahrenheit"
                      onClick={this.handleNavClick}></i>
                  </div>
                </form>
          );
        }

      } else {

        return(
              <form id="inputControls" action="">
                <input
                  type="text"
                  value={this.props.navState.inputValue}
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