
 /*if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition(location);
}

function location(position){
  console.log(position);
*/

$(document).ready(function() {

  /***Call ip-api to get user's location***/
  $.getJSON("http://ip-api.com/json", function(geop) {

    var latitude = geop.lat;
    var longitude = geop.lon;
    var city = geop.city;
    var country = geop.countryCode;
    var locationName = $("<span>" + city + ", " + country + "</span>");
    //console.log(latitude + ' ' + longitude);

    /***call openweathermap to get current weather information***/
    $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&APPID=9ad8257fe3d7737f364b3b1ea8e7cc53', function(currWeather) {
      //console.log(currWeather);

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
      //$("#main").addClass("a01n");


      /***Call openweather API for forecast data***/
      $.get('http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + latitude + '&lon=' + longitude +'&cnt=3&APPID=9ad8257fe3d7737f364b3b1ea8e7cc53', function(forecWeather) {
        //console.log(forecWeather);

      /***calculate temp in Celsius and Fahrenheit for forecast data***/
      function tMaxCelsius(j) { return calcTempC(forecWeather.list[j].temp.max) + "<i class=\"wi wi-degrees\"></i>";}
      function tMaxFahrenheit(k) { return calcTempF(forecWeather.list[k].temp.max) + "<i class=\"wi wi-degrees\"></i>";}
      function tMinCelsius(l) {return calcTempC(forecWeather.list[l].temp.min) + "<i class=\"wi wi-degrees\"></i>";}
      function tMinFahrenheit(m) { return calcTempF(forecWeather.list[m].temp.min) + "<i class=\"wi wi-degrees\"></i>";}
      //console.log(tMinCelsius(1));

      /***insert forecast data on the page***/
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


      /****Create array to store temperature and date*****/
      /*******************************/
      var temps = [];

      for ( i = 0; i < forecWeather.list.length; i++) {
        var maT = calcTempC(forecWeather.list[i].temp.max),
            miT = calcTempC(forecWeather.list[i].temp.min);
        temps.push({
          max: maT,
          min: miT,
          day: null
        });
      }


      /***Write the days of the week for the forecast***/
      var d = new Date();
      var week = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

      $.each($(".day"), function(index, value) {
        var gettDay = new Date(d.getTime() + 86400 * 1000 * (index));
        //console.log(nextDay);
        var weekDay = week[gettDay.getDay()];
        var weekDayTime = gettDay.getTime();
        $(this).html(weekDay);
        temps[index].day = weekDayTime;

        //var date = gettDay.getMonth() + " " + gettDay.getDate() + " " + gettDay.getFullYear();
        //var date = gettDay.toDateString();
        //var patt = /(\w{3}) (\d{2}) (\d{4})/g;
        //var result = date.match(patt);
        //var a = gettDay.toJSON();

        //temps[index].day = result;

        //console.log(temps);
      });

      /******DRAW TEMPERATURE CHART*******/
        //Set margins, height and width
      var width, height, margin = {}, chartWidth, chartHeight;

      margin = {top: 20, right: 20, bottom: 50, left: 50};

      chartWidth = 500 - margin.left - margin.right;
      chartHeight = 200 - margin.top - margin.bottom;

      width = chartWidth + margin.left + margin.right;
      height = chartHeight + margin.top + margin.bottom;


      temps.forEach(function(d){
        d.day = (new Date(d.day));
        d.max = +d.max;
        d.min = +d.min;
      });

      var timeFormat = d3.time.format('%a %d');

      var x = d3.time.scale()
        .range([0, chartWidth]);

      var y = d3.scale.linear()
        .range([chartHeight, 0]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(d3.time.hour, 12)
        .tickPadding(5)
        .outerTickSize(0)
        .tickFormat(timeFormat);

      x.domain(d3.extent(temps, function(d) { return new Date(d.day); }));

      var maxY = d3.max(temps, function(d) { return d.max; });
      var minY = d3.min(temps, function(d) { return d.min -2; });

      y.domain([minY, maxY]);

      var graph = d3.select("#graph").append("svg")
        //.attr("width", width + margin.left + margin.right)
        //.attr("height", height + margin.top + margin.bottom)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio", "xMinYMid meet")
        .append("g")
        .attr("transform", "translate(20, 30)");

      var line = d3.svg.line()
        .interpolate("cardinal")
        .x(function(d) { return x(new Date(d.day)); })
        .y(function(d) { return y(d.max); });

      var line2 = d3.svg.line()
        .interpolate("cardinal")
        .x(function(d) { return x(d.day) })
        .y(function(d) { return y(d.min) });
      graph.append("path")
        .data([temps])
        .attr("class", "line")
        .attr("d", line)
        .attr("stroke", "#000")
        .attr("stroke-width", 1.5)
        .attr("fill", "none");

      graph.append("path")
        .data([temps])
        .attr("class", "line")
        .attr("d", line2)
        .attr("stroke", "#838383")
        .attr("stroke-width", 1.5)
        .attr("fill", "none");

      graph.selectAll("dot")
        .data([temps])
        .enter().append("g")
        .attr("class", "dot")
        .selectAll("circle")
        .data(function(d) { return d; })
        .enter().append("circle")
        .attr("r", 3.5)
        .attr("fill", "#000")
        .attr("cx", function(d, i) { return x(d.day); })
        .attr("cy", function(d, i) { return y(d.max); });

      graph.selectAll("dot")
        .data([temps])
        .enter().append("g")
        .attr("class", "dot")
        .selectAll("circle")
        .data(function(d) { return d; })
        .enter().append("circle")
        .attr("r", 3.5)
        .attr("fill", "#838383")
        //.attr("stroke", "#08c")
        .attr("cx", function(d, i) { return x(d.day); })
        .attr("cy", function(d, i) { return y(d.min); });

      /*graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .attr("stroke", "#000")
        .call(xAxis);
        */


        /***Call method to toggle between Celsius and Fahrenheit on click event***/
        unitSwitch(tCelsius, tFahrenheit, tMaxCelsius, tMaxFahrenheit, tMinCelsius, tMinFahrenheit);


      });

    });

  });
  
});

  //WEATHER ICONS LIST AND FUNCTIONS

  //list of weather iconsbackg
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
  function forecUnitSwitch(elem, getTemp){
    $.each($(elem), function(index, value) {
      $(this).html(getTemp(index));
    });
  }

  //toggle between celsius and Fahrenheit
  var unitSwitch = function(tC, tF, tMaxForecCel, tMaxForecFah, tMinForecCel, tMinForecFah){
    //Fahrenheit
    $('#tempF').on('click', function() {
      if ($('#tempC').hasClass("selected")) {
        $("#temp, .tMax, .tMin").hide();
        //Current temp
        $('#temp').html(tF);
        //tMax forecast
        forecUnitSwitch('.tMax', tMaxForecFah);
        //tMin forecast
        forecUnitSwitch('.tMin', tMinForecFah);

        //Change the class of the unit buttons
        $('#tempC').removeClass("selected").addClass("unselected");
        $('#tempF').removeClass("unselected").addClass("selected");
        $("#temp, .tMax, .tMin").fadeIn(500);
      }
    });
    //Celsius
    $('#tempC').on('click', function() {
      if ($('#tempF').hasClass("selected")) {
        $("#temp, .tMax, .tMin").hide();
        //Current temp
        $('#temp').html(tC);
        //tMax forecast
        forecUnitSwitch('.tMax', tMaxForecCel);
        //tMin forecast
        forecUnitSwitch('.tMin', tMinForecCel);

        //Change the class of the unit buttons
        $('#tempF').removeClass("selected").addClass("unselected");
        $('#tempC').removeClass("unselected").addClass("selected");
        $("#temp, .tMax, .tMin").fadeIn(500);
      }
    });
  }
