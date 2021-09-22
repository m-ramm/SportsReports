const footballLeagueId = [39, 140, 61];
const footballLeague = ['Premier League', 'La Liga', 'Ligue One'];
const standingTeamIds = [33, 452, 96];
const league = localStorage.getItem('league')

const STANDINGS_FOOTBALL_KEY = "standingsFootball";
const FIXTURES_FOOTBALL_TEAM_KEY = "fixturesFootballTeams"
const TEAM_ID_KEYS = "teamIdsFootball"

const KEY = 'd478817a0fmsh584e04929c59a24p15d9b7jsn193d317fead8';

const requestStandingsFromTeamURL = "https://api-football-v1.p.rapidapi.com/v3/standings?"

const RANKING_NUMS = 20;

const standingsElements = {
    leagueTableStats: document.getElementById('leagueTableStats'),
    seasonStandings: document.getElementById('seasonStandings')
}
const standingsTableData = {
    leagueID: footballLeagueId[footballLeague.indexOf(league)],
    selectedSeason: '2021',
}

myHeaders = {
    "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
    "x-rapidapi-key" : KEY
};

var requestOptions = {
    method: "GET",
    headers: myHeaders,
};

document.getElementById('currentLeague').innerHTML = `Current League: <br> ${league}`;

function checkStorage(key){
    let data = JSON.parse(localStorage.getItem(key));
    return data && data !== null;
}

function fetchStandings(){
    fetchFromAPI(requestStandingsFromTeamURL.concat(`league=${standingsTableData.leagueID}&season=${standingsTableData.selectedSeason}`))
}

function fetchFromAPI(fetchURL){
    // api call, storing the data in topScorers object
    fetch(fetchURL, requestOptions)
    .then(response => response.json())
    .then((data) => {
        localStorage.setItem(STANDINGS_FOOTBALL_KEY, JSON.stringify(data.response))
        standingsData = data.response
    })
    .catch(err => {
        console.error(err);
    });
}

// function fetchStandings(leagueId, standingsYear, leagueNames, leagueTableStorageKey){
//     let standings = {};
// 
//     // if storage is already filled, then don't run api request
//     if (checkStorage(leagueTableStorageKey)) return;
// 
//     for(let i = 0; i < leagueId.length; i++) {
//         fetch(`https://api-football-v1.p.rapidapi.com/v3/standings?season=${standingsYear}&league=${leagueId[i]}`, requestOptions)
//         .then(response => response.json())
//         .then((data) => {
//             standings[leagueNames[i]] = data.response;
//             // put into localStorage
//             localStorage.setItem(leagueTableStorageKey, JSON.stringify(standings)); 
//         })
//         .catch(error => console.log("error", error));
//     }
// 
// }
// 
// function fetchFixtureByTeamID(leagueId, leagueNames, leagueTableStorageKey){
//     let fixture = {};
//     // if storage is already filled, then don't run api request
//     if (checkStorage(leagueTableStorageKey)) return;
// 
//     for(let i = 0; i < leagueId.length; i++) {
//         for(let j = 0; j < teamsLength; j++) {
//             fetch(`https://api-football-v1.p.rapidapi.com/v3/fixtures?season=2020&league=${leagueId[i]}`, requestOptions)
//             .then(response => response.json())
//             .then((data) => {
//                 fixture[leagueNames[i]] = data.response;
//                 // put into localStorage
//                 localStorage.setItem(leagueTableStorageKey, JSON.stringify(fixture)); 
//             })
//             .catch(error => console.log("error", error));
//         }
//     }
// }

// function checkId(leagueId, leagueNames){
//     const teamsId = []
//     let teamsData;
//     let tempData;
// 
//     tempData = JSON.parse(localStorage.getItem(STANDINGS_FOOTBALL_KEY));
//     teamsData = tempData[league]
//     teamsLength = teamsData[0]['league']['standings'][0].length
// 
//     for(let i = 0; i < leagueId.length; i++) {
//         for(let j = 0; j < teamsLength; j++) {
//             teamsId[leagueNames[i]] = teamsId[leagueNames[i]].concat(teamsData[0]['league']['standings'][j]['team']['id'])
// 
//             localStorage.setItem(TEAM_ID_KEYS, JSON.stringify(teamsId))
//         }
//     }
// }

//function updateSeasons(selectSeason){
//    if (selectSeason == 'seasonStandings'){
//        standingsTableData.selectedSeason = standingsElements.seasonStandings.options[standingsElements.seasonStandings.selectedIndex].value
//        fetchFromAPI(requestStandingsFromTeamURL.concat(`league=${standingsTableData.leagueID}&season=${standingsTableData.selectedSeason}`))
//    }
//}

function updateStandingsTable() {

    let tableData;
    
    leagueTableStats.innerHTML = 
        `<tr> 
        <th>Position</th>
        <th>Team</th>
        <th>Played</th>
        <th>Won</th>
        <th>Drawn</th>
        <th>Lost</th>
        <th>Points</th>
        <th>History</th>
        <tr>`;

    // Loop to access all rows 
    tableData = JSON.parse(localStorage.getItem(STANDINGS_FOOTBALL_KEY))    
    // tempDataFixture = JSON.parse(localStorage.getItem(FIXTURES_FOOTBALL_TEAM_KEY));
    // hiddenTableData = tempDataFixture[league];
    // building table 
    for(var i = 0; i < RANKING_NUMS; i++) {
        leagueTableStats.innerHTML += 
        `<tr onclick="showHideRow('hidden_row${i}');" class="visible_row">
        <td>${tableData[0]['league']['standings'][0][i]['rank']}</td>
        <td>${tableData[0]['league']['standings'][0][i]['team']['name']}</td>
        <td>${tableData[0]['league']['standings'][0][i]['all']['played']}</td>
        <td>${tableData[0]['league']['standings'][0][i]['all']['win']}</td>
        <td>${tableData[0]['league']['standings'][0][i]['all']['draw']}</td>
        <td>${tableData[0]['league']['standings'][0][i]['all']['lose']}</td>
        <td>${tableData[0]['league']['standings'][0][i]['points']}</td>
        <td>${tableData[0]['league']['standings'][0][i]['form']}</td>`;
        //for(var j = 0; j < 5; j++) {
        //    getTeamId();
        //    leagueTableStats.innerHTML += 
        //    `<tr id="hidden_row${j}" class="hidden_row">
        //        <td colspan=8>
        //            ${hiddenTableData[0]['teams']['home']['name']} VS ${hiddenTableData[0]['teams']['away']['name']}
        //        </td>
        //    </tr>`;
        //}
    }
}

/*
Runs when the page loads 
*/

fetchStandings()

function main() {

    //fetchStandings(footballLeagueId, 2021, footballLeague, STANDINGS_FOOTBALL_KEY)

    //checkId(footballLeagueId, footballLeague)

    //fetchFixtureByTeamID(footballLeagueId, footballLeague, FIXTURES_FOOTBALL_TEAM_KEY)

    updateStandingsTable();
}

function showHideRow(row) {
    $("#" + row).toggle();
}


main();