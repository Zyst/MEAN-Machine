// Get the http and filesystem modules
var http = require("http")
    fs   = require("fs");

// Create our server using the http module
http.createServer(function(req, res) {

    // Write to our server. Set configuration for the response.
    res.writeHead(200, {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin" : "*"
    });

// Grab the index.html file using fs
var readStream = fs.createReadStream(__dirname + "/index.html");

// Send the index.html file to our server
readStream.pipe(res);
}).listen(1337);

// Tell ourselves what's happening
console.log("Site is live! Visit at http://localhost:1337");
