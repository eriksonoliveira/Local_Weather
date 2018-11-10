const wish = require("wish");
const XMLHttpRequest = require("w3c-xmlhttprequest").XMLHttpRequest;

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

// Test async.location
describe("asyncCall()", function() {
  it("has one method", function() {
    wish(Object.keys(asyncCall).length === 1);
  });
  describe("asyncCall.location", function() {
    it("returns a promise", function() {
      asyncCall
        .location()
        .then(resp => JSON.parse(resp))
        .then(location => {
          wish(location instanceof Object);
        })
        .catch(error => {
          console.log(error);
        });
    });
  });
});
