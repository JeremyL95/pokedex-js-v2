const btnSearch = document.querySelector('.search-bar');
const pokemonID = document.getElementById('pokemonID');
const pokemonName = document.getElementById('pokemonName');
const pokemonImage = document.querySelector('#pokemonImage img');
const pokemonType = document.querySelector('.pokemon-type-tag');
const pokemonWeight = document.querySelector('#pokemonWeight');
const pokemonHeight = document.querySelector('#pokemonHeight');
const pokemonContainer = document.querySelector('#pokedex');
const statFigure = document. querySelectorAll('.stat-figure');
const statOuterBar = document.querySelectorAll('.stat-bar-outer');
const statInnerBar = document.querySelectorAll('.stat-bar-inner');
const statTitleColor = document.querySelector('.pokemon-details-stats h5');
let pokemonElement;

// Pokemon Type Color
const typeColors = {
    "bug":      [167, 183,  35],
    "dark":     [117,  87,  76],
    "dragon":   [112,  55, 255],
    "electric": [249, 207,  48],
    "fighting": [193,  34,  57],
    "flying":   [168, 145, 236],
    "ghost":    [112,  85, 155],
    "grass":    [116, 203,  72],
    "ground":   [222, 193, 107],
    "ice":      [154, 214, 223],
    "fairy":    [230, 158, 172],
    "fire":     [245, 125,  49],
    "normal":   [170, 166, 127],
    "rock":     [182, 158,  49],
    "steel":    [183, 185, 208],
    "poison":   [164,  62, 158],
    "psychic":  [251,  85, 132],
    "water":    [100, 147, 235]
}

async function fetchPokemon(pokemon){
    let userSearch = pokemon.split(' ').join('-');
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${userSearch}`);

    if(res.status === 200){
        const pokemonData = await res.json();
        return pokemonData;
    }
}

function capitalizeFirstLetter(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}

btnSearch.addEventListener('change', async(evt)=>{
    let userInput = evt.target.value.toLowerCase();
    const pokemonData = await fetchPokemon(userInput);

    if(!pokemonData){
        alert('This pokemon does not exist!');
        pokemonName.innerText = 'Unknown';
        pokemonID.innerText = '???';

        return;
    }

    // Render Pokemon ID
    pokemonID.innerText = `# ${pokemonData.id.toString().padStart(3, '0')}`;

    // Render Pokemon Name
    pokemonName.innerText = capitalizeFirstLetter(`${pokemonData.name}`);

    // Render Pokemon Sprite
    pokemonImage.src = `${pokemonData.sprites.other.home.front_default}`
    
    // Render Pokemon Types
    let pokemonTypes = pokemonData.types;
    let pokemonTypesContainer = document.getElementById('pokemonTypes');
    let pokemonTypesDisplay = '';

        pokemonTypes.forEach((data)=>{
            pokemonTypesDisplay += `<div class="pokemon-type-tag ${data.type.name}" >${data.type.name}</div>`
        })

        pokemonTypesContainer.innerHTML = pokemonTypesDisplay;

    // Get Main Type Colors
    const mainTypeColor = typeColors[pokemonData.types[0].type.name];

    // Render Main Color
    pokemonContainer.style.backgroundColor = `rgb(${mainTypeColor[0]}, ${mainTypeColor[1]}, ${mainTypeColor[2]})`;
    statTitleColor.style.color = `rgb(${mainTypeColor[0]}, ${mainTypeColor[1]}, ${mainTypeColor[2]})`;
    pokemonElement = `${pokemonData.types[0].type.name}`;

    // Render Pokemon Stats
    pokemonData.stats.forEach((obj, i)=>{
        statFigure[i].innerText = obj.base_stat.toString().padStart(3, '0');
        statOuterBar[i].innerHTML = `<div class="stat-bar-inner" style="width: ${obj.base_stat > 100 ? 100 : obj.base_stat}%; background-color: rgb(${mainTypeColor[0]}, ${mainTypeColor[1]}, ${mainTypeColor[2]})">
        </div>`;
        statOuterBar[i].style.backgroundColor = `rgba(${mainTypeColor[0]}, ${mainTypeColor[1]}, ${mainTypeColor[2]}, 0.3)`;
    });

    // Render Pokemon Height
    pokemonHeight.innerText = `${pokemonData.height / 10} M`;

    // Render Pokemon Weight
    pokemonWeight.innerText = `${pokemonData.weight / 10} KG`;
});

(()=>{
    btnSearch.value = 'bulbasaur';
    
    if(btnSearch.value !== null){
        // Auto fire on change event
        let autoTriggerEvent = new Event('change');
        btnSearch.dispatchEvent(autoTriggerEvent);

        // Empty the value after auto search by default
        btnSearch.value = "";
    }
})();