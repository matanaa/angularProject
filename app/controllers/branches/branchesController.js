'use strict';

define(['app', 'services/branchesService'], function (app) {

    var branchesController = function ($scope, $location, $filter, branchesService, modalService) {

        $scope.branches = [];
        $scope.filteredBranches = [];
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
            getBranchesSummary();
        };

        $scope.deleteBranch = function (id) {
            var branch = getBranchById(id);
            var branchName = branch.name;

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Branch',
                headerText: 'Delete ' + branchName + '?',
                bodyText: 'Are you sure you want to delete this branch?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    branchesService.deleteBranch(id).then(function () {
                        for (var i = 0; i < $scope.branches.length; i++) {
                            if ($scope.branches[i].id == id) {
                                $scope.branches.splice(i, 1);
                                break;
                            }
                        }
                        filterBranches($scope.searchText);
                    }, function (error) {
                        alert('Error deleting branch: ' + error.message);
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
            getBranchesSummary();
        }

        function createWatches() {
            //Watch searchText value and pass it and the branches to nameCityStateFilter
            //Doing this instead of adding the filter to ng-repeat allows it to only be run once (rather than twice)
            //while also accessing the filtered count via $scope.filteredCount above
            $scope.$watch("searchText", function (filterText) {
                filterBranches(filterText);
            });
        }

        function getBranchesSummary() {
            branchesService.getBranchesSummary($scope.currentPage - 1, $scope.pageSize)
                .then(function (data) {
                    $scope.totalRecords = data.totalRecords;
                    $scope.branches = data.results;
                    filterBranches(''); //Trigger initial filter
                }, function (error) {
                    alert(error.message);
                });
        }

        function filterBranches(filterText) {
            $scope.filteredBranches = $filter("nameCityStateFilter")($scope.branches, filterText);
            $scope.filteredCount = $scope.filteredBranches.length;
        }

        function getBranchById(id) {
            for (var i = 0; i < $scope.branches.length; i++) {
                var cust = $scope.branches[i];
                if (cust.id === id) {
                    return cust;
                }
            }
        }

    };

    // app.register.controller('branchesController',
    //     ['$scope', '$location', '$filter', 'branchesService', 'modalService', branchesViewController]);


    app.register.controller('branchesController',
        ['$scope', '$location', '$filter', 'branchesService', 'modalService', branchesController]);

});