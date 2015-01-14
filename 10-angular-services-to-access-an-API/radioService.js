angular.module("radioService", [])

.factory("Radio", function($http) {

    // Create the object
    var myFactory = {}; 

    // A function to get all the stuff
    myFactory.all = function() {
        return $http.get("http://r-a-d.io/api");
    };

    return myFactory;

});
