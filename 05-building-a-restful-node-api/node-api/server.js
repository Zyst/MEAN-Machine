// Base Setup
// ==================================================================

// Call the packages
var express    = require("express") // Call Express
var app        = express(); // Define our app using express
var bodyParser = require("body-parser") // Get Body Parser
var morgan     = require("morgan"); // Used to see requests
var mongoose   = require("mongoose"); // For working w/ our Database
var port       = process.env.PORT || 8080; // Set port for our app
var User       = require("./app/models/user"); // We pull user model

// Connect to our database (Hosted on MongoLab)
mongoose.connect("mongodb://meanmachine:scotch@ds055680.mongolab.com:55680/mean-machine");

// App Configuration ------------------------------------------------
// Use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure our app to handle CORS requests
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers",
        "X-Requested-With, content-type, Authorization");
    next();
});

// Log all requests to the console
app.use(morgan("dev"));

// Routes for our API
// ==================================================================

// Basic route for the home page
app.get("/", function(req, res) {
    res.send("Welcome to the home page!");
});

// Get an instance of the express router
var apiRouter = express.Router();

// Test route to make sure everything is working
// Accessed at GET http://localhost:8080/api
apiRouter.get("/", function(req, res) {
    res.json({ message: "Hooray! Welcome to our api" });
});

apiRouter.use(function(req, res, next) {
    // Do Logging
    console.log("Somebody just came to our app!");

    // We'll add more to the middleware in Chapter 10
    // this is where we will authenticate users
    
    next(); // Make sure we go to the next routes and don't stop here
});

// On routes that end in /users
// ------------------------------------------------------------------
apiRouter.route("/users")
    // Create a user 
    // (Accessed at POST http://localhost:8080/api/users)
    .post(function(req, res) {

        // Create a new instance of the User model
        var user = new User();

        // Set the users information (Comes from the request)
        user.name     = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password

        // Save the user and check for errors
        user.save(function(err) {
            if (err) res.send(err);

            res.json({ message: "User Created!" });
        });
    })

    // Get all users 
    // (Accessed at GET http://localhost:8080/api/users)
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err) res.send(err);

            // Return the users
            res.json(users);
        });
    });

// On routes that end in /users:user_id
// ------------------------------------------------------------------
apiRouter.route("/users/:user_id")

    // Get the user with param ID
    // (Accessed at GET http://localhost:8080/api/users/:user_id)
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err) res.send(err);

            // Return the user
            res.json(user);
        });
    })

    // Update the user with param ID
    // (Accessed at POST http://localhost:8080/api/users/:user_id)
    .put(function(req, res) {

        // Use our user model to find the user we want
        User.findById(req.params.user_id, function(err, user) {
            if (err) res.send(err);

            // Update the users info only if it's new
            if (req.body.name) user.name         = req.body.name;
            if (req.body.username) user.username = req.body.username;
            if (req.body.password) user.password = req.body.password;

            // Save the user
            user.save(function(err) {
                if (err) res.send(err);

                // Return success message
                res.json({ message: "User updated!" });
            });
        });
    })

    // Delete the user with param ID
    // (Accessed at DELETE http://localhost:8080/api/users/:user_id)
    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err) res.send(err);

            res.json({ message: "Successfuly deleted" });
        });
    });

// Register our Routes ----------------------------------------------
// All of our routes will be prefixed with /api
app.use("/api", apiRouter);

// Start the server
// ==================================================================
app.listen(port);

console.log("Site is live! Visit at http://localhost:" + port);
