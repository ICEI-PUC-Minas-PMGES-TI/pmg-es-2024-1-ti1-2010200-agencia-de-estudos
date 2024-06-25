document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        let cadastros = localStorage.getItem('cadastros');
        if (!cadastros) {
            cadastros = [];
        } else {
            cadastros = JSON.parse(cadastros);
        }

        const user = cadastros.find(cadastro => cadastro.email === email && cadastro.password === password);

        if (user) {
            alert('Login bem-sucedido!');
            // Armazena as informações do usuário logado
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            // Redireciona para a página de conteúdo principal
            window.location.href = 'main.html';
        } else {
            alert('E-mail ou senha incorretos!');
        }
    });
});
