const pokemons = document.querySelector(".pokemons");
const pokemonName = document.querySelector(".pokemon_name");
const pokemonImage = document.querySelector(".pokemon_image");

const battle = document.querySelector(".battle");
const menu = document.querySelector(".menu");

const pokemon_escolhido = document.getElementById("pokemon_escolhido");
const pokemon_adversario = document.getElementById("pokemon_adversario");

const btnLutar = document.querySelector(".lutarPokemon");
const againPlay = document.querySelector(".againPlay");

let searchPokemon = 1;

async function fetchPokemonList() {
  const APIResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=20&limit=1000`
  );

  const data = await APIResponse.json();
  const pokemonList = data.results;

  for (const pokemon of pokemonList) {
    const pokemonData = await fetch(pokemon.url);
    const pokemonDetails = await pokemonData.json();
    renderPokemonCard(pokemonDetails);
  }
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderPokemonCard(pokemon) {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
 <img
      src="${pokemon.sprites.front_default}"
      class="pokemon_image"
      alt="${pokemon.name}"
    />
            <div class="container atributos">
              <h4><b>${pokemon.name}</b></h4>
              <p>Caracteristicas:</p>
              <div class="ataques">
                <p>Ataque basico: <span>${pokemon.stats[1].base_stat}</span></p>
                <p>Ataque normal: <span>${pokemon.stats[3].base_stat}</span></p>
                <p>Defesa: <span>${pokemon.stats[2].base_stat}</span></p>
                <p>Velocidade de ataque: <span>${pokemon.stats[5].base_stat}</span></p>
              </div>
              <button class="btnPokemon">Escolher</button>
            </div>
  `;

  pokemons.appendChild(card);

  const btnPokemon = card.querySelector(".btnPokemon");
  btnPokemon.addEventListener("click", async function () {
    const randomId = getRandomIntInclusive(1, 1000);
    console.log("ID do Pokémon adversário:", randomId);

    const APIResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${randomId}`
    );
    if (APIResponse.ok) {
      const pokemonData = await APIResponse.json(); // Dados do adversário

      if (menu) {
        menu.style.display = "none";
        modal.style.display = "none";
        battle.style.display = "flex";

        pokemon_escolhido.innerHTML = `
        <img src="${pokemon.sprites["versions"]["generation-v"]["black-white"]["animated"].front_default}" alt="${pokemon.name}" class="imgPokemon" />
        <h3>${pokemon.name}</h3>
        <p>HP: ${pokemon.stats[0].base_stat}</p>
        <p>Ataque: ${pokemon.stats[1].base_stat}</p>
        <p>Defesa: ${pokemon.stats[2].base_stat}</p>
         <p>Velocidade: ${pokemonData.stats[5].base_stat}</p>
            `;

        pokemon_adversario.innerHTML = `
        <img src="${pokemonData.sprites["versions"]["generation-v"]["black-white"]["animated"].front_default}" alt="${pokemonData.name}" class="imgPokemon" />
        <h3>${pokemonData.name}</h3>
        <p>HP: ${pokemonData.stats[0].base_stat}</p>
        <p>Ataque: ${pokemon.stats[1].base_stat}</p>
        <p>Defesa: ${pokemonData.stats[2].base_stat}</p>
        <p>Velocidade: ${pokemonData.stats[5].base_stat}</p>
    `;
        typePokemon(pokemon, pokemonData);
      }
    }
  });
}

function typePokemon(pokemonChamp, pokemonADV) {
  let typeChamp = pokemonChamp.types.map((type) => type.type.name);
  let typeADV = pokemonADV.types.map((type) => type.type.name);

  const typeChart = {
    fire: {
      strongAgainst: ["grass", "ice", "bug"],
      weakAgainst: ["water", "rock", "fire"],
    },
    water: {
      strongAgainst: ["fire", "rock", "ground"],
      weakAgainst: ["water", "electric", "grass"],
    },
    grass: {
      strongAgainst: ["water", "ground", "rock"],
      weakAgainst: ["fire", "ice", "flying"],
    },
    electric: {
      strongAgainst: ["water", "flying"],
      weakAgainst: ["electric", "ground"],
    },
    ghost: {
      strongAgainst: ["ghost", "psychic"],
      weakAgainst: ["dark", "normal"],
    },
  };
  let champAdvantage = 0; // Vantagem do campeão
  let advAdvantage = 0;

  console.log(typeChart.fire.strongAgainst);

  typeChamp.forEach((champType) => {
    typeADV.forEach((advType) => {
      if (typeChart[champType]?.strongAgainst.includes(advType)) {
        champAdvantage++;
      }
      if (typeChart[champType]?.weakAgainst.includes(advType)) {
        advAdvantage++;
      }
    });
  });

  // Resultado
  // Resultado
  if (champAdvantage > advAdvantage) {
    console.log("O tipo do campeão tem vantagem sobre o adversário!");
  } else if (advAdvantage > champAdvantage) {
    console.log("O tipo do adversário tem vantagem sobre o campeão!");
  } else {
    console.log("Os tipos estão equilibrados.");
  }

  calculateDamage(pokemonChamp, pokemonADV, champAdvantage, advAdvantage);
  return { champAdvantage, advAdvantage };
}

function calculateDamage(
  pokemonChamp,
  pokemonADV,
  champAdvantage,
  advAdvantage
) {
  const champStats = {
    hp: pokemonChamp.stats[0].base_stat,
    attack: pokemonChamp.stats[1].base_stat,
    defense: pokemonChamp.stats[2].base_stat,
  };

  const advStats = {
    hp: pokemonADV.stats[0].base_stat,
    attack: pokemonADV.stats[1].base_stat,
    defense: pokemonADV.stats[2].base_stat,
  };

  let champCurrentHP = champStats.hp;
  let advCurrentHP = advStats.hp;

  btnLutar.addEventListener("click", () => {
    const champDamage = Math.max(
      0,
      champStats.attack - advStats.defense + champAdvantage
    );
    const advDamage = Math.max(
      0,
      advStats.attack - champStats.defense + advAdvantage
    );

    champCurrentHP -= advDamage;
    advCurrentHP -= champDamage;

    champCurrentHP = Math.max(0, champCurrentHP);
    advCurrentHP = Math.max(0, advCurrentHP);

    resultados.innerHTML = `
      <p>Dano do Campeão: ${champDamage}</p>
      <p>Dano do Adversário: ${advDamage}</p>
      <p>HP Atual do Campeão: ${champCurrentHP}</p>
      <p>HP Atual do Adversário: ${advCurrentHP}</p>
    `;
    if (champCurrentHP === 0 || advCurrentHP === 0) {
      btnLutar.disabled = true;
      setTimeout(() => {
        btnLutar.disabled = false;
      }, 500);

      const winner = champCurrentHP === 0 ? pokemonADV.name : pokemonChamp.name;
     

      resultados.innerHTML += `<p><strong>${winner} venceu a batalha!</strong></p>`;

      lutarNovamente();
    }
  });
}

function lutarNovamente() {
  menu.style.display = "block";
  btn.innerHTML=`Jogar novamente`

  btn.addEventListener("click",()=>{
    resultados.innerHTML=""
    pokemon_escolhido.innerHTML = "";
    pokemon_adversario.innerHTML = "";
    
  
  })
}

fetchPokemonList();

var modal = document.getElementById("myModal");

var btn = document.querySelector(".btn-choice");

var span = document.getElementsByClassName("close")[0];

var resultados = document.querySelector(".resultados");

btn.onclick = function () {
  modal.style.display = "block";
  resultados.style.display = "block";
  btnLutar.style.display = "inline-block";
};

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
