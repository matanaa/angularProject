'use strict';

define(['app', 'services/productsService'], function (app) {

    var productsController = function ($rootScope, $scope, $location, $routeParams, $timeout, config, productsService, modalService) {

        var productID = ($routeParams.productID) ? parseInt($routeParams.productID) : 0,
            timer,
            onRouteChangeOff;

        $scope.product;
        $scope.title = (productID > 0) ? 'Edit' : 'Add';
        $scope.buttonText = (productID > 0) ? 'Update' : 'Add';
        $scope.updateStatus = false;
        $scope.errorMessage = '';

        init();



        $scope.saveProduct = function () {

            if ($scope.editForm.$valid) {
                if (!$scope.product.id) {
                    productsService.insertProduct($scope.product).then(processSuccess, processError);
                }
                else {
                    productsService.updateProduct($scope.product).then(processSuccess, processError);
                }
            }
        };

        $scope.deleteProduct = function () {
            var productName = $scope.product.name;
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Product',
                headerText: 'Delete ' + productName + '?',
                bodyText: 'Are you sure you want to delete this product?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    productsService.deleteProduct($scope.product.id).then(function () {
                        onRouteChangeOff(); //Stop listening for location changes
                        $location.path('/products');
                    }, processError);
                }
            });
        };

        function init() {
            if (productID > 0) {
                productsService.getProduct(productID).then(function (product) {
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