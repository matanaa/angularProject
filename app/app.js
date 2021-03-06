﻿'use strict';

define(['services/routeResolver'], function () {

    var app = angular.module('customersApp', ['ngRoute', 'ngAnimate', 'routeResolverServices', 'wc.Directives', 'wc.Animations', 'ui.bootstrap']);






    app.config(['$routeProvider', 'routeResolverProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$httpProvider',
        function ($routeProvider, routeResolverProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider) {

            //Change default views and controllers directory using the following:
            //routeResolverProvider.routeConfig.setBaseDirectories('/app/views', '/app/controllers');

            app.register =
            {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };
            app.register.directive('bars', function ($parse) {
                return {
                    restrict: 'E',
                    replace: true,
                    template: '<div id="chart"></div>',
                    link: function (scope, element, attrs) {
                        Graph('/api/dataservice/AllproducerGroupBy', "chart");

                    }
                };
            });


            app.register.directive('cust', function ($parse) {
                return {
                    restrict: 'E',
                    replace: true,
                    template: '<div id="chart1"></div>',
                    link: function (scope, element, attrs) {
                        Graph('/api/dataservice/products', "chart1");

                    }
                };
            });


            //Define routes - controllers will be loaded dynamically
            var route = routeResolverProvider.route;

            $routeProvider
                //route.resolve() now accepts the convention to use (name of controller & view) as well as the 
                //path where the controller or view lives in the controllers or views folder if it's in a sub folder. 
                //For example, the controllers for customers live in controllers/customers and the views are in views/customers.
                //The controllers for orders live in controllers/orders and the views are in views/orders
                //The second parameter allows for putting related controllers/views into subfolders to better organize large projects
                //Thanks to Ton Yeung for the idea and contribution
                .when('/customers', route.resolve('Customers', 'customers/'))
                .when('/login', route.resolve('login', 'customers/'))

                .when('/customerorders/:customerID', route.resolve('CustomerOrders', 'customers/'))
                .when('/customeredit/:customerID', route.resolve('CustomerEdit', 'customers/'))
                .when('/orders', route.resolve('Orders', 'orders/'))
                .when('/about', route.resolve('About'))
                .when('/products', route.resolve('products', 'products/'))
                .when('/chat/', route.resolve('chat', 'chat/'))
                .when('/productedit/:productID', route.resolve('productEdit', 'products/'))
                .when('/productBuy/:productID', route.resolve('productBuy', 'products/'))
                .when('/branches', route.resolve('branches', 'branches/'))
                .otherwise({ redirectTo: '/login' });
               // .otherwise({ redirectTo: '/customers' });

    }]);

    //Only needed for Breeze. Maps Q (used by default in Breeze) to Angular's $q to avoid having to call scope.$apply() 
    app.run(['$q', '$rootScope',
        function ($q, $rootScope) {
            breeze.core.extendQ($rootScope, $q);
    }]);

    return app;

});





