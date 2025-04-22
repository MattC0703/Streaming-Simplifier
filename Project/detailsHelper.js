// Code by Matthew Culley (unused)

var current_id = localStorage.getItem('currentMovie');
async function getMovieByID(movie_id){
    // const fetch = require('node-fetch');
    const url = 'https://api.themoviedb.org/3/movie/'+movie_id+'?include_adult=falselanguage=en-US';
    const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYzRkMjE0ZmY4YzI3ZWUwYzU5YzllYWQxMTQ3YjkxMCIsIm5iZiI6MTc0NTM0NzY3NS43NTIsInN1YiI6IjY4MDdlNDViYjY1OTgyMjgxMmVlYTUzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.u28CIZf4aAUUvS50fIBo-TIcZkpdL7ayh_f0iIszCps'
    }};
    try{
        const response = await fetch(url, options);
        const data = await response.json();
        // localStorage.setItem('currentTitle', data.original_title);
        return data;
    }catch(error){
        console.error('error:', error);
    }
}
function setLinkName(){
    getMovieByID(current_id).then(data => {
        console.log(data.original_title);
        localStorage.setItem('currentTitle', data.original_title);
        console.log(localStorage.getItem('currentTitle'));
    })
}
setLinkName();