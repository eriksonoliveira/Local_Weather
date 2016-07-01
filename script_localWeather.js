
 /*if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition(location);
}

function location(position){
  console.log(position);
*/
$(document).ready(function() {



  //Calls ip-api to get user's location
  $.getJSON("http://ip-api.com/json", function(geop) {

    var latitude = geop.lat;
    var longitude = geop.lon;
    var city = geop.city;
    var country = geop.countryCode;
    //console.log(latitude + ' ' + longitude);

    //calls openweathermap to get current weather information
    $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&APPID=9ad8257fe3d7737f364b3b1ea8e7cc53', function(currWeather) {
     // console.log(currWeather);

      //Sets the weather variables from the JSON data
      var tCelsius = "<span>" + calcTempC(currWeather.main.temp_max) + "</span>";
      var tFahrenheit = "<span>" + Math.round(calcTempF(currWeather.main.temp_max)) + "</span>";
      var weatherIcon = currWeather.weather[0].icon;
      var description = currWeather.weather[0].description;
      var windsp = Math.round(currWeather.wind.speed);
      var winddir = Math.round(currWeather.wind.deg);
      var humidity = currWeather.main.humidity;

      //adds to the page the city and country names and current weather for the user's location
      var locationName = $("<span>" + city + ", " + country + "</span>");
      $("#cityName").html(locationName);
      $("#temp").html(tCelsius);
      $(".degrees").addClass("wi wi-degrees");
      $("#wind").html("Wind <i class=\"wi wi-wind from-" + winddir + "-deg\"></i>  " + windsp + " m/s");
      $("#RU").append("<i class=\"wi wi-humidity\"></i> Umidity " + humidity + "%");

      //toggles between celsius and Fahrenheit
      unitSwitch('#temp', '#tempC', '#tempF', tCelsius, tFahrenheit);
      
      //adds icons and weather description to the page
      $("#icon").addClass(iconsList[weatherIcon]);    
    
      description = uppercase(description);      
      $("#condition").html(description);  
    
    });
    
    //Call openweather API for forecast data
    $.get('http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + latitude + '&lon=' + longitude +'&cnt=3&APPID=9ad8257fe3d7737f364b3b1ea8e7cc53', function(forecWeather) {
      
      //console.log(forecWeather);

      function tMaxCelsius(j) { return calcTempC(forecWeather.list[j].temp.max) + "<i class=\"wi wi-degrees\"></i>";}
      function tMaxFahrenheit(k) { return calcTempF(forecWeather.list[k].temp.max) + "<i class=\"wi wi-degrees\"></i>";}
      function tMinCelsius(l) {return calcTempC(forecWeather.list[l].temp.min) + "<i class=\"wi wi-degrees\"></i>";}
      function tMinFahrenheit(m) { return calcTempF(forecWeather.list[m].temp.min) + "<i class=\"wi wi-degrees\"></i>";}
      console.log(tMinCelsius(1));

      function unitForecSwitch(temp, tempC, tempF, tC, tF) {
        $(tempF).on('click', function(){
          if ($(tempC).hasClass("selected")) {
            console.log("Hello");
            $.each($(temp), function(index, value) {
              $(this).html(tF(index));
            });
          };
        });
        $(tempC).on('click', function() {
          if ($(tempF).hasClass("selected")) {
            console.log("Hello");
            $.each($(temp), function(index, value) {
              $(this).html(tC(index));
              console.log(tC(index));
            });
          };
        });
      }

      //insert forecast data on the page
      //High
      $.each($('.tMax'), function(index, value) {                  
        $(this).html(tMaxCelsius(index));
      });

      unitForecSwitch('.tMax', '#tempC', '#tempF', tMaxCelsius, tMaxFahrenheit);

      //Low
      $.each($('.tMin'), function(index, value) {
        $(this).html(tMinCelsius(index));
      });
    
      unitForecSwitch('.tMin', '#tempC', '#tempF', tMinCelsius, tMinFahrenheit);

      //weather condition
      $.each($(".iconF"), function(index, value) { 
        var forecIcon = forecWeather.list[index].weather[0].icon;
        $(this).addClass(iconsList[forecIcon]);
      });
      
      //Condition description
      $.each($(".condF"), function(index, value) { 
        var forecDescr = forecWeather.list[index].weather[0].description;
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
      
////////////////////////////////
      //test class
    /*  var Pessoa = function() {
        this.name = "nome";
        this.genero = "genero";
        console.log("Pessoa adicionada à lista");
      }
        Pessoa.prototype.dizerOla = function(){
          alert(this.name);
      }

      //obj
      var pessoa1 = new Pessoa();
      pessoa1.genero = 'masc';
      pessoa1.name = 'Erik';
      console.log(pessoa1.genero);
      pessoa1.dizerOla();*/
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

  //toggles between celsius and Fahrenheit
  var unitSwitch = function(temp, tempC, tempF, tC, tF){
    $(tempF).on('click', function() {
      if ($(tempC).hasClass("selected")) {
        $(temp).html(tF);
        $(tempC).removeClass("selected").addClass("unselected");
        $(tempF).removeClass("unselected").addClass("selected");
      }
    });

    $(tempC).on('click', function() {
      if ($(tempF).hasClass("selected")) {
        $(temp).html(tC);
        $(tempF).removeClass("selected").addClass("unselected");
        $(tempC).removeClass("unselected").addClass("selected");
      }
    });
  }
