const form = document.querySelector('#form');
const searchInput = document.querySelector('#search');
const songsContainer = document.querySelector('#songs-container');
const prevAndNextContainer = document.querySelector('#prev-and-next-container');

const apiURL = `https://api.lyrics.ovh`;

const fetchData = async url => {

    const response = await fetch(url);
    return await response.json();
};

const getMoreSongs = async url => {

    const data = await fetchData(`https://cors-anywhere.herokuapp.com/${url}`);
    insertSongsIntoPage(data);
};

const insertNextAndPrevButtons = songsInfo => {

    prevAndNextContainer.innerHTML = `
        ${songsInfo.prev ? `<button class="btn" onClick="getMoreSongs('${songsInfo.prev}')">Anteriores</button>` : ''}
        ${songsInfo.next ? `<button class="btn" onClick="getMoreSongs('${songsInfo.next}')">Próximas</button>` : ''}
    `
};

// [insere a listagem das músicas na página]
const insertSongsIntoPage = songsInfo => {

    songsContainer.innerHTML = songsInfo.data.map(song => `
    <li class="song">
        <span class="song-artist"><strong>${song.artist.name}</strong> - ${song.title}</span>
        <button class="btn" data-artist="${song.artist.name}" data-song-title="${song.title}">Ver letra</button>
    </li>
    `).join('');    
    
    // [insere os botões para as próximas músicas e as anteriores]
    if (songsInfo.prev || songsInfo.next) {
        
        insertNextAndPrevButtons(songsInfo); 
        return;
    }

    prevAndNextContainer.innerHTML = ''
};

// [fazer a requisição das letras das músicas]
const fetchSongs = async term => {

    const data = await fetchData(`${apiURL}/suggest/${term}`);
    insertSongsIntoPage(data);
};

form.addEventListener('submit', event => {

    event.preventDefault();

    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {

        songsContainer.innerHTML = `<li class="warning-message">Por favor, digite um termo válido</li>`;
        return;
    }

    fetchSongs(searchTerm);    
});

// [insere os dados da letra na página ao clicar no botão 'ver letra']
const insertLyricsIntoPage = ({ lyrics, artist, songTitle }) => {

    songsContainer.innerHTML = `
        <li class="lyrics-container">
            <h2><strong>${songTitle}</strong> - ${artist}</h2>
            <p class="lyrics">${lyrics}</p>
        </li>
    `
};

// [insere os dados da letra na página ao clicar no botão 'ver letra']
const fetchLyrics = async (artist, songTitle) => {

    const data = await fetchData(`${apiURL}/v1/${artist}/${songTitle}`);
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

    insertLyricsIntoPage({ lyrics, artist, songTitle });
};

songsContainer.addEventListener('click', event => {

    const clickedElement = event.target;

    if (clickedElement.tagName === 'BUTTON') {

        const artist = clickedElement.getAttribute('data-artist');
        const songTitle = clickedElement.getAttribute('data-song-title');

        prevAndNextContainer.innerHTML = '';
        fetchLyrics(artist, songTitle);
    }
});
