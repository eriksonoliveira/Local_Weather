$(document).ready(function() {


  /***Call ip-api to get user's location***/
//  $.getJSON("http://ip-api.com/json", function(geop) {
  $.getJSON("https://ipapi.co/json/", function(geop) {
  var latitude,
      longitude,
      city,
      country,
      locationName;

    /*Get location details*/
    latitude = geop.latitude;
    longitude = geop.longitude;
    city = geop.city;
    country = geop.country;
    locationName = $("<span>" + city + ", " + country + "</span>");

    /*Get weather data and add it to the page*/
    insertData(latitude, longitude, locationName);
//    unitSwitch(metData.forecWeather, metData.tCelsius, metData.tFahrenheit);
  });



//  google.maps.event.addDomListener(window, 'load', initialize);

});
