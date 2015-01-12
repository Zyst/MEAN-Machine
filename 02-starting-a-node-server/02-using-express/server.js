// Load the express package and create our app
var express = require("express");
var app     = express();

// Send our index.html file to the user for the homepage
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

// Start the server
app.listen(1337);

console.log("Site is live! Visit at http://localhost:1337");
