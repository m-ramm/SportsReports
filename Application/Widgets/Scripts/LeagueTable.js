const footballLeagueId = [39, 140, 61];
const footballLeague = ['Premier League', 'La Liga', 'Ligue One'];
const standingTeamIds = [33, 452, 96];
const footballSeasons = [2021, 2020, 2019]
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

document.getElementById('seasonStandings').onchange = function(){updateStandingsTable();};

function checkStorage(key){
    let data = JSON.parse(localStorage.getItem(key));
    return data && data !== null;
}

function fetchStandings(){
    for(let i = 0; i < footballSeasons.length; i++) {
        fetchFromAPI(requestStandingsFromTeamURL.concat(`league=${standingsTableData.leagueID}&season=${footballSeasons[i]}`))
    }
}

function fetchStandings(){
    let standingsData = {};
    if (checkStorage(STANDINGS_FOOTBALL_KEY)) return;
    // api call, storing the data in topScorers object
    for(let i = 0; i < footballSeasons.length; i++) {
        fetch(requestStandingsFromTeamURL.concat(`league=${standingsTableData.leagueID}&season=${footballSeasons[i]}`), requestOptions)
        .then(response => response.json())
        .then((data) => {
            standingsData[footballSeasons[i]] = data.response

            localStorage.setItem(STANDINGS_FOOTBALL_KEY, JSON.stringify(standingsData))
        })
        .catch(err => {
            console.error(err);
        });
    }
    
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
//         teamsId[leagueNames[i]] = teamsId[leagueNames[i]].concat(teamsData[0]['league']['standings'][j]['team']['id'])
// 
//             localStorage.setItem(TEAM_ID_KEYS, JSON.stringify(teamsId))
//         }
//     }
// }

//function updateSeasons(){
//    standingsTableData.selectedSeason = standingsElements.seasonStandings.options[standingsElements.seasonStandings.selectedIndex].value
//    fetchStandings();
//    updateStandingsTable();
//}

function updateStandingsTable() {

    let tempData;
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

    switch(seasonStandings.value) {
        case '2021':
        // Loop to access all rows 
        tempData = JSON.parse(localStorage.getItem(STANDINGS_FOOTBALL_KEY))
        tableData= tempData[footballSeasons[0]];

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
            <td>${tableData[0]['league']['standings'][0][i]['form']}</td>
            <tr id="hidden_row${i}" class="hidden_row">
                <td colspan=8>
                </td>
            </tr>`;
        }
        case '2020':
        // Loop to access all rows 
        tempData = JSON.parse(localStorage.getItem(STANDINGS_FOOTBALL_KEY))
        tableData= tempData[footballSeasons[1]];

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
            <td>${tableData[0]['league']['standings'][0][i]['form']}</td>
            <tr id="hidden_row${i}" class="hidden_row">
                <td colspan=8>
                </td>
            </tr>`;
        }
        case '2019':
        // Loop to access all rows 
        tempData = JSON.parse(localStorage.getItem(STANDINGS_FOOTBALL_KEY))
        tableData= tempData[footballSeasons[2]];

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
            <td>${tableData[0]['league']['standings'][0][i]['form']}</td>
            <tr id="hidden_row${i}" class="hidden_row">
                <td colspan=8>
                </td>
            </tr>`;
        }
    }
}


/*
Runs when the page loads 
*/

function main() {

    //fetchStandings(footballLeagueId, 2021, footballLeague, STANDINGS_FOOTBALL_KEY)

    //checkId(footballLeagueId, footballLeague)

    //fetchFixtureByTeamID(footballLeagueId, footballLeague, FIXTURES_FOOTBALL_TEAM_KEY)

    fetchStandings();

    updateStandingsTable();

}

function showHideRow(row) {
    $("#" + row).toggle();
}


main();