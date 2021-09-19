const footballLeagueId = [39, 140, 61];
const footballLeague = ['Premier League', 'La Liga', 'Ligue One'];
const league = localStorage.getItem('league')

const STANDINGS_FOOTBALL_KEY = "standingsFootball";

const KEY = 'd478817a0fmsh584e04929c59a24p15d9b7jsn193d317fead8';

myHeaders = {
    "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
    "x-rapidapi-key" : KEY
};

var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
};

function checkStorage(key){
    let data = JSON.parse(localStorage.getItem(key));
    return data && data !== null;
}

function fetchStandings(leagueId, leagueNames, leagueTableStorageKey){
    let standings = {};
    // if storage is already filled, then don't run api request
    if (checkStorage(leagueTableStorageKey)) return;

    for(let i = 0; i < leagueId.length; i++) {
        fetch(`https://api-football-v1.p.rapidapi.com/v3/standings?season=2020&league=${leagueId[i]}`, requestOptions)
        .then(response => response.json())
        .then((data) => {
            standings[ leagueNames[i] ] = data.response;
            // put into localStorage
            localStorage.setItem(leagueTableStorageKey, JSON.stringify(standings));  
        })
        .catch(error => console.log("error", error));
    }
 
}

const tableElements = {
    leagueTableStats: document.getElementById('leagueTableStats')
}

function updateTable() {

    let tableData;
    let tempData;

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
    tempData = JSON.parse(localStorage.getItem(STANDINGS_FOOTBALL_KEY));
    tableData = tempData[league]; 

    // building table 
    for(let i = 0; i < 10; i++) {
        leagueTableStats.innerHTML += 
        `<tr>
        <td>${tableData[i]['standings'][0][i]['rank']}</td>
        <td>${tableData[i]['standings'][0][i]['team']['name']}</td>
        <td>${tableData[i]['standings'][0][i]['all']['played']}</td>
        <td>${tableData[i]['standings'][0][i]['all']['win']}</td>
        <td>${tableData[i]['standings'][0][i]['all']['draw']}</td>
        <td>${tableData[i]['standings'][0][i]['all']['lose']}</td>
        <td>${tableData[i]['standings'][0][i]['points']}</td>
        <td>${tableData[i]['standings'][0][i]['form']}</td>
        </tr>`;
    }
}

/*
Runs when the page loads 
*/
function main() {

    fetchStandings(footballLeagueId, footballLeague, STANDINGS_FOOTBALL_KEY);

    updateTable();
}

function showHideRow(row) 
    {
        $("#" + row).toggle();
    }

main();