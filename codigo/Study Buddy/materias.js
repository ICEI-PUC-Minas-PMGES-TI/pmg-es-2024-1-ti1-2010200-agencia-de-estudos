document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }

    loadCards();
});

function loadCards() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const cards = JSON.parse(localStorage.getItem('materias')) || {};
    const userCards = cards[loggedInUser.email] || [];
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = '';

    userCards.forEach((card, index) => {
        addCardToDOM(card, index);
    });
}

function addCardToDOM(cardText, index) {
    const cardContainer = document.getElementById('cardContainer');
    const newCard = document.createElement('div');
    newCard.className = 'card';
    newCard.innerHTML = `<h2 contenteditable="true">${cardText}</h2>
                         <button class="edit-btn" onclick="editCard(event, ${index})">✎</button>
                         <button class="delete-btn" onclick="deleteCard(event, ${index})">✖</button>`;
    newCard.onclick = () => openNotes(index);
    cardContainer.appendChild(newCard);
}

function addCard() {
    const newCardText = document.getElementById('newCardInput').value;
    if (newCardText.trim() !== "") {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        const cards = JSON.parse(localStorage.getItem('materias')) || {};
        const userCards = cards[loggedInUser.email] || [];
        userCards.push(newCardText);
        cards[loggedInUser.email] = userCards;
        localStorage.setItem('materias', JSON.stringify(cards));
        addCardToDOM(newCardText, userCards.length - 1);
        document.getElementById('newCardInput').value = '';
    }
}

function editCard(event, index) {
    event.stopPropagation();
    const cardContainer = document.getElementById('cardContainer');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const cards = JSON.parse(localStorage.getItem('materias')) || {};
    const userCards = cards[loggedInUser.email] || [];
    const cardText = cardContainer.children[index].querySelector('h2').innerText;

    userCards[index] = cardText;
    cards[loggedInUser.email] = userCards;
    localStorage.setItem('materias', JSON.stringify(cards));
}

function deleteCard(event, index) {
    event.stopPropagation();
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const cards = JSON.parse(localStorage.getItem('materias')) || {};
    const userCards = cards[loggedInUser.email] || [];
    userCards.splice(index, 1);
    cards[loggedInUser.email] = userCards;
    localStorage.setItem('materias', JSON.stringify(cards));
    loadCards();
}

function openNotes(index) {
    window.open(`notas.html?index=${index}`, '_blank');
}
