const codeSnippetsHeadline = document.querySelector('.code-snippets h2');
const codeSnippetUlElement = document.querySelector('.code-snippets ul');
const codeSnippetCountElement = document.querySelector('.code-snippets span');
const newCodeSnippetButton = document.querySelector('#new-snippet');
const profileDropdown = document.querySelector('.dropdown');
const languageFilter = document.querySelector('#filter-language');
const authorFilter = document.querySelector('#filter-author');
const authorFilterLi = document.querySelector('#author-li');
const searchFilterButton = document.querySelector('#filter-search');

// Create code-snippet modal elements here:
const createCodeModal = document.querySelector('#create-snippet-modal');
const createCodeBackdrop = document.querySelector('#snippet-backdrop');
const createCodeTitleInput = document.querySelector('#snippet-title');
const createCodeLanguageInput = document.querySelector('#language');
const createCodeBodyInput = document.querySelector('#code');
const createCodeSnippetButton = document.querySelector('#create-snippet');
const cancelCreateCodeSnippet = document.querySelector('#create-snippet-cancel');

newCodeSnippetButton.addEventListener('click', toggleCreationModal);
cancelCreateCodeSnippet.addEventListener('click', toggleCreationModal);
createCodeSnippetButton.addEventListener('click', createNewCodeSnippet);
searchFilterButton.addEventListener('click', searchFilter);

document.addEventListener('DOMContentLoaded', function () {
    showAllCodeSnippets();
    loadAllUsers();
});

/**
 * Fetches code snippet data from the server and updates the UI with the retrieved code snippet information.
 * @function
 */
function showAllCodeSnippets() {
    setCurrentSectionView('all')
    codeSnippetsHeadline.innerText = 'Code snippet Overview';

    if (!profileDropdown.classList.contains('hidden'))
        profileDropdown.classList.add('hidden');

    fetch('/code-snippets/all')
        .then(response => response.json())
        .then(codeSnippetArray => createAndRenderCodeSnippets(codeSnippetArray)
        ).catch(error => {
        console.error('Something went wrong:', error);
    });
}

function showAllUserCodeSnippets(userId) {
    loadAllUsers();
    setCurrentSectionView('user');
    codeSnippetsHeadline.innerText = 'My Code Snippet Overview';

    if (!profileDropdown.classList.contains('hidden'))
        profileDropdown.classList.add('hidden');

    fetch(`/users/${userId}/code-snippets`)
        .then(response => response.json())
        .then(codeSnippetArray => createAndRenderCodeSnippets(codeSnippetArray)
        ).catch(error => {
        console.error('Something went wrong:', error);
    });
}

function createNewCodeSnippet() {
    const title = createCodeTitleInput.value;
    const language_id = createCodeLanguageInput.value;
    const code_snippet = createCodeBodyInput.value;
    const user_id = getCurrentUserID();

    // TODO: Check valid input

    fetch("/code-snippets/new", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            "title": title,
            "language_id": language_id,
            "code_snippet": code_snippet,
            "user_id": user_id
        })
    }).then(response => {
        if (response.ok) {
            console.log('Code-snippet created successfully');
            searchFilter();
            toggleCreationModal();
        } else {
            console.error('Something went wrong:', response.statusText);
            return Promise.reject(response.status); // Reject the promise with the status
        }
    }).catch(error => {
        console.error('Unhandled error:', error);
    });
}

/**
 * Creates and displays code snippet information in the UI.
 *
 * @param {Array} codeSnippetArray - An array of code snippet objects containing code snippet information.
 */
function createAndRenderCodeSnippets(codeSnippetArray) {
    clearCodeSnippets();

    const filteredArray = getFilteredCodeSnippetArray(codeSnippetArray);

    filteredArray.forEach(codeSnippetObject => {
        const codeSnippetLiElement = getCodeSnippetElement(codeSnippetObject);
        codeSnippetUlElement.appendChild(codeSnippetLiElement);
    });

    codeSnippetCountElement.innerText = `(Found ${filteredArray.length} code-snippets)`;

    hljs.highlightAll(); // Give all code correct layout with hightlight.js
}

function getFilteredCodeSnippetArray(codeSnippetArray) {
    const languageFilterValue = parseInt(languageFilter.value);
    const authorFilterValue = parseInt(authorFilter.value);

    if (languageFilterValue === 0 && authorFilterValue === 0)
        return codeSnippetArray;

    return codeSnippetArray.filter(codeSnippet => {
        const matchesLanguage = languageFilterValue === 0 || codeSnippet.language_id === languageFilterValue;
        const matchesAuthor = authorFilterValue === 0 || codeSnippet.author_id === authorFilterValue;

        return matchesLanguage && matchesAuthor;
    });
}

function searchFilter() {
    switch (currentSectionView) {
        case 'all':
            showAllCodeSnippets();
            break;
        case 'fave':
            showFaveCodeSnippets();
            break;
        case 'user':
            showAllUserCodeSnippets(getCurrentUserID());
            break;
        default:
            showAllCodeSnippets();
    }
}

/**
 * Creates a list item element representing a code snippet.
 *
 * @param {Object} codeSnippetObject - The code snippet object containing code snippet information.
 * @returns {HTMLLIElement} - The created list item element.
 */
function getCodeSnippetElement(codeSnippetObject) {
    const li = document.createElement('li');
    const snippetHeader = getCodeSnippetHeader(codeSnippetObject);
    const snippetBody = getCodeSnippetBody(codeSnippetObject);
    
    li.appendChild(snippetHeader);
    li.appendChild(snippetBody);

    return li;
}

function getCodeSnippetHeader(codeSnippetObject) {
    const divContainer = document.createElement('div');
    const title = document.createElement('span');

    divContainer.setAttribute('class', 'snippet-header');

    title.innerText = codeSnippetObject.title;

    divContainer.appendChild(title);

    // If the logged-in user is NOT the same as code snippet author, create favorite or un-favorite button
    const usersOwnSnippet = codeSnippetObject.author_id === getCurrentUserID() || getCurrentUserID() === undefined;
    if (loggedIn && !usersOwnSnippet) {
        const userId = getCurrentUserID();
        const snippetId = codeSnippetObject.snippet_id;

        fetch(`/users/${userId}/favorite-code-snippets/${snippetId}`)
            .then(response => response.json())
            .then(codeSnippetArray => {
                const faveButton = createFaveButton(codeSnippetArray, codeSnippetObject);
                divContainer.appendChild(faveButton);
            })
            .catch(error => {
                console.error('Something went wrong:', error);
            });
    }

    return divContainer;
}

function createFaveButton(faveCodeSnippetArray, codeSnippetObject) {
    const faveButton = document.createElement('button');
    const icon = document.createElement('span');

    const likedByCurrentUser = faveCodeSnippetArray.length > 0;

    if (likedByCurrentUser) {
        icon.innerText = 'heart_broken';
        icon.setAttribute('class', 'material-symbols-outlined');

        faveButton.setAttribute('liked', 'true');
        faveButton.setAttribute('snippet-id', faveCodeSnippetArray[0].snippet_id);
    } else {
        icon.innerText = 'favorite';
        icon.setAttribute('class', 'material-symbols-outlined');

        faveButton.setAttribute('liked', 'false');
        faveButton.setAttribute('snippet-id', codeSnippetObject.snippet_id);
    }

    faveButton.addEventListener('click', (event) => {
        const thisFaveButton = event.target.parentNode; // icon is targeted, therefore parentNode
        const snippet_id = thisFaveButton.getAttribute('snippet-id');
        const isLiked = JSON.parse(thisFaveButton.getAttribute('liked')); // convert fx. 'true' to true

        if (isLiked) {
            removeFaveCodeSnippet(getCurrentUserID(), parseInt(snippet_id), thisFaveButton);
        } else {
            addFaveCodeSnippet(getCurrentUserID(), parseInt(snippet_id), thisFaveButton);
        }
    });

    faveButton.appendChild(icon);

    return faveButton;
}

/**
 * Removes a code snippet from favorites by sending a POST request to the server.
 *
 * @param user_id
 * @param {number} snippet_id - The ID of the code snippet to be removed from favorites.
 * @param faveButton
 */
function removeFaveCodeSnippet(user_id, snippet_id, faveButton) {
    fetch(`/users/${user_id}/favorite-code-snippets/${snippet_id}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            "userId" : user_id,
            "snippetId": snippet_id
        })
    }).then(response => {
        if (response.ok) {
            console.log('Removed from favorites successfully');
            faveButton.setAttribute('liked', false);
            const icon = faveButton.firstChild;
            icon.innerText = 'favorite';
            if (currentSectionView === 'fave') {
                searchFilter();
            }
        } else {
            console.error('Failed to remove from favorites:', response.statusText);
            return Promise.reject(response.status); // Reject the promise with the status
        }
    }).catch(error => {
        console.error('Unhandled error:', error);
    });
}

/**
 * Add a code snippet to favorites by sending a POST request to the server.
 *
 * @param {number} user_id - The ID of the user adding the code snippet to favorites.
 * @param {number} snippet_id - The ID of the code snippet to be added to favorites.
 * @param {HTMLButtonElement} faveButton - The button element representing the favorite status.
 */
function addFaveCodeSnippet(user_id, snippet_id, faveButton) {
    fetch(`/users/${user_id}/favorite-code-snippets/${snippet_id}`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            "userId": user_id,
            "snippetId": snippet_id
        })
    }).then(response => {
        if (response.ok) {
            console.log('Added to favorites successfully');
            faveButton.setAttribute('liked', true);
            const icon = faveButton.firstChild;
            icon.innerText = 'heart_broken';
        } else {
            console.error('Failed to add to favorites:', response.statusText);
            return Promise.reject(response.status); // Reject the promise with the status
        }
    }).catch(error => {
        console.error('Unhandled error:', error);
    });
}

function getCodeSnippetBody(codeSnippetObject) {
    const divContainer = document.createElement('div');
    const divTop = getCodeSnippetBodyTop(codeSnippetObject.author, codeSnippetObject.programming_language);
    const codeSnippet = getCodeSnippetBodyElement(codeSnippetObject.code, codeSnippetObject.programming_language);
    const date = getCodeSnippetDate(codeSnippetObject.date);

    divContainer.appendChild(divTop);
    divContainer.appendChild(codeSnippet);
    divContainer.appendChild(date);

    divContainer.setAttribute('class', 'snippet-body');

    return divContainer;
}

function getCodeSnippetDate(date) {
    const dateElement = document.createElement('span');
    dateElement.setAttribute('class', 'snippet-date');
    const dateWithoutTime = date.slice(0,10);
    dateElement.innerText = `Date: ${dateWithoutTime}`;

    return dateElement;
}

function getCodeSnippetBodyTop(author, programmingLanguage) {
    const divContainer = document.createElement('div');
    const authorSpan = document.createElement('span');
    const imgIcon = getProgrammingIcon(programmingLanguage);

    divContainer.setAttribute('class', 'snippet-body-top');

    authorSpan.innerText = `Author: ${author}`; // TODO: DO author bold

    divContainer.appendChild(authorSpan);
    divContainer.appendChild(imgIcon);

    return divContainer;
}

function getProgrammingIcon(programmingLanguage) {
    const img = document.createElement('img');

    switch (programmingLanguage) {
        case 'JavaScript':
            img.setAttribute('src', 'images/js.png');
            img.setAttribute('alt', 'javascript icon');
            img.classList.add('image-border');
            break;
        case 'MySQL':
            img.setAttribute('src', 'images/mysql.png');
            img.setAttribute('alt', 'MySQL icon');
            break;
        case 'HTML':
            img.setAttribute('src', 'images/html.png');
            img.setAttribute('alt', 'HTML icon');
            break;
        case 'CSS':
            img.setAttribute('src', 'images/css.png');
            img.setAttribute('alt', 'CSS icon');
            break;
    }

    return img;
}

function getCodeSnippetBodyElement(code, programmingLanguage) {
    const pre = document.createElement('pre');
    const codeElement = document.createElement('code');

    switch (programmingLanguage) {
        case 'JavaScript':
            codeElement.setAttribute('class', 'language-javascript');
            break;
        case 'MySQL':
            codeElement.setAttribute('class', 'language-sql'); // my sql not supported by hightlight.js
            break;
        case 'HTML':
            codeElement.setAttribute('class', 'language-html');
            break;
        case 'CSS':
            codeElement.setAttribute('class', 'language-css');
            break;
    }

    codeElement.innerText = code.replaceAll('\t', '\n'); // TODO: Make this work!

    pre.appendChild(codeElement);

    return pre;
}

function toggleCreationModal() {
    if (!loggedIn) {
        toggleLogInUserModal();
        return;
    }

    createCodeTitleInput.value = '';
    createCodeLanguageInput.value = '';
    createCodeBodyInput.value = '';
    createCodeModal.classList.toggle('hidden');
    createCodeBackdrop.classList.toggle('hidden');
}

function clearCodeSnippets() {
    codeSnippetUlElement.innerHTML = '';
}