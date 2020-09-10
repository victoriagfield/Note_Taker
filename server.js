//Dependencies 
const express = require("express");
const path = require("path");
const fs = require("fs");

//sets an inital port
const app = express();
const PORT = process.env.PORT || 8089

// Sets up the Express app to handle data parsing
app.use(express.static('public'));
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());


//variables for the raw data from db.json
let rawData = fs.readFileSync(path.resolve(__dirname + "/db/db.json"));
let dbJSON = JSON.parse(rawData);
console.log(dbJSON);

//Function to set IDs for each individual note
const notesID = () => {
  for (let i = 1; i < dbJSON.length; i++) {
    dbJSON[i].id = i;
  }
}

// Route for index.js
app.get("/assets/js/index.js", function (require, results) {
  results.sendFile(path.join(__dirname, "/public/assets/js/index.js"));
});

// Route for css
app.get("/assets/css/styles.css", function (require, results) {
  results.sendFile(path.join(__dirname, "/public/assets/css/styles.css"));
});

//api route for notes page
app.get("/api/notes", function (require, results) {
  return results.json(dbJSON);
});

//Creating a new note
app.post("/api/notes", function (require, results) {
  const newNotes = require.body
  dbJSON.push(newNotes);
  notesID();

  fs.writeFileSync(__dirname + "/db/db.json", JSON.stringify(dbJSON));
  results.json(newNotes);
  console.log("Your note has been saved!");
});

//Delete a note from the note taker
app.delete("/api/notes/:id", function (require, results) {
  const deleteNotes = require.params.id;
  console.log("Your note has been successfully deleted!");
  dbJSON.splice(deleteNotes, 1);
  notesID();

  fs.writeFileSync(__dirname + "/db/db.json", JSON.stringify(dbJSON));
  results.json(dbJSON);
});

//route for html
app.get("/notes", function (require, results) {
  results.sendFile(path.join(__dirname + "/public/notes.html"));
});

// If no matching route is found default to home
app.get("*", function (require, results) {
  results.sendFile(path.join(__dirname + "/public/index.html"));
});

//console to see if port is listening
app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});