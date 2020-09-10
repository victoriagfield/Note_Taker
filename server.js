//Dependencies 
const express = require("express");
const path = require("path");
const fs = require("fs");

//sets an inital port
const app = express();
const PORT = process.env.PORT || 8089

// Sets up the Express app to handle data parsing
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//variables for the raw data from db.json
let rawData = fs.readFileSync(__dirname + "/db/db.json");
let dbJSON = JSON.parse(rawData);
console.log(dbJSON);

//Function to set IDs for each individual note
const notesId = () => {
  for (let i = 0; i < dbJSON.length; i++) {
    dbJSON[i].id = i;
  }
}


// Route for index.js
app.get("/assets/js/index.js", function(require, results) {
  results.sendFile(path.join(__dirname, "/public/assets/js/index.js"));
});

// Route for css
app.get("/assets/css/styles.css", function(require, results) {
  results.sendFile(path.join(__dirname, "/public/assets/css/styles.css"));
});

//route for notes page
app.get("/notes", function(require, results){
  results.sendFile(path.join(__dirname, "/public/notes.html" ));
});

app.get("api/notes", function(require, results){
  results.end(JSON.stringify(dbJSON));
});

//**THIS IS WHERE CODE FOR Delete a note from the note taker WILL GO

//Creating a new note
app.post("/api/notes", function(results, require){
  let newNotes = require.body
  dbJSON.push(newNotes);
  results.json(newNotes);
  notesId();

  fs.writeFileSync(path.resolve(__dirname + "/db/db.json", JSON.stringify(dbJSON)));
  results.json(newNotes);
});

//route for index.html
app.get("/index", function(require, results) {
  results.sendFile(path.join(__dirname + "/public/index.html"));
});

// If no matching route is found default to home
app.get("*", function(require, results) {
  results.sendFile(path.join(__dirname + "/public/index.html"));
});


//console to see if port is listening
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});