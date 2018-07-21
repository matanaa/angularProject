'use strict';

define(['app'], function (app) {

    var nameProductFilter = function () {

        function matchesProduct(customer, filterValue) {
            if (customer.orders) {
                for (var i = 0; i < customer.orders.length; i++) {
                    if (customer.orders[i].product.toLowerCase().indexOf(filterValue) > -1) {
                        return true;
                    }
                }
                return false;
            }

            return true;
        }

        return function (products, filterValue) {
            if (!filterValue || !products) return products;

            var matches = [];
            filterValue = filterValue.toLowerCase();
            for (var i = 0; i < products.length; i++) {
                var product = products[i];
                if (product.name.toLowerCase().indexOf(filterValue) > -1 ){// ||
                    //matchesProduct(product, filterValue)) {

                    matches.push(product);

                }
            }
            return matches;
        };
    };

    app.filter('nameProductFilter', nameProductFilter);

});