function initialize() {
  var lat,
    lng,
    locationName;

  var input = document.getElementById('location-search');
  new google.maps.places.Autocomplete(input);

  /*Create new instance of Autocomplete*/
  var autocomplete = new google.maps.places.Autocomplete(input);

  /*Get location when the user types*/
  autocomplete.addListener('place_changed', function () {

    var place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    //    console.log(place);

    lat = place.geometry.location.lat();
    lng = place.geometry.location.lng();
    locationName = place.formatted_address;

    /*Update UI with new data*/
    insertData(lat, lng, locationName);
  });
}
