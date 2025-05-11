# Project 
  Our final project, "Text Anonymization",ss tackles the tricky challenge of working with sensitive text data. We've developed a neat way to automatically identify and mask those tricky bits of personal info hiding in your text. By teaming up smart tech like Named Entity Recognition and Large Language Models, we've built a system that's both effective at keeping things private and super easy to use.


## Prerequisites

Before starting the project, make sure you have the following tools:

- [Node.js](https://nodejs.org/) (for the client-side React application)
- [Python 3.x](https://www.python.org/downloads/) (for the server-side Django application)
- [pip](https://pip.pypa.io/en/stable/) (Python package installer)
- [npm](https://www.npmjs.com/) (Node package manager)
- [virtualenv](https://virtualenv.pypa.io/en/latest/) (for creating a virtual environment for Python)
- [Mongo Atlas](https://www.mongodb.com/) (for database management)

## Setup

### 1. Setup the Server (Django)

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Create and activate the virtual environment:
   * python -m venv venv

   * On Windows:
     ```bash
     venv\Scripts\activate
     ```
   * On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
3. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   
4. Create .env file in server folder: 
   ```bash
   server
   |____.env 
   ```
5. Add Database connection info to .env file:
   ```bash
    DB_PASS=
    DB_USER=
    DB_URI=
    DB_NAME=
    JWT_SECRET=
    OPENAI_API_KEY=
   ```
6. Run the Django server:
   ```bash
   python manage.py runserver
   ```
   The Django server should now be running at http://127.0.0.1:8000.

### 2. Setup the Client (React)

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install the required Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   The React client should now be running at http://localhost:3000.

## Running Both Servers

Once both the server and client are running, the Django API should be accessible at `http://127.0.0.1:8000` (or another port if configured differently), and the React client will be running at `http://localhost:3000`.
