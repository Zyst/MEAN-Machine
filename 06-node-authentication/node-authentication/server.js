// Base Setup
// ==================================================================

// Call the packages
var express     = require("express") // Call Express
var app         = express(); // Define our app using express
var bodyParser  = require("body-parser") // Get Body Parser
var morgan      = require("morgan"); // Used to see requests
var mongoose    = require("mongoose"); // For working w/ our Database
var port        = process.env.PORT || 8080; // Set port for our app
var User        = require("./app/models/user"); // We pull user model
var jwt         = require("jsonwebtoken");
var superSecret = "ilovescotchscotchscotchscotchscotch";

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

// On routes that end in /authenticate
// ------------------------------------------------------------------
// Route to authenticate a user
// Accessed at POST http://localhost:8080/api/authenticate
apiRouter.post("/authenticate", function(req, res) {

    // Find the user
    // Select the password explicitily since mongoose is not
    // returning it by default
    User.findOne({
        username: req.body.username
    }).select("password").exec(function(err, user) {

        if (err) throw err;

        // No user with that username was found
        if (!user) {
            res.json({ 
                success: false, 
                message: "Authentication failed. User not found" 
            });
        } else if (user) {
            // Check if the password matches
            var validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
                res.json({
                    success: false,
                    message: "Authentication failed. Wrong password."
                });
            } else {

                // If user is found and password is correct
                // Create a token
                var token = jwt.sign(user, superSecret, {
                    expiresInMinutes: 1440 // Expires in 24 hours
                });

                // Return the information including token as JSON
                res.json({
                    success: true,
                    message: "Enjoy your token!",
                    token: token
                });
            }

        }

    });
});

// Test route to make sure everything is working
// Accessed at GET http://localhost:8080/api
apiRouter.get("/", function(req, res) {
    res.json({ message: "Hooray! Welcome to our api" });
});

// Route middleware to verify a token
apiRouter.use(function(req, res, next) {
    // Do Logging
    console.log("Somebody just came to our app!");

    // Check header or url parameters or post parameters for token
    var token = req.body.token     ||
                req.param("token") ||
                req.headers["x-access-token"];

    if (token) {
        // Verifies secret and checks exp
        jwt.verify(token, superSecret, function(err, decoded) {
            if (err) {
                return res.status(403).send({
                    success: false,
                    message: "Failed to authenticate token"
                });
            } else {
                // If everything is good, save to request for use
                // other routes
                req.decoded = decoded;

                next();

            }
        });

    } else {

        // If there is no token return an HTTP response
        // of 403 (access forbidden) and an error message
        return res.status(403).send({
            success: false,
            message: "No token provided"
        });
    }
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

// Api endpoint to get user information
apiRouter.get("/me", function(req, res) {
    res.send(req.decoded);
});

// Register our Routes ----------------------------------------------
// All of our routes will be prefixed with /api
app.use("/api", apiRouter);

// Start the server
// ==================================================================
app.listen(port);

console.log("Site is live! Visit at http://localhost:" + port);
