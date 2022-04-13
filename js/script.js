/**
 * Gets pokemon details
 * @param {string} url 
 */
function getDetails(url) {
    return fetch(url)
        .then(res => res.json())
}

function generateCardBack(pokemon, card) {
    const backCard = card.querySelector('.back');
    const types = pokemon.details.types.map(typeName => `<span class="type">${typeName}</span>`).join('<span> & </span>');
    console.log(types);
    backCard.innerHTML = `<div class="dex">${pokemon.dex}</div>
        <div class="fact">Name: ${pokemon.name}</div>
        <div class="types fact">Type${pokemon.details.types.length > 1 ? 's' : ''}: ${types}</div>`
    backCard.classList.add('loaded');
}

/**
 * Makes a card element
 * @param {*} pokemon  A pokemon object
 */
function makeCard(pokemon) {
    const card = document.createElement('div');

    card.className = 'card';
    const picture = `<img loading="lazy" height="200" width="200" src="${
        pokemon.hidePicture ? '/assets/question.png' : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.dex}.png`
        }">`
    card.innerHTML = `
        <div class="content">
            <div class="front">
                <div class="dex">${pokemon.dex}</div>
                ${picture}
            </div>
            <div class="back">
                <div class="fact">Loading...</div>
            </div>
        </div>`;

    card.addEventListener('click', function () {
        card.classList.toggle('is-flipped');
        if (!pokemon.details) {
            getDetails(pokemon.url).then(details => {
                console.log(details);
                pokemon.details = {
                    types: details.types.map(t => t.type.name),
                    sprite: details.sprites.other['official-artwork'].front_default,
                    fullDetails: details
                };
                generateCardBack(pokemon, card);
            });
        } else {
            generateCardBack(pokemon, card);
        }
    });



    return card;
}


// get and render cards
const cards = document.querySelector('#cards');

fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
    .then(res => res.json())
    .then(res => res.results.map((pokemon, i) => ({ ...pokemon, dex: i + 1 })))
    .then(function (data) {
        console.log(data);
        data.forEach(pokemon => {
            const card = makeCard(pokemon);
            cards.appendChild(card);
        });;
    });


const form = document.querySelector('#add-form');
document.querySelector('#add-button').addEventListener('click', () => {
    form.classList = [];
})
form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.className = 'is-hidden';

    const formData = new FormData(form);

    console.log(formData);

    const pokemon = {
        name: formData.get('species'),
        dex: formData.get('dex'),
        hidePicture: true,
        details: {
            types: [],
        }
    };

    const type1 = formData.get('type1');
    if (type1 !== null && type1 !== '') {
        pokemon.details.types.push(type1);
    }

    const type2 = formData.get('type2');
    if (type2 && type1 !== type2) {
        pokemon.details.types.push(type2);
    }
    const card = makeCard(pokemon);
    cards.appendChild(card);
    card.scrollIntoView({behavior: 'smooth'});
    console.log(formData, pokemon);
});

document.querySelector('#top').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
});