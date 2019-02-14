import React, { Component } from 'react';


export default class TableHdr extends Component {

  constructor(props) {
    super(props);
    this.dateInt = this.props.appData.currentForecast.currently.time;
    this.utcOffSet = this.props.appData.currentForecast.offset;
    this.tempHigh = Math.floor(this.props.appData.currentForecast.daily.data[0].temperatureMax);
    this.tempLow = Math.floor(this.props.appData.currentForecast.daily.data[0].temperatureMin);
    this.whatDayIsIt = this.whatDayIsIt.bind(this);
  }

  whatDayIsIt(dateInt){
    return this.props.whatDayIsIt(dateInt)
  }
  render(){
    return(
      <table id="tableHdr">
       <tbody>
          <tr>
            <th id="dayOfWeek">{this.whatDayIsIt(this.dateInt)}</th>
            <th id="today">TODAY</th>
            <th id="blank"></th>
            <th id="tempHigh">{this.tempHigh}°</th>
            <th id="tempLow">{this.tempLow}°</th>
          </tr>
        </tbody>
      </table>
    );
  }
}
