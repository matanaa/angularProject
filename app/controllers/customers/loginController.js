'use strict';

define(['app'], function (app) {
    var loginController = function ($rootScope, $scope, $location, $routeParams,$http, $timeout, config, dataService, modalService) {
        $scope.customer;
        $scope.states = [];
        $scope.title = "system";
        $scope.buttonText = 'login';
        $scope.updateStatus = false;
        $scope.errorMessage = '';


        var customerID =0,timer,onRouteChangeOff;


        init();

        $scope.doLogin = function () {
            if ($scope.editForm.$valid) {
                dataService.login($scope.customer).then(function (res) {
                    if (res.status ==200 )

                    {
                        window.localStorage.setItem('token', res.data.token);
                        document.cookie = "token="+res.data.token;
                        document.cookie = "isAdmin="+res.data.isAdmin;

                        $http.defaults.headers.common.Authorization = res.data.token;
                        processSuccess()

                    }
                else{
                        processError("User/Password incorrect");
                    }

                });

                    //dataService.insertCustomer($scope.customer).then(processSuccess, processError);
            }
        };

        function init() {
                dataService.newCustomer().then(function (customer) {
                    $scope.customer = customer;
                });
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
            $scope.title = 'Welcome';
            $scope.buttonText = 'Login';
            startTimer();
        }

        function processError(error) {
            $scope.errorMessage = error;
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

    app.register.controller('loginController',
       ['$rootScope', '$scope', '$location', '$routeParams', '$http','$timeout', 'config', 'dataService', 'modalService', loginController]);

});