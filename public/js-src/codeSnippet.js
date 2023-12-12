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
        .then(codeSnippetArray => createAndDisplayCodeSnippets(codeSnippetArray)
        ).catch(error => {
        console.error('Something went wrong:', error);
    });
}

/**
 * Creates and displays code snippet information in the UI.
 *
 * @param {Array} codeSnippetArray - An array of code snippet objects containing code snippet information.
 */
function createAndDisplayCodeSnippets(codeSnippetArray) {
    codeSnippetUlElement.innerHTML = '';

    codeSnippetArray.forEach(codeSnippetObject => {
        const codeSnippetLiElement = getCodeSnippetElement(codeSnippetObject);
        codeSnippetUlElement.appendChild(codeSnippetLiElement);
    });

    codeSnippetCountElement.innerText = `(Found ${codeSnippetArray.length} code-snippets)`;
}

/**
 * Creates a list item element representing a code snippet.
 *
 * @param {Object} codeSnippetObject - The code snippet object containing code snippet information.
 * @returns {HTMLLIElement} - The created list item element.
 */
function getCodeSnippetElement(codeSnippetObject) {
    const title = codeSnippetObject.title;
    const author = codeSnippetObject.author;
    const author_id = codeSnippetObject.author_id;
    const snippet_id = codeSnippetObject.snippet_id;
    const programmingLanguage = codeSnippetObject.programming_language;
    const date = codeSnippetObject.date.slice(0,10);
    const code = codeSnippetObject.code;
    const codeFormatted = code.replaceAll('\t', '\n') // tab and new line

    const li = document.createElement('li');
    const spanTitle = document.createElement('span');
    const spanAuthor = document.createElement('span');
    const spanProgrammingLanguage = document.createElement('span');
    const spanDate = document.createElement('span');
    const pre = document.createElement('pre');
    const codeTag = document.createElement('code');

    spanTitle.innerText = `Title: ${title}`;
    spanAuthor.innerText = `Author: ${author}`;
    spanProgrammingLanguage.innerText = `Programming language: ${programmingLanguage}`;
    spanDate.innerText = `Date: ${date}`;
    codeTag.innerText = `\n${codeFormatted}`;

    pre.appendChild(codeTag);

    li.appendChild(spanTitle);
    li.appendChild(spanAuthor);
    li.appendChild(spanProgrammingLanguage);
    li.appendChild(spanDate);
    li.appendChild(pre);

    // If the logged-in user is NOT the same as code snippet author, create favorite button
    // if (author_id !== getCurrentUserID()) {
    //    const button = createFavoriteButton(snippet_id);
    //    li.appendChild(button);
    // }

    return li;
}