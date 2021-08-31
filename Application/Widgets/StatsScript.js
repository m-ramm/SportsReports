// FETCH FROM API

var data = [13, 11, 15, 8] // replace with call to api
var type = 'bar' // Replace this with selected graph type

// MARK: Configuring graph
var ctx = document.getElementById('statsGraph');
var myChart = new Chart(ctx, {
    type: type, 
    data: {
        labels: ['Harry Kane', 'Robert Firmino', 'Troy Deeny', 'Marcus Rashford'],
        datasets: [{
            label: '# of Goals',
            data: data, 
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
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