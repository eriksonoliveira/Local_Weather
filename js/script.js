// On page load, get user location from https://ipapi.co and call inserData()
asyncCall
  .location()
  .then(resp => JSON.parse(resp))
  .then(geoposition => {
    const { latitude, longitude, city, country } = geoposition;
    const locationName = "<span>" + city + ", " + country + "</span>";

    /*Get weather data and add it to the page*/
    insertData(latitude, longitude, locationName);
  })
  .catch(error => console.log(error));
