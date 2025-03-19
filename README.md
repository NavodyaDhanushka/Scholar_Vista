
# Scholar Vista

### Automated Extraction and Analysis of Research Publications and Achievements

Scholar Vista is a platform designed to automate the extraction and analysis of research publications, track achievements, and facilitate management of scholarly articles.


## Project Setup
#### Prerequisites

Make sure you have the following installed before proceeding:

Git

Node.js (for React frontend)

Python (for FastAPI backend)

MySQL (for MySQL Database)

#### Clone the Project
First, clone the repository to your local machine using Git.
```bash
  git clone https://github.com/NavodyaDhanushka/Scholar_Vista.git
    cd Scholar-Vista

```

### Backend Setup (FastAPI)

The backend is built with FastAPI and Python. It handles user authentication, research paper management, and more.

#### 1. Set up a Virtual Environment

Navigate to the Backend directory and create a virtual environment
```bash
    cd Backend
    python -m venv venv
```

#### 2. Install Dependencies
Activate the virtual environment:
```bash
   venv\Scripts\activate
```
Then, install the required dependencies using pip:
```bash
   pip install -r requirements.txt
```
#### 3. Set up the Database
Make sure MySQL is installed and running. Create a new database for the project and update the database connection details in the .env file.

#### 4. Run the Backend
Now, you can start the FastAPI server:
```bash
   uvicorn main:app --reload
```
The backend will be running at http://127.0.0.1:8005

### Frontend Setup (React)
The frontend is built with React. It interacts with the backend API and displays the user interface.

#### 1. Install Dependencies
Navigate to the Frontend directory and install the necessary dependencies
```bash
   cd ../Frontend
   npm install
```
#### 2. Run the Frontend
To start the React development server, run:
```bash
   npm start
```
This will launch the frontend at http://localhost:3000
## API Endpoints

`/api/research_papers` - Fetch, upload, and manage research papers.

`/api/admin` - Admin functionality for login, registration, and user management.

Make sure both the frontend and backend servers are running in parallel to test the full system.
## Contributing

We welcome contributions to this project! To contribute:

Fork the repository

Create a new branch (git checkout -b feature-name)

Commit your changes (git commit -am 'Add new feature')

Push to your branch (git push origin feature-name)

Create a new pull request

