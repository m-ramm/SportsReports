# Spike : API Sports
This spike will run through an example call to API-sports, and give an example response.  
For different queries / parameter options, visit the <a href="https://www.api-football.com/documentation-v3">API-Sports documentation</a>    
**NOTE: using v3 of the football api**  
## Registration
Go to the api-sports <a href="https://dashboard.api-football.com/">dashboard</a>, sign up, then go to profile, and find your api keys.  
Then continue to the next section

## Code example
The following code snippet can be considered boilerplate for making api calls. Be careful of making too many calls however, because each key only gets 100 calls per day on the free license.  
For issues with fetch or promises, visit <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch">here</a>.  
**NOTE: fetch only works in browsers, so when testing API calls, make sure you do it through an HTML file, and not in VS code directly**  
  

```javascript
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
```  
## Output Example  
The following output is the object stored in variable 'storage_object' in the code snippet.  
Changing parameters will change what is returned, so be sure to tailor the api calls to what is needed specifically

```javascript
{
    "get": "leagues",
    "parameters": {
        "id": "39"
    },
    "errors": [],
    "results": 1,
    "paging": {
        "current": 1,
        "total": 1
    },
    "response": [
        {
            "league": {
                "id": 39,
                "name": "Premier League",
                "type": "League",
                "logo": "https:\/\/media.api-sports.io\/football\/leagues\/39.png"
            },
            "country": {
                "name": "England",
                "code": "GB",
                "flag": "https:\/\/media.api-sports.io\/flags\/gb.svg"
            },
            "seasons": [
                {
                    "year": 2010,
                    "start": "2010-08-14",
                    "end": "2011-05-17",
                    "current": false,
                    "coverage": {
                        "fixtures": {
                            "events": true,
                            "lineups": true,
                            "statistics_fixtures": false,
                            "statistics_players": false
                        },
                        "standings": true,
                        "players": true,
                        "top_scorers": true,
                        "top_assists": true,
                        "top_cards": true,
                        "injuries": false,
                        "predictions": true,
                        "odds": false
                    }
                },
                {
                    "year": 2011,
                    "start": "2011-08-13",
                    "end": "2012-05-13",
                    "current": false,
                    "coverage": {
                        "fixtures": {
                            "events": true,
                            "lineups": true,
                            "statistics_fixtures": false,
                            "statistics_players": false
                        },
                        "standings": true,
                        "players": true,
                        "top_scorers": true,
                        "top_assists": true,
                        "top_cards": true,
                        "injuries": false,
                        "predictions": true,
                        "odds": false
                    }
                },
                {
                    "year": 2012,
                    "start": "2012-08-18",
                    "end": "2013-05-19",
                    "current": false,
                    "coverage": {
                        "fixtures": {
                            "events": true,
                            "lineups": true,
                            "statistics_fixtures": false,
                            "statistics_players": false
                        },
                        "standings": true,
                        "players": true,
                        "top_scorers": true,
                        "top_assists": true,
                        "top_cards": true,
                        "injuries": false,
                        "predictions": true,
                        "odds": false
                    }
                },
                {
                    "year": 2013,
                    "start": "2013-08-17",
                    "end": "2014-05-11",
                    "current": false,
                    "coverage": {
                        "fixtures": {
                            "events": true,
                            "lineups": true,
                            "statistics_fixtures": false,
                            "statistics_players": false
                        },
                        "standings": true,
                        "players": true,
                        "top_scorers": true,
                        "top_assists": true,
                        "top_cards": true,
                        "injuries": false,
                        "predictions": true,
                        "odds": false
                    }
                },
                {
                    "year": 2014,
                    "start": "2014-08-16",
                    "end": "2015-05-24",
                    "current": false,
                    "coverage": {
                        "fixtures": {
                            "events": true,
                            "lineups": true,
                            "statistics_fixtures": true,
                            "statistics_players": true
                        },
                        "standings": true,
                        "players": true,
                        "top_scorers": true,
                        "top_assists": true,
                        "top_cards": true,
                        "injuries": false,
                        "predictions": true,
                        "odds": false
                    }
                },
                {
                    "year": 2015,
                    "start": "2015-08-08",
                    "end": "2016-05-17",
                    "current": false,
                    "coverage": {
                        "fixtures": {
                            "events": true,
                            "lineups": true,
                            "statistics_fixtures": true,
                            "statistics_players": true
                        },
                        "standings": true,
                        "players": true,
                        "top_scorers": true,
                        "top_assists": true,
                        "top_cards": true,
                        "injuries": false,
                        "predictions": true,
                        "odds": false
                    }
                },
                {
                    "year": 2016,
                    "start": "2016-08-13",
                    "end": "2017-05-21",
                    "current": false,
                    "coverage": {
                        "fixtures": {
                            "events": true,
                            "lineups": true,
                            "statistics_fixtures": true,
                            "statistics_players": true
                        },
                        "standings": true,
                        "players": true,
                        "top_scorers": true,
                        "top_assists": true,
                        "top_cards": true,
                        "injuries": false,
                        "predictions": true,
                        "odds": false
                    }
                },
                {
                    "year": 2017,
                    "start": "2017-08-11",
                    "end": "2018-05-13",
                    "current": false,
                    "coverage": {
                        "fixtures": {
                            "events": true,
                            "lineups": true,
                            "statistics_fixtures": true,
                            "statistics_players": true
                        },
                        "standings": true,
                        "players": true,
                        "top_scorers": true,
                        "top_assists": true,
                        "top_cards": true,
                        "injuries": false,
                        "predictions": true,
                        "odds": false
                    }
                },
                {
                    "year": 2018,
                    "start": "2018-08-10",
                    "end": "2019-05-12",
                    "current": false,
                    "coverage": {
                        "fixtures": {
                            "events": true,
                            "lineups": true,
                            "statistics_fixtures": true,
                            "statistics_players": true
                        },
                        "standings": true,
                        "players": true,
                        "top_scorers": true,
                        "top_assists": true,
                        "top_cards": true,
                        "injuries": false,
                        "predictions": true,
                        "odds": false
                    }
                },
                {
                    "year": 2019,
                    "start": "2019-08-09",
                    "end": "2020-07-26",
                    "current": false,
                    "coverage": {
                        "fixtures": {
                            "events": true,
                            "lineups": true,
                            "statistics_fixtures": true,
                            "statistics_players": true
                        },
                        "standings": true,
                        "players": true,
                        "top_scorers": true,
                        "top_assists": true,
                        "top_cards": true,
                        "injuries": false,
                        "predictions": true,
                        "odds": false
                    }
                },
                {
                    "year": 2020,
                    "start": "2020-09-12",
                    "end": "2021-05-23",
                    "current": false,
                    "coverage": {
                        "fixtures": {
                            "events": true,
                            "lineups": true,
                            "statistics_fixtures": true,
                            "statistics_players": true
                        },
                        "standings": true,
                        "players": true,
                        "top_scorers": true,
                        "top_assists": true,
                        "top_cards": true,
                        "injuries": true,
                        "predictions": true,
                        "odds": false
                    }
                },
                {
                    "year": 2021,
                    "start": "2021-08-13",
                    "end": "2022-05-22",
                    "current": true,
                    "coverage": {
                        "fixtures": {
                            "events": true,
                            "lineups": true,
                            "statistics_fixtures": true,
                            "statistics_players": true
                        },
                        "standings": true,
                        "players": true,
                        "top_scorers": true,
                        "top_assists": true,
                        "top_cards": true,
                        "injuries": true,
                        "predictions": true,
                        "odds": true
                    }
                }
            ]
        }
    ]
}
```