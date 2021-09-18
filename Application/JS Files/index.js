// league IDs and corresponding names
const footballLeagueId = [39, 140, 61];
const footballLeague = ['Premier League', 'La Liga', 'Ligue One'];

// storage keys
const TOP_SCORERS_FOOTBALL_KEY = "topScorersFootball";
const TOP_ASSISTS_FOOTBALL_KEY = "topAssistsFootball";
const TOP_RED_FOOTBALL_KEY = "topRedFootball";
const TOP_YELLOW_FOOTBALL_KEY = "topYellowFootball";

// api data
const YOUR_KEY = "69c1a7a3dbc22ffc02a24af7ce74aca6";

myHeaders = {
  "x-apisports-key": YOUR_KEY,
};

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};


/*
Runs when the page loads 
*/
function main() {
    //top scorers
    fetchTopX(footballLeagueId, footballLeague, TOP_SCORERS_FOOTBALL_KEY, 'topscorers');

    //top assists
    fetchTopX(footballLeagueId, footballLeague, TOP_ASSISTS_FOOTBALL_KEY, 'topassists');

    //top reds 
    fetchTopX(footballLeagueId, footballLeague, TOP_RED_FOOTBALL_KEY, 'topredcards');

    //top yellows 
    fetchTopX(footballLeagueId, footballLeague, TOP_YELLOW_FOOTBALL_KEY, 'topyellowcards');


    //* used for testing
    data = JSON.parse(localStorage.getItem(TOP_SCORERS_FOOTBALL_KEY));
    console.log(data);


    // TODO: other api calls here as required
    
}


/* 
Following function checks if the relevant key has data already in localStorage
Inputs :
    - key : a string which is the key of the localstorage item being checked
Outputs :
    - bool : if there is an existing item at that key.
*/
function checkStorage(key){
    let data = JSON.parse(localStorage.getItem(key));
    return data && data !== null;
}

//--------------------------------------------------------------------------------------------------------------------------------
//* Top scorers for current season
//? do we need top scorers for all seasons?


/*
Function fetches the top scorer data from the league, but first checks if it already exists in storage
Inputs :
    - leagueId : a list of integers of the league id's from API-sports
    - leagueNames : a list of strings with the corresponding league names
    - storageKey : the key used for localStorage of this set of data
Outputs :
    None
*/
function fetchTopX(leagueId, leagueNames, storageKey, topXQuery){
    let topX = {};
    // if storage is already filled, then don't run api request
    if (checkStorage(storageKey)) return;
    // TODO implement date checker here (IE if 1 week out of date, then do another call)(low priority)

    // TODO: adjust following code to get data from multiple seasons. Currently only 2021 season
    // api call, storing the data in topX object
    for(let i = 0; i<leagueId.length; i++) {
        fetch(`https://v3.football.api-sports.io/players/${topXQuery}?season=2021&league=${leagueId[i]}`, requestOptions)
        .then(response => response.json())
        .then((data) => {
            topX[ leagueNames[i] ] = data.response;
            // put into localStorage
            localStorage.setItem(storageKey, JSON.stringify(topX));  
        })
        .catch(error => console.log("error", error));
    }

    
}



//---------------------------------------------------------------------------------------------------------
//* Fixtures / individual match statistics

//! Need to decide on the following
/*
can get the fixture IDs by fetching from the fixtures endpoint with parameters 'from' and 'to'.
will return all fixtures in the period specified.

Can then use the fixture IDs to get individual match statistics with the fixture/statistics endpoint using the fixture ids found before.

Possible to potentially store all of the fixture ids for the past few seasons in localStorage to make statistic calling easier?
 */


main();