document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        loadUserProfile(loggedInUser);
    }

    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    });

    document.getElementById('upload-photo').addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('profile-img').src = e.target.result;
                saveUserProfilePhoto(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const updatedUser = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            profilePicture: document.getElementById('profile-img').src
        };
        saveUserProfile(updatedUser);
        alert('Perfil atualizado com sucesso!');
    });
});

function loadUserProfile(user) {
    document.getElementById('username').value = user.username;
    document.getElementById('email').value = user.email;
    document.getElementById('password').value = user.password;
    document.getElementById('profile-img').src = user.profilePicture || 'default-profile.png';
}

function saveUserProfile(user) {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
}

function saveUserProfilePhoto(photo) {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    user.profilePicture = photo;
    saveUserProfile(user);
}

function showProfile() {
    document.getElementById('profile-details-section').style.display = 'block';
    document.querySelector('.home-content').style.display = 'none';
}
