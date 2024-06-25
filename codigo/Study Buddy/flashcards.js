document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal');
    const helpModal = document.getElementById('help-modal');
    const groupNameInput = document.getElementById('group-name');
    const groupContainer = document.getElementById('group-container');
    let editingGroup = null;

    function loadGroups() {
        const groups = JSON.parse(localStorage.getItem('groups')) || [];
        groups.forEach(group => {
            createGroupElement(group.name, group.cards);
        });
    }

    function saveGroups() {
        const groups = [];
        document.querySelectorAll('.group').forEach(group => {
            const cards = [];
            group.querySelectorAll('.flashcard textarea').forEach(textarea => {
                cards.push({ content: textarea.value });
            });
            groups.push({ name: group.querySelector('.group-title').textContent, cards: cards });
        });
        localStorage.setItem('groups', JSON.stringify(groups));
    }

    window.createGroup = function() {
        modal.style.display = 'flex';
        groupNameInput.focus();
        groupNameInput.value = '';
        editingGroup = null;
    };

    window.closeModal = function() {
        modal.style.display = 'none';
    };

    window.addGroup = function() {
        const groupName = groupNameInput.value.trim();
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
    };

    function createGroupElement(name, cards = []) {
        const group = document.createElement('div');
        group.className = 'group';
        group.innerHTML = `<div class="group-title">${name}</div>
                           <div class="flashcard-container"></div>
                           <button class="action-button" onclick="addFlashcard(this.parentElement)">+ Adicionar Flashcard</button>
                           <button class="action-button" onclick="editGroup(this.parentElement)">Editar Grupo</button>
                           <button class="action-button" onclick="deleteGroup(this.parentElement)">Excluir Grupo</button>`;
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

    window.editGroup = function(group) {
        modal.style.display = 'flex';
        groupNameInput.focus();
        groupNameInput.value = group.querySelector('.group-title').textContent;
        editingGroup = group;
    };

    window.deleteGroup = function(group) {
        showConfirmModal('Tem certeza que deseja excluir este grupo?', function() {
            group.classList.add('flipping-out');
            setTimeout(() => {
                group.parentNode.removeChild(group);
                saveGroups();
                registrarAtividade(`Grupo excluído: ${group.querySelector('.group-title').textContent}`);
            }, 600);
        });
    };

    window.addFlashcard = function(group) {
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
    };

    window.saveFlashcard = function(button) {
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
    };

    window.deleteFlashcard = function(flashcard) {
        showConfirmModal('Tem certeza que deseja excluir este flashcard?', function() {
            flashcard.classList.add('flipping-out');
            setTimeout(() => {
                flashcard.parentNode.removeChild(flashcard);
                saveGroups();
                registrarAtividade(`Flashcard excluído do grupo: ${flashcard.parentElement.previousElementSibling.textContent}`);
            }, 600);
        });
    };

    window.toggleHelpModal = function() {
        if (helpModal.style.display === 'flex') {
            helpModal.style.display = 'none';
        } else {
            helpModal.style.display = 'flex';
        }
    };

    loadGroups(); // Carrega os grupos ao iniciar

    window.viewFlashcards = function() {
        const groups = JSON.parse(localStorage.getItem('groups')) || [];
        let flashcards = '';
        groups.forEach(group => {
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
    };

    function registrarAtividade(descricao) {
        let atividades = localStorage.getItem('atividades');
        if (!atividades) {
            atividades = [];
        } else {
            atividades = JSON.parse(atividades);
        }

        const novaAtividade = {
            descricao,
            data: new Date().toLocaleString()
        };
        atividades.push(novaAtividade);
        localStorage.setItem('atividades', JSON.stringify(atividades));
    }
});

window.showSuccessMessage = function(message) {
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

    setTimeout(function() {
        document.body.removeChild(messageDiv);
    }, 3000);
};

let confirmAction = null; // Armazena a função a ser chamada em caso de confirmação positiva

window.confirmYes = function() {
    if (confirmAction) {
        confirmAction();
        confirmAction = null;
    }
    document.getElementById('confirm-modal').style.display = 'none';
};

window.confirmNo = function() {
    confirmAction = null;
    document.getElementById('confirm-modal').style.display = 'none';
};

function showConfirmModal(message, action) {
    document.getElementById('confirm-message').textContent = message;
    confirmAction = action;
    document.getElementById('confirm-modal').style.display = 'flex';
}
