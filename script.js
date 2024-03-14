'use strict';
let pokemons = [];
let favorites = [];

const toggleFavorite = (pokemonId) => {
  const index = favorites.indexOf(pokemonId);
  if (index === -1) {
    favorites.push(pokemonId);
  } else {
    favorites.splice(index, 1);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  displayFavorites();
  displayData(pokemons);
};

const fetchData = () => {
  fetch('https://pokeapi.co/api/v2/pokemon?limit=500&offset=0')
    .then((response) => response.json())
    .then((json) => {
      const promises = json.results.map((pokemon) => {
        return fetch(pokemon.url)
          .then((response) => response.json())
          .then((data) => {
            return {
              id: data.id,
              name: data.name,
              height: data.height,
              weight: data.weight,
              type: data.types.map((type) => type.type.name).join(', '),
              image: data.sprites.front_default,
            };
          });
      });

      Promise.all(promises).then((detailedPokemonData) => {
        pokemons = detailedPokemonData;
        displayData(pokemons);
      });
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
};

const displayData = (data) => {
  const container = document.querySelector('.data');
  container.innerHTML = '';

  data.forEach((pokemon) => {
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');

    const pokemonImage = document.createElement('img');
    pokemonImage.src = pokemon.image;
    pokemonImage.alt = pokemon.name;

    const pokemonHeading = document.createElement('h2');
    pokemonHeading.textContent = `${pokemon.id}. ${pokemon.name}`;

    const pokemonDetails = document.createElement('p');
    pokemonDetails.innerHTML = `
      <strong>Height:</strong> ${pokemon.height} | 
      <strong>Weight:</strong> ${pokemon.weight} | 
      <strong>Type:</strong> ${pokemon.type}
    `;

    const favoriteButton = document.createElement('button');
    favoriteButton.textContent = favorites.includes(pokemon.id) ? 'Unfavorite' : 'Favorite';
    favoriteButton.addEventListener('click', () => {
      toggleFavorite(pokemon.id);
      favoriteButton.textContent = favorites.includes(pokemon.id) ? 'Unfavorite' : 'Favorite';
    });

    pokemonCard.appendChild(pokemonImage);
    pokemonCard.appendChild(pokemonHeading);
    pokemonCard.appendChild(pokemonDetails);
    pokemonCard.appendChild(favoriteButton);

    container.appendChild(pokemonCard);
  });
};

const searchPokemons = (inputValue) => {
  const filteredData = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(inputValue.toLowerCase())
  );
  displayData(filteredData);
};

document.querySelector('#search').addEventListener('input', (e) => {
  searchPokemons(e.target.value);
});

const displayFavorites = () => {
  const favoritesContainer = document.querySelector('.favorites-list');
  favoritesContainer.innerHTML = '';

  favorites.forEach((favoriteId) => {
    const favoritePokemon = pokemons.find((pokemon) => pokemon.id === favoriteId);
    if (favoritePokemon) {
      const favoriteItem = document.createElement('div');
      favoriteItem.textContent = `${favoritePokemon.id}. ${favoritePokemon.name}`;
      favoritesContainer.appendChild(favoriteItem);
    }
  });
};

favorites = JSON.parse(localStorage.getItem('favorites')) || [];
displayFavorites();
fetchData();

