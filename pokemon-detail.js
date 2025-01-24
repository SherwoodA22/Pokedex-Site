let currentPokemonId = null;
const MAX_POKEMON = 1025;


//Gets the id of the pokemon that was clicked on.
document.addEventListener("DOMContentLoaded", () => {
    const pokemonID = new URLSearchParams(window.location.search).get("id");
    const id = parseInt(pokemonID, 10);

    if(id < 1 || id > MAX_POKEMON){
        return (window.location.href = "./index.html");
    }

    currentPokemonId = id;
    loadPokemon(id, MAX_POKEMON);
});

async function loadPokemon(id){
    console.log(id);
    try {
        
        //Fetches data of the specific Pokemon.
        const [pokemon, pokemonSpecies] = await Promise.all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((result) => 
            result.json()
        ),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((result) => 
            result.json()
       ),
    ]);

        const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail.abilities");
        abilitiesWrapper.innerHTML ="";

        //Changes forward and back arrow depending on Pokemon Id.
        if(currentPokemonId === id) {
            displayPokemonDetails(pokemon);
                const flavorText = getEnglishFlavorText(pokemonSpecies);
                document.querySelector(".body3-fonts.pokemon-description").textContent = flavorText;
            
            const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map((selection) => 
                document.querySelector(selection)
            );

            leftArrow.removeEventListener("click", navigatePokemon);
            rightArrow.removeEventListener("click", navigatePokemon);

            if(id !== 1) {
                leftArrow.addEventListener("click", () => {
                    navigatePokemon(id -1);
                });
            } else {
                leftArrow.addEventListener("click", () => {
                    navigatePokemon(MAX_POKEMON);
                });
            }
            if(id !== MAX_POKEMON) {
                rightArrow.addEventListener("click", () => {
                    navigatePokemon(id + 1);
                });
            } else {
                rightArrow.addEventListener("click", () => {
                    navigatePokemon(1);
                });
            }

            window.history.pushState({},"", `./detail.html?id=${id}`);
        }

        return true;
    } catch (error) {
        console.error("An error has occured.", error);
        return false;
    }
}

async function navigatePokemon(id) {
    currentPokemonId = id;
    await loadPokemon(id);
}

//Color values for the different Pokemon types.
const typeColors = {
    normal:"#A8A878",
    fire:"#F08030",
    water:"#6890F0",
    electric:"#F8D030",
    grass:"#78C850",
    ice:"#98D8D8",
    fighting:"#C03028",
    poison:"#A040A0",
    ground:"#E0C068",
    rock:"#B8A038",
    steel:"#B8B8D0",
    dragon:"#7038F8",
    flying:"#A890F0",
    dark:"#EE99AC",
    psychic:"#F85888",
    bug:"#A8B820",
    fairy:"#FBABC3",
    ghost:"#705898",
};

function setElementStyles(elements, cssProperty, value){
    elements.forEach((element)=> {
        element.style[cssProperty] = value;
    });
}

function rgbaFromHex(hexColor) {
    return [
        parseInt(hexColor.slice(1,3), 16),
        parseInt(hexColor.slice(3,5), 16), 
        parseInt(hexColor.slice(5,7), 16),].join(", "); 
}

//Sets the background to different color depending on type of the Pokemon.
function setTypeBackgroundColor(pokemon){
    const mainType = pokemon.types[0].type.name;
    const color = typeColors[mainType];

    if(!color){
        console.warn(`Color not defined for type: ${mainType}`);
        return;
    }

    const detailMainElement = document.querySelector(".detail-main");
    setElementStyles([detailMainElement], "backgroundColor", color);
    setElementStyles([detailMainElement], "borderColor", color);
    setElementStyles(document.querySelectorAll(".power-wrapper > p"), "backgroundColor", color);
    setElementStyles(document.querySelectorAll(".stats-wrap > p.stats"), "color", color);
    setElementStyles(document.querySelectorAll(".stats-wrapp > progress-bar"), "color", color);

    //Fills the stats bar for each Pokemon.
    const rgbaColor = rgbaFromHex(color);
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
    .stats-wrap .progress-bar::-webkit-progress-bar {
        background-color: rgba(${rgbaColor}, 0.5);
    }
        .stats-wrap .progress-bar::-webkit-progress-value {
        background-color: ${color};
    }
    `
    document.head.appendChild(styleTag);
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function createAndAppendElement(parent, tag, options = 0) {
    const element = document.createElement(tag);
    Object.keys(options).forEach((key) => {
        element[key] = options[key];
    });
    parent.appendChild(element);
    return element;
}

function displayPokemonDetails(pokemon) {
    const {name, id, types, weight, height, abilities, stats} = pokemon;
    console.log(name);
    console.log(id);
    console.log(types);
    console.log(weight);
    console.log(height);
    console.log(abilities);
    console.log(stats);
    const capitalizePokemonName = capitalizeFirstLetter(name);
    document.querySelector("title").textContent = capitalizePokemonName;
    const detailMainElement = document.querySelector(".detail-main");
    detailMainElement.classList.add(name.toLowerCase());
    document.querySelector(".name-wrap .name").textContent = capitalizePokemonName;
    document.querySelector(".pokemon-id-wrap .body2-fonts").textContent = `#${String(id).padStart(3, "0")}`;

    //Creates the image for the Pokemon to display.
    const imageElement = document.querySelector(".detail-img-wrapper img");
    imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    imageElement.alt = name;

    const typeWrapper = document.querySelector(".power-wrapper");
    typeWrapper.innerHTML = "";
    types.forEach(({type}) => {
        createAndAppendElement(typeWrapper, "p", { className: `body3-fonts type ${type.name},`, textContent: type.name, });
    });

    //Adds the height and weight of the Pokemon.
    document.querySelector(".pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight").textContent =`${weight / 10} kg`;
    document.querySelector(".pokemon-detail-wrap .pokemon-detail p.body3-fonts.height").textContent =`${height / 10} kg`;

    //Adds the abilities of the Pokemon.
    const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail.abilities");
    abilities.forEach(({ability}) => {
        createAndAppendElement(abilitiesWrapper, "p", {className: "body3-fonts", textContent: ability.name,});
    });

    //Adds the stats of the Pokemon.
    const statsWrapper = document.querySelector(".stats-wrapper");
    statsWrapper.innerHTML = "";

    const statNameMapping = {
        hp: "HP",
        attack: "ATK",
        defense: "DEF",
        "special-attack": "SATK",
        "special-defense": "SDEF",
        speed: "SPD",
    };

    stats.forEach(({stat, base_stat}) => {
        const statDiv = document.createElement("div");
        statDiv.className = "stats-wrap";
        statsWrapper.appendChild(statDiv);
        createAndAppendElement(statDiv, "p", {className: "body3-fonts stats", textContent: statNameMapping[stat.name],});
        createAndAppendElement(statDiv, "p", {className: "body3-fonts", textContent: String(base_stat).padStart(3, "0"),});
        createAndAppendElement(statDiv, "progress", {className: "progress-bar", value: base_stat, max: 260,});
    });
    setTypeBackgroundColor(pokemon);
    
}
function getEnglishFlavorText(pokemonSpecies) {
        for(let entry of pokemonSpecies.flavor_text_entries){
            if(entry.language.name =="en"){
                let flavor = entry.flavor_text.replace(/\f/g," ");
                return flavor;
            }
        }
        return "";
}