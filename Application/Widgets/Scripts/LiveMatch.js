var ctx = document.getElementById('scatter_graph').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: '# of Votes',
            data: [],
            backgroundColor: [
                'red',
                'red',
                'red',
                'red',
                'red',
                'red'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});


// --------------------------------- API testing ---------------->>
const data_key = "35d8517127mshdf20e1fe84837bbp18973fjsn99f4faf52300";
const ids = "allTheIDs";
let venueData = [];
// ------------------------------get Fixtures--------------------->>
myHeaders = {
    "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
	"x-rapidapi-key": data_key
}

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

function getDataforLocation(FetchURL){
    fetch(FetchURL, requestOptions)
    .then(response =>response.json())
    .then((data) => {
        venueData = data.response
        console.log(venueData)
        setText(venueData)

        // get fixture ID:
        for(i = 0; i < venueData.length; i++){
            if(venueData[i].fixture.id == 39){
                reqEventData = getLiveEventDataByID("39");
                graphData(reqEventData);

            }
            else if(venueData[i].fixture.id == 140){
                reqEventData = getLiveEventDataByID("140");
                graphData(reqEventData);

            }
            else if(venueData[i].fixture.id == 61){
                reqEventData = getLiveEventDataByID("140");
                graphData(reqEventData);

            }
        }

    })
    .catch(err => {
        console.log(err);
    });
}

getDataforLocation("https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all")


// ----------------------------------------get Events ------------------------>>
// get location from the API:
function setText(data){
    let locs = document.getElementById('Loc1');
    for(i = 0; i < data.length; i++){
        locs.innerHTML += `<p1>${data[i].fixture.venue.name} <br/>`;
    }
}

// get events
//function getEvents(FetchURL){
//    fetch(FetchURL, requestOptions)
//    .then(response => response.json())
//    .then((data) => {
//        eventsdata = data.response
//        console.log(eventsdata)
//    })
//}
//getEvents("https://api-football-v1.p.rapidapi.com/v3/fixtures/statistics?fixture=215662&team=463")


// -------------------------------- graph data ----------------------->>
function getLiveEventDataByID(FixutureID){
    let Eventurl = "https://api-football-v1.p.rapidapi.com/v3/fixtures/events";
    Eventurl += Eventurl +"?fixture=" + FixutureID;
    fetch(Eventurl, requestOptions)
    .then(response => response.json())
    .then((data) => {
        eventsData = data.response;
    return eventsData;
    })

function graphData(eventsData){
    team1 = eventsData[0].team.name;
    for(i = 0; i < data.length; i++){
        // get the name of team1:
        let team1 = eventsData[i].team.name;

        // nested if:
        if(eventsData[i].team.name == team1){
            if(eventsData[i].type == "Goal"){
                // get time:
                myChart.data.labels.push(eventsData[i].time.elapsed);
                // goals scored:
                myChart.data.datasets.data.push(1);
                myChart.update();
            }
        // if name is not team1:
        else{
            if(eventsData[i].type == "Goal"){
                myChart.data.datasets.data.push(-1);
                myChart.update();
            }
        }
        }

        

    }
}


        }

