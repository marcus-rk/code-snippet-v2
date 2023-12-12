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
app.post('/user/new', (req, res) => {
    // Extracting username, email, birthdate and password from the request body
    const username = req.body.username;
    const email = req.body.email;
    const birthDate = req.body.birthDate;
    const password = req.body.password;

    // Checking if the username or email already exists
    db.query('SELECT user_id FROM `user` WHERE username = ? OR email = ?',
        [username, email],
        (error, results) => {
            if (results.length > 0) {
                res.status(403).send('Username OR email already exists');
            } else {
                // Inserting a new user into the database
                db.query('INSERT INTO `user` (username, email, date_of_birth, `password`) VALUES (?, ?, ?, ?)',
                    [username, email, birthDate, password],
                    (error, results) => {
                        if (error) {
                            console.error('Error inserting user:', error);
                            res.status(500).send('Internal Server Error ' +  error);
                        } else {
                            res.status(200).send(results);
                        }
                    });
            }
        });
});

// Endpoint to log in user by email or username (and password)
// Use POST and not GET, to not expose user password in URL.
app.post('/user/login', (req, res) => {
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
                    res.status(200).send('Login successful');
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
    db.query('SELECT CS.title, U.username AS author, U.user_id AS author_id, PL.language_name AS programming_language, CS.code_snippet AS `code`, CS.created_at AS `date`, CS.snippet_id FROM code_snippet AS CS INNER JOIN `user` AS U ON CS.user_id = U.user_id INNER JOIN programming_language AS PL ON CS.language_id = PL.language_id',
        (error, results)=>{
        if (error) {
            console.error('Error finding cafe:', error);
            res.status(500).send('Internal Server Error ' +  error);
        } else {
            res.send(results);
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