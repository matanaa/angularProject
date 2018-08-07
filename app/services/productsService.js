'use strict';

define(['app'], function (app) {

    var productsService = function ($http, $q) {
        var serviceBase = '/api/dataservice/',
            products = null,
            productsFactory = {};

        productsFactory.getProducts = function (pageIndex, pageSize) {
            return getPagedResource('products', pageIndex, pageSize);
        };

        productsFactory.getProductsSummary = function (pageIndex, pageSize) {
            return getPagedResource('productsSummary', pageIndex, pageSize);
        };

        productsFactory.getStates = function () {
            return $http.get(serviceBase + 'states').then(
                function (results) {
                    return results.data;
                });
        }

        productsFactory.checkUniqueValue = function (id, property, value) {
            if (!id) id = 0;
            return $http.get(serviceBase + 'checkUnique/' + id + '?property=' + property + '&value=' + escape(value)).then(
                function (results) {
                    return results.data.status;
                });
        };

        productsFactory.insertProduct = function (product) {
            return $http.post(serviceBase + 'addProduct', product).then(function (results) {
                product._id = results.data.id;
                return results.data;
            });
        };

        productsFactory.addToCustomer = function(product){
            return $http.get(serviceBase + "buyProduct/"+ product.id).then(function (status) {
                return status.data;
            })
        }

        productsFactory.addCommentToProduct = function (product, newComment){
            return $http.post(serviceBase + "addComment/"+ product.id, newComment).then(function (results) {
                return results.data;
            })
        }

        productsFactory.newProduct = function () {
            return $q.when({});
        };

        productsFactory.updateProduct = function (product) {
            return $http.put(serviceBase + 'putProduct/' + product.id, product).then(function (status) {
                return status.data;
            });
        };

        productsFactory.deleteProduct = function (id) {
            return $http.delete(serviceBase + 'deleteProduct/' + id).then(function (status) {
                return status.data;
            });
        };

        productsFactory.getProduct = function (id) {
            //then does not unwrap data so must go through .data property
            //success unwraps data automatically (no need to call .data property)
            return $http.get(serviceBase + 'productById/' + id).then(function (results) {
                //extendCustomers([results.data]);
                return results.data;
            });
        };


        productsFactory.producerGroupBy = function (id) {
            //then does not unwrap data so must go through .data property
            //success unwraps data automatically (no need to call .data property)
            return $http.get(serviceBase + 'producerGroupBy/' + id).then(function (results) {
                //extendCustomers([results.data]);
                return results.data;
            });
        };

        // function extendProducts(products) {
        //     var custsLen = products.length;
        //     //Iterate through products
        //     for (var i = 0; i < custsLen; i++) {
        //         var cust = products[i];
        //         if (!cust.orders) cust.orders = [];
        //
        //         var ordersLen = cust.orders.length;
        //         for (var j = 0; j < ordersLen; j++) {
        //             var order = cust.orders[j];
        //             order.orderTotal = order.quantity * order.price;
        //         }
        //         cust.ordersTotal = ordersTotal(cust);
        //     }
        // }

        function getPagedResource(baseResource, pageIndex, pageSize) {
            var resource = baseResource;
            resource += (arguments.length == 3) ? buildPagingUri(pageIndex, pageSize) : '';
            return $http.get(serviceBase + resource).then(function (response) {
                var products = response.data;
                //extendCustomers(custs);
                return {
                    totalRecords: products.length, //parseInt(response.headers('X-InlineCount')),
                    results: products
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

        function ordersTotal(product) {
            var total = 0;
            var orders = product.orders;
            var count = orders.length;

            for (var i = 0; i < count; i++) {
                total += orders[i].orderTotal;
            }
            return total;
        };

        return productsFactory;

    };

    app.factory('productsService', ['$http', '$q', productsService]);

});