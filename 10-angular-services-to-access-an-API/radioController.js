// Inject the radio service into our main Angular Module
angular.module("myApp", ["radioService"])

// Create a controller and inject the Radio factory
.controller("radioController", function(Radio) {
    var vm = this;

    // Get all the radio
    Radio.all()

        // Promise object
        .success(function(data) {

            // Bind the data to a controller variable
            // this comes from the radioService
            vm.radio = data;
        });
});