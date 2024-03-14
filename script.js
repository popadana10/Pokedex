let pokemons = [];

const fetchData = () => {
  fetch('https://pokeapi.co/api/v2/pokemon?limit=500&offset=0')
    .then((response) => response.json())
    .then((json) => {
      pokemons = json.results;
      displayData(pokemons);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
};

fetchData();

const displayData = (data) => {
  const container = document.querySelector('.data');
  container.innerHTML = '';

  data.forEach((pokemon) => {
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');

    const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    const pokemonImage = document.createElement('img');
    pokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(pokemon)}.png`;
    pokemonImage.alt = pokemonName;

    const pokemonHeading = document.createElement('h2');
    pokemonHeading.textContent = pokemonName;

    pokemonCard.appendChild(pokemonImage);
    pokemonCard.appendChild(pokemonHeading);

    container.appendChild(pokemonCard);
  });
};

const getPokemonId = (pokemon) => {
  const urlParts = pokemon.url.split('/');
  return urlParts[urlParts.length - 2];
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