document.addEventListener('DOMContentLoaded', function () {
    const cadastrosTable = document.getElementById('cadastrosTable').querySelector('tbody');

    function loadCadastros() {
        let cadastros = localStorage.getItem('cadastros');
        if (!cadastros) {
            cadastros = [];
        } else {
            cadastros = JSON.parse(cadastros);
        }

        cadastrosTable.innerHTML = '';

        cadastros.forEach((cadastro, index) => {
            const row = cadastrosTable.insertRow();
            row.insertCell(0).textContent = cadastro.firstname;
            row.insertCell(1).textContent = cadastro.lastname;
            row.insertCell(2).textContent = cadastro.email;
            row.insertCell(3).textContent = cadastro.number;
            row.insertCell(4).textContent = cadastro.gender;
            const actionsCell = row.insertCell(5);

            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.className = 'edit-button';
            editButton.onclick = function () {
                openEditPopup(index);
            };
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.className = 'delete-button';
            deleteButton.onclick = function () {
                deleteCadastro(index);
            };
            actionsCell.appendChild(deleteButton);
        });
    }

    function openEditPopup(index) {
        let cadastros = localStorage.getItem('cadastros');
        if (!cadastros) {
            cadastros = [];
        } else {
            cadastros = JSON.parse(cadastros);
        }

        const cadastro = cadastros[index];

        const popup = document.createElement('div');
        popup.className = 'edit-popup';
        popup.innerHTML = `
            <div class="edit-popup-content">
                <h2>Editar Cadastro</h2>
                <form id="editForm">
                    <div class="form-group">
                        <label for="editFirstname">Primeiro Nome:</label>
                        <input type="text" id="editFirstname" value="${cadastro.firstname}" required>
                    </div>
                    <div class="form-group">
                        <label for="editLastname">Sobrenome:</label>
                        <input type="text" id="editLastname" value="${cadastro.lastname}" required>
                    </div>
                    <div class="form-group">
                        <label for="editEmail">E-mail:</label>
                        <input type="email" id="editEmail" value="${cadastro.email}" required>
                    </div>
                    <div class="form-group">
                        <label for="editNumber">Celular:</label>
                        <input type="text" id="editNumber" value="${cadastro.number}" required>
                    </div>
                    <div class="form-group">
                        <label for="editGender">Gênero:</label>
                        <select id="editGender" required>
                            <option value="Masculino" ${cadastro.gender === 'Masculino' ? 'selected' : ''}>Masculino</option>
                            <option value="Feminino" ${cadastro.gender === 'Feminino' ? 'selected' : ''}>Feminino</option>
                            <option value="Outro" ${cadastro.gender === 'Outro' ? 'selected' : ''}>Outro</option>
                        </select>
                    </div>
                    <button type="button" onclick="saveEdit(${index})">Salvar</button>
                    <button type="button" onclick="closePopup()">Cancelar</button>
                </form>
            </div>
        `;
        document.body.appendChild(popup);

        window.saveEdit = function (index) {
            const firstname = document.getElementById('editFirstname').value;
            const lastname = document.getElementById('editLastname').value;
            const email = document.getElementById('editEmail').value;
            const number = document.getElementById('editNumber').value;
            const gender = document.getElementById('editGender').value;

            cadastros[index] = { firstname, lastname, email, number, gender };
            localStorage.setItem('cadastros', JSON.stringify(cadastros));

            alert('Cadastro atualizado com sucesso!');
            closePopup();
            loadCadastros();
        };

        window.closePopup = function () {
            document.body.removeChild(popup);
        };
    }

    function deleteCadastro(index) {
        let cadastros = localStorage.getItem('cadastros');
        if (!cadastros) {
            cadastros = [];
        } else {
            cadastros = JSON.parse(cadastros);
        }

        cadastros.splice(index, 1);
        localStorage.setItem('cadastros', JSON.stringify(cadastros));
        loadCadastros();
    }

    loadCadastros();
});
