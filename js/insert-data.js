/*Get weather data from API and populate the app*/

function insertData(latitude, longitude, locationName) {


  /***call openweathermap to get current weather information***/
  $.getJSON('https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&APPID=9ad8257fe3d7737f364b3b1ea8e7cc53', function (currWeather) {

    /***Set the weather variables from the received JSON data***/
    var tCelsius = "<span>" + calcTempC(currWeather.main.temp_max) + "</span>";
    var tFahrenheit = "<span>" + Math.round(calcTempF(currWeather.main.temp_max)) + "</span>";

    var weatherIcon = currWeather.weather[0].icon;
    var backgroundCol = "a" + weatherIcon.toString();
    var description = currWeather.weather[0].description;
    var windsp = Math.round(currWeather.wind.speed);
    var winddir = Math.round(currWeather.wind.deg);
    var humidity = currWeather.main.humidity;

    /***add to the page, the location and country names and current weather for the user's location***/
    $('#cityName').html(locationName);
    $('#temp').html(tCelsius);
    $('.degrees').addClass("wi wi-degrees");
    $('#tUnits > a').show();
    $('#wind').html("<i class=\"wi wi-wind from-" + winddir + "-deg\"></i>  " + windsp + " m/s");
    $('#RU').html("<i class=\"wi wi-humidity\"></i>" + "  " + humidity + "%");

    /***add weather icon and description to the page and change backgound***/
    //icon
    //    $('.icon').html("<span class='" + iconsList[weatherIcon] + "'></span>");
    //condition text
    description = uppercase(description);
    $('#condition').html(description);
    //background
    $('body').removeClass().addClass(backgroundCol);


    /***Call openweather API for forecast data***/
    $.get('https://api.openweathermap.org/data/2.5/forecast/daily?lat=' + latitude + '&lon=' + longitude + '&cnt=3&APPID=9ad8257fe3d7737f364b3b1ea8e7cc53', function (forecWeather) {
      /*Reset unit to Celsius*/
      toggleTempUnit('C', tCelsius, tFahrenheit, forecWeather);

      /***insert forecast data on the page***/
      //High
      $.each($('.tMax'), function (index, value) {
        $(this).html(tMaxCelsius(index, forecWeather));
      });

      //Low
      $.each($('.tMin'), function (index, value) {
        $(this).html(tMinCelsius(index, forecWeather));
      });

      //weather condition icon
      $.each($('.iconF'), function (index, value) {
        var forecIcon = forecWeather.list[index].weather[0].icon;
        $(this).html("<i class='" + iconsList[forecIcon] + "'></i>");
      });

      //Weather condition text
      $.each($('.condF'), function (index, value) {
        var forecDescr = forecWeather.list[index].weather[0].description;
        //Make sure description fits the space
        if ((forecDescr == "heavy intensity rain") || (forecDescr == "very heavy rain")) {
          forecDescr = "heavy rain";
        }

        forecDescr = uppercase(forecDescr);
        $(this).html(forecDescr);
      });

      /*Insert weekdays*/
      $.each($(".day"), function (index, value) {
        var day = getWeekdays(index);

        $(this).html(day.weekday);
      });

      /*Create temp chart*/
      //      createChart(forecWeather, calcTempMaxC, calcTempMinC);


      //toggle between celsius and Fahrenheit
      /******Fahrenheit******/
      //unbind is used, so that the event is not fired more than once
      $('#tempF').off('click').on('click', function () {
        toggleTempUnit('F', tCelsius, tFahrenheit, forecWeather)
      });

      /*Change temperatures on chart*/
      //        createChart(forecWeather, calcTempMaxF, calcTempMinF);
      //      });

      /******Celsius******/
      $('#tempC').off('click').on('click', function () {
        toggleTempUnit('C', tCelsius, tFahrenheit, forecWeather)
      });

      /*Change temperatures on chart*/
      //        createChart(forecWeather, calcTempMaxC, calcTempMinC);
      //      });
    });

  });
}
