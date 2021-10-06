let teamsData = []
let playersData = []
let teamStats = []
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
    graphTitle: document.getElementById('graphTitle'),
    removableSelects: document.getElementById('removableSelects')
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
const requestsTeamStatsURL = 'https://api-football-v1.p.rapidapi.com/v3/teams/statistics?'
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
function fetchFromAPI(fetchURL, type, season='2016'){
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
        }else if (type == 'teamHistory'){
            // TODO: set team history
            teamStats.push(data.response)
            teamStats = teamStats.flat(1)
            console.log(teamStats + fetchURL)
            if (Number(season) < 2020){
                fetchFromAPI(`${requestsTeamStatsURL}league=${graphData.leagueID}&season=${season}&team=${graphData.selectedTeam.id}`, 'teamHistory', String(Number(season)+1))
            }
            updateData(teamStats)
            localStorage.setItem('TEAM_STATISTICS', teamStats)
        }else{
            localStorage.setItem(PLAYERS_FOOTBALL_KEY, JSON.stringify(data.response))
            
            playersData.push(data.response)
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

fetchTeams() 

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
    // updating team stats
    localStorage.removeItem('TEAM_STATISTICS')
    fetchFromAPI(`${requestsTeamStatsURL}league=${graphData.leagueID}&season=2016&team=${graphData.selectedTeam.id}`, 'teamHistory')
    if (graphData.selectedMode == 'Total'){
        elements.graphTitle.innerText = `${graphData.selectedTeam.name} player statistics`
    }else{
        elements.graphTitle.innerText = `${graphData.selectedTeam.name} average goals per game`
    }
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
        switch (graphData.selectedMode){
            case 'Total':
                updateData(playersData)
            case 'Average':
                updateData(teamStats)
        }
    }else if (selectID == 'seasons'){
        graphData.selectedSeason = elements.seasons.options[elements.seasons.selectedIndex].value
        fetchFromAPI(requestTeamsURL.concat(`league=${graphData.leagueID}&season=${graphData.selectedSeason}`), 'teams')
    }else if (selectID == 'statType'){
        graphData.selectedType = elements.statType.options[elements.statType.selectedIndex].value
        updateData(playersData)
    }else if (selectID == 'statMode'){
        teamStats = []
        graphData.selectedMode = elements.statMode.options[elements.statMode.selectedIndex].value
        // TODO: fetch teams stats from api
        if (graphData.selectedMode == 'Average'){
            let seasons = ['2016', '2017', '2018', '2019', '2020']
            fetchFromAPI(`${requestsTeamStatsURL}league=${graphData.leagueID}&season=2016&team=${graphData.selectedTeam.id}`, 'teamHistory')
            statModeChange('Average')
        }else{
            updateData(playersData)
            statModeChange('Total')
        }
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

/*
This function updates the selects shown on screen to the user, basically, 
*/
function statModeChange(statMode){
    if (statMode == 'Total'){
        elements.graphTitle.innerText = `${graphData.selectedTeam.name} player statistics`
        // adding options
        elements.removableSelects.innerHTML += '<select name="seasons" id="seasons" onchange="updateSelect(`seasons`)"> <option value="2018">2021</option> <option value="2019">2020</option> <option value="2020">2019</option> <option value="2021">2018</option> </select>'
        elements.removableSelects.innerHTML += '<select name="statType" id="statType" onchange="updateSelect(`statType`)"> <option value="Goals">Goals</option> <option value="Assists">Assists</option> <option value="Red cards">Red cards</option> <option value="Yellow cards">Yellow cards</option> </select>'
        elements.seasons = document.getElementById('seasons')
        elements.statType = document.getElementById('statType')
    }else{
        elements.graphTitle.innerText = `${graphData.selectedTeam.name} average goals per game`
        // removing options
        elements.statType.remove()
        elements.seasons.remove()
    }
}
//* ------------------------------------------------------ GRAPH ----------------------------------------------------- *//
//* STYLING GRAPH
/*
Creates the border color and background color for each graph element, for a line graph this is just on value, for a bar graph this is an array of values, where the index corresponds to
the bar number
return: {borders:any, backgrounds:any}
*/
function styleGraph(selectedGraph, data=playersData.flat(1)){
    let borders = [], backgrounds = []
    //* Helper functions
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
    if (selectedGraph == 'bar') {
        borders = createBorders(data)
        backgrounds = createBackgrounds(data)
    }else if (selectedGraph == 'pie'){
        for (let i=0; i<data.length; i++){
            borders.push('#FFF')
            backgrounds.push('#FFF')
        }
        let r = 217; let g = 72; let b = 79
        backgrounds = backgrounds.map(() => {
            b <= 255 ? (r -= 10, b += 20) : (r -= 10, g += 20)
            return `rgb(${r}, ${g}, ${b})`
        })
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
    //* Helper functions
    /*
    Basically this filterPage function just takes the and filters out all the players that dont have a stat
    */
    const filterPage = (page) => {
        let filteredPage = page.filter((player) => checkPlayerHasStat(player))
        return filteredPage
    }
    /*
    Simple switch case function, returns false if the player doesn't have a stat, otherwise returns true
    */
    const checkPlayerHasStat = (player) => {
        switch (graphData.selectedType){
            case 'Goals':
                return player.statistics[0].goals.total != null && player.statistics[0].goals.total != 0
            case 'Assists':
                return player.statistics[0].passes.key != null && player.statistics[0].passes.key != 0
            case 'Yellow card':
                return player.statistics[0].cards.yellow != null && player.statistics[0].cards.yellow != 0
            case 'Red card':
                return player.statistics[0].cards.red != null && player.statistics[0].cards.red != 0
        }
    }
    // Basically total just means we show the total goals/assists/etc for each player for the currently selected team
    // Average gets the average goals for the selected team for the last 6 years then extrapolates that data out to make a prediction
    if (graphData.selectedMode == 'Total'){
        //* Turning objects into workable data
        stats = []; names = []
        data = data.map((page) => filterPage(page))
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
        })
        stats = stats.flat(1)
        names = names.flat(1)
        myChart.data.datasets[0].data = stats
        myChart.data.labels = names
    }else{
        goals = data.map((team) => team.goals.for.average.total)
        goals = goals.map((goal) => Number(goal))
        myChart.data.datasets[0].data = extrapolateData(goals, 10)
        myChart.data.labels = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025']      // hard coding it isn't good, should prolly use dates to make it always work for the last 6 years
    }
    myChart.data.datasets[0].backgroundColor = styleGraph(graphData.selectedGraph, graphData.selectedMode == 'Total' ? playersData.flat(1) : ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025']).backgrounds
    myChart.data.datasets[0].borderColor = styleGraph(graphData.selectedGraph, graphData.selectedMode == 'Total' ? playersData.flat(1) : ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025']).borders
    myChart.update()
}

/*
param data: array of numbers
param fitCount: the number of values you to extrapolate to
this code was found at: https://stackoverflow.com/questions/67868049/javascript-extrapolate-an-array-of-numbers
*/
function extrapolateData(data, fitCount){
    let newData = []
    let springFactor = Number((data.length - 1) / (fitCount - 1))
    let linearInterpolate = (before, after, atPoint) => {
        return before + (after - before) * atPoint
    };
      
    for (var i = 0; i < fitCount - 1; i++) {
        let tmp = i * springFactor
        let before = Number(Math.floor(tmp)).toFixed()
        let after = Number(Math.ceil(tmp)).toFixed()
        let atPoint = tmp - before
        newData.push(linearInterpolate(data[before], data[after], atPoint))
    }
    
    // for new allocation
    newData[fitCount - 1] = data[data.length - 1]
        
    return data.concat(newData.slice(5, fitCount))        // these are again hard coded which is bad but it'll work for the next year
}


//* ------------------------------------------------------ MAIN ----------------------------------------------------- *//

function main(){
    updateSelectTeams()
}

main()