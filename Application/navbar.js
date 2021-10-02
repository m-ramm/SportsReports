/*
This may be a way can implement the common values through local storage.
Have only done it on navbar.html to test it out, if this approach is fine then we
can move it on to index.html and rest of the pages. Maybe we can set other values
through this method as well.

NOT WORKING AS INTENDED - Just testing.

Also: maybe clear local storage if user clicks home ??

Mursal
*/

// pass string that represents selected league
function setLeagueStorage(value){
    window.localStorage.setItem('league', value)
}

//set logo based of local storage value in options page
const leageVal = window.localStorage.getItem('league');

function getImagePath(local_league){
    var ret_val = "";
    if (local_league == "Premier League"){
        ret_val = "/Application/images/soccer/premier-league.png";
    } else if (local_league == "La Liga"){
        ret_val = "/Application/images/soccer/la-liga.png";
    } else if (local_league == "Ligue One") {
        ret_val = "/Application/images/soccer/ligue-one.png";
    }

    return ret_val;
}

function setImageSrc(path){
    var image_left = document.getElementById('league_logo_left');
    // var image_right = document.getElementById('league_logo_right');

    //set paths and dimensions
    image_left.src = path;
    image_left.style.height = '50px';
    image_left.style.width = '50px';

    // image_right.src = path;
    // image_right.style.height = '50px';
    // image_right.style.width = '50px';

    //set alt attributes
    image_left.alt = 'logo of ' + leageVal
    // image_right.alt = 'logo of ' + leageVal
}

var imagePath = getImagePath(leageVal)
setImageSrc(imagePath);