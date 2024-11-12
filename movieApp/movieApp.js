const apiKey = '234371287fa86b0d3840d7d936aee1e6';
const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
const searchInput = document.querySelector('.search');
const searchIcon = document.querySelector('.bi-search');
const movieContainer = document.querySelector('.movies_wrapper');
const favoritesButton = document.querySelector('.favorites');

async function getMovieSuggestions(query) {
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=1&include_adult=false`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    return data.results;
}
function displayMovies(movies) {
    movieContainer.innerHTML = '';
    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
            <div>
                <span class="release_date">${new Date(movie.release_date).getFullYear()}</span>
                <span class="rating">${movie.vote_average.toFixed(1)}</span>
            </div>
            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
            <p class="movie_name">${movie.title}</p>
        `;
        movieElement.addEventListener('click', () => {
            window.location.href = `movieDetails.html?movieId=${movie.id}`;
        });
        
        movieContainer.appendChild(movieElement);
    });
}
searchIcon.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (query) {
        const movies = await getMovieSuggestions(query);
        displayMovies(movies);
    }
});
searchInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            const movies = await getMovieSuggestions(query);
            displayMovies(movies);
        }
    }
});
fetch(url)
    .then(response => response.json())
    .then(data => displayMovies(data.results))
    .catch(error => console.error('Error fetching movies:', error));
