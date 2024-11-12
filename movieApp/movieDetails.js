const apiKey = '234371287fa86b0d3840d7d936aee1e6';
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('movieId');
    
if (movieId) {
    fetchMovieDetails(movieId);
}
    
async function fetchMovieDetails(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`;
    const response = await fetch(url);
    const movie = await response.json();
    
    document.querySelector('.movie_title').textContent = movie.title;
    document.querySelector('.rating').textContent = movie.vote_average.toFixed(1);
    document.querySelector('.release_date').textContent = movie.release_date;
    document.querySelector('.overview').textContent = movie.overview;
    document.querySelector('.company_name').textContent = movie.production_companies[0]?.name || "N/A";
    document.querySelector('.country_name').textContent = `Country: ${movie.production_countries[0]?.name || "N/A"}`;
    document.querySelector('.movie_img').src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
}

