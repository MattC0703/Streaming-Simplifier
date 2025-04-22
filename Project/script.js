// Code by Matthew Culley and Rodjovit Ramos

const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', search);



const userInput = document.getElementById('search-bar');
const emptySearch = document.getElementById('empty-search');

const popularButton = document.getElementById('popular-button');
const upcomingButton = document.getElementById('upcoming-button');
const topRatedButton = document.getElementById('top-rated-button');
const currentButton = document.getElementById('current-button');
const dropButton = document.getElementById('drop-button');
const dropdown = document.getElementById('myDropdown');
const nextPage = document.getElementById('next-page');
const lastPage = document.getElementById('last-page');
const surpriseButton = document.getElementById('surprise-button');
const resetButton = document.getElementById('reset-button');

const movieTable = document.querySelectorAll('#movie-holder td a img');
console.log(movieTable);

let isShowing = false;
let url = localStorage.getItem('url');
    if(localStorage.getItem('url') == undefined){
        url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
    }

let urlLabel = localStorage.getItem('urlLabel');
    if(localStorage.getItem('urlLabel') == undefined){
        urlLabel = 'Sort By';
    }
dropButton.innerText = urlLabel+' ⇩';


console.log(localStorage.getItem('url'));

//searchButton.addEventListener('click', search);

async function search(){
    let imagesArray = [];
    let idArray = [];
    console.log(userInput.value);
    if(userInput.value != emptySearch.value)
    query = userInput.value;

    nextPage.style.display = "none";
    lastPage.style.display = "none";
    resetButton.style.display = "block";


    const encoded_query = encodeURIComponent(query);
    const url = 'https://api.themoviedb.org/3/search/movie?query=' + encoded_query + '&include_adult=false&language=en-US';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYzRkMjE0ZmY4YzI3ZWUwYzU5YzllYWQxMTQ3YjkxMCIsIm5iZiI6MTc0NTM0NzY3NS43NTIsInN1YiI6IjY4MDdlNDViYjY1OTgyMjgxMmVlYTUzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.u28CIZf4aAUUvS50fIBo-TIcZkpdL7ayh_f0iIszCps'
            }
    };
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        for (let movie of data.results){
            if(movie.poster_path != null){
                imagesArray = await imagesArray.concat(movie.poster_path);
            } else {
                imagesArray = await imagesArray.concat(movie.original_title);
            }
            idArray = await idArray.concat(movie.id);
        }
        console.log(imagesArray);
        console.log(imagesArray.length);
        console.log(idArray);
        //return data;
    } catch (error) {
        console.error('error:', error);
    }

    let num = 1;
    let indexNum = 0;
    if(imagesArray.length != 0 && imagesArray >= 20){
        for(num = 1; num <= 20; num++){
            let currentImg = $("#img"+num);
            currentImg.attr('src','https://image.tmdb.org/t/p/w780/'+imagesArray[indexNum]);
            currentImg.attr('alt',imagesArray[indexNum]);
            currentImg.attr('name',idArray[indexNum]);

            indexNum++;
        } 
    } else if(imagesArray.length == 0) {
            alert("Sorry! There are NO Movies in our Database Matching: "+ "\""+userInput.value+"\"");
            nextPage.style.display = "block";
            lastPage.style.display = "block";
            resetButton.style.display = "none";
            return;

    } else if(imagesArray.length <= 20){
        for(num = 1; num <= imagesArray.length; num++){
            let currentImg = $("#img"+num);
            currentImg.attr('src','https://image.tmdb.org/t/p/w780/'+imagesArray[indexNum]);
            currentImg.attr('alt',imagesArray[indexNum]);
            currentImg.attr('name',idArray[indexNum]);

            indexNum++
        }
        for(num = imagesArray.length+1; num <=20; num++){
            let currentImg = $("#img"+num);
            currentImg.attr('src','');
            currentImg.attr('alt','No Result!');
            currentImg.attr('name',idArray[indexNum]);

            indexNum++
        }
    }
    
}
userInput.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {  
        search();
    }
});

resetButton.onclick = () => {
    window.location.reload();
}

function createListeners(){
    movieTable.forEach(movie => movie.addEventListener("click", function() {
            console.log(movie.name);
            localStorage.setItem('currentMovie', movie.name);

    }));
    movieTable.forEach(movie => movie.addEventListener("auxclick", function() {
        console.log(movie.name);
        localStorage.setItem('currentMovie', movie.name);

}));
}
createListeners();

dropButton.onclick = () => {
     

        if(!isShowing){
            dropdown.style.display = "flex";
            isShowing = true;
            console.log('showing');
        }else {
            dropdown.style.display = "none";
            isShowing = false;
            console.log('hiding');
        }
    console.log(isShowing);
}

    popularButton.onclick = () => {
        localStorage.setItem('url', 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1');
        window.location.reload();
        localStorage.setItem('urlLabel', 'Popular');
    }
    currentButton.onclick = () => {
        localStorage.setItem('url', 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1');
        window.location.reload();
        localStorage.setItem('urlLabel', 'Current');
    }
    upcomingButton.onclick = () => {
        localStorage.setItem('url', 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1');
        window.location.reload();
        localStorage.setItem('urlLabel', 'Upcoming');
    }
    topRatedButton.onclick = () => {
        localStorage.setItem('url', 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1');
        window.location.reload();
        localStorage.setItem('urlLabel', 'Top Rated');
    }

    //next page ideas
    // 'https://api.themoviedb.org/3/movie/popular?language=en-US&page'+pageNum;
    // I need to figure out how to make the button update the page without needing it to refresh though, because
    // if I just use local storage than returning to the home page or refreshing wouldn't send you back to the first page.
    let pageNum = 1;
    nextPage.onclick = () => {
        pageNum++;
        if(pageNum==10){
            newUrl = url.substring(0, url.length-1)+pageNum;
            url = newUrl;
            console.log(pageNum);
            console.log(newUrl);
            getPopMovieImages();
            
            return;
        }

        
        if(pageNum < 10)
        newUrl = url.substring(0, url.length-1)+pageNum;
        
        if(pageNum > 10)
        newUrl = url.substring(0, url.length-2)+pageNum;

        console.log(pageNum);   
        console.log(newUrl);
        url = newUrl;

        lastPage.style.display = "block";
        
        getPopMovieImages();
    }
        //later pages in the database sometimes have null image references, it's possible that it's missing a movie in that spot
        //but I think it's more likely that there just isn't an image for certain movies
        //if that's the case I think we could have a conditional where if the image reference is null then instead
        //return something else, like an alt text for example or just the name

    lastPage.onclick = () => {
        pageNum--;
        if(pageNum==9){
            newUrl = url.substring(0, url.length-2)+pageNum;
            url = newUrl;
            console.log(pageNum);
            console.log(newUrl);
            getPopMovieImages();
            
            return;
        }


        if(pageNum < 10)
        newUrl = url.substring(0, url.length-1)+pageNum;
        
        if(pageNum >= 10)
        newUrl = url.substring(0, url.length-2)+pageNum;
        
        

        console.log(pageNum);
        console.log(newUrl);
        url = newUrl;

        if(pageNum<2){
            lastPage.style.display = "none";
        } else {
            lastPage.style.display = "block";
        }

        getPopMovieImages();
    }

    async function getMovieByID(movie_id){
        // const fetch = require("node-fetch");
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
            return data;
        }catch(error){
            console.error('error:', error);
        }
    }
    
    surpriseButton.onclick = async function surpriseMe() {
        random_id = Math.floor(Math.random()*10000);
        getMovieByID(random_id).then(async data =>{
            if(data.status_code == 34){
                surpriseMe()
            } else {
                console.log(data.title);
                localStorage.setItem('currentMovie', random_id);
                console.log(localStorage.getItem('currentMovie'));
                window.location.assign('./movieDetails.php');
            }
        })
        
    }
//const testCell = $('#img1');
//testCell.attr('src','images/3Slogo');


async function getPopMovieImages(){
    let idArray = [];
    let imagesArray = [];    
    const options = {
    method: 'GET',
    headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYzRkMjE0ZmY4YzI3ZWUwYzU5YzllYWQxMTQ3YjkxMCIsIm5iZiI6MTc0NTM0NzY3NS43NTIsInN1YiI6IjY4MDdlNDViYjY1OTgyMjgxMmVlYTUzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.u28CIZf4aAUUvS50fIBo-TIcZkpdL7ayh_f0iIszCps'
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        for (let movie of data.results){
            if(movie.poster_path != null){
                imagesArray = await imagesArray.concat(movie.poster_path);
                idArray = await idArray.concat(movie.id);

            } else {
                imagesArray = await imagesArray.concat(movie.original_title);
                idArray = await idArray.concat(movie.id);
            }
        }
        //return imagesArray;
    } catch (error) {
        console.error('error:', error);
    }

    let num = 1;
    let indexNum = 0;
    for(num = 1; num <= 20; num++){
        let currentImg = $("#img"+num);
        currentImg.attr('src','https://image.tmdb.org/t/p/w780/'+imagesArray[indexNum]);
        currentImg.attr('alt',imagesArray[indexNum]);
        currentImg.attr('name',idArray[indexNum]);

        let currentCell = $("#cell"+num);
        indexNum++;
    }
    console.log(imagesArray);

}
getPopMovieImages();


