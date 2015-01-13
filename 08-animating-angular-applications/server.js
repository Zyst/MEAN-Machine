// Get the stuff we need
var express = require("express");
var app     = express();
var path    = require("path");

// set the public folder to serve public assets
app.use(express.static(__dirname + '/public'));

// set up our one route to the index.html file
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/views/index.html'));
});

// Start the server on port 8080 (http://localhost:8080)
app.listen(8080);

console.log("Site is live! Visit at http://localhost:8080");
