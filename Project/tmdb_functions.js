// Code by Rodjovit Ramos

//search bar function
async function getMovieData(query) {

    const encoded_query = encodeURIComponent(query);
    const url = 'https://api.themoviedb.org/3/search/movie?query=' + encoded_query + '&include_adult=false&language=en-US';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ODZjZWUwMzkxZTBjMWYzMGY4MDFlNDI2YTBjNTFiZCIsInN1YiI6IjY1YmIwODM3MWZkMzZmMDE0OTcxYWIyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pZJ6GS-C1YzJbZhwAx28zA0yP_nb049MoVUOcIlF1Xs'
            }
    };
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('error:', error);
    }
}

//search actor function
async function getActorData(query) {
    const encoded_query = encodeURIComponent(query);
    const url = 'https://api.themoviedb.org/3/search/person?query=' + encoded_query + '&include_adult=false&language=en-US';
    const options = {
        method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ODZjZWUwMzkxZTBjMWYzMGY4MDFlNDI2YTBjNTFiZCIsInN1YiI6IjY1YmIwODM3MWZkMzZmMDE0OTcxYWIyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pZJ6GS-C1YzJbZhwAx28zA0yP_nb049MoVUOcIlF1Xs'
            }
    };
    try{
        const response = await fetch(url, options)
        const data = await response.json();
        return data;
    } catch (error){
        console.error('error:', error);
    }
}

//main function (search watch providers function)
async function getWatchProviders(movie_id){
    const url = 'https://api.themoviedb.org/3/movie/'+movie_id+'/watch/providers';
    const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ODZjZWUwMzkxZTBjMWYzMGY4MDFlNDI2YTBjNTFiZCIsInN1YiI6IjY1YmIwODM3MWZkMzZmMDE0OTcxYWIyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pZJ6GS-C1YzJbZhwAx28zA0yP_nb049MoVUOcIlF1Xs'
    }
    };

   try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('error:', error);
    }
}


//extra details function
async function mapGenreIDtoName(genre_id){
    const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en';
    const options = {
    method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ODZjZWUwMzkxZTBjMWYzMGY4MDFlNDI2YTBjNTFiZCIsInN1YiI6IjY1YmIwODM3MWZkMzZmMDE0OTcxYWIyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pZJ6GS-C1YzJbZhwAx28zA0yP_nb049MoVUOcIlF1Xs'
        }
    };
    try {
        const response = await fetch(url, options);
        const json = await response.json();
        for (let genre of json.genres) {
            if (genre.id == genre_id) {
                return genre.name;
            }
        }
    } catch (error) {
        console.error('error:', error);
    }
}

//get popular (or any filter) movie images
async function getPopMovieImages(){
    let images = [];
    const url = 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1';
    const options = {
    method: 'GET',
    headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ODZjZWUwMzkxZTBjMWYzMGY4MDFlNDI2YTBjNTFiZCIsInN1YiI6IjY1YmIwODM3MWZkMzZmMDE0OTcxYWIyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pZJ6GS-C1YzJbZhwAx28zA0yP_nb049MoVUOcIlF1Xs'
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        for (let movie of data.results){
            images = await images.concat(movie.poster_path);
        }
        return images;
    } catch (error) {
        console.error('error:', error);
    }
}

//surprise me helper function
async function getMovieByID(movie_id){
    const fetch = require('node-fetch');
    const url = 'https://api.themoviedb.org/3/movie/'+movie_id+'?include_adult=falselanguage=en-US';
    const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ODZjZWUwMzkxZTBjMWYzMGY4MDFlNDI2YTBjNTFiZCIsInN1YiI6IjY1YmIwODM3MWZkMzZmMDE0OTcxYWIyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pZJ6GS-C1YzJbZhwAx28zA0yP_nb049MoVUOcIlF1Xs'
    }};
    try{
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    }catch(error){
        console.error('error:', error);
    }
}

//surprise me function
async function surpriseMe(){
    random_id = Math.floor(Math.random()*10000);
    getMovieByID(random_id).then(async data => {
        if (data.status_code == 34){
            surpriseMe();
        } else {
            console.log(data.title);
        }
    });
}

//main function (search watch providers function)
async function getWatchProviders(movie_id){
    const url = 'https://api.themoviedb.org/3/movie/'+movie_id+'/watch/providers';
    const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ODZjZWUwMzkxZTBjMWYzMGY4MDFlNDI2YTBjNTFiZCIsInN1YiI6IjY1YmIwODM3MWZkMzZmMDE0OTcxYWIyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pZJ6GS-C1YzJbZhwAx28zA0yP_nb049MoVUOcIlF1Xs'
    }
    };

   try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('error:', error);
    }
}

//base url for matinee pic:  https://image.tmdb.org/t/p/w780/

// test
// getMovieData('Kung Fu Panda 2').then(async data => {
//     console.log("Image: " + "https://image.tmdb.org/t/p/w780/" + data.results[0].poster_path + "\n")
//     console.log("Movie ID: " + data.results[0].id + "\n")
//     console.log("Title: ")
//     console.log(data.results[0].title) 
//     console.log("\n")
//     console.log("Release Date: ")
//     console.log(data.results[0].release_date)
//     console.log("\n")
//     console.log("Overview: ")
//     console.log(data.results[0].overview)
//     console.log("\n")
//     console.log("Genres: ");
//     for (let genre of data.results[0].genre_ids){
//         console.log(await mapGenreIDtoName(genre));
//     }
//     console.log("\n");
//     getWatchProviders(data.results[0].id).then(data => {
//         console.log("Rent: ");
//         for (let key in data.results.US.rent){
//             console.log(key + ": " + data.results.US.rent[key].provider_name);
//         }
//         console.log("\n");
//         console.log("Buy: ");
//         for (let key in data.results.US.buy){
//             console.log(key + ": " + data.results.US.buy[key].provider_name);
//         }
//         console.log("\n");
//         console.log("Stream: ");
//         for (let key in data.results.US.flatrate){
//             console.log(key + ": " + data.results.US.flatrate[key].provider_name);
//         }
//     });
// });

surpriseMe()