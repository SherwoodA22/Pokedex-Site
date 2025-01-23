const MAX_POKEMON = 1025
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

let allPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
.then((response) => response.json())
.then((data) => {
    allPokemons = data.results;
    displayPokemon(allPokemons);
});

//Fetching the pokemon names and ids from the PokeApi.
async function fetchPokemonDataBeforeRedirect(id) {
   try {
        const [pokemon, pokemonSpecies] = await Promise.all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((result) => {
            result.json();
        }),
        fetch(`https://pokeapi.co/api/v1/pokemon-species/${id}`).then((result) => {
            result.json();
        }),
    ])
    return true;
   } catch(error) {
        console.error("Failed to Fetch Pokemon");
   }
}

function displayPokemon(pokemon) {
    listWrapper.innerHTML = "";

    //Creates an element for each of the pokemon to display them.
    pokemon.forEach((pokemon) => {
        const pokemonID = pokemon.url.split("/")[6];
        const listItem = document.createElement("div");
        listItem.className = "list-item";
        listItem.innerHTML = `
        <div class="number-wrape">
            <p class="caption-fonts">#${pokemonID}</p>
        </div>
         <div class="img-wrape">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonID}.png" alt="${pokemon.name}"/>
        </div>
         <div class="name-wrape">
            <p class="body3-fonts">#${pokemon.name}</p>
        </div>
        `;

        //Will change to the individual pokemon's details page on click.
        listItem.addEventListener("click", async () => {
            const success = await fetchPokemonDataBeforeRedirect(pokemonId);
            if(success){
                window.location.href = `./detail/html?id=${pokemonID}`;
            }
        });

        listWrapper.appendChild(listItem);
    });
}