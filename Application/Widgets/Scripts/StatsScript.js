//! DUMMY DATA
let list1 = [0, 1, 1, 1, 3, 6, 1, 6, 0, 0, 0, 1]
let list2 = [0, 1, 0, 2, 3, 1, 1, 3, 0, 0, 0, 1]
let list3 = [0, 0, 1, 0, 3, 1, 1, 10, 0, 0, 0, 1]
let list4 = [0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0]
let xAxis = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
let yAxis = list1
//* ----------------------------------------------------- FETCHING DATA START ----------------------------------------------------- //
let playersData = null

// league IDs and corresponding names
const footballLeagueId = [39, 140, 61];
const footballLeague = ['English Premier League', 'La Liga', 'Ligue One'];

// storage keys
const PLAYERS_FOOTBALL_KEY = "footballPlayers";

// api data
const KEY = '10b74ce9ebmsh829850853489ac5p14ae76jsn9fd379ce8a94';
const requestURL = 'https://api-football-v1.p.rapidapi.com/v3/players?'

myHeaders = {
    "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
	"x-rapidapi-key": KEY
}

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

/*
This function either takes data directly from local storage if it exists or fetches from the API. This is done to
minamise calls to the API as we only get 100 per day
*/
function fetchPlayers(){
    localStorage.getItem(PLAYERS_FOOTBALL_KEY) ? playersData = JSON.parse(localStorage.getItem(PLAYERS_FOOTBALL_KEY)) : fetchPlayersFromAPI()
}

/*
This function fetches the players from the API and returns an object in the form:
data : {
    parameters: {...},
    results: 20,
    paging: {...},
    response: [
        0: {
            player: {
                id: int,
                name: string,
                etc.
            },
            statistics: [
                0: {
                    ...,
                    goals: {total: int},
                    passes: {key: int} - were just gonna say key passes are assists coz fk it
                }
            ]
        },
        1: {...},
        ...
    ]
}
*/
function fetchPlayersFromAPI(){
    // api call, storing the data in topScorers object
    fetch(requestURL.concat(`league=${footballLeagueId[0]}&season=${2020}`), requestOptions)
    .then(response => response.json())
    .then((data) => {
        localStorage.setItem(PLAYERS_FOOTBALL_KEY, JSON.stringify(data.response))
        playersData = data.response
        // on completion of this function we want to call the updateData method, which, will update the table and chart
        updateData()
    })
    .catch(err => {
        console.error(err);
    });
}

fetchPlayers() // this is the variable that holds all the data being used in this script
//* ----------------------------------------------------- FETCHING DATA END ----------------------------------------------------- //

//* GETTING HTML ELEMENTS
const elements = {
    team: document.getElementById('team'),
    graphType: document.getElementById('graphType'),
    players: document.getElementById('players'),
    seasons: document.getElementById('seasons'),
    statMode: document.getElementById('statMode'),
    statType: document.getElementById('statType')
}

//* DATA FOR GRAPH AND TABLE
// hopefully will be able to access api data like data.players[graphData.player].seasons[graphData.season].stats[graphData.selectedType]
const graphData = {
    //! DUMMY DATA FOR GRAPH
    selectedTeam: 'Watford',
    selectedGraph: 'line',
    selectedPlayer: 'Troy Deeny',
    selectedSeason: '2020',
    selectedMode: 'Total',
    selectedType: 'Goals'
}

const tableData = {

}

//* ON CHANGE FUNCTION FOR SELECT
/*
This function handles the on change for all the select elements, when the user changes what is selected the graph and table data should be updated, this is done
by updating the graph data and table data variables then refreshing the graph and table.
*/
function updateSelect(selectID){
    if (selectID == 'players'){
        graphData.selectedPlayer = elements.players.options[players.selectedIndex].value
        yAxis = updatePlayer(graphData.selectedPlayer)
        updateChartData(yAxis)
    }else if (selectID == 'graphType'){
        graphData.selectedGraph = elements.graphType.options[graphType.selectedIndex].value
        // TODO - create new chart - might have to do something with local storage here
    }else if (selectID == 'seasons'){
        graphData.selectedSeason = elements.seasons.options[seasons.selectedIndex].value
        yAxis = updateSeason(graphData.selectedSeason)
        updateChartData(yAxis)
    }else if (selectID == 'statType'){
        graphData.selectedType = elements.statType.options[statType.selectedIndex].value
        yAxis = updateStatType(graphData.selectedType)
        myChart.data.datasets[0].label = graphData.selectedType
        updateChartData(yAxis)
    }

    /*
    Simply takes in a new set of data and sets the yAxis of the chart to the input data
    */
    function updateChartData(yAxis){
        myChart.data.datasets[0].data = yAxis
        myChart.update()
    }

    /* 
    These functions will just filter out the data already provided by the API, e.g if the user selects a new player, these functions will search
    for the selected player and then set the data to that players data
    */
    //! purely test functions
    function updatePlayer(playerName){
        if (playerName == 'Troy Deeny'){
            return list1
        }else if (playerName === 'Harry Kane'){
            return list2
        }else if (playerName === 'Robert Firmino'){
            return list3
        }else if (playerName === 'Marcus Rashford'){
            return list4
        }
    }
    function updateSeason(season){
        if (season == '2018'){
            return list1
        }else if (season === '2019'){
            return list2
        }else if (season === '2020'){
            return list3
        }else if (season === '2021'){
            return list4
        }
    }
    function updateStatType(statType){
        if (statType == 'Goals'){
            return list1
        }else if (statType === 'Assists'){
            return list2
        }else if (statType === 'Yellow cards'){
            return list3
        }else if (statType === 'Red cards'){
            return list4
        }
    }
}

//* STYLING GRAPH
/*
Creates the border color and background color for each graph element, for a line graph this is just on value, for a bar graph this is an array of values, where the index corresponds to
the bar number
return: {borders:any, backgrounds:any}
*/
function styleGraph(selectedGraph){
    let borders = [], backgrounds = []
    function createBackgrounds(data){
        let backgrounds = []
        for (let i=0; i<data.length; i++){
            backgrounds.push('#D9484F')
        }
        return backgrounds
    }
    function createBorders(data){
        let borders = []
        for (let i=0; i<data.length; i++){
            borders.push('#FFF')
        }
        return borders
    }
    if (selectedGraph === 'bar') {
        borders = createBorders(yAxis)
        backgrounds = createBackgrounds(yAxis)
    }else{
        borders = '#FFF'
        backgrounds = '#D9484F'
    }
    return {borders: borders, backgrounds: backgrounds}
}

//* CONFIGURING GRAPH
Chart.defaults.global.defaultFontColor = "#FFF";
let ctx = document.getElementById('statsGraph');
let myChart = new Chart(ctx, {
    type: graphData.selectedGraph, 
    data: {
        labels: xAxis,
        datasets: [{
            label: 'Goals',
            data: yAxis, 
            backgroundColor: styleGraph(graphData.selectedGraph).backgrounds,
            borderColor: styleGraph(graphData.selectedGraph).borders,
            borderWidth: 1,
        }]
    },
    options: {
        scale: {
            y: {
                beginAtZero: true,
            }
        },
    }
});

/*
This function simply updates the chart with the players data, this is call after our fetch from the API has been completed
*/
function updateData(){
    console.log(playersData)
}

function main(){
    console.log(playersData)
}

main()