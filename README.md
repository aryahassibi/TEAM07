# TEAM07

This is the repository for team 07 of the course CS 308 - Software Engineering at Sabanci University.

We will develop an online store to sell our own brand of coffee.

## Group Members

- Arya Hassibi
- Beste Bayhan
- Mustafa Topcu
- Orhun Ege Ozpay
- Eid Alhamali
- Ecem Akın

## Git and GitHub Guidelines

For detailed guidelines and cheat sheets on using Git and GitHub effectively, refer to our [Git Guide](docs/Git_Guide.md). This resource will help you understand our project's version control practices and provide useful tips and commands.

## Workflow Overview

Here’s a quick roadmap to get you set up and moving forward effectively.

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
- Download and install Docker Desktop from [here](https://www.docker.com/products/docker-desktop).
- Verify Docker is running by checking:
    ```bash
    docker --version
    ```
- **Run the Project in Docker**: Start all services (backend, frontend, database) with:
    ```bash
    docker-compose up --build
    ```
- **Access Services**:
    - **Frontend**: [http://localhost:3000](http://localhost:3000)
    - **Backend**: [http://localhost:5001](http://localhost:5001)
    - **Database**: MySQL on `localhost:3307`
- To stop the running containers, press Ctrl+C in the terminal, then run:
    ```bash
    docker-compose down
    ```
    This will stop and remove the containers. However, the data will persist in the database volume.
    If you want to remove the data as well, run:
    ```bash
    docker-compose down -v
    ```
    This command stops and removes the containers and associated volumes, effectively resetting the database and other persistent data.


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

### Best Practices

- Use **environment variables** for sensitive data. Never hard-code passwords, tokens, or keys in the code.



