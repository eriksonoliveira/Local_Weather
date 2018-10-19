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
  $.each($(".day"), function (index, value) {
    var day = getWeekdays(index);

    temps[index].day = day.weekDayTime;

  });

  /***Draw the temperature chart***/
  createTempChart(temps);
}
