function initialize() {
  var lat,
      lng,
      locationName;

  var input = document.getElementById('city-search');
  new google.maps.places.Autocomplete(input);

  var autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.addListener('place_changed', function() {

    var place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    lat = place.geometry.location.lat();
    lng = place.geometry.location.lng();
    locationName = place.formatted_address;

    console.log(locationName);
    insertData(lat, lng, locationName);
  });
}
