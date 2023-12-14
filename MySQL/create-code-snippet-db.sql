-- @Marcus, makj0005

-- ----------------------------------
-- Creating the code_snippet database
-- ----------------------------------

-- create code_snippet database/scheme --
CREATE DATABASE IF NOT EXISTS code_snippet;

USE code_snippet;

-- create user table --
CREATE TABLE IF NOT EXISTS `user` (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(64) NOT NULL,
    email VARCHAR(255) NOT NULL,
    `password` VARCHAR(64) NOT NULL,
    date_of_birth DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- create programming_language table
CREATE TABLE IF NOT EXISTS programming_language (
    language_id INT AUTO_INCREMENT PRIMARY KEY,
    language_name VARCHAR(64) NOT NULL
);

-- create code-snippet table ----------------------
-- user_id: is the author of the code-snippet
CREATE TABLE IF NOT EXISTS code_snippet (
    snippet_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(128) NOT NULL,
    code_snippet TEXT NOT NULL, -- Text datatype. No restrictions to length
    language_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES `user`(user_id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES programming_language(language_id) ON DELETE CASCADE
);

-- create code-snippet-fave table
CREATE TABLE IF NOT EXISTS code_snippet_fave (
    fave_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    snippet_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES `user`(user_id) ON DELETE CASCADE,
    FOREIGN KEY (snippet_id) REFERENCES code_snippet(snippet_id) ON DELETE CASCADE
);

-- -------------------------------------------
-- Inserting dummy data with help from ChatGPT
-- -------------------------------------------

-- Inserting data into `user` table
INSERT INTO `user` (username, email, `password`, date_of_birth)
VALUES ('john_doe', 'john@mail.com', 'password', "1989-05-01"),
       ('jane_smith', 'jane@smith.com','password', "1999-10-12"),
       ('bob_coder', 'bob@mail.com','password', "2002-04-04");

-- Insert programming languages (JS, HTML, CSS and MySQL because that is what I know)
-- ID to keep normalization
INSERT INTO programming_language (language_name) VALUES
    ('JavaScript'),
    ('HTML'),
    ('CSS'),
    ('MySQL');

-- Inserting data into `code_snippet` table
INSERT INTO code_snippet (user_id, title, code_snippet, language_id)
VALUES
  (1, 'Sum two Numbers', 'function sum(a, b) {\n\treturn a + b;\n}', 1),
  (3, 'CSS Styling', 'body {\n\tfont-family: Arial, sans-serif;\n\tbackground-color: #f4f4f4;\n}', 3),
  (2, 'HTML Template', '<html>\n\t<head>\n\t\t<title>My Page</title>\n\t</head>\n\t<body>Hello, World!</body>\n</html>', 2),
  (2, 'SELECT all', 'SELECT * FROM table;', 4),
  (1, 'Filter by Condition', 'SELECT * FROM my_table\nWHERE column_name = "value";', 4),
  (3, 'Christmas Console Log', 'console.log("Merry Christmas!");', 1);

-- Inserting data into `code_snippet_fave` table
INSERT INTO code_snippet_fave (user_id, snippet_id)
VALUES (3, 1),  -- Bob Coder favorite Sum two Numbers
       (3, 2),  -- Bob Coder favorite HTML template
       (2, 3),  -- Jane Smith favorite CSS Styling
       (1, 4),  -- John Doe favorite SQL SELECT
       (2, 5),  -- Jane Smith favorite SQL filter
       (1, 6);  -- John Doe favorite console log

-- -------------------------------------------
-- Select all queries ------------------------
-- -------------------------------------------

SELECT * FROM `user`;

SELECT * FROM code_snippet;

SELECT * FROM programming_language;

SELECT * FROM code_snippet_fave;

-- ----------------------------------------------------
-- Advanced Used API queries --------------------------
-- ----------------------------------------------------

-- /users/:userId/code-snippets
-- Get all code snippets by a specific user
SELECT
	CS.title,
	U.username AS author,
	U.user_id AS author_id,
	PL.language_name AS programming_language,
	PL.language_id,
	CS.code_snippet AS `code`,
	CS.created_at AS `date`,
	CS.snippet_id FROM code_snippet AS CS
INNER JOIN `user` AS U
	ON CS.user_id = U.user_id
INNER JOIN programming_language AS PL
	ON CS.language_id = PL.language_id
WHERE CS.user_id = 1; -- ? in API

-- /users-with-code-snippets
-- Endpoint to retrieve users who have created code snippets
SELECT DISTINCT
	U.user_id AS author_id,
    U.username AS author
FROM `user` AS U
INNER JOIN code_snippet AS CS
	ON U.user_id = CS.user_id;

-- /users/:userId/code-snippet-faves
-- Endpoint to retrieve favorite code snippets for a specific user
SELECT
	CS.title,
    U.username AS author,
    U.user_id AS author_id,
    PL.language_name AS programming_language,
    PL.language_id,
    CS.code_snippet AS `code`,
    CS.snippet_id,
    CS.created_at AS `date`
FROM code_snippet_fave AS CSF
INNER JOIN code_snippet AS CS
	ON CSF.snippet_id = CS.snippet_id
INNER JOIN programming_language AS PL
	ON CS.language_id = PL.language_id
INNER JOIN `user` AS U
	ON CS.user_id = U.user_id
WHERE CSF.user_id = 1; -- ? in API

-- /users/:userId/favorite-code-snippets/:snippetId
-- Endpoint to retrieve a specific favorite code snippet for a specific user
SELECT
	CS.title,
    U.username AS author,
    U.user_id AS author_id,
    PL.language_name AS programming_language,
    PL.language_id,
    CS.code_snippet AS `code`,
    CS.snippet_id,
    CS.created_at AS `date`
FROM code_snippet_fave AS CSF
INNER JOIN code_snippet AS CS
	ON CSF.snippet_id = CS.snippet_id
INNER JOIN programming_language AS PL
	ON CS.language_id = PL.language_id
INNER JOIN `user` AS U
	ON CS.user_id = U.user_id
WHERE CSF.user_id = 1 AND CSF.snippet_id = 4; -- ? in API

-- /users/:userId/favorite-code-snippets/:snippetId
-- Endpoint to delete the favorite code snippet for the specified user and snippet ID
-- DELETE FROM code_snippet_fave WHERE user_id = ? AND snippet_id = ?

-- /users/:userId/favorite-code-snippets/:snippetId
-- Endpoint to add a code snippet to favorites for the specified user and snippet ID
SELECT * FROM code_snippet_fave WHERE user_id = 3 AND snippet_id = 1; -- ? in API