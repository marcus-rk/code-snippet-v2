const frontPageCreateUserButton = document.querySelector('#front-create-user');
const frontPageLogInUserButton = document.querySelector('#front-log-in');
const headerButtonsElement = document.querySelector('.header-buttons');
const profileButton = document.querySelector('#profile');
const profileUsernameSpan = document.querySelector('#profile #username');
const logoutButton = document.querySelector('#logout');
const showUserCodeSnippets = document.querySelector('#my-snippets');
const showAllCodeSnippetsButton = document.querySelector('#all-snippets');

// Create user modal elements here:
const userModalElement = document.querySelector('#create-user-modal');
const userModalBackdropElement = document.querySelector('#create-backdrop');
const modalCreateUserButton = document.querySelector('#create-user');
const modalCancelCreateUserButton = document.querySelector('#create-user-cancel');
const modalCreateUserUsernameInput = document.querySelector('#create-username');
const modalCreatedUserEmailInput = document.querySelector('#create-email');
const modalCreateUserPasswordInput = document.querySelector('#create-password');
const modalCreateUserBirthdateInput = document.querySelector('#create-user-modal #date-of-birth');
const modalCreateUserUsernameLabel = document.querySelector('#create-user-modal form label');

// Log in user modal elements here:
const loginModalElement = document.querySelector('#login-user-modal');
const loginModalBackdropElement = document.querySelector('#login-backdrop');
const modalLoginUserButton = document.querySelector('#login-user');
const modalCancelLoginUserButton = document.querySelector('#login-cancel');
const modalLoginUsernameOrEmailInput = document.querySelector('#login-username-mail');
const modalLoginUserPasswordInput = document.querySelector('#login-password');
const modalLoginUserCreateUserButton = document.querySelector('#login-user-modal form button');

frontPageCreateUserButton.addEventListener('click', toggleCreateUserModal);
frontPageLogInUserButton.addEventListener('click', toggleLogInUserModal);
modalLoginUserButton.addEventListener('click', loginUser);
modalCancelLoginUserButton.addEventListener('click', toggleLogInUserModal);
modalCancelCreateUserButton.addEventListener('click', toggleCreateUserModal);
modalCreateUserButton.addEventListener('click', createNewUser);
modalCreateUserPasswordInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        modalCreateUserButton.click();
    }
});
modalLoginUserCreateUserButton.addEventListener('click', () => {
    toggleLogInUserModal();
    toggleCreateUserModal();
})

modalLoginUserPasswordInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        modalLoginUserButton.click();
    }
});
profileButton.addEventListener('click', toggleProfileDropdown);
showAllCodeSnippetsButton.addEventListener('click', showAllCodeSnippets);
logoutButton.addEventListener('click', logoutUser);
showUserCodeSnippets.addEventListener('click', () => {
    showAllUserCodeSnippets(getCurrentUserID());
})

let loggedIn = false;
let currentUserId;
let currentSectionView = 'all';

/***************************************************/
/******************* FUNCTIONS *********************/
/***************************************************/

function createNewUser() {
    const username = modalCreateUserUsernameInput.value;
    const email = modalCreatedUserEmailInput.value;
    const birthDate = modalCreateUserBirthdateInput.value;
    const password = modalCreateUserPasswordInput.value;

    if(!isValidCreateUserInput(username, email, birthDate, password)){
        return;
    }

    fetch("/users/new", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "email": email,
            "birthDate": birthDate,
            "password": password
        })
    }).then(async response => {
        if (response.ok) {
            console.log('User created successfully');

            const userObj = await response.json();

            toggleCreateUserModal();
            changeToLoggedIn(userObj.user_id, userObj.username);
        } else {
            console.error('Something went wrong:', response.statusText);
            return Promise.reject(response.status); // Reject the promise with the status
        }
    }).catch(error => {
        if (error === 403) {
            modalCreateUserUsernameLabel.innerText = 'Username - name or email already in use';
        } else {
            console.error('Unhandled error:', error);
        }
    });
}

function isValidCreateUserInput(username, email, birthDate, password) {
    let hasError = false;

    if (!isValidUsername(username)) {
        displayInputfieldError(modalCreateUserUsernameInput, 'a-z, A-Z, 8-24 characters.');
        hasError = true;
    }

    if (!isValidEmail(email)) {
        displayInputfieldError(modalCreatedUserEmailInput, 'Invalid email format');
        hasError = true;
    }

    if (!isValidBirthDate(birthDate)) {
        displayInputfieldError(modalCreateUserBirthdateInput, 'Invalid birth date');
        hasError = true;
    }

    if (!isValidPassword(password)) {
        displayInputfieldError(modalCreateUserPasswordInput, '8 or more characters');
        hasError = true;
    }

    return !hasError;
}

function isValidUsername(username) {
    const regexPatteren = /^[a-zA-Z0-9]+$/; // allowed: a-z, A-Z, 0-9
    const isValidLength = username.length <= 8 && username.length <= 24;

    return regexPatteren.test(username) && isValidLength;
}

/**
 Uppercase: (A-Z)
 Lowercase: (a-z)
 Digits: (0-9)
 Characters: ! # $ % & ' * + - / = ? ^ _ ` { | } ~
 Character: period or dot check
 RegEx found here: https://www.w3resource.com/javascript/form/email-validation.php
 */
function isValidEmail(email) {
    const regexPatteren = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    return regexPatteren.test(email);
}

function isValidBirthDate(birthDate) {
    // TODO: what to check for here?
    return true;
}

function isValidPassword(password) {
    return password.length >= 8;
}

function displayInputfieldError(inputElement, errorMessage) {
    inputElement.value = '';
    inputElement.classList.add('error-inputfield');
    inputElement.placeholder = errorMessage;
}

function loadAllUsers() {
    fetch('/users-with-code-snippets')
        .then(response => response.json())
        .then(usersArray => createAndRenderAuthor(usersArray)
        ).catch(error => {
        console.error('Something went wrong:', error);
    });
}

function createAndRenderAuthor(usersArray) {
    authorFilter.innerHTML = '';
    const option = document.createElement('option');
    option.innerText = 'All';
    option.setAttribute('value', '0');
    authorFilter.appendChild(option);

    usersArray.forEach(userObj => {
        const option = document.createElement('option');
        option.innerText = userObj.author;
        option.setAttribute('value', userObj.author_id);
        authorFilter.appendChild(option);
    })
}

function loginUser() {
    const usernameOrEmail = modalLoginUsernameOrEmailInput.value;
    const password = modalLoginUserPasswordInput.value;

    fetch("/users/login", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            "usernameOrEmail": usernameOrEmail,
            "password": password
        })
    }).then(async response => {
        if (response.ok) {
            console.log('User logged in successfully');

            const userObj = await response.json();

            toggleLogInUserModal();
            changeToLoggedIn(userObj.user_id, userObj.username);
        } else {
            console.error('Something went wrong:', response.statusText);
            return Promise.reject(response.status); // Reject the promise with the status
        }
    }).catch(error => {
        if (error === 401) {
            console.log('username/email or password is incorrect');
            displayInputfieldError(modalLoginUsernameOrEmailInput, 'username/email or password is incorrect')
            displayInputfieldError(modalLoginUserPasswordInput, 'username/email or password is incorrect')
        } else {
            console.error('Unhandled error:', error);
        }
    });
}

function changeToLoggedIn(userId, username) {
    toggleHeaderButtons();
    toggleProfileButton(username);
    languageFilter.selectedIndex = 0;
    authorFilter.selectedIndex = 0;
    loggedIn = true;
    currentUserId = userId;
    setCurrentSectionView('all');
    showAllCodeSnippets();
}

function logoutUser() {
    toggleProfileButton();
    toggleHeaderButtons();
    toggleProfileDropdown();
    languageFilter.selectedIndex = 0;
    authorFilter.selectedIndex = 0;
    loggedIn = false;
    currentUserId = undefined;
    setCurrentSectionView('all');
    showAllCodeSnippets();
}

function setCurrentSectionView(labelString) {
    if (labelString === 'user') {
        if (!authorFilterLi.classList.contains('hidden')) {
            authorFilterLi.classList.add('hidden');
            authorFilter.value = getCurrentUserID();
        }
    } else {
        if (authorFilterLi.classList.contains('hidden') && labelString !== currentSectionView) {
            authorFilter.selectedIndex = 0;
            authorFilterLi.classList.remove('hidden');
        }
    }

    currentSectionView = labelString;
}

function getCurrentUserID() {
    return parseInt(currentUserId);
}

function toggleProfileButton(username) {
    profileUsernameSpan.innerText = username;
    profileButton.classList.toggle('hidden')
    // TODO: Add username and functionality
}
function toggleHeaderButtons() {
    headerButtonsElement.classList.toggle('hidden');
}

function toggleCreateUserModal() {
    modalCreateUserUsernameInput.value = '';
    modalCreateUserPasswordInput.value = '';
    userModalElement.classList.toggle('hidden');
    userModalBackdropElement.classList.toggle('hidden');
}

function toggleLogInUserModal() {
    modalLoginUsernameOrEmailInput.value = '';
    modalLoginUserPasswordInput.value = '';
    loginModalElement.classList.toggle('hidden');
    loginModalBackdropElement.classList.toggle('hidden');
}

function toggleProfileDropdown() {
    profileDropdown.classList.toggle('hidden');
}