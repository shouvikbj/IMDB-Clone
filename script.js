const apiKey = '4f6e1419'; // Replace with your OMDB API key

function searchMovies() {
    const searchInput = document.getElementById('searchInput').value;

    if (searchInput.trim() === '') {
        // alert('Please enter a movie title.');
        return;
    }

    // Make API request to OMDB
    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchInput}`)
        .then(response => response.json())
        .then(data => displaySearchResults(data.Search))
        .catch(error => console.error('Error:', error));
}

function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer.innerHTML = ''; // Clear previous results

    if (results) {
        results.forEach(movie => {
            const movieCard = createMovieCard(movie);
            searchResultsContainer.appendChild(movieCard);
        });
    } else {
        searchResultsContainer.innerHTML = '<p>No results found.</p>';
    }
}

function createMovieCard(movie, isFavoritePage) {
    const card = document.createElement('div');
    card.classList.add('card', 'mb-3');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Poster image
    const poster = document.createElement('img');
    poster.classList.add('card-img-top');
    poster.src = movie.Poster !== 'N/A' ? movie.Poster : 'placeholder-image-url.jpg'; // Replace 'placeholder-image-url.jpg' with a default image URL
    poster.alt = 'Movie Poster';

    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = movie.Title;

    const year = document.createElement('p');
    year.classList.add('card-text');
    year.textContent = `Year: ${movie.Year}`;

    const actionButton = document.createElement('button');
    actionButton.classList.add('btn', 'mt-3', 'rounded-pill');

    if (isFavoritePage) {
        // If on the favorites page, create a "Remove from Favorites" button
        actionButton.classList.add('btn-danger');
        actionButton.textContent = 'Remove from Favorites';
        actionButton.onclick = function () {
            removeFromFavorites(movie);
        };
    } else {
        // If on other pages, create an "Add to Favorites" button
        actionButton.classList.add('btn-outline-primary');
        actionButton.textContent = 'Add to Favorites';
        actionButton.onclick = function () {
            addToFavorites(movie);
        };
    }

    cardBody.appendChild(poster); // Add poster image to the card
    cardBody.appendChild(title);
    cardBody.appendChild(year);
    cardBody.appendChild(actionButton);

    card.appendChild(cardBody);

    // Open movie details page on click
    if (!isFavoritePage) {
        card.onclick = function () {
            goToMoviePage(movie.imdbID);
        };
    }

    card.id = `movieCard_${movie.imdbID}`; // Assign a unique ID to the movie card

    return card;
}

function addToFavorites(movie) {
    let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    favoriteMovies.push(movie);
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
}

function removeFromFavorites(movie) {
    let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    favoriteMovies = favoriteMovies.filter(favMovie => favMovie.imdbID !== movie.imdbID);
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));

    // Remove the movie card from the DOM
    const movieCardToRemove = document.getElementById(`movieCard_${movie.imdbID}`);
    if (movieCardToRemove) {
        movieCardToRemove.remove();
    }
}

function goToMoviePage(imdbID) {
    window.location.href = `movie.html?imdbID=${imdbID}`;
}

function goToHome() {
    window.location.href = 'index.html';
}

function goToFavorites() {
    window.location.href = 'favourites.html';
}

// Initial setup
document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const imdbID = params.get('imdbID');

    if (imdbID) {
        // Display movie details page
        fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`)
            .then(response => response.json())
            .then(data => displayMovieDetails(data))
            .catch(error => console.error('Error:', error));
    } else {
        // Display favourite movies on the favorites.html page
        const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

        if (favoriteMovies.length > 0) {
            const favoriteMoviesContainer = document.getElementById('favouriteMovies');

            favoriteMovies.forEach(movie => {
                const movieCard = createMovieCard(movie, true); // Pass true to indicate it's the favorites page
                favoriteMoviesContainer.appendChild(movieCard);
            });
        } else {
            const noFavoritesMessage = document.createElement('p');
            noFavoritesMessage.textContent = 'No favorite movies yet.';
            document.getElementById('favouriteMovies').appendChild(noFavoritesMessage);
        }
    }
});

function displayMovieDetails(movie) {
    const movieDetailsContainer = document.getElementById('movieDetails');
    movieDetailsContainer.innerHTML = ''; // Clear previous details

    const card = createMovieCard(movie);
    movieDetailsContainer.appendChild(card);

    const plot = document.createElement('p');
    plot.textContent = `Plot: ${movie.Plot || 'Not available'}`;

    const genre = document.createElement('p');
    genre.textContent = `Genre: ${movie.Genre || 'Not available'}`;

    const director = document.createElement('p');
    director.textContent = `Director: ${movie.Director || 'Not available'}`;

    const backButton = document.createElement('button');
    backButton.classList.add('btn', 'btn-outline-primary', 'mt-3', 'rounded-pill');
    backButton.textContent = 'Back to Home';
    backButton.onclick = function () {
        goToHome();
    };

    movieDetailsContainer.appendChild(plot);
    movieDetailsContainer.appendChild(genre);
    movieDetailsContainer.appendChild(director);
    movieDetailsContainer.appendChild(backButton);
}
