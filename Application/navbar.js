/*
This may be a way can implement the common values through local storage.
Have only done it on navbar.html to test it out, if this approach is fine then we
can move it on to index.html and rest of the pages. Maybe we can set other values
through this method as well

Also: maybe clear local storage if user clicks home ??

Mursal
*/

// pass string that represents selected league
function setLeagueStorage(value){
    window.localStorage.setItem('league', value)
}