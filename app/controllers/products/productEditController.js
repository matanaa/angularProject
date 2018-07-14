'use strict';

define(['app', 'services/productsService'], function (app) {

    var productsController = function ($rootScope, $scope, $location, $routeParams, $timeout, config, productsService, modalService) {

        var customerID = ($routeParams.customerID) ? parseInt($routeParams.customerID) : 0,
            timer,
            onRouteChangeOff;

        $scope.customer;
        $scope.title = (customerID > 0) ? 'Edit' : 'Add';
        $scope.buttonText = (customerID > 0) ? 'Update' : 'Add';
        $scope.updateStatus = false;
        $scope.errorMessage = '';

        init();



        $scope.saveProduct = function () {
            console.log("here");
            if ($scope.editForm.$valid) {
                if (!$scope.product.id) {
                    productsService.insertProduct($scope.product).then(processSuccess, processError);
                }
                else {
                    productsService.updateCustomer($scope.customer).then(processSuccess, processError);
                }
            }
        };

        $scope.deleteCustomer = function () {
            var custName = $scope.customer.firstName + ' ' + $scope.customer.lastName;
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Customer',
                headerText: 'Delete ' + custName + '?',
                bodyText: 'Are you sure you want to delete this customer?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    productsService.deleteCustomer($scope.customer.id).then(function () {
                        onRouteChangeOff(); //Stop listening for location changes
                        $location.path('/customers');
                    }, processError);
                }
            });
        };

        function init() {
            if (customerID > 0) {
                productsService.getProducts(customerID).then(function (product) {
                    $scope.product = product;
                }, processError);
            } else {
                productsService.newProduct().then(function (product) {
                    $scope.product = product;
                });

            }
            //getStates();

            //Make sure they're warned if they made a change but didn't save it
            //Call to $on returns a "deregistration" function that can be called to
            //remove the listener (see routeChange() for an example of using it)
            onRouteChangeOff = $rootScope.$on('$locationChangeStart', routeChange);
        }

        function routeChange(event, newUrl) {
            //Navigate to newUrl if the form isn't dirty
            if (!$scope.editForm.$dirty) return;

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ignore Changes',
                headerText: 'Unsaved Changes',
                bodyText: 'You have unsaved changes. Leave the page?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    onRouteChangeOff(); //Stop listening for location changes
                    $location.path(newUrl); //Go to page they're interested in
                }
            });

            //prevent navigation by default since we'll handle it
            //once the user selects a dialog option
            event.preventDefault();
            return;
        }

        function getStates() {
            productsService.getStates().then(function (states) {
                $scope.states = states;
            }, processError);
        }

        function processSuccess() {
            $scope.editForm.$dirty = false;
            $scope.updateStatus = true;
            $scope.title = 'Edit';
            $scope.buttonText = 'Update';
            startTimer();
        }

        function processError(error) {
            $scope.errorMessage = error.message;
            startTimer();
        }

        function startTimer() {
            timer = $timeout(function () {
                $timeout.cancel(timer);
                $scope.errorMessage = '';
                $scope.updateStatus = false;
            }, 3000);
        }
    };

    app.register.controller('productEditController',
       ['$rootScope', '$scope', '$location', '$routeParams', '$timeout', 'config', 'productsService', 'modalService', productsController]);

});