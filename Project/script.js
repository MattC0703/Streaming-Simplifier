// Code by Matthew Culley

//assigning page objects to usable variables



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
const login = document.getElementById('account-logo');
const logout = document.getElementById('logout');
const pfp = document.getElementById('account-info');
const pfpForm = document.getElementById('pfp-form');

const movieTable = document.querySelectorAll('#movie-holder td a img');
console.log(movieTable);

let isShowing = false;
let url = localStorage.getItem('url'); //grab the url to use for the current TMBD filtering mode
    if(localStorage.getItem('url') == undefined){ //if it's undefined for the current user, set it to the popular tab
        url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
    }

let urlLabel = localStorage.getItem('urlLabel'); //if the URL doesn't have a given label, set it to the default
    if(localStorage.getItem('urlLabel') == undefined){
        urlLabel = 'Sort By';
    }
dropButton.innerText = urlLabel+' ⇩';


console.log(localStorage.getItem('url'));

//searchButton.addEventListener('click', search);

if(localStorage.getItem('token')){ //checks if there currently exists a login token
    console.log(localStorage.getItem('token')); 
    login.style.display = 'none'; //hides the options for logging in
    logout.style.display = 'block'; //displays the options for someone who's already logged in
    pfp.style.display = 'flex'; 
}

logout.addEventListener('click', () => {
    localStorage.removeItem('token'); // removes the webtoken used being used to retain logged in status
    alert('You have been logged out.');
    location.reload(); //reload the page
});

let profileOptionsShowing = false;
pfp.addEventListener('click', () => {
    //add logic for pop up menu 

    if(!profileOptionsShowing){
        profileOptionsShowing = true;
        pfpForm.style.display = 'flex';
    } else if (profileOptionsShowing){
        profileOptionsShowing = false;
        pfpForm.style.display = 'none';
    }
    console.log(profileOptionsShowing);
});

pfpForm.addEventListener('submit', async (e) => {
  e.preventDefault(); //prevent the default event

  const form = e.target; //set the event object to a variable
  const formData = new FormData(form); //pass the data from the event object into another variable
  const token = localStorage.getItem('token');  // grab our token

  try {
    const response = await fetch('http://localhost:3000/upload-profile-picture', { //the location of the post request to the backend
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}` //custom header for the request to pass the token into the backend for verification
        // Do NOT set Content-Type when using FormData — fetch handles it
      },
      body: formData //sends the contents of the form to the backend
    });

    const result = await response.text(); //waits for the backend to respond, stores it as text
    alert("Success!"); // alerts the user of the response
    window.location.reload();
    // might reload page or do some kind of custom UI update here
  } catch (error) {
    console.error('Upload failed:', error);
    alert('Upload failed');
  }
});

async function loadProfilePicture() {
    const token = localStorage.getItem('token');  // grab our token
  try {
    const response = await fetch('http://localhost:3000/profile-picture-url', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();

    if (data.signedUrl) {
      document.getElementById('profile-picture').src = data.signedUrl;
    }
  } catch (error) {
    console.error('Error loading profile picture:', error);
  }
}
window.onload = loadProfilePicture;

document.getElementById('menu-icon').addEventListener('click', ()=>{
    document.getElementById('slide-menu').classList.toggle('open');
});














async function search(){
    let imagesArray = []; //declares new arrays for containing the table cells and images
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

    popularButton.onclick = () => { //change the url for populating movies to the popular filter
        localStorage.setItem('url', 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1');
        window.location.reload();
        localStorage.setItem('urlLabel', 'Popular');
    }
    currentButton.onclick = () => { //change the url for populating movies to the currently player filter
        localStorage.setItem('url', 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1');
        window.location.reload();
        localStorage.setItem('urlLabel', 'Current');
    }
    upcomingButton.onclick = () => { //change the url for populating movies to the upcoming filter
        localStorage.setItem('url', 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1');
        window.location.reload();
        localStorage.setItem('urlLabel', 'Upcoming');
    }
    topRatedButton.onclick = () => { //change the url for populating movies to the top rated filter
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
    let idArray = []; //declares new arrays for containing the table cells and images
    let imagesArray = [];    
    const options = {
    method: 'GET',
    headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYzRkMjE0ZmY4YzI3ZWUwYzU5YzllYWQxMTQ3YjkxMCIsIm5iZiI6MTc0NTM0NzY3NS43NTIsInN1YiI6IjY4MDdlNDViYjY1OTgyMjgxMmVlYTUzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.u28CIZf4aAUUvS50fIBo-TIcZkpdL7ayh_f0iIszCps'
        }
    };

    try {
        const response = await fetch(url, options); //calls the data from the API using current user filter (or default)
        const data = await response.json();
        for (let movie of data.results){ //loops through each object in the data
            if(movie.poster_path != null){ //checks to see if a given movie has a poster path (assigned by the TMDB database)
                imagesArray = await imagesArray.concat(movie.poster_path);  //if it has a poster path, add it as a new item in the imagesArray
                idArray = await idArray.concat(movie.id); //do the same with all movie IDs

            } else {
                imagesArray = await imagesArray.concat(movie.original_title); //if it doesn't have a poster path, add the title to use as an alt for the missing photo.
                idArray = await idArray.concat(movie.id);
            }
        }
        //return imagesArray;
    } catch (error) {
        console.error('error:', error);
    }

    let num = 1;
    let indexNum = 0;
    for(num = 1; num <= 20; num++){ //loop 20 times (the size of the table)
        let currentImg = $("#img"+num); //look at the given image at the current id
        currentImg.attr('src','https://image.tmdb.org/t/p/w780/'+imagesArray[indexNum]); //change the image source to the TMBD poster path
        currentImg.attr('alt',imagesArray[indexNum]); //change the ult to the current item in the images database (would be the title when required)
        currentImg.attr('name',idArray[indexNum]); //assign the name of the cell to the movie ID to for calling details page later

        let currentCell = $("#cell"+num);
        indexNum++;
    }
    console.log(imagesArray);

}
getPopMovieImages();



