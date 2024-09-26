# Code Snippet v2 - API

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D12.0.0-green)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/mysql-%3E%3D5.7-orange)](https://www.mysql.com/)

## Project Overview

**Code Snippet v2** is a web-based platform that enables users to create accounts, share code snippets, and favorite code snippets from other users. It is designed to be a simple yet powerful solution for collaborative coding. The platform features a clean interface and a robust backend powered by Node.js, Express, and MySQL.

This project showcases key skills including:
- Full-stack development (Node.js, Express, MySQL)
- Frontend development (JavaScript, HTML, CSS)
- RESTful API design
- Database design and management
- Basic user authentication and interaction

## Features

- User registration and authentication.
- Ability to create, view, and delete code snippets.
- Option to favorite other users' snippets.
- Responsive UI for seamless user experience.
- RESTful API following best practices.
- Robust error handling and status codes.

<img width="1200" alt="code-snippet-demo" src="https://github.com/user-attachments/assets/6492d669-fcfe-48c6-9049-48c883108537">

## Project Structure

```bash
code-snippet-project/
├─ public/
│  ├─ images/               # Image assets
│  ├─ js-src/               # Frontend JS files
│  │  ├─ codeSnippet.js     # Logic to handle code snippets
│  │  ├─ faveCodeSnippet.js # Logic for favorite code snippets
│  │  ├─ user.js            # User validation and interactions
│  ├─ index.html            # Main HTML file
│  ├─ style.css             # Styling for the frontend
├─ MySQL/                   # MySQL database scripts
├─ server.js                # Node.js backend entry point
├─ README.md                # Project documentation
└─ package.json             # Node.js dependencies
```

---

## Installation

### Prerequisites

- **Node.js** (version 12.x or later)
- **MySQL** (version 5.7 or later)
- **npm** (Node Package Manager)

### Step-by-Step Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/marcus-rk/code-snippet-v2.git
    cd code-snippet-v2
    ```

2. **Set up the MySQL database**:

    - Run the SQL script found in the `MySQL/` folder to create the database:

    ```bash
    mysql -u root -p < MySQL/create-code-snippet-db.sql
    ```

3. **Configure MySQL connection**:
    Open `server.js` and adjust the MySQL credentials:

    ```javascript
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root", 
        password: "your-password-here", 
        database: "code_snippet"
    });
    ```

4. **Install dependencies**:

    ```bash
    npm install express mysql2 cors path
    ```

5. **Start the server**:

    ```bash
    node server.js
    ```

6. **Access the app**: Open your browser and navigate to `http://localhost:3000`.

---

## Usage

### Running the Application

- **Start the server**:

    ```bash
    node server.js
    ```

- **Access the app**: Open your browser and go to `http://localhost:3000`.

### Common Commands

- **npm install**: Re-install dependencies.
- **node server.js**: Start the backend server.

---

## API Endpoints

Here is just a handfull of the available end-points:

### User Endpoints

- **POST /users/:userId/favorite-code-snippets/:snippetId**
    - Add a code snippet to a user’s list of favorites.

### Code Snippet Endpoints

- **GET /code-snippets/all**
    - Retrieve all available code snippets.
  
- **POST /code-snippets**
    - Create a new code snippet.

- **DELETE /code-snippets/:snippetId**
    - Delete a code snippet by its ID.

### Error Handling

- **404**: Custom 404 error for unmatched routes.
- **500**: Detailed internal server error messages.

---

## Technologies Used

### Frontend

- **HTML5**: Structure of the web application.
- **CSS3**: Styling for the application.
- **JavaScript**: For dynamic content and API interactions.

### Backend

- **Node.js**: JavaScript runtime environment for backend logic.
- **Express.js**: Web framework to handle routes and middleware.
- **MySQL**: Database management system for storing user and code snippet data.

### Additional Tools

- **highlight.js**: For syntax highlighting of code snippets.
- **cors**: Middleware to handle Cross-Origin Resource Sharing (CORS).
- **mysql2**: MySQL client for Node.js.
