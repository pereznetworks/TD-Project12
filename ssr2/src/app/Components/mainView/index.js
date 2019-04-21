import React, { Component } from 'react';

import MainViewHdr from './mainViewHeader.js';
import TableHdr from './tableHeader.js';
import TableDay from './tableDay';
import TableWeek from './tableWeek';
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
      this.whatDayIsIt = this.whatDayIsIt.bind(this);
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

    whatDayIsIt(dateInt, utcOffSet){
      return this.props.whatDayIsIt(dateInt, utcOffSet);
    }

  render() {
    if (this.props.navState.mainView){
      return(
            <div style={{"paddingTop": "28px "}} className="mainView" title='mainView' id={this.props.appData.mainViewBackGround[this.props.appData.currentLocationData.index]}>
                  <MainViewHdr
                    navState={this.props.navState}
                    appData={this.props.appData}
                   />
                  <TableHdr
                    navState={this.props.navState}
                    appData={this.props.appData}
                    whatDayIsIt={this.whatDayIsIt}
                   />
                  <div className="scrollingEnabled">
                    <TableDay
                      navState={this.props.navState}
                      appData={this.props.appData}
                     />
                  </div>
                  <TableWeek
                    navState={this.props.navState}
                    appData={this.props.appData}
                   />
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


// this.filterHourlyCondition=this.props.filterHourlyCondition.bind(this);
// filterHourlyCondition={this.props.filterHourlyCondition}