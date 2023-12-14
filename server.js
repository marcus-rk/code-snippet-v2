// npm install * --save
const express = require("express");   // Express framework for handling HTTP requests
const mysql2 = require("mysql2");      // MySQL database driver
const cors = require("cors");         // CORS middleware for handling cross-origin resource sharing
const path = require("path");         // Path module for working with file and directory paths

// Importing MySQL password from external file (.gitignore)
const password = require('./password');

// Initializing Express application
const app = express();
const port = 3000;

// Middleware setup
app.use(express.json());
app.use(cors()); // Enable CORS to avoid network security restrictions

// Creating a MySQL connection to code_snippet db
const db = mysql2.createConnection({
    host:"localhost",
    user:"root",
    password: password,
    database:"code_snippet"
});

// Checking connect to the database
db.connect(error => {
    if (error) {
        console.error('Database connection error:', error);
    } else {
        console.log('Connected to the database');
    }
});

// All files within the public folder will be served automatically
// when you access the root path http://localhost:8080/
// For details, refer to: https://expressjs.com/en/starter/static-files.html
app.use(express.static(path.join(__dirname, 'public')));


// Endpoint to create a new user
app.post('/users/new', (req, res) => {
    // Extracting username, email, birthdate, and password from the request body
    const username = req.body.username;
    const email = req.body.email;
    const birthDate = req.body.birthDate;
    const password = req.body.password;

    // Checking if the username or email already exists
    db.query('SELECT user_id FROM `user` WHERE username = ? OR email = ?',
        [username, email],
        (error, results) => {
            if (error) {
                console.error('Error checking if user exists:', error);
                res.status(500).send('Internal Server Error ' +  error);
                return;
            }

            if (results.length > 0) {
                res.status(403).send('Username OR email already exists');
            } else {
                // Inserting a new user into the database
                db.query('INSERT INTO `user` (username, email, date_of_birth, `password`) VALUES (?, ?, ?, ?)',
                    [username, email, birthDate, password],
                    (error) => {
                        if (error) {
                            console.error('Error inserting user:', error);
                            res.status(500).send('Internal Server Error ' +  error);
                        } else {
                            // Getting the new user's data
                            db.query('SELECT username, user_id FROM `user` WHERE username = ?',
                                [username],
                                (error, results) => {
                                    if (error) {
                                        console.error('Error getting new user:', error);
                                        res.status(500).send('Internal Server Error ' +  error);
                                    } else {
                                        // Sending back the username and user_id as an object
                                        const newUser = {
                                            username: results[0].username,
                                            user_id: results[0].user_id
                                        };
                                        res.status(200).send(newUser);
                                    }
                                });
                        }
                    });
            }
        });
});


// Endpoint to log in user by email or username (and password)
// Use POST and not GET, to not expose user password in URL.
app.post('/users/login', (req, res) => {
    // Extracting username and password from the request body
    const usernameOrEmail = req.body.usernameOrEmail;
    const password = req.body.password;

    // Check if the user exists by username or email
    const query = 'SELECT user_id FROM `user` WHERE username = ? OR email = ?';
    db.query(query, [usernameOrEmail, usernameOrEmail], (error, results) => {
        if (error) {
            console.error('Error checking if user exists:', error);
            res.status(401).send('Username OR email does not exist');
            return;
        }

        if (results.length > 0) {
            // Check if password is correct
            const queryPasswordCheck = 'SELECT user_id FROM `user` WHERE (username = ? OR email = ?) AND `password` = ?';
            db.query(queryPasswordCheck, [usernameOrEmail, usernameOrEmail, password], (error, results) => {
                if (error) {
                    console.error('Error logging in user:', error);
                    res.status(500).send('Internal Server Error ' +  error);
                    return;
                }

                if (results.length > 0) {
                    // Getting the new user's data
                    const newUserQuery = 'SELECT username, user_id FROM `user` WHERE (username = ? OR email = ?)';
                    db.query(newUserQuery, [usernameOrEmail, usernameOrEmail],
                        (error, results) => {
                            if (error) {
                                console.error('Error getting new user:', error);
                                res.status(500).send('Internal Server Error ' +  error);
                            } else {
                                // Sending back the username and user_id as an object
                                const user = {
                                    username: results[0].username,
                                    user_id: results[0].user_id
                                };
                                res.status(200).send(user);
                            }
                        });
                } else {
                    res.status(401).send('Incorrect password');
                }
            });
        } else {
            res.status(401).send('Username OR email does not exist');
        }
    });
});


// Endpoint to retrieve all code snippets (title, author, author_id, language, code, date, snippet_id)
app.get('/code-snippets/all',(req, res)=>{
    const query = 'SELECT CS.title, U.username AS author, U.user_id AS author_id, PL.language_name AS programming_language, PL.language_id, CS.code_snippet AS `code`, CS.created_at AS `date`, CS.snippet_id FROM code_snippet AS CS INNER JOIN `user` AS U ON CS.user_id = U.user_id INNER JOIN programming_language AS PL ON CS.language_id = PL.language_id'
    db.query(query, (error, results)=>{
        if (error) {
            console.error('Error finding code snippets:', error);
            res.status(500).send('Internal Server Error ' +  error);
        } else {
            res.send(results);
        }
    });
});

// Endpoint to create a new code snippet
app.post('/code-snippets/new',(req, res)=>{
    // Extracting values from the request body
    const user_id = req.body.user_id;
    const title = req.body.title;
    const code_snippet = req.body.code_snippet;
    const language_id = req.body.language_id;

    // Inserting a new code snippet into the database
    const newSnippetQuery = 'INSERT INTO code_snippet (user_id, title, code_snippet, language_id) VALUES (?, ?, ?, ?)';
    db.query(newSnippetQuery, [user_id, title, code_snippet, language_id],
        (error, results) => {
            if (error) {
                console.error('Error inserting code-snippet:', error);
                res.status(500).send('Internal Server Error ' +  error);
            } else {
                res.status(200).send(results);
            }
        });
});

// Get all code snippets by a specific user
app.get('/users/:userId/code-snippets', (req, res) => {
    const userId = parseInt(req.params.userId);

    console.log(userId);
    console.log(typeof userId);

    // Your database query to retrieve code snippets by user ID goes here
    const query = 'SELECT CS.title, U.username AS author, U.user_id AS author_id, PL.language_name AS programming_language, PL.language_id, CS.code_snippet AS `code`, CS.created_at AS `date`, CS.snippet_id FROM code_snippet AS CS INNER JOIN `user` AS U ON CS.user_id = U.user_id INNER JOIN programming_language AS PL ON CS.language_id = PL.language_id WHERE CS.user_id = ?';

    db.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Error retrieving code snippets:', error);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(results);
        }
    });
});

// Endpoint to retrieve users who have created code snippets
app.get('/users-with-code-snippets', (req, res) => {
    // Query to get users with code snippets
    const query = 'SELECT DISTINCT U.user_id AS author_id, U.username AS author FROM `user` AS U INNER JOIN code_snippet AS CS ON U.user_id = CS.user_id';

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error getting users with code snippets:', error);
            res.status(500).send('Internal Server Error ' + error);
        } else {
            res.status(200).send(results);
        }
    });
});

// Endpoint to retrieve favorite code snippets for a specific user
app.get('/users/:userId/code-snippet-faves',(req, res)=>{
    // Extracting user id from the request parameters
    const idFromUser = req.params.userId;

    // Query to get favorite code snippets for the specified user
    const query = 'SELECT CS.title, U.username AS author, U.user_id AS author_id, PL.language_name AS programming_language, PL.language_id, CS.code_snippet AS `code`, CS.snippet_id, CS.created_at AS `date` FROM code_snippet_fave AS CSF INNER JOIN code_snippet AS CS ON CSF.snippet_id = CS.snippet_id INNER JOIN programming_language AS PL ON CS.language_id = PL.language_id INNER JOIN `user` AS U ON CS.user_id = U.user_id WHERE CSF.user_id = ?';
    db.query(query, [idFromUser],
        (error, results) => {
            if (error) {
                console.error('Error getting code-snippets:', error);
                res.status(500).send('Internal Server Error ' +  error);
            } else {
                res.status(200).send(results);
            }
        });
});

// Endpoint to retrieve a specific favorite code snippet for a specific user
app.get('/users/:userId/favorite-code-snippets/:snippetId', (req, res) => {
    // Extracting user id and snippet id from the request parameters
    const userId = req.params.userId;
    const snippetId = req.params.snippetId;

    // Query to get a specific favorite code snippet for the specified user and snippet ID
    const query = 'SELECT CS.title, U.username AS author, U.user_id AS author_id, PL.language_name AS programming_language, PL.language_id, CS.code_snippet AS `code`, CS.snippet_id, CS.created_at AS `date` FROM code_snippet_fave AS CSF INNER JOIN code_snippet AS CS ON CSF.snippet_id = CS.snippet_id INNER JOIN programming_language AS PL ON CS.language_id = PL.language_id INNER JOIN `user` AS U ON CS.user_id = U.user_id WHERE CSF.user_id = ? AND CSF.snippet_id = ?';

    db.query(query, [userId, snippetId], (error, results) => {
        if (error) {
            console.error('Error getting code-snippet:', error);
            res.status(500).send('Internal Server Error ' + error);
        } else {
            res.status(200).send(results);
        }
    });
});

// Endpoint to delete the favorite code snippet for the specified user and snippet ID
app.delete('/users/:userId/favorite-code-snippets/:snippetId', (req, res) => {
    // Extracting user id and snippet id from the request parameters
    const userId = req.params.userId;
    const snippetId = parseInt(req.params.snippetId);

    // Query to delete the favorite code snippet for the specified user and snippet ID
    const deleteQuery = 'DELETE FROM code_snippet_fave WHERE user_id = ? AND snippet_id = ?';

    db.query(deleteQuery, [userId, snippetId], (error, results) => {
        if (error) {
            console.error('Error getting code-snippet:', error);
            res.status(500).send('Internal Server Error ' + error);
        } else {
            res.status(200).send(results);
        }
    });
});

// Endpoint to add a code snippet to favorites for the specified user and snippet ID
app.post('/users/:userId/favorite-code-snippets/:snippetId', (req, res) => {
    // Extracting user id and snippet id from the request parameters
    const userId = req.params.userId;
    const snippetId = parseInt(req.params.snippetId);

    // Query to check if the code snippet is already in favorites
    const checkQuery = 'SELECT * FROM code_snippet_fave WHERE user_id = ? AND snippet_id = ?';

    db.query(checkQuery, [userId, snippetId], (error, results) => {
        if (error) {
            console.error('Error checking favorite status:', error);
            res.status(500).send('Internal Server Error ' + error);
        } else {
            if (results.length === 0) {
                // Code snippet is not in favorites, proceed to add
                const addQuery = 'INSERT INTO code_snippet_fave (user_id, snippet_id) VALUES (?, ?)';

                db.query(addQuery, [userId, snippetId], (error, results) => {
                    if (error) {
                        console.error('Error adding to favorites:', error);
                        res.status(500).send('Internal Server Error ' + error);
                    } else {
                        res.status(200).send(results);
                    }
                });
            } else {
                // Code snippet is already in favorites, send conflict status
                res.status(403).send('Code snippet is already in favorites');
            }
        }
    });
});


// Default route to handle 404 errors for unmatched API endpoints
app.get('*',(req,res) =>{
    res.sendStatus(404);
});

// Starting the Express server on the specified port (3000)
app.listen(port, () =>{
    console.log(`Application is now running on port ${port}`);
});