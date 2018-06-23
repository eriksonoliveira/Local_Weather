/*PREPARE DATA AND CREATE CHART*/

function createChart(forecWeather, calcMaxTemp, calcMinTemp) {
  /*Clean chart area*/
  $("#graph").empty();

  /***Create array to store temperature and date***/
  var temps = [];

  for (i = 0; i < forecWeather.list.length; i++) {
    var maT = calcMaxTemp(forecWeather.list[i].temp.max),
      miT = calcMinTemp(forecWeather.list[i].temp.min);
    temps.push({
      max: maT,
      min: miT,
      day: null
    });
  }


  /***Push the days of the week into 'temps' array***/
  var d = new Date();
  var week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  $.each($(".day"), function (index, value) {
    var forecDay = new Date(d.getTime() + 86400 * 1000 * (index));
    var weekDay = week[forecDay.getDay()];
    var weekDayTime = forecDay.getTime();

    $(this).html(weekDay);
    temps[index].day = weekDayTime;

  });

  /***Draw the temperature chart***/
  createTempChart(temps);
}
