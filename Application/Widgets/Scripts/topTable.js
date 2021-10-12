//* storage keys
// soccer keys
const TOP_SCORERS_FOOTBALL_KEY = "topScorersFootball";
const TOP_ASSISTS_FOOTBALL_KEY = "topAssistsFootball";
const TOP_RED_FOOTBALL_KEY = "topRedFootball";
const TOP_YELLOW_FOOTBALL_KEY = "topYellowFootball";
// basketball keys
// cricket keys

//* number of top x's
const NUM_OF_TOP = 10; // can only go up to 20

//* GETTING HTML ELEMENTS
const tableElements = {
    //seasonSelect: document.getElementById('seasonSelect'),
    tableType: document.getElementById('tableStats'),
    topTable: document.getElementById('topTable')
}

// changing page title to display what league is selected
//! in future, may want to include which sport it is as well
// document.getElementById('title').innerHTML = `Statistics - ${league}`;

// attaching onchange event listener to 'tableStats'
// means that whenever the statistic wanted changes, then the updateTable function will run
document.getElementById('tableStats').onchange = function(){updateTable();};
//! add event listener for season when included


// ---------------------------------------------------------------------------------------------------------------------------- //


/* 
this function runs from the 'onchange' event listener attached to the 'tableStats' element

*/ 
function updateTable() {
    // statType can be: 'Goals', 'Assists', 'Red cards', 'Yellow cards'
    let statType = document.getElementById('tableStats').value;
    let tableData;
    let tempData;

    // TODO: check sport
    // check what sport, to get relevant keys
    // localStorage.getItem('sport')

    // TODO: adapt for multiple sports and leagues
    // check what league
    // localStorage.getItem('league')
    // currentLeagueId = footballLeagueId[footballLeague.indexOf(league)];

    //! can include players photo using this url : https://media.api-sports.io/football/players/{player_id}.png
    //! can include the club's logo by doing tableData[i]['statistics'][0]['team']['logo'] in img tag
    // building table headers
    topTable.innerHTML = `<tr>
    <th>Rank</th>
    <th>Player</th>
    <th>Team</th>
    <th>${statType}</th>
    </tr>`;

    /* Example row
    <tr>
    <td>1</td>
    <td>Antony Loose</td>
    <td>Manchester United</td>
    <td>9</td>
    </tr>
    */

    // switch statement finds the data and builds the table depending on what statType is selected by the user
    switch(statType) {
        case 'Goals':
            // retrieving relevant data
            tempData = JSON.parse(localStorage.getItem(TOP_SCORERS_FOOTBALL_KEY))
            tableData = tempData[league]; 

            // building table 
            for(let i = 0; i < NUM_OF_TOP; i++) {
                topTable.innerHTML += `<tr>
                <td>${i+1}</td>
                <td>${tableData[i]['player']['name']}</td>
                <td>${tableData[i]['statistics'][0]['team']['name']}</td>
                <td>${tableData[i]['statistics'][0]['goals']['total']}</td>
                </tr>`;
            }
            break;

        case 'Assists':
            // retrieving relevant data
            tempData = JSON.parse(localStorage.getItem(TOP_ASSISTS_FOOTBALL_KEY))
            tableData = tempData[league]; 

            // building table
            for(let i = 0; i < NUM_OF_TOP; i++) {
                topTable.innerHTML += `<tr>
                <td>${i+1}</td>
                <td>${tableData[i]['player']['name']}</td>
                <td>${tableData[i]['statistics'][0]['team']['name']}</td>
                <td>${tableData[i]['statistics'][0]['goals']['assists']}</td>
                </tr>`;
            }
            break;

        case 'Red cards':
            // retrieving relevant data
            tempData = JSON.parse(localStorage.getItem(TOP_RED_FOOTBALL_KEY))
            tableData = tempData[league]; 

            // building table
            //! currently total reds = yellowred + red, may need change
            for(let i = 0; i < NUM_OF_TOP; i++) {
                topTable.innerHTML += `<tr>
                <td>${i+1}</td>
                <td>${tableData[i]['player']['name']}</td>
                <td>${tableData[i]['statistics'][0]['team']['name']}</td>
                <td>${tableData[i]['statistics'][0]['cards']['yellowred'] + tableData[i]['statistics'][0]['cards']['red']}</td>
                </tr>`;
            }
            break;

        case 'Yellow cards':
            // retrieving relevant data
            tempData = JSON.parse(localStorage.getItem(TOP_YELLOW_FOOTBALL_KEY))
            tableData = tempData[league];

            // building table
            for(let i = 0; i < NUM_OF_TOP; i++) {
                topTable.innerHTML += `<tr>
                <td>${i+1}</td>
                <td>${tableData[i]['player']['name']}</td>
                <td>${tableData[i]['statistics'][0]['team']['name']}</td>
                <td>${tableData[i]['statistics'][0]['cards']['yellow']}</td>
                </tr>`;
            }
            break;
             
    }

    // boilerplate for building table

    // for(let i = 0; i < NUM_OF_TOP; i++) {
    //     topTable.innerHTML += `<tr>
    //     <td>${i+1}</td>
    //     <td>${tableData[i]['player']['name']}</td>
    //     <td>${tableData[i]['statistics'][0]['team']['name']}</td>
    //     <td>${tableData[i]['statistics'][0]['goals']['total']}</td>
    //     </tr>`;
    // }

}

/*
    This function runs when the page loads, creates the table with the default value of top goals
*/
function main() {
    updateTable();
}

main();