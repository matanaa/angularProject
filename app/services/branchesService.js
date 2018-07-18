'use strict';

define(['app'], function (app) {

    var branchesService = function ($http, $q) {
        var serviceBase = '/api/dataservice/',
            branches = null,
            branchesFactory = {};

        branchesFactory.getBranches = function (pageIndex, pageSize) {
            return getPagedResource('branches', pageIndex, pageSize);
        };

        branchesFactory.getBranchesSummary = function (pageIndex, pageSize) {
            return getPagedResource('branchesSummary', pageIndex, pageSize);
        };

        branchesFactory.getStates = function () {
            return $http.get(serviceBase + 'states').then(
                function (results) {
                    return results.data;
                });
        }

        branchesFactory.checkUniqueValue = function (id, property, value) {
            if (!id) id = 0;
            return $http.get(serviceBase + 'checkUnique/' + id + '?property=' + property + '&value=' + escape(value)).then(
                function (results) {
                    return results.data.status;
                });
        };

        branchesFactory.insertBranch = function (branch) {
            return $http.post(serviceBase + 'addBranch', branch).then(function (results) {
                branch._id = results.data.id;
                return results.data;
            });
        };

        branchesFactory.newBranch = function () {
            return $q.when({});
        };

        branchesFactory.updateBranch = function (branch) {
            return $http.put(serviceBase + 'putBranch/' + branch.id, branch).then(function (status) {
                return status.data;
            });
        };

        branchesFactory.deleteBranch = function (id) {
            return $http.delete(serviceBase + 'deleteBranch/' + id).then(function (status) {
                return status.data;
            });
        };

        branchesFactory.getBranch= function (id) {
            //then does not unwrap data so must go through .data property
            //success unwraps data automatically (no need to call .data property)
            return $http.get(serviceBase + 'branchById/' + id).then(function (results) {
                extendBranches([results.data]);
                return results.data;
            });
        };

        function extendBranches(branches) {
            var branchesLen = branches.length;
            //Iterate through customers
            for (var i = 0; i < branchesLen; i++) {
                var branch = branches[i];
                if (!branch.orders) branch.orders = [];

                var ordersLen = cust.orders.length;
                for (var j = 0; j < ordersLen; j++) {
                    var order = cust.orders[j];
                    order.orderTotal = order.quantity * order.price;
                }
                cust.ordersTotal = ordersTotal(cust);
            }
        }

        function getPagedResource(baseResource, pageIndex, pageSize) {
            var resource = baseResource;
            resource += (arguments.length == 3) ? buildPagingUri(pageIndex, pageSize) : '';
            return $http.get(serviceBase + resource).then(function (response) {
                var custs = response.data;
                return {
                    totalRecords: 1,
                    results: custs
                };
            });
        }

        function buildPagingUri(pageIndex, pageSize) {
            var uri = '?$top=' + pageSize + '&$skip=' + (pageIndex * pageSize);
            return uri;
        }


        function orderTotal(order) {
            return order.quantity * order.price;
        };

        function ordersTotal(customer) {
            var total = 0;
            var orders = customer.orders;
            var count = orders.length;

            for (var i = 0; i < count; i++) {
                total += orders[i].orderTotal;
            }
            return total;
        };

        return branchesFactory  ;

    };

    app.factory('branchesService', ['$http', '$q', branchesService]);

});