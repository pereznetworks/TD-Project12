import React, { Component } from 'react';
import axios from 'axios';

// importing sub-components
import TitleBar from './titleBar';
import NavBar3 from './navBar3';
import MainView from "./mainView";
import LocationBar from "./locationBar";

// import custon css styling
import './assets/css/navBar3.css';
import './assets/css/mainView.css';
import './assets/css/locationBar.css';
import './assets/css/grid-main2.css';
import './assets/css/weather.css';

// css from npm package weather-icons
import './assets/css/weather-icons.css';
import './assets/css/weather-icons-wind.css';

  /*   state boolean values control  which components are rendered and displayed
        home, about, mainView and locationBar

        home: initial view of app
              includes titleBar, navbar3
              home and locationBar can be true at the same time, but about and mainView are false
              when about is true; home, mainView and locationBar are false
              when mainView is tru;  home, about and locationBar are false

        about: blog and about WeatherX app page

        geoCoding and geoLocation : indicate which method used to pinpoint which location to get forecastData for
   */

export default class Middle extends Component {

  constructor(props) {
    super(props);

    this.state = {
      home: true,
      about: false,
      inputForm: true,
      controlsForm: false,
      mainView: false,
      locationBar:false,
      geoLocation: false,
      geoCoding: false,
      errInputMsg: false,
      removeLocation: false,
      inputValue: ''
    }; // initial state components

    this.backendServer = {
      url: `/weather`
    };


    // clock, time, date conversion, date formatting methods
    this.getUpToSecDateOfLocation = this.getUpToSecDateOfLocation.bind(this);
    this.getTZhours = this.getTZhours.bind(this);
    this.formatTime = this.formatTime.bind(this);
    this.getCurrentTimeAtLocation = this.getCurrentTimeAtLocation.bind(this);
    this.getHourOfDay = this.getHourOfDay.bind(this);
    this.whatDayIsIt = this.whatDayIsIt.bind(this);

    // data integration and processing methods
    this.getHourlyConditions = this.getHourlyConditions.bind(this);
    this.getDailyConditions = this.getDailyConditions.bind(this);
    this.pickOutDataPoints = this.pickOutDataPoints.bind(this);
    this.pickOutDailyDataPoints = this.pickOutDailyDataPoints.bind(this);
    this.setMainViewBackGround = this.setMainViewBackGround.bind(this);
    this.setLocationBarBackGround = this.setLocationBarBackGround.bind(this);
    this.checkDay = this.checkDay.bind(this);
    this.getLiveFormatedTime = this.getLiveFormatedTime.bind(this);
    this.displayNewLocFirst = this.displayNewLocFirst.bind(this);
    this.createGridItem = this.createGridItem.bind(this);

    // temp conversion
    this.tempTypeConversion = this.tempTypeConversion.bind(this);

    // main app methods
    this.handleNavClick = this.handleNavClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleNavSubmit = this.handleNavSubmit.bind(this);
    this.showMeThisOne = this.showMeThisOne.bind(this);
    this.removeLocation = this.removeLocation.bind(this);
  }

  componentDidMount(){ // contructing app's Data
    this.appData = {
      removeLocation:0,
      errMsg: '',
      err: false,
      geoCodeThis:'',
      showMeThisOne:'',
      notADuplicateLocation:true,
      date: new Date(),
      currentDay:[],
      currentDayIndex: 0,
      forecastData: [],
      locationData: [],
      locationName: [],
      availLocationsArray: [],
      mainViewBackGround: [],
      locationBarBackGround: [],
      locationCount: 0,
      currentLocation:'',
      currentForecast: {},
      currentLocationData: [],
      hourlyConditions: [],
      dailyConditions: [],
      weatherConditions: {
        cloud:false,
        fog:false,
        hurrican:false,
        partlyCloudy:false,
        rain:false,
        sun:false,
        snow:false,
        scatteredShowers:false,
        thunder:false,
        wind:false,
      },
      weatherIcon:{},
      fahrenheitType:true,
      fahrenheitFont:"°F",
      celsiusType:true,
      celsiusFont:"°C"
    };
  };

  componentWillUnmount(){ // destroy app and it's data when unloading app
    clearInterval(this.appData.interval);
    this.appData = null;
  };

  // may use dayJs-ext or moment0-timezone for timezone time adjustment
  // For now, using my own custom code to adjust from UTC to timezone offset of location

  getUpToSecDateOfLocation(dateInt){
    // for whatever reason, the hourly timestamps need extra 000's to be a full timestamp
   return new Date(dateInt * 1000);
  }

  checkDay(dateInt, tz, sunset, sunrise){
    // dont need actual current time
    // need to calc whether for a given hour of the day...
    // for specific location,
    // given that timezone sunrise and sunset time
    // ..is it nighttime or daytime

    // getTZhours usess getUTCHours, which returns a 36 hr/day hour
    // but here I am correting for a 24 hour/day hour
    // so 24 hundred hours becomes, 0 hours, etc...
    const correct24hour = hrX => {
      if (hrX === 24){
       return 0;
      } else if (hrX > 24){
       return hrX - 24;
     } else {
       return hrX;
     }
    };

    let tzHrs = correct24hour(this.getTZhours(this.getUpToSecDateOfLocation(dateInt), tz));
    let tzSunset = correct24hour(this.getTZhours(this.getUpToSecDateOfLocation(sunset), tz));
    let tzSunrise = correct24hour(this.getTZhours(this.getUpToSecDateOfLocation(sunrise), tz));

    if(tzHrs > tzSunset || tzHrs <= tzSunrise ){
      return false;  // so it's night time in this timezone
    } else if ( tzHrs <= tzSunset && tzHrs >= tzSunrise) {
      return true; // so it's still daytime in this timezone
    }
  }

  getTZhours(dateInt, tz){ // get the UTChour() of a dateInt, then account for timezone offset

    let utc = dateInt.getUTCHours();
    let hrs;

    if (tz < 0){
      tz = Math.abs(tz);
      if (utc < 12 ){
        utc = utc + 24
        hrs = utc - tz;
      } else if (utc === 0){
        hrs = utc - tz;
        hrs = 24 - tz
      } else {
        hrs = utc - tz;
      }

    } else {
        hrs = utc + tz;
    }

    return hrs; // is a 36 hours/day hour

  }

  formatTime(hrs, mins, secs){  // format the time so it can be displayed as hh:mm:ss AM/PM

    hrs = Math.floor(hrs); // every once in awhile getTZhours return a floating point hour, 10.5 (??)

    if (secs){
      if (hrs > 24){
         hrs = hrs - 24;
         return `${hrs}:${mins}:${secs} PM`;
      } else if (hrs > 12){
         hrs = hrs - 12;
         return `${hrs}:${mins}:${secs} PM`;
      } else if (hrs === 24){
         hrs = 12;
         return `${hrs}:${mins}:${secs} AM`;
      } else if (hrs === 12){
         return `${hrs}:${mins}:${secs} PM`;
      } else if (hrs <= 11){
         return `${hrs}:${mins}:${secs} AM`;
      }
    } else if (mins){
      if (hrs > 24){
         hrs = hrs - 24;
         return `${hrs}:${mins} PM`;
      } else if (hrs > 12){
         hrs = hrs - 12;
         return `${hrs}:${mins} PM`;
      } else if (hrs === 24){
         hrs = 12;
         return `${hrs}:${mins} AM`;
      } else if (hrs === 12){
         return `${hrs}:${mins} PM`;
      } else if (hrs <= 11){
         return `${hrs}:${mins} AM`;
      }
    } else {
      if (hrs > 24){
         hrs = hrs - 24;
         return `${hrs} AM`;
      } else if (hrs > 12 && hrs < 24){
         hrs = hrs - 12;
         return `${hrs} PM`;
      }  else if(hrs === 24){
         hrs = 12;
         return `${hrs} AM`;
      } else if (hrs === 12){
         return `${hrs} PM`;
      } else if (hrs <= 11){
         return `${hrs} AM`;
      }
    }
  }

  getLiveFormatedTime(dateInt, tz){ // get the time, given utc hr, min and secs and the timezone, for given location
    let date = dateInt;
    let hrs, mins, secs;

    hrs = this.getTZhours(date, tz);

    mins = date.getUTCMinutes();
    if (mins < 10) {
      mins = "0" + mins;
    }

    secs = date.getUTCSeconds();
    if (secs < 10) {
      secs = "0" + secs;
    }

    return this.formatTime(hrs, mins, secs);

  }

  getCurrentTimeAtLocation(dateInt, tz){ // get the time, given utc hr, min and the timezone, for given location
    let date = this.appData.date;
    let hrs, mins;

    hrs = this.getTZhours(date, tz);

    mins = date.getUTCMinutes();
    if (mins < 10) {
      mins = "0" + mins;
    }

    return this.formatTime(hrs, mins);

  }

  getHourOfDay(dateInt, tz){ // return the hours of the day, for 00 hours, return day of week
    // get hour of day, given utc hour and timezone offset for a given location
    // if it's 12 AM, or midnight, return the day of week instead

    // used in hourly conditions mainView table component
    const today = this.getUpToSecDateOfLocation(dateInt);

    let hrs = this.getTZhours(today, tz);
    let hourOfDay = this.formatTime(hrs);
    let nextDay;

    this.appData.currentDay = [...this.appData.currentDay, this.whatDayIsIt(dateInt, tz)];
    this.appData.currentDayIndex = this.appData.currentDay.length - 1;
    let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    if (hourOfDay === '0 AM' || hourOfDay === '12 AM'){
        nextDay = this.appData.currentDay[this.appData.currentDayIndex];
        return daysOfWeek[nextDay];
    } else {
      return hourOfDay;
    }
  }

  whatDayIsIt(dateInt, utcOffSet){ // what day is it for a given timezone, based on UTC time

    // returns a timeStamp using the dateInt * 1000
    // the forecast.io timestamps needs to be * 1000 to be converted into a Date timeStamp
    // this.getUpToSecDateOfLocation(1550674800)
    const timeStamp = this.getUpToSecDateOfLocation(dateInt)

    let dayOfWeek;
    let utcHours = timeStamp.getUTCHours();

    if (utcOffSet === 0){

        dayOfWeek = timeStamp.getUTCDay();

    } else if (utcOffSet < 0){
          utcOffSet = Math.abs(utcOffSet);
          if ( (utcHours - utcOffSet) <  0 ){
            if (timeStamp.getUTCDay() === 0){
              dayOfWeek = 7 - 1;
            } else {
              dayOfWeek = timeStamp.getUTCDay() - 1;
            }
          } else {
            dayOfWeek = timeStamp.getUTCDay();
          }
    } else {
      if ( (utcHours + utcOffSet) >=  24 ){
        if (timeStamp.getUTCDay() === 6){
          dayOfWeek = 0;
        } else {
          dayOfWeek = timeStamp.getUTCDay() + 1;
        }
      } else {
        dayOfWeek = timeStamp.getUTCDay();
      }
    }

    // console.log(timeStamp, utcHours, utcOffSet, dayOfWeek);

    return dayOfWeek;


    // use the following array wherever calling this function
    // let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  }

  // temp type conversion method

  tempTypeConversion(tempF, tempNum){
    if (!tempF){
      // if not fahrenheit, then convert back to fahrenheit
      return Math.round((tempNum - 32 ) / 1.8);
    } else {
      return tempNum;
    }
     // wont need to convert fahrenheit back to celsius
     // but if so...
     // return Math.round((tempNum *  1.8) + 32);
  }

  // methods for integrating TomTom and Forecast.io results components

  pickOutDataPoints(dataObject, index){  // callback function for getHourlyConditions

    let day = this.checkDay(dataObject.time, this.appData.currentLocationData.utcOffSet, this.appData.currentLocationData.sunsetTime, this.appData.currentLocationData.sunriseTime);
    let hour =  this.getHourOfDay(dataObject.time, this.appData.currentLocationData.utcOffSet);
    let icon = dataObject.icon;
    let temp = this.tempTypeConversion(this.appData.fahrenheitType, Math.floor(dataObject.temperature));

    if (index === 0 ){
      return {
        day: day,     // datatype boolean
        hour: 'Now',  // datatype string
        icon: icon,   // datatype string
        temp: temp,   // datatype int
      };
    } else {
      return {
        day: day,    // datatype boolean
        hour: hour,  // datatype string
        icon: icon,  // datatype string
        temp: temp   // datatype int
      };
    }
  }

  pickOutDailyDataPoints(dataObject, index){ // calback function for getDailyConditions

      // let today = new Date();
      let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

      return {
        day: daysOfWeek[this.whatDayIsIt(dataObject.time, this.appData.currentLocationData.utcOffSet)],  // datatype string
        icon: dataObject.icon,            // datatype string
        tempLow: this.tempTypeConversion(this.appData.fahrenheitType, Math.floor(dataObject.temperatureLow)),   // datatype int
        tempHigh: this.tempTypeConversion(this.appData.fahrenheitType, Math.floor(dataObject.temperatureHigh)),   // datatype int
      };
    }

  getHourlyConditions(dataArray){ // for each hour in a locations forecast, return an object of datapoints
     return dataArray.map(this.pickOutDataPoints);
  }

  getDailyConditions(dataArray){ // for each day in a locations forecast, return an object of datapoints
    return dataArray.map(this.pickOutDailyDataPoints);
  }

  setMainViewBackGround(data){ // set appropriate background based on current weather condition

    let day = this.checkDay(data.currently.time, data.offset, data.daily.data[0].sunsetTime, data.daily.data[0].sunriseTime );
    let icon = data.currently.icon;

       if ( icon === 'cloudy' && day){
          return "cloudyDay"
        } else if ( icon === 'cloudy' && !day){
           return "cloudyNight"
        } else if ( icon === 'fog' && day){
          return "foggyDay";
        } else if ( icon === 'fog' && !day){
          return "foggyNight";
        } else if ( icon === 'partly-cloudy-day'){
          return "partlyCloudyDay";
        } else if ( icon === 'partly-cloudy-night'){
          return "partlyCloudyNight";
        } else if ( icon === 'rain' && day){
          return "rainyDay";
        } else if ( icon === 'rain' && !day){
          return "rainyNight";
        } else if ( icon === 'clear-day' && day){
          return "clearDay";
        } else if ( icon === 'clear-night' && !day){
          return "clearNight";
        } else if ( icon === 'snow' && day){
          return "snowyDay";
        } else if ( icon === 'snow' && !day){
          return "snowyNight";
        } else if ( icon === 'scattered-showers' && day ){
          return "rainyDay";
        } else if ( icon === 'scattered-showers' && !day ){
          return "rainyNight";
        } else if ( icon === 'thunder' && day ){
          return "thunderDay";
        } else if ( icon === 'thunder' && !day ){
          return "thunderNight";
        } else if ( icon === 'wind' && day ){
          return "windyDay";
        } else if ( icon === 'wind' && !day ){
          return "windyNight";
        }
  }

  setLocationBarBackGround(data){ // set appropriate background based on current weather condition

    let day = this.checkDay(data.currently.time, data.offset, data.daily.data[0].sunsetTime, data.daily.data[0].sunriseTime);
    let icon = data.currently.icon;

       if ( icon === 'cloudy' && day){
          return "locationBar-cloudyDay";
        } else if ( icon === 'cloudy' && !day){
           return "locationBar-cloudyNight";
        } else if ( icon === 'fog' && day){
          return "locationBar-foggyDay";
        } else if ( icon === 'fog' && !day){
          return "locationBar-foggyNight";
        } else if ( icon === 'partly-cloudy-day'){
          return "locationBar-partlyCloudyDay";
        } else if ( icon === 'partly-cloudy-night'){
          return "locationBar-partlyCloudyNight";
        } else if ( icon === 'rain' && day){
          return "locationBar-rainyDay";
        } else if ( icon === 'rain' && !day){
          return "locationBar-rainyNight";
        } else if ( icon === 'clear-day' && day){
          return "locationBar-clearDay";
        } else if ( icon === 'clear-night' && !day){
          return "locationBar-clearNight";
        } else if ( icon === 'snow' && day){
          return "locationBar-snowyDay";
        } else if ( icon === 'snow' && !day){
          return "locationBar-snowyNight";
        } else if ( icon === 'scattered-showers' && day ){
          return "locationBar-rainyDay";
        } else if ( icon === 'scattered-showers' && !day ){
          return "locationBar-rainyNight";
        } else if ( icon === 'thunder' && day ){
          return "locationBar-thunderDay";
        } else if ( icon === 'thunder' && !day ){
          return "locationBar-thunderNight";
        } else if ( icon === 'wind' && day ){
          return "locationBar-windyDay";
        } else if ( icon === 'wind' && !day ){
          return "locationBar-windyNight";
        }
  }

  // return a ampped array of div elements with location data inserted

  createGridItem(object, index){ // for mapping locationData, inserts currentConditions into a LocationBar Div, inserted into grid
    let currentConditions = this.appData.availLocationsArray[index];
    currentConditions.day = this.checkDay(currentConditions.timeStamp, currentConditions.utcOffSet, currentConditions.sunsetTime, currentConditions.sunriseTime);
    let weatherIcon;
      if ( currentConditions.icon === 'cloudy'  && currentConditions.day){
        weatherIcon = <i title={currentConditions.icon} style={{"fontSize" : "1em"}} key={index} className="wi wi-day-cloudy"></i>

      } else if ( currentConditions.icon === 'cloudy'  && !currentConditions.day){
        weatherIcon = <i title={currentConditions.icon} style={{"fontSize" : "1em"}} key={index} className="wi wi-night-alt-cloudy"></i>

      } else if ( currentConditions.icon === 'fog' && currentConditions.day){
        weatherIcon = <i title={currentConditions.icon} style={{"fontSize" : "1em"}} key={index} className="wi wi-day-fog"></i>

      } else if ( currentConditions.icon === 'fog' && !currentConditions.day){
        weatherIcon = <i title={currentConditions.icon} style={{"fontSize" : "1em"}} key={index} className="wi wi-night-fog"></i>

      } else if ( currentConditions.icon === 'partly-cloudy-day'){
        weatherIcon = <i title={currentConditions.icon} style={{"fontSize" : "1em"}} key={index}  className="wi wi-day-sunny-overcast"></i>

      } else if (currentConditions.icon === 'partly-cloudy-night'  ){
        weatherIcon = <i title={currentConditions.icon} style={{"fontSize" : "1em"}} key={index}  className="wi wi-night-alt-cloudy"></i>

      } else if ( currentConditions.icon === 'rain' && currentConditions.day){
        weatherIcon = <i title={currentConditions.icon} style={{"fontSize" : "1em"}} key={index} className="wi wi-day-rain"></i>

      } else if ( currentConditions.icon === 'rain' && !currentConditions.day){
        weatherIcon = <i title={currentConditions.icon} style={{"fontSize" : "1em"}} key={index} className="wi wi-night-alt-rain"></i>

      } else if ( currentConditions.icon === 'clear-day' && currentConditions.day ){
        weatherIcon = <i title={currentConditions.icon} style={{"fontSize" : "1em"}} key={index} className="wi wi-day-sunny"></i>

      } else if ( currentConditions.icon === 'clear' && currentConditions.day ){
        weatherIcon = <i title={currentConditions.icon} style={{"fontSize" : "1em"}} key={index} className="wi wi-day-sunny"></i>

      } else if ( currentConditions.icon === 'clear-day' && !currentConditions.day ){
        weatherIcon = <i title={currentConditions.icon} style={{"fontSize" : "1em"}} key={index} className="wi wi-night-clear"></i>

      } else if ( currentConditions.icon === 'clear' && !currentConditions.day ){
        weatherIcon = <i title={currentConditions.icon} style={{"fontSize" : "1em"}} key={index} className="wi wi-night-clear"></i>

      } else if (currentConditions.icon === 'clear-night'){
        weatherIcon = <i title={currentConditions.icon} style={{"fontSize" : "1em"}} key={index} className="wi wi-night-clear"></i>

      } else if ( currentConditions.icon === 'snow' && currentConditions.day ){
        weatherIcon = <i title={currentConditions.icon} style={{"fontSize" : "1em"}} key={index} className="wi wi-day-snow"></i>

      }  else if ( currentConditions.icon === 'snow' && !currentConditions.day ){
        weatherIcon = <i title={currentConditions.icon} style={{"fontSize" : "1em"}} key={index} className="wi wi-night-alt-snow"></i>

      } else if ( currentConditions.icon === 'scattered-showers' && currentConditions.day){
        weatherIcon = <i title={currentConditions.icon} style={{"fontSize" : "1em"}} key={index} className="wi wi-day-showers"></i>

      }else if ( currentConditions.icon === 'scattered-showers' && !currentConditions.day){
        weatherIcon = <i title={currentConditions.icon} style={{"fontSize" : "1em"}} key={index} className="wi wi-night-alt-showers"></i>

      } else if ( currentConditions.icon === 'thunder' && currentConditions.day){
        weatherIcon = <i title={currentConditions.icon} style={{"fontSize" : "1em"}} key={index} className="wi wi-day-thunderstorm"></i>

      }  else if ( currentConditions.icon === 'thunder' && !currentConditions.day){
        weatherIcon = <i title={currentConditions.icon} style={{"fontSize" : "1em"}} key={index} className="wi wi-night-alt-thunderstorm"></i>

      } else if ( currentConditions.icon === 'wind' && currentConditions.day){
        weatherIcon = <i title={currentConditions.icon} style={{"fontSize" : "1em"}} key={index} className="wi wi-day-windy"></i>

      } else if ( currentConditions.icon === 'wind' && !currentConditions.day){
        weatherIcon = <i title={currentConditions.icon} style={{"fontSize" : "1em"}} key={index} className="wi wi-night-alt-cloudy-gusts"></i>
      }

    return (
      <LocationBar
        locationCurrentTemp={Math.floor(this.appData.forecastData[index].data.currently.temperature)}
        locationCurrentTime={this.getCurrentTimeAtLocation(this.appData.forecastData[index].data.currently.time, this.appData.forecastData[index].data.offset)}
        locationCurrentName={`${this.appData.locationData[index].data.city}, ${this.appData.locationData[index].data.province}`}
        appData={this.appData}
        key={index}
        indexno={index} value={this.appData.locationData[index]}
        showMeThisOne={this.showMeThisOne}
        getCurrentTimeAtLocation={this.getCurrentTimeAtLocation}
        getUpToSecDateOfLocation={this.getUpToSecDateOfLocation}
        getLiveFormatedTime={this.getLiveFormatedTime}
        tempTypeConversion={this.tempTypeConversion}
        handleNavClick={this.handleNavClick}
        wi = {weatherIcon}
        />
    );
  }

  displayNewLocFirst(){ // reverse the array of locationBar grid items, so new locations appear at the top

    if (this.state.removeLocation){
      this.removeLocation(this.appData.removeIndexNo);
    }

    if (this.state.locationBar){
      let arrayOfElements = this.appData.locationData.map(this.createGridItem);
      arrayOfElements.reverse();
      return arrayOfElements;
    }
  }

  removeLocation(locationIndex){
    // using a given index, splice all arrays with the effect of removing that location
    this.appData.locationData.splice(locationIndex, 1);
    this.appData.locationName.splice(locationIndex, 1);
    this.appData.forecastData.splice(locationIndex, 1);
    this.appData.availLocationsArray.splice(locationIndex, 1);
    this.appData.locationBarBackGround.splice(locationIndex, 1);
    this.appData.mainViewBackGround.splice(locationIndex, 1);
    this.appData.locationCount = this.appData.locationData.length;
  }

  // responding to UI events

  handleInputChange(event) {
    event.preventDefault();
    if (!event.target.value){
      this.appData.geoCodeThis = ''
    } else {
      this.appData.geoCodeThis = event.target.value;
      this.setState({
        inputValue: event.target.value,
        errInputMsg: false
      })
    }
  }

  handleNavClick(event, removeIndexNo) {

    // for clicks other than the submit of the NavBar3/input form
    // check source element's title and set state appropriatly
   event.preventDefault();

   if (event.target.title === 'backHome'){
      this.setState({
        home: true,
        about: false,
        mainView: false,
        locationBar:true,
        inputForm: false,
        controlsForm: true,
        removeLocation: false,
        errInputMsg: false,
        inputValue: ''
      });
    } else if (event.target.title === 'Find Me'){
      this.setState({
        home: true,
        about: false,
        mainView: false,
        locationBar:true,
        inputForm: false,
        controlsForm: true,
        removeLocation: false,
        errInputMsg: false,
        inputValue: ''
      });
    } else if (event.target.title === 'About WeatherX'){
      this.setState({
        home: false,
        about: true,
        mainView: false,
        locationBar:false,
        inputForm: false,
        controlsForm: true,
        removeLocation: false,
        errInputMsg: false,
        inputValue: ''
      })
    } else if (event.target.title === 'locationBar'){
      this.setState({
        home: false,
        about: false,
        mainView: true,
        locationBar: false,
        inputForm: false,
        controlsForm: true,
        removeLocation: false,
        errInputMsg: false,
        inputValue: ''
      });
    } else if (event.target.title === "Add Location"){
      this.setState({
        home: true,
        about: false,
        mainView: false,
        locationBar: true,
        inputForm: true,
        controlsForm: false,
        removeLocation: false,
        errInputMsg: false,
        inputValue: ''
      });
    } else if (event.target.title === "Celsius"){
     this.setState({
      home: true,
      about: false,
      mainView: false,
      locationBar: true,
      inputForm: false,
      controlsForm: true,
      removeLocation: false,
      errInputMsg: false,
      inputValue: ''
    });
    this.appData.celsiusType=true;
    this.appData.fahrenheitType=false;
    } else if (event.target.title === "Fahrenheit"){
      this.setState({
        home: true,
        about: false,
        mainView: false,
        locationBar: true,
        inputForm: false,
        controlsForm: true,
        removeLocation: false,
        errInputMsg: false,
        inputValue: ''
      });
      this.appData.celsiusType=false;
      this.appData.fahrenheitType=true;
    } else if (event.target.title === "remove"){

      // if no more locations, don't render the ControlsForm div
      if (this.appData.locationCount == 1){

        this.setState({
          home: true,
          about: false,
          inputForm: true,
          controlsForm: false,
          mainView: false,
          locationBar:false,
          geoLocation: false,
          geoCoding: false,
          errInputMsg: false,
          removeLocation: false,
          inputValue: ''
        });

      } else {

        this.setState({
           home: true,
           about: false,
           mainView: false,
           locationBar: true,
           inputForm: false,
           controlsForm: true,
           removeLocation: true,
           errInputMsg: false,
           inputValue: ''
         });

      }
     this.appData.removeIndexNo = removeIndexNo;
    }
  }

  handleNavSubmit(event) {

    event.preventDefault();

    // would like a comprehesive global list of city, province, country names...
    // but for now ...
    // regexps for basic input validation
    // for now just checking for comma delimited location like...city, state
    const lookForCommaBetween = /,(?=[\sA-Za-z])/g;
    // for any input that start with a comma
    const lookForCommaAtBeginning = /^,(?=[\sA-Za-z])/g;
    // and for numbers anywhere in the input
    const findNumbers = /[0-9]+/g;

    // check for dups, if input is a dup, set notADuplicateLocation to false
    const compareLocationName = (item, index) => {

      // first isolate city, province and the make Upper Case
      const findEachWord = /[\sA-Za-z]+/g;

      const locationCity = item.match(findEachWord)[0].toUpperCase();
      const locationProvice = item.match(findEachWord)[1].toUpperCase();
      const compareLocationName = `${locationCity}, ${locationProvice}`;

      const city = this.appData.geoCodeThis.match(findEachWord)[0].toUpperCase();
      const province = this.appData.geoCodeThis.match(findEachWord)[1].toUpperCase();
      const compareInput = `${city}, ${province}`;

      // then compare
      if (compareLocationName === compareInput){
        this.appData.notADuplicateLocation = false;
      } else {
        this.appData.notADuplicateLocation = true;
      }
    };

    // do basic input validation
      if ( this.appData.geoCodeThis === '' || this.appData.geoCodeThis.match(lookForCommaBetween) == null || this.appData.geoCodeThis.match(lookForCommaAtBeginning) !== null || this.appData.geoCodeThis.match(findNumbers) !== null ){

       this.setState({
         home: true,
         about: false,
         mainView: false,
         locationBar: true,
         inputControls: false,
         controlsForm: true,
         removeLocation: false,
         errInputMsg: true,
         noDupsMsg: false,
         inputValue: ''
       });

      } else {

       // so only want to get and forecast data for a new location

        // if there are other names in the locationData array.. compare each of these also
        if (this.appData.locationName.length > 0){
          this.appData.locationName.forEach(compareLocationName);
        }

        // if no dups, then we have a new valid location
        if (this.appData.notADuplicateLocation){

            this.requestDataFromServer(this.appData.geoCodeThis);
            this.appData.geoCodeThis = '';

        } else {

          this.setState({
            home: true,
            about: false,
            mainView: false,
            locationBar: true,
            inputForm: false,
            controlsForm: true,
            removeLocation: false,
            errInputMsg: false,
            noDupsMsg: true,
            inputValue: ''
          });

        }

      }

  }

  // this method builds the arrays needed to to display each location's forecast data

  showMeThisOne(locationName, index, event){
      event.preventDefault();

      // have forecastData ready ... now set mainView to true
      this.appData.currentLocationData = {
          index: index,
          name: `${this.appData.locationData[index].data.city}, ${this.appData.locationData[index].data.province}`,
          sunsetTime: this.appData.forecastData[index].data.daily.data[0].sunsetTime,
          sunriseTime: this.appData.forecastData[index].data.daily.data[0].sunriseTime,
          utcOffSet: this.appData.forecastData[index].data.offset,
          time: this.getCurrentTimeAtLocation(this.appData.forecastData[index].data.currently.time, this.appData.forecastData[index].data.offset),
          temp: this.tempTypeConversion(this.appData.fahrenheitType, Math.floor(this.appData.forecastData[index].data.currently.temperature)),
          day: this.checkDay(this.appData.forecastData[index].data.currently.time, this.appData.forecastData[index].data.offset, this.appData.forecastData[index].data.daily.data[0].sunsetTime, this.appData.forecastData[index].data.daily.data[0].sunriseTime),
          icon: this.appData.forecastData[index].data.currently.icon
        };

       this.appData.currentForecast = this.appData.forecastData[index].data;
       this.appData.hourlyConditions = this.getHourlyConditions(this.appData.forecastData[index].data.hourly.data);
       this.appData.dailyConditions = this.getDailyConditions(this.appData.forecastData[index].data.daily.data);

      this.setState({
        home: false,
        about: false,
        mainView: true,
        locationBar: false,
        inputForm: false,
        controlsForm: true,
        removeLocation: false,
        errInputMsg: false,
        noDupsMsg: false,
        inputValue: ''
      })

  }

  // this method makes an apicall, get request, to the backendServer
  // only handleNavSubmit calls this method
  // never called by other methods or components

  // this methods is also the only method that adds a location
  requestDataFromServer(location){

      // once we have a valid location... get forecast data from backendServer

    axios.get(`${this.backendServer.url}:${location}`)
          .then(response => {
            let newForecast = {  // save new current foreeast
              timeStamp: Date.now(),
              data: response.data
            }

            // currentLocation will always be the latest one entered, so new locationBar will be rendered for it
            // index of locationName array should always match index of forecastData array

                this.appData.forecastData = [...this.appData.forecastData, newForecast.data.mostRecentForecast];
                this.appData.locationData =  [...this.appData.locationData, newForecast.data.mostRecentLocation];
                this.appData.locationName = [...this.appData.locationName, `${newForecast.data.mostRecentLocation.data.city}, ${newForecast.data.mostRecentLocation.data.province}`];
                this.appData.currentLocationData = {
                  index: this.appData.forecastData.length,
                  name: `${newForecast.data.mostRecentLocation.data.city}, ${newForecast.data.mostRecentLocation.data.province}`,
                  sunsetTime: newForecast.data.mostRecentForecast.data.daily.data[0].sunsetTime,
                  sunriseTime: newForecast.data.mostRecentForecast.data.daily.data[0].sunriseTime,
                  utcOffSet: newForecast.data.mostRecentForecast.data.offset,
                  time: this.getCurrentTimeAtLocation(newForecast.data.mostRecentForecast.data.currently.time, newForecast.data.mostRecentForecast.data.offset),
                  day: this.checkDay(newForecast.data.mostRecentForecast.data.currently.time, newForecast.data.mostRecentForecast.data.offset, newForecast.data.mostRecentForecast.data.daily.data[0].sunsetTime, newForecast.data.mostRecentForecast.data.daily.data[0].sunriseTime),
                  temp: Math.floor(newForecast.data.mostRecentForecast.data.currently.apparentTemperature),
                  icon:`${newForecast.data.mostRecentForecast.data.currently.icon}`
                };
                this.appData.availLocationsArray = [...this.appData.availLocationsArray, {
                  index: this.appData.forecastData.length,
                  name: `${newForecast.data.mostRecentLocation.data.city}, ${newForecast.data.mostRecentLocation.data.province}`,
                  utcOffSet: newForecast.data.mostRecentForecast.data.offset,
                  timeStamp: newForecast.data.mostRecentForecast.data.currently.time,
                  sunsetTime: newForecast.data.mostRecentForecast.data.daily.data[0].sunsetTime,
                  sunriseTime: newForecast.data.mostRecentForecast.data.daily.data[0].sunriseTime,
                  time: this.getCurrentTimeAtLocation(newForecast.data.mostRecentForecast.data.currently.time, newForecast.data.mostRecentForecast.data.offset),
                  day: this.checkDay(newForecast.data.mostRecentForecast.data.currently.time, newForecast.data.mostRecentForecast.data.offset, newForecast.data.mostRecentForecast.data.daily.data[0].sunsetTime, newForecast.data.mostRecentForecast.data.daily.data[0].sunriseTime),
                  temp: Math.floor(newForecast.data.mostRecentForecast.data.currently.apparentTemperature),
                  icon:`${newForecast.data.mostRecentForecast.data.currently.icon}`
                }];
                this.appData.locationCount = this.appData.locationCount + 1;
                this.appData.mainViewBackGround = [...this.appData.mainViewBackGround, this.setMainViewBackGround(newForecast.data.mostRecentForecast.data)];
                this.appData.locationBarBackGround =  [...this.appData.locationBarBackGround, this.setLocationBarBackGround(newForecast.data.mostRecentForecast.data)];

              // refreshing state of main components
              // requestDataFromServer is only called by NavBar3's submit form
              this.setState({
                home: true,
                about: false,
                mainView: false,
                locationBar:true,
                inputForm: false,
                controlsForm: true,
                errInputMsg: false,
                noDupsMsg: false,
                inputValue: ''
              });

          }).catch(err => {

            // No Chewy, THAT one goes there, THIS one goes here.... AAGH AANGH!
            this.setState(
              {
                errMsg: err
              }
            )
          });
  }

  render(){
   return(

    <div className="middle middle-grid-container">
      <TitleBar />
      <NavBar3
        navState={this.state}
        appData={this.appData}
        handleNavClick={this.handleNavClick}
        handleInputChange={this.handleInputChange}
        handleNavSubmit={this.handleNavSubmit}
        getCurrentLocation={this.getCurrentLocation}
        />
      <div className='middle-grid-item-2'>
        {this.displayNewLocFirst()}
      </div>
      <MainView
        navState={this.state}
        appData={this.appData}
        whatDayIsIt={this.whatDayIsIt}
        />
    </div>
   );
  }

}
