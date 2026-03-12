const API_KEY = "7f7fc3df7ba8f6cd565bdbac4adc066b";
const BASE_URL = "https://api.themoviedb.org/3/discover/movie";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const moviesContainer = document.getElementById("movies");
const searchInput = document.getElementById("search");
const genreFilter = document.getElementById("genreFilter");
const yearFilter = document.getElementById("yearFilter");
const sortFilter = document.getElementById("sortFilter");

let moviesData = [];

async function fetchMovies(){

let url = `${BASE_URL}?api_key=${API_KEY}&sort_by=${sortFilter.value}`;

if(genreFilter.value){
url += `&with_genres=${genreFilter.value}`;
}

if(yearFilter.value){
url += `&primary_release_year=${yearFilter.value}`;
}

const res = await fetch(url);
const data = await res.json();

moviesData = data.results;
displayMovies(moviesData);

}

function displayMovies(movies){

moviesContainer.innerHTML="";

movies.forEach(movie=>{

const card=document.createElement("div");
card.classList.add("movie-card");

card.innerHTML=`

<img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">

<div class="movie-info">

<div class="movie-title">${movie.title}</div>

<div class="movie-year">${movie.release_date?.split("-")[0]}</div>

<div class="avg-rating">User Rating: <span id="avg-${movie.id}">0</span></div>

<div class="user-rating" data-id="${movie.id}">
<span data-value="1">☆</span>
<span data-value="2">☆</span>
<span data-value="3">☆</span>
<span data-value="4">☆</span>
<span data-value="5">☆</span>
</div>



<div class="description">${movie.overview}</div>

</div>

<div class="hover-details">
<p>${movie.overview}</p>
</div>

`;

moviesContainer.appendChild(card);

updateAverage(movie.id);

});

}

searchInput.addEventListener("keyup",()=>{

let searchValue=searchInput.value.toLowerCase();

let filtered=moviesData.filter(movie=>
movie.title.toLowerCase().includes(searchValue)
);

displayMovies(filtered);

});

genreFilter.addEventListener("change",fetchMovies);
yearFilter.addEventListener("change",fetchMovies);
sortFilter.addEventListener("change",fetchMovies);

document.addEventListener("click",function(e){

if(e.target.parentElement.classList.contains("user-rating")){

const stars=e.target.parentElement.querySelectorAll("span");
const movieId=e.target.parentElement.dataset.id;
const ratingValue=e.target.dataset.value;

stars.forEach((star,index)=>{
if(index<ratingValue){
star.textContent="⭐";
}else{
star.textContent="☆";
}
});

saveRating(movieId,ratingValue);

}

});

function saveRating(movieId,rating){

let ratings=JSON.parse(localStorage.getItem("ratings"))||{};

if(!ratings[movieId]){
ratings[movieId]=[];
}

ratings[movieId].push(Number(rating));

localStorage.setItem("ratings",JSON.stringify(ratings));

updateAverage(movieId);

}

function updateAverage(movieId){

let ratings=JSON.parse(localStorage.getItem("ratings"))||{};

if(!ratings[movieId]) return;

let avg=ratings[movieId].reduce((a,b)=>a+b,0)/ratings[movieId].length;

document.getElementById(`avg-${movieId}`).innerText=avg.toFixed(1);

}

fetchMovies();