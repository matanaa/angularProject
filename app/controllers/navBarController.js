'use strict';

define(['app'], function (app) {

    var navbarController = function ($scope, $location, config) {
        var appTitle = 'Shop';
        var isAdmin = true;// getCookie("isAdmin");
        $scope.appTitle = appTitle;
        $scope.isAdmin =isAdmin;

        $scope.highlight = function (path) {
            return $location.path().substr(0, path.length) == path;
        };
        $scope.checkAdmin=function () {
            return getCookie("isAdmin")==='true';
        }
        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
    };

    app.controller('NavbarController', ['$scope', '$location', 'config', navbarController]);

});