const codeSnippetUlElement = document.querySelector('.code-snippets ul');
const codeSnippetCountElement = document.querySelector('.code-snippets span');

showCodeSnippets()

/**
 * Fetches code snippet data from the server and updates the UI with the retrieved code snippet information.
 * @function
 */
function showCodeSnippets() {
    fetch('/code-snippets/all')
        .then(response => response.json())
        .then(codeSnippetArray => createAndRenderCodeSnippets(codeSnippetArray)
        ).catch(error => {
        console.error('Something went wrong:', error);
    });
}

/**
 * Creates and displays code snippet information in the UI.
 *
 * @param {Array} codeSnippetArray - An array of code snippet objects containing code snippet information.
 */
function createAndRenderCodeSnippets(codeSnippetArray) {
    clearCodeSnippets();

    codeSnippetArray.forEach(codeSnippetObject => {
        const codeSnippetLiElement = getCodeSnippetElement(codeSnippetObject);
        codeSnippetUlElement.appendChild(codeSnippetLiElement);
    });

    codeSnippetCountElement.innerText = `(Found ${codeSnippetArray.length} code-snippets)`;
    hljs.highlightAll(); // hightligt.js
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
    const faveButton = document.createElement('button');
    const faveIcon = document.createElement('span');
    const unfaveIcon = document.createElement('span');

    divContainer.setAttribute('class', 'snippet-header');
    faveIcon.setAttribute('class', 'material-symbols-outlined');
    unfaveIcon.setAttribute('class', 'material-symbols-outlined');

    title.innerText = codeSnippetObject.title;
    faveIcon.innerText = 'favorite';
    unfaveIcon.innerText = 'heart_broken';

    faveButton.appendChild(faveIcon);
    faveButton.appendChild(unfaveIcon);
    divContainer.appendChild(title);
    divContainer.appendChild(faveButton);

    // If the logged-in user is NOT the same as code snippet author, create favorite button
    // if (author_id !== getCurrentUserID()) {
    //    const button = createFavoriteButton(snippet_id);
    //    li.appendChild(button);
    // }

    return divContainer;
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

function clearCodeSnippets() {
    codeSnippetUlElement.innerHTML = '';

}