// ----------------------------- graph ---------------------- >>
var ctx = document.getElementById('scatter_graph').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
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
    })
    .catch(err => {
        console.log(err);
    });
}

getData("https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all")

// get location from the API:
function setText(data){
    let locs = document.getElementById('Loc1');
    for(i = 0; i < data.length; i++){
        locs.innerHTML += `<p1>Venue: ${data[i].fixture.venue.name}  <br />`;
    }
}

