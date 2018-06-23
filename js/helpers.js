  /*WEATHER ICONS LIST AND FUNCTIONS*/

  //list of weather icons
   var iconsList = {
    "01d" : "wi wi-day-sunny",
    "02d" : "wi wi-day-cloudy",
    "03d" : "wi wi-cloud",
    "04d" : "wi wi-cloudy",
    "09d" : "wi wi-showers",
    "10d" : "wi wi-day-rain",
    "11d" : "wi wi-thunderstorm",
    "13d" : "wi wi-snow",
    "50d" : "wi wi-fog",

    "01n" : "wi wi-night-clear",
    "02n" : "wi wi-night-alt-cloudy",
    "03n" : "wi wi-cloud",
    "04n" : "wi wi-cloudy",
    "09n" : "wi wi-showers",
    "10n" : "wi wi-night-alt-rain",
    "11n" : "wi wi-thunderstorm",
    "13n" : "wi wi-snow",
    "50n" : "wi wi-fog"
  }

  //Capitalize the fist letters of the weather description
  function uppercase(str) {
    str = str.split(' ');
    for (var i = 0; i < str.length; i++){
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    str = str.join(' ');
    return str;
  }

  //Calculate temperature in degrees
  function calcTempC(tempK) {
    return Math.round(tempK - 273.15);
  }

  function calcTempMaxC(tempK) {
    return Math.ceil(tempK - 273.15);
  }

  function calcTempMinC(tempK) {
    return Math.floor(tempK - 273.15);
  }

  function calcTempF(tempK) {
    return Math.round((tempK *9/5) - 459.67);
  }

  function calcTempMaxF(tempK) {
    return Math.ceil((tempK *9/5) - 459.67);
  }

  function calcTempMinF(tempK) {
    return Math.floor((tempK *9/5) - 459.67);
  }


  /*Iterate through forec days and change temp unit
    Receive element, forecast object and temperature method
  */
  function forecUnitSwitch(elem, forecWeather, getTemp){
    $.each($(elem), function(index, value) {
      $(this).html(getTemp(index, forecWeather));
    });
  }

  /***calculate temp in Celsius and Fahrenheit for forecast data***/
  function tMaxCelsius(j, forecWeather) { return calcTempMaxC(forecWeather.list[j].temp.max) + "<i class=\"wi wi-degrees\"></i>";}
  function tMaxFahrenheit(k, forecWeather) { return calcTempMaxF(forecWeather.list[k].temp.max) + "<i class=\"wi wi-degrees\"></i>";}
  function tMinCelsius(l, forecWeather) {return calcTempMinC(forecWeather.list[l].temp.min) + "<i class=\"wi wi-degrees\"></i>";}
  function tMinFahrenheit(m, forecWeather) { return calcTempMinF(forecWeather.list[m].temp.min) + "<i class=\"wi wi-degrees\"></i>";}
