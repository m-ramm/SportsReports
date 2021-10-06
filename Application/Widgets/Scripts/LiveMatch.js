
var ctx = document.getElementById('scatter_graph').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: new Array(91).fill(0),
        datasets: [{
            label: 'Goals Scored',
            data: new Array(91).fill(0),
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

// Fill the array with time:
let lab = myChart.data.labels
for(i = 0; i < lab.length; i++){
    myChart.data.labels[i] = i;
}

//console.log(myChart.data.labels);

// change page title to display whatever league is selected:
//document.getElementById('title').innerHTML = `Statistics - ${league}`;

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
            if(venueData[i].league.id == 39){
                reqEventData = getLiveEventDataByID(venueData[i].fixture.id);
                graphfromData(reqEventData);

            }
            else if(venueData[i].league.id == 140){
                reqEventData = getLiveEventDataByID(venueData[i].fixture.id);
                graphfromData(reqEventData);

            }
            else if(venueData[i].league.id == 61){
                reqEventData = getLiveEventDataByID(venueData[i].fixture.id);
                graphfromData(reqEventData);

            }
            else if(venueData[i].fixture.id == 727854){
                getLiveEventDataByID(venueData[i].fixture.id);
                //console.log(reqEventData)
                //graphfromData(reqEventData);
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
    Eventurl = Eventurl +"?fixture=" + FixutureID;
    fetch(Eventurl, requestOptions)
    .then(response => response.json())
    .then((data) => {
        eventsData = data.response;
        graphfromData(eventsData);
    //return eventsData;
    })

function graphfromData(eventsData){
    console.log(eventsData);
    let teamF = eventsData[0].team.name;
    for(i = 0; i < eventsData.length; i++){
        // get the name of team1:
        let team1 = eventsData[i].team.name;
        console.log(team1)

        // nested if:
        if(eventsData[i].team.name == teamF){
            if(eventsData[i].type == "Goal"){
                console.log('True')
                // get time:
                current_time = eventsData[i].time.elapsed;
                console.log(current_time)

                // might need to delete next line:
                //myChart.data.labels.push(eventsData[i].time.elapsed);

                // goals scored:
                for(j = current_time; j < myChart.data.datasets[0].data.length; j++){
                    console.log(j);
                    myChart.data.datasets[0].data[j] = 1;
                }

                // delete next line
                //myChart.data.datasets.data.push(1);
                myChart.update();
            }
        // if name is not team1:
        else{
            if(eventsData[i].type == "Goal"){
                for(j = current_time; j < myChart.data.datasets[0].data.length; j++){
                    myChart.data.datasets[0].data[j] = -1;
                    console.log(myChart.data.datasets[0].data[j])
                }

                // delete this line
                //myChart.data.datasets.data.push(-1);
                myChart.update();
            }
        }
        }``


    }
}


        }

