const YOUR_KEY = "xxxxxxxxxxxxxxxxxxx"
// go to https://dashboard.api-football.com/, sign up, go to account, and find key.

myHeaders = {
  "x-apisports-key": YOUR_KEY,
};


var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

var storage_object;

fetch("https://v3.football.api-sports.io/leagues?id=39", requestOptions)
  .then((response) => response.json())
  .then((result) => storage_object = result)
  .then(() => console.log(storage_object))
  .catch((error) => console.log("error", error));

// after this fetch call, the data will be stored as an object in 'storage_object'