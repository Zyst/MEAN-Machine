// Load the express package and create our app
var express = require("express");
var app     = express();

// Send our index.html file to the user for the homepage
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

// Create routes for the admin section

// Get an instance of the router
var adminRouter = express.Router();

// Route middleware that will happen on every request
adminRouter.use(function(req, res, next) {
    // Log each request to the console
    console.log(req.method, req.url);

    // Continue doing what we were doing and go to the route
    next();
});

// Admin main page. The dashboard (http://localhost:1337/admin)
adminRouter.get("/", function(req, res) {
    res.send("I am the dashboard!");
});

// Users page (http://localhost:1337/admin/users)
adminRouter.get("/users", function(req, res) {
    res.send("I show all the users!");
});

// Posts page (http://localhost:1337/admin/posts)
adminRouter.get("/posts", function(req, res) {
    res.send("I show all the posts!");
});

// Route middleware to validate :name
adminRouter.param("name", function(req, res, next, name) {
    // Do validation on name here
    // Blah blah validation logic
    // log something so we know it's working
    console.log("Doing name validations on " + name + ".");

    // Once validation is done save the new item in the req
    req.name = name;

    // Go to the next thing
    console.log("Validation successful, " + name +
                " seems to be fine.");
    next();
});

// Route with Parameters(http://localhost:1337/admin/users/:name)
adminRouter.get("/users/:name", function(req, res) {
    res.send("Hello " + req.params.name + "!");
});

// Apply the routes to our application
app.use("/admin", adminRouter);

// Start the server
app.listen(1337);

console.log("Site is live! Visit at http://localhost:1337");
