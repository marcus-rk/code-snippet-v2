const faveSnippetsButton = document.querySelector('#fave-snippets');

faveSnippetsButton.addEventListener('click', showFaveCodeSnippets);

let faveSnippetView = false;

/**
 * Fetches favorite code snippet data from the server and updates the UI with the retrieved information.
 */
function showFaveCodeSnippets() {
    faveSnippetView = true;
    const userId = getCurrentUserID();

    fetch(`/users/${userId}/code-snippet-faves`)
        .then(response => response.json())
        .then(faveSnippetArray => createAndDisplayFaveSnippets(faveSnippetArray)
        ).catch(error => {
        console.error('Something went wrong:', error);
    });
}


/**
 * Creates and displays favorite code snippet information in the UI.
 *
 * @param {Array} faveSnippetArray - An array of favorite code snippet objects containing information.
 */
function createAndDisplayFaveSnippets(faveSnippetArray) {
    codeSnippetsHeadline.innerText = 'Favorite Code Snippet Overview';
    toggleProfileDropdown();
    clearCodeSnippets();

    faveSnippetArray.forEach(faveSnippetObject => {
        const faveSnippetLiElement = getCodeSnippetElement(faveSnippetObject);
        codeSnippetUlElement.appendChild(faveSnippetLiElement);
    });

    codeSnippetCountElement.innerText = `(Found ${faveSnippetArray.length} code-snippets)`;
    hljs.highlightAll(); // hightligt.js
}