//! DUMMY DATA
let list1 = [0, 1, 1, 1, 3, 6, 1, 6, 0, 0, 0, 1]
let list2 = [0, 1, 0, 2, 3, 1, 1, 3, 0, 0, 0, 1]
let list3 = [0, 0, 1, 0, 3, 1, 1, 10, 0, 0, 0, 1]
let list4 = [0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0]
let xAxis = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
let yAxis = list1

let teamsData = []
let playersData = []

// league IDs and corresponding names
const footballLeagueId = [39, 140, 61];
const footballLeague = ['English Premier League', 'La Liga', 'Ligue One'];

//* GETTING HTML ELEMENTS
const elements = {
    teams: document.getElementById('teams'),
    graphType: document.getElementById('graphType'),
    seasons: document.getElementById('seasons'),
    statMode: document.getElementById('statMode'),
    statType: document.getElementById('statType'),
}

//* DATA FOR GRAPH AND TABLE
// hopefully will be able to access api data like data.players[graphData.player].seasons[graphData.season].stats[graphData.selectedType]
const graphData = {
    leagueID: footballLeagueId[0],
    selectedTeam: 'Manchester',
    selectedGraph: 'bar',
    selectedTeam: {},
    players: [],
    selectedSeason: '2020',
    selectedMode: 'Total',
    selectedType: 'Goals'
}

const tableData = {

}

//* ----------------------------------------------------- FETCHING DATA START ----------------------------------------------------- //
// storage keys
const TEAMS_FOOTBALL_KEY = "footballTeams";
const PLAYERS_FOOTBALL_KEY = 'footballPlayers'
// api data
const KEY = '10b74ce9ebmsh829850853489ac5p14ae76jsn9fd379ce8a94';
const requestTeamsURL = 'https://api-football-v1.p.rapidapi.com/v3/teams?'
const requestPlayersFromTeamURL = 'https://api-football-v1.p.rapidapi.com/v3/players?'
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
function fetchTeams(){
    // localStorage.clear(TEAMS_FOOTBALL_KEY)
    // localStorage.clear(PLAYERS_FOOTBALL_KEY)
    localStorage.getItem(TEAMS_FOOTBALL_KEY) ? (teamsData = JSON.parse(localStorage.getItem(TEAMS_FOOTBALL_KEY)), updateOptions()) : fetchFromAPI(requestTeamsURL.concat(`league=${graphData.leagueID}&season=${graphData.selectedSeason}`), 'teams')
}

/*
This function fetches the teams or players from the API and then sets the teams or players variable
to an object in the form:
teamsData : [
    team: {
        id: int
        name: string
        ...
    }
    venue: {
        ...
    }
]

playersData : [
    {
        player: {
            id: int
            name: string
            ...
        }
        statistics: {
            goals: {total: int, conceded: int, ...}
            ...
        }
    },
    ...
]
*/
function fetchFromAPI(fetchURL, type){
    // api call, storing the data in topScorers object
    fetch(fetchURL, requestOptions)
    .then(response => response.json())
    .then((data) => {
        if (type == 'teams'){
            localStorage.setItem(TEAMS_FOOTBALL_KEY, JSON.stringify(data.response))
            teamsData = data.response
            // on completion of this function we want to call the updateData method, which, will update the table and chart
            updateOptions()
            console.log(teamsData)
        }else{
            localStorage.setItem(PLAYERS_FOOTBALL_KEY, JSON.stringify(data.response))
            playersData = data.response
            updateData(playersData)
        }
    })
    .catch(err => {
        console.error(err);
    });
}

/*
This functions updates the teams the user can select from when a league is selected. Note that the 
value of each option is set to the team id, this is so that later on it is easier to search for players
by their team id.
*/
function updateOptions(){
    let options = ''
    teamsData.forEach((item) => {
        options += `<option value='${item.team.id}'>${item.team.name} </option>`
    })
    elements.teams.innerHTML = options
}

fetchTeams() // this is the variable that holds all the data being used in this script

//* ----------------------------------------------------- SELECT FUNCTIONS ----------------------------------------------------- //

//* ON CHANGE FUNCTION FOR SELECTS
/*
This function changes the current selected team and then fetches the players for that team and stores them
in the graph data object.
//! NOTE Please be careful when changing the dropdown as this calls the api
*/
function updateSelectTeams(){
    let team = elements.teams.options[elements.teams.selectedIndex].value
    graphData.selectedTeam = (teamsData.filter((data) => data.team.id == team))[0].team
    console.log(graphData.selectedTeam.id)
    fetchFromAPI(requestPlayersFromTeamURL.concat(`team=${graphData.selectedTeam.id}&season=${graphData.selectedSeason}`), 'players')
}

/*
This function handles the on change for all the select elements, when the user changes what is selected the graph and table data should be updated, this is done
by updating the graph data and table data variables then refreshing the graph and table.
*/
function updateSelect(selectID){
    if (selectID == 'graphType'){
        graphData.selectedGraph = elements.graphType.options[elements.graphType.selectedIndex].value
        // TODO - create new chart - might have to do something with local storage here
    }else if (selectID == 'seasons'){
        graphData.selectedSeason = elements.seasons.options[elements.seasons.selectedIndex].value
        updateChartData(yAxis)
    }else if (selectID == 'statType'){
        graphData.selectedType = elements.statType.options[elements.statType.selectedIndex].value
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
}

//* ------------------------------------------------------ GRAPH ----------------------------------------------------- *//
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
This function simply updates the chart with the players data, this is called after our fetch from the API has been completed
*/
function updateData(data){
    console.log(data)
    names = data.map((playerObj) => playerObj.player.name)
    goals = data.map((playerObj) => playerObj.statistics[0].goals.total)
    goals = goals.map((goal) => goal === null ? 0 : goal)
    myChart.data.datasets[0].data = goals
    myChart.data.labels = names
    myChart.data.datasets[0].backgroundColor = styleGraph(graphData.selectedGraph).backgrounds
    myChart.data.datasets[0].borderColor = styleGraph(graphData.selectedGraph).borders
    myChart.update()
}

//* ------------------------------------------------------ TABLE ----------------------------------------------------- *//


//* ------------------------------------------------------ MAIN ----------------------------------------------------- *//

function main(){
    updateSelectTeams()
}

main()