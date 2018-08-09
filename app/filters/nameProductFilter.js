'use strict';

define(['app'], function (app) {

    var nameProductFilter = function () {

        return function (product, filterName, filterType, filterProducer) {
            if (!filterName && !filterType && !filterProducer ) return product;

            var matches = [];
            filterName = (!filterName)? "" : filterName.toLowerCase();
            filterType = (!filterType)? "" : filterType.toLowerCase();
            filterProducer = (!filterProducer)? "" : filterProducer.toLowerCase();
            for (var i = 0; i < product.length; i++) {
                var prod = product[i];
                if ((prod.name.toLowerCase().indexOf(filterName) > -1 || filterName == "") &&
                    (prod.type.toLowerCase().indexOf(filterType) > -1 || filterType == "") &&
                    (prod.producer.toLowerCase().indexOf(filterProducer) > -1 || filterProducer == "")) {

                    matches.push(i);

                }
            }
            return matches;
        };
    };

    app.filter('nameProductFilter', nameProductFilter);

});