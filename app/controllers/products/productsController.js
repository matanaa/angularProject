'use strict';

define(['app', 'services/productsService'], function (app) {

    var productsController = function ($scope, $location, $filter, productsService, modalService) {

        $scope.products = [];
        $scope.filteredProducts = [];
        $scope.filteredCount = 0;
        $scope.orderby = 'name';
        $scope.reverse = false;

        //paging
        $scope.totalRecords = 0;
        $scope.pageSize = 10;
        $scope.currentPage = 1;

        init();

        $scope.pageChanged = function (page) {
            $scope.currentPage = page;
            getProductsSummary();
        };

        $scope.deleteProduct = function (id) {
            var product = getProductById(id);
            var productName = product.name;

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Product',
                headerText: 'Delete ' + productName + '?',
                bodyText: 'Are you sure you want to delete this product?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    productsService.deleteProduct(id).then(function () {
                        for (var i = 0; i < $scope.products.length; i++) {
                            if ($scope.products[i].id == id) {
                                $scope.products.splice(i, 1);
                                break;
                            }
                        }
                        filterProducts($scope.filterName, $scope.filterType, $scope.filterProducer);
                    }, function (error) {
                        alert('Error deleting product: ' + error.message);
                    });
                }
            });
        };

        $scope.ViewEnum = {
            Card: 0,
            List: 1
        }

        $scope.changeView = function (view) {
            switch (view) {
                case $scope.ViewEnum.Card:
                    $scope.listViewEnabled = false;
                    break;
                case $scope.ViewEnum.List:
                    $scope.listViewEnabled = true;
                    break;
            }
        }

        $scope.navigate = function (url) {
            $location.path(url);
        }

        $scope.setOrder = function (orderby) {
            if (orderby === $scope.orderby) {
                $scope.reverse = !$scope.reverse;
            }
            $scope.orderby = orderby;
        };

        function init() {
            createWatches();
            getProductsSummary();
        }

        function createWatches() {
            //Watch searchText value and pass it and the branches to nameCityStateFilter
            //Doing this instead of adding the filter to ng-repeat allows it to only be run once (rather than twice)
            //while also accessing the filtered count via $scope.filteredCount above
            $scope.$watch("filterName", function (filterName) {
                $scope.$watch("filterType", function (filterType) {
                    $scope.$watch("filterProducer", function (filterProducer) {
                        filterProducts(filterName, filterType, filterProducer);
                    })
                })
            });
        }

        function getProductsSummary() {
            productsService.getProductsSummary($scope.currentPage - 1, $scope.pageSize)
                .then(function (data) {
                    $scope.totalRecords = data.totalRecords;
                    $scope.products = data.results;
                    filterProducts(''); //Trigger initial filter
                }, function (error) {
                    alert(error.message);
                });
        }

        function filterProducts(filterName, filterType, filterProducer) {
            $scope.filteredProducts = $filter("nameProductFilter")($scope.products, filterName, filterType, filterProducer);
            if ($scope.filteredProducts.length != null) {
                $scope.filteredCount = $scope.filteredProducts.length;
            }
        }

        function getProductById(id) {
            for (var i = 0; i < $scope.products.length; i++) {
                var product = $scope.products[i];
                if (product.id === id) {
                    return product;
                }
            }
        }

    };

    // app.register.controller('branchesController',
    //     ['$scope', '$location', '$filter', 'branchesService', 'modalService', branchesViewController]);


    app.register.controller('productsController',
        ['$scope', '$location', '$filter', 'productsService', 'modalService', productsController]);

});