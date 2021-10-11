let standingsTeamsData = []

const footballLeagueId = [39, 140, 61];
const footballLeague = ['Premier League', 'La Liga', 'Ligue One'];
const standingTeamIds = [33, 452, 96];
const footballSeasons = [2021, 2020, 2019]
const league = localStorage.getItem('league')

const STANDINGS_FOOTBALL_KEY = "standingsFootball";
const FIXTURES_FOOTBALL_TEAM_KEY = "fixturesFootballTeams"
const FIXTURES_FOOTBALL_TEAM_KEY_test = "fixturesFootballTeamsTest"
const TEAM_ID_KEYS = "teamIdsFootball"

const KEY = 'd478817a0fmsh584e04929c59a24p15d9b7jsn193d317fead8';

const requestStandingsURL = "https://api-football-v1.p.rapidapi.com/v3/standings?"
const requestTeamsFromStandingsURL = "https://api-football-v1.p.rapidapi.com/v3/fixtures?"

const RANKING_NUMS = 20;

const standingsElements = {
    leagueTableTeams: document.getElementById('leagueTableTeams'),
    leagueTableStats: document.getElementById('leagueTableStats'),
    seasonStandings: document.getElementById('seasonStandings')
}
const standingsTableData = {
    leagueID: footballLeagueId[footballLeague.indexOf(league)],
    selectedSeason: '2021',
    selectedTeam: {}
}

myHeaders = {
    "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
    "x-rapidapi-key": KEY
};

var requestOptions = {
    method: "GET",
    headers: myHeaders,
};

document.getElementById('currentLeague').innerHTML = `Current League: <br> ${league}`;

document.getElementById('seasonStandings').onchange = function () { updateStandingsTable(); };

function checkStorage(key) {
    let data = JSON.parse(localStorage.getItem(key));
    return data && data !== null;
}

function fetchStandings() {
    for (let i = 0; i < footballSeasons.length; i++) {
        fetchFromAPI(requestStandingsURL.concat(`league=${standingsTableData.leagueID}&season=${footballSeasons[i]}`), 'standings')
    }
}

// Be careful when refreshing page because it calls the api 6 times everytime the page refreshes.
function fetchStandingsAPI() {
    let standingsData = {};
    // if (checkStorage(STANDINGS_FOOTBALL_KEY)) return;
    // api call, storing the data in topScorers object
    for (let i = 0; i < footballSeasons.length; i++) {
        fetch(requestStandingsURL.concat(`league=${standingsTableData.leagueID}&season=${footballSeasons[i]}`), requestOptions)
            .then(response => response.json())
            .then((data) => {
                standingsData[footballSeasons[i]] = data.response
                localStorage.setItem(STANDINGS_FOOTBALL_KEY, JSON.stringify(standingsData))
                getTeamIds()
            })
            .catch(err => {
                console.error(err);
            });
    }

}

function getTeamIds() {
    let tempData;

    tempData = JSON.parse(localStorage.getItem(STANDINGS_FOOTBALL_KEY))
    season = tempData[footballSeasons[0]]
    for (var j = 0; j < RANKING_NUMS; j++) {
        teamIds = season[0]['league']['standings'][0][j]['team']['id']
        standingsTeamsData.push(teamIds)
    }

}

function fetchFixturesAPI() {
    let fixturesData = {};
    getTeamIds()
    // if (checkStorage(FIXTURES_FOOTBALL_TEAM_KEY_test)) return;
    // api call, storing the data in topScorers object
    for (let i = 0; i < footballSeasons.length; i++) {
        fetch(requestTeamsFromStandingsURL.concat(`league=${standingsTableData.leagueID}&season=${footballSeasons[i]}`), requestOptions)
            .then(response => response.json())
            .then((data) => {
                fixturesData[footballSeasons[i]] = data.response
                localStorage.setItem(FIXTURES_FOOTBALL_TEAM_KEY_test, JSON.stringify(fixturesData))
            })
            .catch(err => {
                console.error(err);
            });
    }
}

function updateStandingsTable() {

    let tempData;
    let tableData;
    let tempTeamData;
    let teamData;

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

    switch (seasonStandings.value) {
        case '2021':
            // Loop to access all rows 
            tempData = JSON.parse(localStorage.getItem(STANDINGS_FOOTBALL_KEY))
            tableData = tempData[footballSeasons[0]];
            tempTeamData = JSON.parse(localStorage.getItem(FIXTURES_FOOTBALL_TEAM_KEY_test))
            teamData = tempTeamData[footballSeasons[0]];

            // building table 
            for (var i = 0; i < RANKING_NUMS; i++) {

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
                        <td colspan=8 id="leagueHiddenTableStats${i}">
                        </td>
                    </tr>`;

                currentTeam = tableData[0]['league']['standings'][0][i]['team']['id'];
                var hiddenStats = document.getElementById(`leagueHiddenTableStats${i}`)
                played = tableData[0]['league']['standings'][0][19]['all']['played']
                totalFixtures = played * 10

                for (var j = 0; j < totalFixtures; j++) {
                    awayTeam = teamData[j]['teams']['away']['id']
                    homeTeam = teamData[j]['teams']['home']['id']
                    awayTeamName = teamData[j]['teams']['away']['name']
                    homeTeamName = teamData[j]['teams']['home']['name']
                    currentRound = teamData[j]['league']['round']
                    roundNum = currentRound.replace(/\D/g, "");

                    awayResult = teamData[j]['teams']['away']['winner']
                    homeResult = teamData[j]['teams']['home']['winner']
                    //&#10004;&#65039; = green tick
                    //&#10060; = red cross
                    //&#68; = D(draw)
                    if (awayResult == true) {
                        aResult = `&#10004;&#65039;`
                        hResult = `&#10060;`
                    }
                    if (homeResult == true) {
                        aResult = `&#10060;`
                        hResult = `&#10004;&#65039;`
                    }
                    if (awayResult == null){
                        aResult = `<b>&#68;</b>`
                        hResult = `<b>&#68;</b>`
                    }

                    if (currentTeam == homeTeam) {
                        hiddenStats.innerHTML +=
                            `Round ${roundNum}: ${hResult} ${homeTeamName} VS ${awayTeamName} ${aResult}<br>`;
                    }
                    if (currentTeam == awayTeam) {
                        hiddenStats.innerHTML +=
                            `Round ${roundNum}: ${aResult} ${awayTeamName} VS ${homeTeamName} ${hResult} <br>`;
                    }
                }
            }
            break;

        case '2020':
            // Loop to access all rows 
            tempData = JSON.parse(localStorage.getItem(STANDINGS_FOOTBALL_KEY))
            tableData = tempData[footballSeasons[1]];
            tempTeamData = JSON.parse(localStorage.getItem(FIXTURES_FOOTBALL_TEAM_KEY_test))
            teamData = tempTeamData[footballSeasons[1]];

            // building table 
            for (var i = 0; i < RANKING_NUMS; i++) {
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
                        <td colspan=8 id="leagueHiddenTableStats${i}">

                        </td>
                    </tr>`;

                currentTeam = tableData[0]['league']['standings'][0][i]['team']['id'];
                var hiddenStats = document.getElementById(`leagueHiddenTableStats${i}`)

                for (var j = 379; j > 269; j--) {
                    awayTeam = teamData[j]['teams']['away']['id']
                    homeTeam = teamData[j]['teams']['home']['id']
                    awayTeamName = teamData[j]['teams']['away']['name']
                    homeTeamName = teamData[j]['teams']['home']['name']
                    currentRound = teamData[j]['league']['round']
                    roundNum = currentRound.replace(/\D/g, "");

                    awayResult = teamData[j]['teams']['away']['winner']
                    homeResult = teamData[j]['teams']['home']['winner']
                    //&#10004;&#65039; = green tick
                    //&#10060; = red cross
                    //&#68; = D(draw)
                    if (awayResult == true) {
                        aResult = `&#10004;&#65039;`
                        hResult = `&#10060;`
                    }
                    if (homeResult == true) {
                        aResult = `&#10060;`
                        hResult = `&#10004;&#65039;`
                    }
                    if (awayResult == null){
                        aResult = `<b>&#68;</b>`
                        hResult = `<b>&#68;</b>`
                    }

                    if (currentTeam == homeTeam) {
                        hiddenStats.innerHTML +=
                            `Round ${roundNum}: ${hResult} ${homeTeamName} VS ${awayTeamName} ${aResult}<br>`;
                    }
                    if (currentTeam == awayTeam) {
                        hiddenStats.innerHTML +=
                            `Round ${roundNum}: ${aResult} ${awayTeamName} VS ${homeTeamName} ${hResult} <br>`;
                    }
                }
            }
            break;

        case '2019':
            // Loop to access all rows 
            tempData = JSON.parse(localStorage.getItem(STANDINGS_FOOTBALL_KEY))
            tableData = tempData[footballSeasons[2]];
            tempTeamData = JSON.parse(localStorage.getItem(FIXTURES_FOOTBALL_TEAM_KEY_test))
            teamData = tempTeamData[footballSeasons[2]];

            // building table 
            for (var i = 0; i < RANKING_NUMS; i++) {
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
                        <td colspan=8 id="leagueHiddenTableStats${i}">
                        </td>
                    </tr>`;

                currentTeam = tableData[0]['league']['standings'][0][i]['team']['id'];
                var hiddenStats = document.getElementById(`leagueHiddenTableStats${i}`)

                for (var j = 379; j > 269; j--) {
                    awayTeam = teamData[j]['teams']['away']['id']
                    homeTeam = teamData[j]['teams']['home']['id']
                    awayTeamName = teamData[j]['teams']['away']['name']
                    homeTeamName = teamData[j]['teams']['home']['name']
                    currentRound = teamData[j]['league']['round']
                    roundNum = currentRound.replace(/\D/g, "");

                    awayResult = teamData[j]['teams']['away']['winner']
                    homeResult = teamData[j]['teams']['home']['winner']
                    //&#10004;&#65039; = green tick
                    //&#10060; = red cross
                    //&#68; = D(draw)
                    if (awayResult == true) {
                        aResult = `&#10004;&#65039;`
                        hResult = `&#10060;`
                    }
                    if (homeResult == true) {
                        aResult = `&#10060;`
                        hResult = `&#10004;&#65039;`
                    }
                    if (awayResult == null){
                        aResult = `<b>&#68;</b>`
                        hResult = `<b>&#68;</b>`
                    }

                    if (currentTeam == homeTeam) {
                        hiddenStats.innerHTML +=
                            `Round ${roundNum}: ${hResult} ${homeTeamName} VS ${awayTeamName} ${aResult}<br>`;
                    }
                    if (currentTeam == awayTeam) {
                        hiddenStats.innerHTML +=
                            `Round ${roundNum}: ${aResult} ${awayTeamName} VS ${homeTeamName} ${hResult} <br>`;
                    }
                }
            }
            break;
    }
}


/*
Runs when the page loads 
*/

function main() {

    fetchStandingsAPI();
    fetchFixturesAPI();
    updateStandingsTable();

}

function showHideRow(row) {
    $("#" + row).toggle();
}

main();
