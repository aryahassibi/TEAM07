# Project Setup and Development Guide

## Table of Contents
1. [Project Initialization](#project-initialization)
   - [Backend Setup (Node.js)](#backend-setup-nodejs)
   - [Frontend Setup (React)](#frontend-setup-react)
   - [Database Setup (MySQL)](#database-setup-mysql)
2. [Connecting Backend, Frontend, and Database](#connecting-backend-frontend-and-database)
3. [Environment Setup](#environment-setup)
  - [Windows and Mac Setup](#windows-and-mac-setup)
4. [Best Practices](#best-practices)
5. [Troubleshooting and FAQs](#troubleshooting-and-faqs)

---

## Project Initialization

### Backend Setup (Node.js)

1. **Install Node.js:**
   - Download and install Node.js from [here](https://nodejs.org/). Choose the appropriate version based on your operating system.
   - Verify installation:
     ```bash
     node -v
     npm -v
     ```

2. **Initialize the Backend Project:**
   - In the project root directory:
     ```bash
     mkdir backend
     cd backend
     npm init -y
     ```
   - Install essential dependencies (Express framework):
     ```bash
     npm install express
     ```

3. **Create a Basic Express Server:**
   - Create an `index.js` file:
     ```javascript
     const express = require('express');
     const app = express();
     const port = process.env.PORT || 3000;

     app.get('/', (req, res) => {
         res.send('Backend is running');
     });

     app.listen(port, () => {
         console.log(`Server is running on port ${port}`);
     });
     ```

4. **Install MySQL and other dependencies:**
   ```bash
   npm install mysql2
   ```

### Frontend Setup (React)

1. **Install Node.js (if not already):**
   Ensure Node.js and npm are installed.

2. **Create a React App:**
   - In the project root directory:
     ```bash
     npx create-react-app frontend
     cd frontend
     ```

3. **Run the React Application:**
   ```bash
   npm start
   ```

4. **Install Axios (for API requests to backend):**
   ```bash
   npm install axios
   ```

### Database Setup (MySQL)

1. **Install MySQL:**
   - Download MySQL from [here](https://www.mysql.com/downloads/).
   - For Windows, follow the MySQL Installer instructions. For Mac, use `Homebrew`:
     ```bash
     brew install mysql
     ```

2. **Start MySQL Service:**
   - **Windows:**
     Start MySQL using MySQL Workbench or command prompt.
   - **Mac:**
     ```bash
     brew services start mysql
     ```

3. **Create the Database:**
   ```sql
   CREATE DATABASE online_store;
   ```

---

## Connecting Backend, Frontend, and Database

1. **API Integration:**
   - Ensure backend (Node.js) and frontend (React) are running on different ports (e.g., 3000 for React and 5000 for Node.js).
   - Use Axios in the React app to call the backend:
     ```javascript
     axios.get('http://localhost:5000/api/products')
     .then(response => setProducts(response.data))
     ```

2. **Backend-Database Connection:**
   - In your backend code, connect to MySQL:
     ```javascript
     const mysql = require('mysql2');
     const db = mysql.createConnection({
         host: 'localhost',
         user: 'root',
         password: 'your_password',
         database: 'online_store'
     });

     db.connect(err => {
         if (err) throw err;
         console.log('MySQL connected');
     });
     ```

---

## Environment Setup

To ensure consistency and eliminate environment-related issues across all team members, **Docker** will be used to create a uniform development environment. Docker simplifies dependency management and ensures that everyone is working in the same setup, regardless of their operating system. Follow the steps below for setting up the environment.

### Windows and Mac Setup

1. **Install Docker:**
   - Download and install Docker Desktop from [here](https://www.docker.com/products/docker-desktop).
   - Verify Docker is running by checking:
     ```bash
     docker --version
     ```

2. **Clone the Repository:**
   - Clone the project repository to your local machine:
     ```bash
     git clone https://github.com/your-username/TEAM07.git
     cd TEAM07
     ```

3. **Create a `.env` File:**
   - In the project root, create a `.env` file to manage environment variables for the backend and database:
     ```
     PORT=5000
     DB_HOST=db
     DB_USER=root
     DB_PASS=
     DB_NAME=ecommerce_db
     ```
  The `DB_PASS` field should be left empty since for now during the development phase, the database is modified to accepts empty passwords.

4. **Setup Docker with `docker-compose`:**
   - In the project root directory, create a `docker-compose.yml` file to define the services (backend, frontend, and MySQL database):
     ```yaml
     version: '3.8'

     services:
       db:
         image: mysql:8.0
         environment:
           MYSQL_ROOT_PASSWORD: ${DB_PASS}
           MYSQL_DATABASE: ${DB_NAME}
         ports:
           - "3306:3306"
         volumes:
           - ./db_data:/var/lib/mysql

       backend:
         build: ./backend
         ports:
           - "5000:5000"
         volumes:
           - ./backend:/usr/src/app
         depends_on:
           - db
         environment:
           - DB_HOST=db
           - DB_USER=${DB_USER}
           - DB_PASS=${DB_PASS}
           - DB_NAME=${DB_NAME}

       frontend:
         build: ./frontend
         ports:
           - "3000:3000"
         volumes:
           - ./frontend:/usr/src/app
     ```

5. **Build and Start the Containers:**
   - To start the entire application (frontend, backend, and database):
     ```bash
     docker-compose up --build
     ```

6. **Access the Application:**
   - **Frontend**: Go to `http://localhost:3000`
   - **Backend**: Access the backend API at `http://localhost:5000`
   - **Database**: MySQL is running on `localhost:3306`

7. **Stop the Application:**
   - To stop the running containers:
     ```bash
     docker-compose down
     ```
     
---

## Best Practices

- Use **ESLint** and **Prettier** for consistent code style across all environments.
  - Install them as dev dependencies:
    ```bash
    npm install eslint prettier --save-dev
    ```

- Maintain **test coverage** using tools like **Jest** for React and **Mocha** for Node.js.
  
- Use **environment variables** for sensitive data. Never hard-code passwords, tokens, or keys in the code.

---

## Troubleshooting

- **React app not connecting to the backend?**
  - Ensure both the backend and frontend are running on different ports, and use the correct API URL.
  
- **Database connection issues?**
  - Verify the database credentials in the `.env` file and ensure MySQL service is running.
