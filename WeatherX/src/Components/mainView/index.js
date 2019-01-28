import React, { Component } from 'react';
// import ReactMap from "react-mapbox-gl";
// import logo from '../imgs/logo.svg';


import About from "./about.js";


export default class MainView extends Component {

  // passing props, navState object,
  // each element in object refers to a html element by true/false, render/dont render
  // passing bound handler methods
  // hanldeNavSubmit makes api call to back-end server
  // hanldeNavClick used to render/not render: Home, GeoLocaton form, or About

    constructor(props) {
      super(props);
      this.handleNavClick = this.handleNavClick.bind(this);
      this.handleNavSubmit = this.handleNavSubmit.bind(this);
    }

    handleNavClick(event) {
      this.props.handleNavClick(event);
    }


    handleNavSubmit(event) {
      this.props.handleNavSubmit(event);
    }

    showMeThisOne(){
      this.props.showMeThisOne();
    }

  render() {

    if (this.props.navState.mainView){
      return(
        <div id="mainView" title='mainView'>
          <h3 id="cityName">{this.props.navState.currentLocation}</h3>
          <p id="currentConditions">Sunny</p>
          <h1 id="todayTemp">61°</h1>
          <table id="tableHdr">
           <tbody>
            <tr>
              <th id="dayOfWeek">Wednesday</th>
              <th id="today">TODAY</th>
              <th id="blank"></th>
              <th id="tempHigh">61°</th>
              <th id="tempLow">44°</th>
            </tr>
            </tbody>
          </table>
          <table id="tableDays">
           <tbody>
              <tr>
                <th>Now</th>
                <th>3 PM</th>
                <th>4 PM</th>
                <th>5 PM</th>
                <th>6 PM</th>
                <th>7 PM</th>
              </tr>
              <tr>
                <td className="Sunny">Clear Skies, Sunny</td>
                <td className="Sunny">Clear Skies, Sunny</td>
                <td className="Sunny">Clear Skies, Sunny</td>
                <td className="Sunny">Clear Skies, Sunny</td>
                <td className="Sunset">Clear Skies, Sunset</td>
                <td className="ClearNightSky">Clear Night</td>
              </tr>
              <tr>
                <td>61°</td>
                <td>62°</td>
                <td>62°</td>
                <td>62°</td>
                <td>62°</td>
                <td>62°</td>
              </tr>
            </tbody>
          </table>
          <table id="tableWeek">
           <tbody>
            <tr>
              <th id="dayOfWeek"></th>
              <th id="forecastCondition"></th>
              <th id="tempHigh"></th>
              <th id="tempLow"></th>
            </tr>
            <tr>
              <td id="dayOfWeek">Thursday</td>
              <td id="forecastCondition">Clear Skies, Sunny</td>
              <td id="tempHigh">61°</td>
              <td id="tempLow">44°</td>
            </tr>
            <tr>
              <td id="dayOfWeek">Friday</td>
              <td id="forecastCondition">Clear Skies, Sunny</td>
              <td id="tempHigh">61°</td>
              <td id="tempLow">44°</td>
            </tr>
            <tr>
              <td id="dayOfWeek">Saturday</td>
              <td id="forecastCondition">Cloudy</td>
              <td id="tempHigh">61°</td>
              <td id="tempLow">44°</td>
            </tr>
            <tr>
              <td id="dayOfWeek">Sunday</td>
              <td id="forecastCondition">Cloudy</td>
              <td id="tempHigh">61°</td>
              <td id="tempLow">44°</td>
            </tr>
            <tr>
              <td id="dayOfWeek">Monday</td>
              <td id="forecastCondition">Cloudy</td>
              <td id="tempHigh">61°</td>
              <td id="tempLow">44°</td>
            </tr>
            <tr>
              <td id="dayOfWeek">Tuesday</td>
              <td id="forecastCondition">Partly Cloudy</td>
              <td id="tempHigh">61°</td>
              <td id="tempLow">44°</td>
            </tr>
            <tr>
              <td id="dayOfWeek">Wednesday</td>
              <td id="forecastCondition">Clear Skies, Sunny</td>
              <td id="tempHigh">61°</td>
              <td id="tempLow">44°</td>
            </tr>
            </tbody>
          </table>
        </div>
      );
    } if (this.props.navState.about){
      return (
        <About />
      );
    } else {
      return null;
    }

  }
}