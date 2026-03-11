const API_KEY = "7f7fc3df7ba8f6cd565bdbac4adc066b";

const BASE_URL = "https://api.themoviedb.org/3/discover/movie";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const moviesContainer = document.getElementById("movies");
const searchInput = document.getElementById("search");
const genreFilter = document.getElementById("genreFilter");
const yearFilter = document.getElementById("yearFilter");
const sortFilter = document.getElementById("sortFilter");

let moviesData = [];

async function fetchMovies() {

let url = `${BASE_URL}?api_key=${API_KEY}&sort_by=${sortFilter.value}`;

if (genreFilter.value) {
url += `&with_genres=${genreFilter.value}`;
}

if (yearFilter.value) {
url += `&primary_release_year=${yearFilter.value}`;
}

const res = await fetch(url);
const data = await res.json();

moviesData = data.results;
displayMovies(moviesData);
}

function displayMovies(movies){

moviesContainer.innerHTML = "";

movies.forEach(movie => {

const stars = getStars(movie.vote_average);

const card = document.createElement("div");
card.classList.add("movie-card");

card.innerHTML = `
<img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">

<div class="movie-info">
<div class="movie-title">${movie.title}</div>
<div class="movie-year">${movie.release_date?.split("-")[0]}</div>
<div class="rating">${stars}</div>
<div class="description">${movie.overview}</div>
</div>

<div class="hover-details">
<p>${movie.overview}</p>
</div>
`;

moviesContainer.appendChild(card);

});
}

function getStars(vote){

let rating = vote / 2;
let stars = "";

for(let i=1;i<=5;i++){

if(i <= rating){
stars += "⭐";
}else{
stars += "☆";
}

}

return stars;

}

searchInput.addEventListener("keyup", ()=>{

let searchValue = searchInput.value.toLowerCase();

let filtered = moviesData.filter(movie =>
movie.title.toLowerCase().includes(searchValue)
);

displayMovies(filtered);

});

genreFilter.addEventListener("change", fetchMovies);
yearFilter.addEventListener("change", fetchMovies);
sortFilter.addEventListener("change", fetchMovies);

fetchMovies();