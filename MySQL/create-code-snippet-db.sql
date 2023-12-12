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
    code_snippet TEXT NOT NULL,
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
VALUES ('john_doe', 'john@mail.com', 'password123', "1989-05-01"),
       ('jane_smith', 'jane@smith.com','securepass', "1999-10-12"),
       ('bob_coder', 'bob@mail.com','letmein', "2002-04-04");

-- Insert programming languages (JS, HTML, CSS and MySQL because that is what I know)
-- ID to keep normalization
INSERT INTO programming_language (language_name) VALUES
    ('JavaScript'),
    ('HTML'),
    ('CSS'),
    ('MySQL');

-- Inserting data into `code_snippet` table
INSERT INTO code_snippet (user_id, title, code_snippet, language_id)
VALUES (1, 'Sum two Numbers', 'function sum(a, b) {	return a + b;	}', 1),
       (2, 'HTML Template', '<html>	    <head>	        <title>My Page</title>	    </head>	    <body>	        Hello, World!	    </body>	</html>', 2),
       (3, 'CSS Styling', 'body { 	font-family: Arial, sans-serif; 	background-color: #f4f4f4;	 }', 3),
       (2, 'SELECT all','SELECT * FROM table;', 4),
       (1, 'Filter by Condition', 'SELECT * FROM my_table 	WHERE column_name = "value";', 4),
       (3, 'Console Log', 'console.log("Logging message");', 1);

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

-- -------------------------------------------