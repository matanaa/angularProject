'use strict';

define(['app'], function (app) {

    var nameProductFilter = function () {

        return function (product, filterValue) {
            if (!filterValue) return product;

            var matches = [];
            filterValue = filterValue.toLowerCase();
            for (var i = 0; i < product.length; i++) {
                var cust = product[i];
                if (cust.Name.toLowerCase().indexOf(filterValue) > -1 ||
                    cust.type.toLowerCase().indexOf(filterValue) > -1 ||
                    cust.producer.toLowerCase().indexOf(filterValue) > -1 ) {

                    matches.push(cust);

                }
            }
            return matches;
        };
    };

    app.filter('nameProductFilter', nameProductFilter);

});