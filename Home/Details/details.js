// Code by Matthew Culley and Rodjovit Ramos

//const { create } = require("domain");

const poster = $("#movie-poster");
const desc = document.getElementById('movie-desc');
const title = document.getElementById('movie-title');
const rating = document.getElementById('movie-rating');
var current_id = localStorage.getItem('currentMovie');
var movie_image = '';
var movie_title = '';
var movie_desc = '';
var movie_rating = '';

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
            console.log(data.original_title);
            return data;
        }catch(error){
            console.error('error:', error);
        }
    }
    
    // function setLinkName(){
    //     getMovieByID(current_id).then(data => {
    //         console.log(data.original_title);
    //         localStorage.setItem('currentTitle', data.original_title);
    //         console.log(localStorage.getItem('currentTitle'));
    //     })
    // }
    // setLinkName();
    
    function populateSplash(){
        getMovieByID(current_id).then(data => {
            movie_image += 'https://image.tmdb.org/t/p/w780/'+data.poster_path;  
            movie_desc += data.overview;
            movie_title += data.original_title;
            movie_rating += data.vote_average;
            // localStorage.setItem('currentTitle', data.original_title);
            
            console.log(movie_desc);
            console.log(movie_image);
            console.log(movie_title);
            console.log(movie_rating);
            // localStorage.setItem('currentTitle', movie_title);
            
            poster.attr("src", movie_image);
            
            if(movie_desc != '')
            desc.innerHTML = movie_desc;
            
            if(movie_title != '')
            title.innerHTML = movie_title;
            
            rating.innerHTML = movie_rating;
            
            
        })
        // localStorage.setItem('currentTitle', title.innerHTML);
        // console.log(localStorage.getItem('currentTitle'));
        
    }
    populateSplash();
    
    
    //main function (search watch providers function)
    async function getWatchProviders(movie_id){
        let imagesArray = [];
        let rentImages = [];
        let namesArray = [];
        let rentNamesArray = [];
        const url = 'https://api.themoviedb.org/3/movie/'+movie_id+'/watch/providers';
        const url2 = 'https://api.themoviedb.org/3/movie/'+movie_id+'?include_adult=falselanguage=en-US';
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ODZjZWUwMzkxZTBjMWYzMGY4MDFlNDI2YTBjNTFiZCIsInN1YiI6IjY1YmIwODM3MWZkMzZmMDE0OTcxYWIyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pZJ6GS-C1YzJbZhwAx28zA0yP_nb049MoVUOcIlF1Xs'
            }
        };
        
        try {
            const response = await fetch(url, options);
            const response2 = await fetch(url2, options);
            const data = await response.json();
            const data2 = await response2.json();
            console.log(data.results.US);
            createBuyTable(data.results.US.buy.length)
            
            if(typeof data.results.US.buy != "undefined"){
                for(let provider of data.results.US.buy){
                    imagesArray = imagesArray.concat(provider.logo_path);
                    namesArray = namesArray.concat(provider.provider_name);
                    // console.log(provider);
                    // console.log('https://image.tmdb.org/t/p/w780'+provider.logo_path);
                    // console.log(provider.provider_name);
                }
            }
            
            
            
            
            if(typeof data.results.US.rent != "undefined"){    
                createRentTable(data.results.US.rent.length)
                for(let provider of data.results.US.rent){
                    rentImages = rentImages.concat(provider.logo_path);
                    rentNamesArray = rentNamesArray.concat(provider.provider_name);
                }
            }
            
            if(typeof data.results.US.buy != "undefined"){
                for(i = 0; i < data.results.US.buy.length; i++){
                    $('#provider-'+i).css("background-image", 'url(' + 'https://image.tmdb.org/t/p/w780'+imagesArray[i] + ')');
                    $('#provider-'+i).css({
                        backgroundSize: "contain"
                    });
                    providerLink = "https://google.com/search?q="+namesArray[i]+"+Buy+"+data2.original_title;
                    //$('#provider-'+i).attr("href", providerLink);
                    createLinks($('#provider-'+i), providerLink.replace(/ /g,"+"))
                    console.log(providerLink.replace(/ /g,"+"));
                }
            }
            
            if(typeof data.results.US.rent != "undefined"){  
                for(i = 0; i < data.results.US.rent.length; i++){
                    $('#rent-'+i).css("background-image", 'url(' + 'https://image.tmdb.org/t/p/w780'+rentImages[i] + ')');
                    $('#rent-'+i).css({
                        backgroundSize: "contain"
                    });
                    providerLink = "https://google.com/search?q="+rentNamesArray[i]+"+Rent+"+data2.original_title;
                    createLinks($('#rent-'+i), providerLink.replace(/ /g,"+"))
                    console.log(providerLink.replace(/ /g,"+"));
                }
                
                
            }
            //return data;
            console.log(imagesArray);
            console.log(namesArray);
        } catch (error) {
            console.error('error:', error);
        } finally {
            
        }
        
    }
    getWatchProviders(current_id);
    
    //provide a number of columns to generate a single row table
    function createBuyTable(columnNum){
        const tbl = document.querySelector("#provider-table tr")
        // console.log(tbl);
        for(i = 0; i < columnNum; i++){
            tbl.insertCell(i);
        }
        
        const tblTd = $("#provider-table tr td");
        console.log(tblTd);
        n=-1;
        for(let box of tblTd){
            n++;
            $(box).attr("id", "provider-"+n);
        }
    }
    function createLinks(box, link){ //create a holder for the links that can be inserted into a box
        box.html("<a href="+link+" target=\"_blank\">.</a>")
    }
    function createRentTable(columnNum){
        const tbl = document.querySelector("#provider-table-rent tr")
        // console.log(tbl);
        for(i = 0; i < columnNum; i++){
            tbl.insertCell(i);
        }
        const tblTd = $("#provider-table-rent tr td");
        console.log(tblTd);
        n=-1;
        for(let box of tblTd){
            n++;
            $(box).attr("id", "rent-"+n);
            
        }
    }

    async function initializeWatchlist() {
        await loadWatchlist();  // Wait for the watchlist to be fully loaded
        document.getElementById('toggle-watchlist-button').addEventListener('click', () => {
            const movieId = localStorage.getItem('currentMovie');
            toggleWatchlist(movieId);
        });
    }
    initializeWatchlist();

    let userWatchlist = []; //array to eventually hold watchlist item IDs
    //pass a movie Id into this function
    async function toggleWatchlist(movieId) { 
        const token = localStorage.getItem('token');
        console.log("movieId:", movieId);  
        const url = isInWatchlist(movieId) ? 'http://localhost:3000/remove-from-watchlist' : 'http://localhost:3000/add-to-watchlist'; //check if it's in the watchlist and run the post method accordingly

        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ movieId: movieId })
        });
    
        const data = await response.json();
        if (data.success) {
        alert(data.message);  // Show a success message
        loadWatchlist();  // Re-fetch or update the watchlist UI
        } else {
        alert(data.message);  // Handle the error
        }
    }
    async function loadWatchlist() {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/get-watchlist', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        userWatchlist = data.watchlist.map(movie => movie.id); // Just store the IDs
        console.log(userWatchlist);
    }
    loadWatchlist();
    //helper function to check the contents of the watchlist
    function isInWatchlist(movieId) {
        console.log(movieId, typeof movieId);
        console.log(userWatchlist, typeof userWatchlist[0]);
        console.log(userWatchlist.includes(Number(movieId)));
        return userWatchlist.includes(Number(movieId));
    }



    console.log('hi');
    console.log(localStorage.getItem('currentMovie'));
    
