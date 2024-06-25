document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registrationForm');

    registrationForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const firstname = document.getElementById('firstname').value;
        const lastname = document.getElementById('lastname').value;
        const email = document.getElementById('email').value;
        const number = document.getElementById('number').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const gender = document.getElementById('gender').value;

        if (password !== confirmPassword) {
            alert('As senhas não correspondem!');
            return;
        }

        let cadastros = localStorage.getItem('cadastros');
        if (!cadastros) {
            cadastros = [];
        } else {
            cadastros = JSON.parse(cadastros);
        }

        const cadastro = { firstname, lastname, email, number, password, gender };
        cadastros.push(cadastro);
        localStorage.setItem('cadastros', JSON.stringify(cadastros));

        alert('Cadastro bem-sucedido!');
        registrationForm.reset();
    });

    // Código existente para o CRUD
    const cadastrosTable = document.getElementById('cadastrosTable').getElementsByTagName('tbody')[0];

    function carregarCadastros() {
        let cadastros = localStorage.getItem('cadastros');
        if (!cadastros) {
            cadastros = [];
        } else {
            cadastros = JSON.parse(cadastros);
        }

        cadastrosTable.innerHTML = '';

        cadastros.forEach((cadastro, index) => {
            const row = cadastrosTable.insertRow();
            row.insertCell(0).innerText = cadastro.firstname;
            row.insertCell(1).innerText = cadastro.lastname;
            row.insertCell(2).innerText = cadastro.email;
            row.insertCell(3).innerText = cadastro.number;
            row.insertCell(4).innerText = cadastro.gender;

            const actionsCell = row.insertCell(5);
            const editButton = document.createElement('button');
            editButton.innerText = 'Editar';
            editButton.classList.add('edit-button');
            editButton.onclick = () => editarCadastro(index);
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Excluir';
            deleteButton.classList.add('delete-button');
            deleteButton.onclick = () => excluirCadastro(index);
            actionsCell.appendChild(deleteButton);
        });
    }

    function editarCadastro(index) {
        const cadastros = JSON.parse(localStorage.getItem('cadastros'));
        const cadastro = cadastros[index];

        document.getElementById('edit-firstname').value = cadastro.firstname;
        document.getElementById('edit-lastname').value = cadastro.lastname;
        document.getElementById('edit-email').value = cadastro.email;
        document.getElementById('edit-number').value = cadastro.number;
        document.getElementById('edit-gender').value = cadastro.gender;
        document.getElementById('edit-index').value = index;

        document.getElementById('edit-popup').style.display = 'block';
    }

    function excluirCadastro(index) {
        let cadastros = JSON.parse(localStorage.getItem('cadastros'));
        cadastros.splice(index, 1);
        localStorage.setItem('cadastros', JSON.stringify(cadastros));
        carregarCadastros();
    }

    document.getElementById('edit-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const index = document.getElementById('edit-index').value;
        const cadastros = JSON.parse(localStorage.getItem('cadastros'));

        cadastros[index].firstname = document.getElementById('edit-firstname').value;
        cadastros[index].lastname = document.getElementById('edit-lastname').value;
        cadastros[index].email = document.getElementById('edit-email').value;
        cadastros[index].number = document.getElementById('edit-number').value;
        cadastros[index].gender = document.getElementById('edit-gender').value;

        localStorage.setItem('cadastros', JSON.stringify(cadastros));
        document.getElementById('edit-popup').style.display = 'none';
        carregarCadastros();
    });

    document.getElementById('edit-cancel').addEventListener('click', function () {
        document.getElementById('edit-popup').style.display = 'none';
    });

    carregarCadastros();
});
