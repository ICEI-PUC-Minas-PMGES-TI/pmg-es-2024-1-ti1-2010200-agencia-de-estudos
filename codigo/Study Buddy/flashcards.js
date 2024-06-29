document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }

    loadGroups();
});

function loadGroups() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const groups = JSON.parse(localStorage.getItem('flashcardGroups')) || {};
    const userGroups = groups[loggedInUser.email] || [];
    const groupContainer = document.getElementById('group-container');
    groupContainer.innerHTML = '';

    userGroups.forEach(group => {
        createGroupElement(group.name, group.cards);
    });
}

function saveGroups() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const groups = JSON.parse(localStorage.getItem('flashcardGroups')) || {};
    groups[loggedInUser.email] = Array.from(document.querySelectorAll('.group')).map(group => {
        const cards = Array.from(group.querySelectorAll('.flashcard textarea')).map(textarea => ({
            content: textarea.value
        }));
        return { name: group.querySelector('.group-title').textContent, cards: cards };
    });
    localStorage.setItem('flashcardGroups', JSON.stringify(groups));
}

function createGroup() {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('group-name').focus();
    document.getElementById('group-name').value = '';
    editingGroup = null;
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function addGroup() {
    const groupName = document.getElementById('group-name').value.trim();
    if (!groupName) {
        alert('Por favor, insira um nome válido para o grupo.');
        return;
    }

    if (editingGroup) {
        editingGroup.querySelector('.group-title').textContent = groupName;
        editingGroup.classList.add('flipping-in');
        setTimeout(() => editingGroup.classList.remove('flipping-in'), 600);
    } else {
        createGroupElement(groupName);
        registrarAtividade(`Grupo criado: ${groupName}`);
    }
    closeModal();
    saveGroups();
}

function createGroupElement(name, cards = []) {
    const group = document.createElement('div');
    group.className = 'group';
    group.innerHTML = `<div class="group-title">${name}</div>
                       <div class="flashcard-container"></div>
                       <button class="action-button" onclick="addFlashcard(this.parentElement)">+ Adicionar Flashcard</button>
                       <button class="action-button" onclick="editGroup(this.parentElement)">Editar Grupo</button>
                       <button class="action-button" onclick="deleteGroup(this.parentElement)">Excluir Grupo</button>`;
    const groupContainer = document.getElementById('group-container');
    groupContainer.appendChild(group);
    cards.forEach(card => {
        const flashcard = document.createElement('div');
        flashcard.className = 'flashcard';
        flashcard.innerHTML = `<textarea>${card.content}</textarea>
                               <button onclick="saveFlashcard(this)">Editar</button>
                               <button onclick="deleteFlashcard(this.parentElement)">Excluir</button>`;
        group.querySelector('.flashcard-container').appendChild(flashcard);
    });
    group.classList.add('flipping-in');
    setTimeout(() => group.classList.remove('flipping-in'), 600);
}

function editGroup(group) {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('group-name').focus();
    document.getElementById('group-name').value = group.querySelector('.group-title').textContent;
    editingGroup = group;
}

function deleteGroup(group) {
    showConfirmModal('Tem certeza que deseja excluir este grupo?', function() {
        group.classList.add('flipping-out');
        setTimeout(() => {
            group.parentNode.removeChild(group);
            saveGroups();
            registrarAtividade(`Grupo excluído: ${group.querySelector('.group-title').textContent}`);
        }, 600);
    });
}

function addFlashcard(group) {
    const container = group.querySelector('.flashcard-container');
    const flashcard = document.createElement('div');
    flashcard.className = 'flashcard';
    flashcard.innerHTML = `<textarea></textarea>
                           <button onclick="saveFlashcard(this)">Salvar</button>
                           <button onclick="deleteFlashcard(this.parentElement)">Excluir</button>`;
    container.appendChild(flashcard);
    flashcard.classList.add('flipping-in');
    setTimeout(() => flashcard.classList.remove('flipping-in'), 600);
    saveGroups();
    registrarAtividade(`Flashcard adicionado no grupo: ${group.querySelector('.group-title').textContent}`);
}

function saveFlashcard(button) {
    const textarea = button.previousElementSibling;
    if (textarea.disabled) {
        textarea.disabled = false;
        button.textContent = 'Salvar';
    } else {
        textarea.disabled = true;
        button.textContent = 'Editar';
        button.onclick = function() {
            saveFlashcard(button);
        };
        showSuccessMessage('Salvo com sucesso!');
        saveGroups();
        registrarAtividade(`Flashcard editado no grupo: ${button.parentElement.parentElement.previousElementSibling.textContent}`);
    }
}

function deleteFlashcard(flashcard) {
    showConfirmModal('Tem certeza que deseja excluir este flashcard?', function() {
        flashcard.classList.add('flipping-out');
        setTimeout(() => {
            flashcard.parentNode.removeChild(flashcard);
            saveGroups();
            registrarAtividade(`Flashcard excluído do grupo: ${flashcard.parentElement.previousElementSibling.textContent}`);
        }, 600);
    });
}

function toggleHelpModal() {
    const helpModal = document.getElementById('help-modal');
    helpModal.style.display = helpModal.style.display === 'flex' ? 'none' : 'flex';
}

function viewFlashcards() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const groups = JSON.parse(localStorage.getItem('flashcardGroups')) || {};
    const userGroups = groups[loggedInUser.email] || [];
    let flashcards = '';
    userGroups.forEach(group => {
        flashcards += `<h3>${group.name}</h3>`;
        group.cards.forEach(card => {
            flashcards += `<p>${card.content}</p>`;
        });
    });
    document.body.innerHTML = `
        <h1>Todos os Flashcards</h1>
        ${flashcards}
        <button class="action-button" onclick="window.location.href='${window.location.origin + window.location.pathname}'">Voltar</button>
    `;
}

function registrarAtividade(descricao) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const atividades = JSON.parse(localStorage.getItem('atividades')) || {};
    const userActivities = atividades[loggedInUser.email] || [];

    const novaAtividade = {
        descricao,
        data: new Date().toLocaleString()
    };
    userActivities.push(novaAtividade);
    atividades[loggedInUser.email] = userActivities;
    localStorage.setItem('atividades', JSON.stringify(atividades));
}

function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.bottom = '20px';
    messageDiv.style.left = '50%';
    messageDiv.style.transform = 'translateX(-50%)';
    messageDiv.style.backgroundColor = '#28a745';
    messageDiv.style.color = 'white';
    messageDiv.style.padding = '10px 20px';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    messageDiv.style.zIndex = '1000';
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        document.body.removeChild(messageDiv);
    }, 3000);
}

let confirmAction = null;

function confirmYes() {
    if (confirmAction) {
        confirmAction();
        confirmAction = null;
    }
    document.getElementById('confirm-modal').style.display = 'none';
}

function confirmNo() {
    confirmAction = null;
    document.getElementById('confirm-modal').style.display = 'none';
}

function showConfirmModal(message, action) {
    document.getElementById('confirm-message').textContent = message;
    confirmAction = action;
    document.getElementById('confirm-modal').style.display = 'flex';
}
