function insertData(latitude, longitude, locationName) {

  /***call openweathermap to get current weather information***/
  $.getJSON('https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&APPID=9ad8257fe3d7737f364b3b1ea8e7cc53', function(currWeather) {

    /***Set the weather variables from the JSON data***/
    var tCelsius = "<span>" + calcTempC(currWeather.main.temp_max) + "</span>";
    var tFahrenheit = "<span>" + Math.round(calcTempF(currWeather.main.temp_max)) + "</span>";

    var weatherIcon = currWeather.weather[0].icon;
    var backgroundCol = "a" + weatherIcon.toString();
    var description = currWeather.weather[0].description;
    var windsp = Math.round(currWeather.wind.speed);
    var winddir = Math.round(currWeather.wind.deg);
    var humidity = currWeather.main.humidity;

    /***add to the page the city and country names and current weather for the user's location***/
    $("#cityName").html(locationName);
    $("#temp").html(tCelsius);
    $(".degrees").addClass("wi wi-degrees");
    $("#tUnits > a, #today").show();
    $("#wind").html("Wind <i class=\"wi wi-wind from-" + winddir + "-deg\"></i>  " + windsp + " m/s");
    $("#RU").append("<i class=\"wi wi-humidity\"></i>" + "  " + " Humidity " + humidity + "%");

    /***add weather icon and description to the page and change backgound***/
    //icon
    $("#icon").addClass(iconsList[weatherIcon]);
    //condition text
    description = uppercase(description);
    $("#condition").html(description);
    //background
    $("#main").addClass(backgroundCol);


    /***Call openweather API for forecast data***/
    $.get('https://api.openweathermap.org/data/2.5/forecast/daily?lat=' + latitude + '&lon=' + longitude +'&cnt=3&APPID=9ad8257fe3d7737f364b3b1ea8e7cc53', function(forecWeather) {

      /***calculate temp in Celsius and Fahrenheit for forecast data***/
//      function tMaxCelsius(j) { return calcTempMaxC(forecWeather.list[j].temp.max) + "<i class=\"wi wi-degrees\"></i>";}
//      function tMaxFahrenheit(k) { return calcTempMaxF(forecWeather.list[k].temp.max) + "<i class=\"wi wi-degrees\"></i>";}
//      function tMinCelsius(l) {return calcTempMinC(forecWeather.list[l].temp.min) + "<i class=\"wi wi-degrees\"></i>";}
//      function tMinFahrenheit(m) { return calcTempMinF(forecWeather.list[m].temp.min) + "<i class=\"wi wi-degrees\"></i>";}

      /***insert forecast data on the page***/
      //High
      $.each($('.tMax'), function(index, value) {
        $(this).html(tMaxCelsius(index, forecWeather));
      });

      //unitForecSwitch('.tMax', '#tempC', '#tempF', tMaxCelsius, tMaxFahrenheit);

      //Low
      $.each($('.tMin'), function(index, value) {
        $(this).html(tMinCelsius(index, forecWeather));
      });

      //weather condition icon
      $.each($(".iconF"), function(index, value) {
        var forecIcon = forecWeather.list[index].weather[0].icon;
        $(this).addClass(iconsList[forecIcon]);
      });

      //Weather condition text
      $.each($(".condF"), function(index, value) {
        var forecDescr = forecWeather.list[index].weather[0].description;
        //Make sure description fits the space
        if ((forecDescr == "heavy intensity rain") || (forecDescr == "very heavy rain"))
          {forecDescr = "heavy rain";}

        forecDescr = uppercase(forecDescr);
        $(this).html(forecDescr);
      });


      createChart(forecWeather, calcTempMaxC, calcTempMinC);

      /***Call method to toggle between Celsius and Fahrenheit on click event***/
//      unitSwitch(forecWeather, tCelsius, tFahrenheit, tMaxCelsius, tMaxFahrenheit, tMinCelsius, tMinFahrenheit);
      unitSwitch(forecWeather, tCelsius, tFahrenheit);

    });

  });
}
