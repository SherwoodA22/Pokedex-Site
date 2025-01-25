const MAX_POKEMON = 1025;
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
    console.log(data.results);
});

//Fetching the pokemon names and ids from the PokeApi.
async function fetchPokemonDataBeforeRedirect(id) {
   try {
        const [pokemon, pokemonSpecies] = await Promise.all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((result) => {
            result.json();
        }),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((result) => {
            result.json();
        }),
    ]);
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
        <div class="number-wrap">
            <p class="caption-fonts">#${pokemonID}</p>
        </div>
         <div class="img-wrap">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonID}.png" alt="${pokemon.name}"/>
        </div>
         <div class="name-wrap">
            <p class="body3-fonts">${pokemon.name}</p>
        </div>
        `;

        //Will change to the individual pokemon's details page on click.
        listItem.addEventListener("click", async () => {
            const success = await fetchPokemonDataBeforeRedirect(pokemonID);
            if(success){
                window.location.href = `./detail.html?id=${pokemonID}`;
            }
        });

        listWrapper.appendChild(listItem);
    });
}

searchInput.addEventListener("keyup", handleSearch);

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    let filteredPokemon;

    //Searches Pokemon by id if the search is set to Number.
    //Allows for partial matches to come up. Ex Char gets Charmander and Charizard.
    if(numberFilter.checked) {
        filteredPokemon = allPokemons.filter((pokemon) => {
            const pokemonID = pokemon.url.split("/")[6];
            return pokemonID.startsWith(searchTerm);
        });

    //Searches Pokemon by name if search is set to Number.
    //Allows for partial matches to come up. Ex 1 gets both 1 and 10.
    } else if(nameFilter.checked) {
        filteredPokemon = allPokemons.filter((pokemon) => {
            return pokemon.name.toLowerCase().startsWith(searchTerm);
        });
        
    } else {
        filteredPokemon = allPokemons;
    }
    displayPokemon(filteredPokemon);

    if(filteredPokemon.length === 0) {
        notFoundMessage.style.display = "block";
    }else{
        notFoundMessage.style.display = "none";
    }
 }

 
 const closeButton = document.querySelector(".search-close-icon");
 closeButton.addEventListener("click", clearSearch);

 //Handles clearing the search bar.
 function clearSearch() {
    searchInput.value = "";
    displayPokemon(allPokemons);
    notFoundMessage.style.display = "none";
 }