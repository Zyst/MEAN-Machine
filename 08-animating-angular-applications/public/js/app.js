angular.module('routerApp', ['routerRoutes', 'ngAnimate'])

// Create the controllers
// this will be the controller for the entire site
.controller("mainController", function() {

    var vm = this;

    // Create a big message variable to display in our view
    vm.bigMessage = "A smooth sea never made a skilled sailor.";
})

// Home page specific controller
.controller("homeController", function() {

    var vm = this;

    vm.message = "This is the home page!";
})

// About page controller
.controller("aboutController", function() {

    var vm = this;

    vm.message = "Look! I am an about page.";
})

// Contact page controller
.controller("contactController", function() {

    var vm = this;

    vm.message = "Contact us! Actually don't, this is just a demo.";
});
