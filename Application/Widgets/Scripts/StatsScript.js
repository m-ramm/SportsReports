let teamsData = []
let playersData = []

// league IDs and corresponding names
const footballLeagueId = [39, 140, 61];
const footballLeague = ['Premier League', 'La Liga', 'Ligue One'];
const league = localStorage.getItem('league')

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
    leagueID: footballLeagueId[footballLeague.indexOf(league)],
    selectedTeam: '',
    selectedGraph: 'bar',
    selectedTeam: {},
    players: [],
    selectedSeason: '2021',
    selectedMode: 'Total',
    selectedType: 'Goals'
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
    // localStorage.removeItem(TEAMS_FOOTBALL_KEY)
    // localStorage.removeItem(PLAYERS_FOOTBALL_KEY)
    // localStorage.getItem(TEAMS_FOOTBALL_KEY) ? (teamsData = JSON.parse(localStorage.getItem(TEAMS_FOOTBALL_KEY)), updateOptions()) : fetchFromAPI(requestTeamsURL.concat(`league=${graphData.leagueID}&season=${graphData.selectedSeason}`), 'teams')
    fetchFromAPI(requestTeamsURL.concat(`league=${graphData.leagueID}&season=${graphData.selectedSeason}`), 'teams')
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
            updateSelectTeams()
        }else{
            localStorage.setItem(PLAYERS_FOOTBALL_KEY, JSON.stringify(data.response))
            playersData.push(data.response)
            console.log(playersData)
            let pages = data.paging
            if (pages.current < pages.total){
                fetchFromAPI(requestPlayersFromTeamURL.concat(`team=${graphData.selectedTeam.id}&season=${graphData.selectedSeason}&page=${pages.current + 1}`), 'players')
            }
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
    
    // update the team logo
    document.getElementById('teamLogo').src = (teamsData.filter((data) => data.team.id == team))[0].team.logo;

    // resetting player data when new team is selected
    playersData = []
    fetchFromAPI(requestPlayersFromTeamURL.concat(`team=${graphData.selectedTeam.id}&season=${graphData.selectedSeason}`), 'players')
}

/*
This function handles the on change for all the select elements, when the user changes what is selected the graph and table data should be updated, this is done
by updating the graph data and table data variables then refreshing the graph and table.
*/
function updateSelect(selectID){
    if (selectID == 'graphType'){
        graphData.selectedGraph = elements.graphType.options[elements.graphType.selectedIndex].value
        createNewChart()
        updateData(playersData)
    }else if (selectID == 'seasons'){
        graphData.selectedSeason = elements.seasons.options[elements.seasons.selectedIndex].value
        fetchFromAPI(requestTeamsURL.concat(`league=${graphData.leagueID}&season=${graphData.selectedSeason}`), 'teams')
    }else if (selectID == 'statType'){
        graphData.selectedType = elements.statType.options[elements.statType.selectedIndex].value
        updateData(playersData)
    }
    
    /*
    This function deletes the old chart then creates a new one with the selected chart type. This is used to change the chart type when the user selects a different chart type
    */
    function createNewChart(){
        ctx = document.getElementById('statsGraph')
        myChart.destroy()
        myChart = new Chart(ctx, {
            type: graphData.selectedGraph, 
            data: {
                labels: [],
                datasets: [{
                    label: 'Goals',
                    data: [], 
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
        borders = createBorders(playersData.flat(1))
        backgrounds = createBackgrounds(playersData.flat(1))
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
        labels: [],
        datasets: [{
            label: 'Goals',
            data: [], 
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
    stats = []
    names = []
    data.forEach((page) => {
        names.push(page.map((playerObj) => playerObj.player.name))
        if (graphData.selectedType == 'Goals'){
            stat = page.map((playerObj) => playerObj.statistics[0].goals.total)
        } else if (graphData.selectedType == 'Assists') {
            stat = page.map((playerObj) => playerObj.statistics[0].passes.key)
        } else if (graphData.selectedType == 'Yellow card'){
            stat = page.map((playerObj) => playerObj.statistics[0].cards.yellow)
        } else {
            stat = page.map((playerObj) => playerObj.statistics[0].cards.red)
        }
        stats.push(stat.map((stat) => stat === null ? 0 : stat))
        console.log(stats)
    })
    stats = stats.flat(1)
    names = names.flat(1)
    myChart.data.datasets[0].data = stats
    myChart.data.labels = names
    myChart.data.datasets[0].backgroundColor = styleGraph(graphData.selectedGraph).backgrounds
    myChart.data.datasets[0].borderColor = styleGraph(graphData.selectedGraph).borders
    myChart.update()
}


//* ------------------------------------------------------ MAIN ----------------------------------------------------- *//

function main(){
    updateSelectTeams()
}

main()