// Grab the packages that we require for the user model
var mongoose = require("mongoose");
var Schema   = mongoose.Schema;
var bcrypt   = require("bcrypt-nodejs");

// User Schema
var UserSchema = new Schema({
    name: String,
    username: { type: String, required: true, index: { unique: true }},
    password: { type: String, required: true, select: false }
});

// Hash the password before the user is saved
UserSchema.pre("save", function(next) {
    var user = this;

    // Hash the password only if the password has been changed
    // or if the user is new
    if(!user.isModified("password")) return next();

    // Generate the salt
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err);

        // Change the password to the hashed version
        user.password = hash;
        next();
    });
});

// Method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
    var user = this;

    return bcrypt.compareSync(password, user.password);
};

// Return the model
module.exports = mongoose.model("User", UserSchema);
