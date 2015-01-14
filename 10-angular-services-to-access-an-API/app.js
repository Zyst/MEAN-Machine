angular.module("myApp", [])

// Inject the $http into our controller
.controller("mainController", function($http) {
    var vm = this;

    // Make an API call
    $http.get("http://r-a-d.io/api")
        .then(function(data) {

            // Bind the information we get to vm.*
            vm.dj = data.dj;

        });

});
