# Title:

- Vidly App

# Explanation:

- In this project there will be a page in which users can store their movies.
- The app is built using ReactJS.
- When a user is logged in he will see a table with movies, each row having information about the each movie
- The data will be stored on a json-server server
- Each user has the ability to log in/out to register, to change their movie information and to add new movies

# Installation quide:

1. Clone this repository
2. Install dependencies:

- json-server
- etc.

3. Initialize the data from the json-server:

- run this in the command prompt in the location of the db.json file:
  - json-server --watch db.json --port 3001
- now it is very important to keep the port 3001 unless you change the apiEndpoint from the config file with the port you want

4. Run the app

- go inside the app directory and write this command in the command line:
  "npm start"

5. Open your browser and visit http://localhost:3000/ to view it in the browser.
