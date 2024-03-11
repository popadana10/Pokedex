let pokemons = [];

fetch('https://pokeapi.co/api/v2/pokemon?limit=500&offset=0')
  .then((response) => response.json())
  .then((json) => {
    pokemons = json.results;
    displayData(pokemons);
  });

  fetchData();

  const displayData = (data) => {
    const container = document.querySelector('.data');
  
    data.forEach((pokemon) => {
      const pokemonCard = document.createElement('div');
      pokemonCard.innerHTML = `
      <h2>${pokemon.name}</h2>`;
      container.appendChild(pokemonCard);
    });
  };

  const searchPokemons = (searchTerm) => {
    const filteredData = pokemons.filter((pokemon) => pokemon.name.toLoweCase().includes(searchTerm.toLoweCase()))
    displayData(filteredData);
  };

  document
  .querySelector('#search')
  .addEventListener('input', (e)=>searchPokemons(e.target.value));

