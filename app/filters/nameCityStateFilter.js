'use strict';

define(['app'], function (app) {

    var nameCityStateFilter = function () {

        return function (customers, filterFname, filterLname, filterCity) {
            if (!filterFname && !filterLname && !filterCity ) return customers;

            var matches = [];
            filterFname = (!filterFname)? "" : filterFname.toLowerCase();
            filterLname = (!filterLname)? "" : filterLname.toLowerCase();
            filterCity = (!filterCity)? "" : filterCity.toLowerCase();
            for (var i = 0; i < customers.length; i++) {
                var cust = customers[i];
                if ((cust.firstName.toLowerCase().indexOf(filterFname) > -1 || filterFname == "") &&
                    (cust.lastName.toLowerCase().indexOf(filterLname) > -1 || filterLname == "") &&
                    (cust.city.toLowerCase().indexOf(filterCity) > -1 || filterCity == ""))
                {

                    matches.push(cust);

                }
            }
            return matches;
        };
    };

    app.filter('nameCityStateFilter', nameCityStateFilter);

});