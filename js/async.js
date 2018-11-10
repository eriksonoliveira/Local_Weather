let asyncCall = {};

asyncCall.location = function() {
  // Handle location request
  return new Promise(function(resolve, reject) {
    let req = new XMLHttpRequest();
    req.open("GET", "https://ipapi.co/json/");

    req.onload = function() {
      if (req.status == 200) {
        resolve(req.response);
      } else {
        reject(Error(req.statusText));
      }
    };

    req.onerror = function() {
      reject(Error("Network Error"));
    };

    req.send();
  });
};

// asyncCall.currentWeather = function() {};
// asyncCall.forecastWeather = function() {};
