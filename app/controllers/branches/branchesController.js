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

        function initMap() {

            var map = new google.maps.Map(document.getElementById('map_div'), {
                center: {lat: 31.978140, lng: 34.768034},
                zoom: 14
            });

            $scope.branches.map(function (currentBranch) {
                if(currentBranch.latitude && currentBranch.longitude && currentBranch.name) {
                    console.log("Lat : ", currentBranch.latitude, "Lon : ", currentBranch.longitude);

                    // Create a marker and set its position.
                    var marker = new google.maps.Marker({
                        map: map,
                        position: {lat: Number.parseFloat(currentBranch.latitude), lng: Number.parseFloat(currentBranch.longitude)},
                        title: currentBranch.name,
                        animation: google.maps.Animation.DROP
                    });

                    // Create a popup balloon.
                    var contentString = '<div>'+
                        '<h2>' + currentBranch.name + '</h2>';
                    if(currentBranch.openingHours) {
                        contentString += '<p><b>Opening Hours : </b>' + currentBranch.openingHours + '</p>';
                    }
                    if(currentBranch.phone) {
                        contentString += '<p><b>Phone : </b>' + currentBranch.phone + '</p>';
                    }
                    if(currentBranch.address) {
                        contentString += '<p><b>Address : </b>' + currentBranch.address + '</p>';
                    }
                    if(currentBranch.city) {
                        contentString += '<p><b>City : </b>' + currentBranch.city + '</p>';
                    }
                    contentString += '</div>';

                    var infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });

                    marker.addListener('click', function() {
                        infowindow.open(map, marker);
                    });
                }
            });
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

                    if($scope.branches.length === 0) {
                        // Default init for branches in case not existed in DB.
                        $scope.branches = [
                            {
                                "_id" : "5b4610305d5c17ddae31c351",
                                "name" : "Branch Colman",
                                "phone" : "03-1234567",
                                "openingHours" : "09:00 - 16:00",
                                "address" : "Eli Vizel 2 st.",
                                "city" : "Rishon Lezion",
                                "latitude" : "31.9697379",
                                "longitude" : "34.7727873"
                            },
                            {
                                "_id" : "5b4627da21f7e1d7351bb63b",
                                "name" : "Branch Cinema City",
                                "phone" : "04-1234567",
                                "openingHours" : "10:00 - 16:00",
                                "address" : "Yaldei Teheran 3 st.",
                                "city" : "Rishon Lezion",
                                "latitude" : "31.9839871",
                                "longitude" : "34.7709614"
                            },
                            {
                                "_id" : "5b46284321f7e1d7351bb63c",
                                "name" : "Branch Yes Planet",
                                "phone" : "05-1234567",
                                "openingHours" : "11:00 - 16:00",
                                "address" : "Hamea Veesrim 4 st.",
                                "city" : "Rishon Lezion",
                                "latitude" : "31.9796641",
                                "longitude" : "34.7475896"
                            }
                        ];
                    }

                    initMap();

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