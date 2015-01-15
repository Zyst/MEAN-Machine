// Get our packages
var express = require("express");
var app     = express();
var path    = require("path");
var port    = process.env.PORT || 8080;

// Configure public assets folder
app.use(express.static(__dirname + "/public"));

// Route to send Index.html 
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/public/app/views/index.html"));
});

// Start the server!
app.listen(port);
console.log("Server is live! Access on http://localhost:" + port);
