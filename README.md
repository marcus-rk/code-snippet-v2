# code-snippet-api
Code snippet is a site that makes it possible to create an user, share code-snippets and favorite code-snippets made by other users.

## How to run:
1. Run MySQL script named: **create-code-snippet-db**
2. Change password to yours in **server.js** db connection
```javascript
const connection = mysql.createConnection({
    host:"localhost",
    user:"root", /****** Change this if needed *****/
    password: "your-mysql-password-here", /****** Change this *****/
    database:"code_snippet"
});
```
3. Remember to npm install: **express, mysql2, cors, path**
```
npm install express
npm install mysql2
npm install cors
npm install path
```
4. Run **server.js**
5. Access localhost on port 3000 in your browser: **localhost:3000**

## Technology used
* **Front-end**
  * JavaScript
  * HTML
  * CSS
* **Back-end**
  * Node.js
  * Express
  * MySQL
