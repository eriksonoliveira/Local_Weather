
 /*if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition(location);
}

function location(position){
  console.log(position);
*/

$(document).ready(function() {

  //Call ip-api to get user's location
  $.getJSON("http://ip-api.com/json", function(geop) {

    var latitude = geop.lat;
    var longitude = geop.lon;
    var city = geop.city;
    var country = geop.countryCode;
    var locationName = $("<span>" + city + ", " + country + "</span>");
    //console.log(latitude + ' ' + longitude);

    //call openweathermap to get current weather information
    $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&APPID=9ad8257fe3d7737f364b3b1ea8e7cc53', function(currWeather) {
      //console.log(currWeather);

      //Set the weather variables from the JSON data
      var tCelsius = "<span>" + calcTempC(currWeather.main.temp_max) + "</span>";
      var tFahrenheit = "<span>" + Math.round(calcTempF(currWeather.main.temp_max)) + "</span>";

      var weatherIcon = currWeather.weather[0].icon;
      var description = currWeather.weather[0].description;
      var windsp = Math.round(currWeather.wind.speed);
      var winddir = Math.round(currWeather.wind.deg);
      var humidity = currWeather.main.humidity;

      //add to the page the city and country names and current weather for the user's location
      $("#cityName").html(locationName);
      $("#temp").html(tCelsius);
      $(".degrees").addClass("wi wi-degrees");
      $("#tUnits > a, #today").show();
      $("#wind").html("Wind <i class=\"wi wi-wind from-" + winddir + "-deg\"></i>  " + windsp + " m/s");
      $("#RU").append("<i class=\"wi wi-humidity\"></i> Humidity " + humidity + "%");

      //add icon and weather description to the page
      $("#icon").addClass(iconsList[weatherIcon]);    
      //condition text
      description = uppercase(description);      
      $("#condition").html(description);  


      //Call openweather API for forecast data
      $.get('http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + latitude + '&lon=' + longitude +'&cnt=3&APPID=9ad8257fe3d7737f364b3b1ea8e7cc53', function(forecWeather) {
        //console.log(forecWeather);

        //calculate temp in Celsius and Fahrenheit for forecast data
      function tMaxCelsius(j) { return calcTempC(forecWeather.list[j].temp.max) + "<i class=\"wi wi-degrees\"></i>";}
      function tMaxFahrenheit(k) { return calcTempF(forecWeather.list[k].temp.max) + "<i class=\"wi wi-degrees\"></i>";}
      function tMinCelsius(l) {return calcTempC(forecWeather.list[l].temp.min) + "<i class=\"wi wi-degrees\"></i>";}
      function tMinFahrenheit(m) { return calcTempF(forecWeather.list[m].temp.min) + "<i class=\"wi wi-degrees\"></i>";}
      //console.log(tMinCelsius(1));

        //insert forecast data on the page
        //High
        $.each($('.tMax'), function(index, value) {
          $(this).html(tMaxCelsius(index));
        });

        //unitForecSwitch('.tMax', '#tempC', '#tempF', tMaxCelsius, tMaxFahrenheit);

        //Low
        $.each($('.tMin'), function(index, value) {
          $(this).html(tMinCelsius(index));
        });

        //weather condition
        $.each($(".iconF"), function(index, value) {
          var forecIcon = forecWeather.list[index].weather[0].icon;
          $(this).addClass(iconsList[forecIcon]);
        });

        //Condition text
        $.each($(".condF"), function(index, value) {
          var forecDescr = forecWeather.list[index].weather[0].description;
          //Make sure description fits the space
          if ((forecDescr == "heavy intensity rain") || (forecDescr == "very heavy rain"))
            {forecDescr = "heavy rain";}

          forecDescr = uppercase(forecDescr);
          $(this).html(forecDescr);
        });

        //write the days of the week for the forecast
        var d = new Date();
        var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

        $.each($(".day"), function(index, value) {
          var nextDay = new Date(d.getTime() + 86400 * 1000 * (index + 1));
          //console.log(nextDay);
          $(this).html(days[nextDay.getDay()]);
        });

        //Toggle between Celsius and Fahrenheit on click
        unitSwitch(tCelsius, tFahrenheit, tMaxCelsius, tMaxFahrenheit, tMinCelsius, tMinFahrenheit);

      });

    });

  });
  
});

  //WEATHER ICONS LIST AND FUNCTIONS

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

  function calcTempF(tempK) {
    return Math.round((tempK *9/5) - 459.67);
  }


  //Iterate through forec days and change temp unit
  function forecUnitSwitch(elem, tempSwitch){
    $.each($(elem), function(index, value) {
      $(this).html(tempSwitch(index));
    });
  }

  //toggle between celsius and Fahrenheit
  var unitSwitch = function(tC, tF, tMaxForecCel, tMaxForecFah, tMinForecCel, tMinForecFah){
    $('#tempF').on('click', function() {
      if ($('#tempC').hasClass("selected")) {
        //Current temp
        $('#temp').html(tF);
        //tMax forecast
        forecUnitSwitch('.tMax', tMaxForecFah);
        //tMin forecast
        forecUnitSwitch('.tMin', tMinForecFah);

        //Change the class of the unit buttons
        $('#tempC').removeClass("selected").addClass("unselected");
        $('#tempF').removeClass("unselected").addClass("selected");
      }
    });

    $('#tempC').on('click', function() {
      if ($('#tempF').hasClass("selected")) {
        //Current temp
        $('#temp').html(tC);
        //tMax forecast
        forecUnitSwitch('.tMax', tMaxForecCel);
        //tMin forecast
        forecUnitSwitch('.tMin', tMinForecCel);

        //Change the class of the unit buttons
        $('#tempF').removeClass("selected").addClass("unselected");
        $('#tempC').removeClass("unselected").addClass("selected");
      }
    });
  }
