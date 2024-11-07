# TEAM07

This is the repository for team 07 of the course CS 308 - Software Engineering at Sabanci University.

We will develop an online store to sell our own brand of coffee.

For detailed instructions on setting up the project, initializing the tech stack, and managing version control, please refer to the [Setup Guide](docs/Setup_Guide.md)

## Workflow Overview

If you’re ready to dive into your task, here’s a quick roadmap to get you set up and moving forward effectively.

If you need more detailed instructions, refer to the sections below.

### 1. Set Up Your Development Environment

   - **Install Prerequisites**: Make sure you have **Docker** installed.
   - **Clone the Project Repository**:  
     ```bash
     git clone https://github.com/aryahassibi/TEAM07.git
     cd TEAM07
     ```
   - **Create Environment Variables**: Add a `.env` file in the project root to manage sensitive data:
     ```
     PORT=5000
     DB_HOST=db
     DB_USER=root
     DB_PASS=
     DB_NAME=ecommerce_db
     ```
     The `DB_PASS` field should be left empty since for now during the development phase, the database is modified to accept empty passwords.

### 2. Start Services with Docker

   - **Run the Project in Docker**: Start all services (backend, frontend, database) with:
     ```bash
     docker-compose up --build
     ```
   - **Access Services**:
     - **Frontend**: [http://localhost:3000](http://localhost:3000)
     - **Backend**: [http://localhost:5001](http://localhost:5001)
     - **Database**: MySQL on `localhost:3307`

### 3. Choose Your Task and Branch

   - **Sync the Latest Code**:
     ```bash
     git pull origin develop
     ```
   - **Create a Feature Branch** for your task (replace `your-feature` with your task name):
     ```bash
     git checkout -b feature/your-feature
     ```

### 4. Code, Test, and Push

   - **Develop**: Write your code and test it locally. Make sure API calls (from React) to the backend work smoothly.
   - **Commit Changes** using the format: `type(scope): message`
     ```bash
     # Stage the changes you want to commit
     git add .
     ```
     ```bash
     git commit -m "type(scope): message"
     ```
   - **Push Your Branch**:
     ```bash
     git push origin feature/your-feature
     ```

### 5. Open a Pull Request (PR)

   - On [GitHub](https://github.com/aryahassibi/TEAM07.git), submit a **Pull Request to the `develop` branch** and request a review. 
   - Once approved by a at least one of your teammates, you’re ready to merge.

## Group Members

- Arya Hassibi
- Beste Bayhan
- Mustafa Topcu
- Orhun Ege Ozpay
- Eid Alhamali
- Ecem Akın
