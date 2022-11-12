const form = document.querySelector('#form');
const searchInput = document.querySelector('#search');
const songsContainer = document.querySelector('#songs-container');
const prevAndNextContainer = document.querySelector('#prev-and-next-container');

const apiURL = `https://api.lyrics.ovh`;

// [inserir as informações das músicas na tela]
const insertSongsIntoPage = songsInfo => {

    songsContainer.innerHTML = songsInfo.data.map(song => `
    <li class="song">
        <span class="song-artist"><strong>${song.artist.name}</strong> - ${song.title}</span>
        <button class="btn" data-artist="${song.artist.name}" data-song-title="${song.title}">Ver letra</button>
    </li>
    `).join('')

    if (songsInfo.prev || songsInfo.next) {

        prevAndNextContainer.innerHTML = `
            ${songsInfo.next ? `<button>Próximas</button>` : '' }
        `
    }
}

// [fazer a requisição das letras das músicas]
const fetchSongs = async term => {

    const response = await fetch(`${apiURL}/suggest/${term}`)
    const data = await response.json()

    insertSongsIntoPage(data);
}

form.addEventListener('submit', event => {

    event.preventDefault();

    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {

        songsContainer.innerHTML = `<li class="warning-message">Por favor, digite um termo válido</li>`;
        return;
    }

    fetchSongs(searchTerm);
    
});
