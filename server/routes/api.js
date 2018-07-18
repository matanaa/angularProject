var db = require('../accessDB')
  , util = require('util');

// GET
exports.products = function (req, res) {
    console.log('*** products');

    db.getProducts(function(err, products) {
        if (err) {
            console.log('*** products err');
            res.json({
                products: products
            });
        } else {
            console.log('*** products ok');

            res.json(products);
        }
    });
};


exports.addProduct = function (req, res) {
    console.log('*** addProduct');

            db.insertProduct(req.body,  function(err){
                if (err) {
                    console.log('*** addproducts err');
                    res.json(false);
                } else {
                    console.log('*** addproducts ok');

                    res.json(req.body);
                }
            });

};


exports.branches = function (req, res) {
    console.log('*** branches');

    db.getBranches(function(err, branches) {
        if (err) {
            console.log('*** branches err');
            res.json({
                branches: branches
            });
        } else {
            console.log('*** branches ok');

            res.json(branches);
        }
    });
};

exports.branch = function (req, res) {
    console.log('*** branch');

    db.getBranch(req.params.id, function(err, branch) {
        if (err) {
            console.log('*** branch err');
            res.json({
                branch: branch
            });
        } else {
            console.log('*** branch ok');

            res.json(branch);
        }
    });
};


exports.branchesSummary = function (req, res) {
    console.log('*** branchesSummary');
    db.getBranchesSummary(function(err, branchesSummary) {
        if (err) {
            console.log('*** branchesSummary err');
            res.json({
                data: branchesSummary
            });
        } else {
            console.log('*** branchesSummary ok');
            res.json(branchesSummary);
        }
    });
};


exports.customers = function (req, res) {
  console.log('*** customers');

  db.getCustomers(function(err, customers) {
    if (err) {
      console.log('*** customers err');
      res.json({
        customers: customers
      });
    } else {
      console.log('*** customers ok');

      res.json(customers);
    }
  });
};

exports.customer = function (req, res) {
  console.log('*** customer');

  db.getCustomer(req.params.id, function(err, customer) {
    if (err) {
      console.log('*** customer err');
      res.json({
        customer: customer
      });
    } else {
      console.log('*** customer ok');

      res.json(customer);
    }
  });
};

exports.addCustomer = function (req, res) {
  console.log('*** addCustomer');

      db.insertCustomer(req.body, function(err){
        if (err) {
          console.log('*** addCustomer err');
          res.json(false);
        } else {
          console.log('*** addCustomer ok');

          res.json(req.body);
        }
      });

};

 exports.editCustomer = function (req, res) {
  console.log('*** editCustomer');

  db.getState(req.body.stateId, function(err, state) {
    if (err) {
      console.log('*** getState err');
      res.json({'status': false});
    } else {
      db.editCustomer(req.params.id, req.body, state, function(err) {
        if (err) {
          console.log('*** editCustomer err' + util.inspect(err));
          res.json({'status': false});
        } else {
          console.log('*** editCustomer ok');

          res.json({'status': true});
        }
      });
    }
  });
};

exports.deleteCustomer = function (req, res) {
  console.log('*** deleteCustomer');

  db.deleteCustomer(req.params.id, function(err) {
    if (err) {
      console.log('*** deleteCustomer err');
      res.json({'status': false});
    } else {
      console.log('*** deleteCustomer ok');
      res.json({'status': true});
    }
  });
};

// GET
exports.states = function (req, res) {
  console.log('*** states');
    res.json({});
    //TODO: delete all calls to this function
  db.getStates(function(err, states) {

    if (err) {
      console.log('*** states err');
      res.json({
        states: states
      });
    } else {
      console.log('*** states ok');
      res.json(states);
    }
  });
};

exports.customersSummary = function (req, res) {
  console.log('*** customersSummary');
  db.getCustomersSummary(function(err, customersSummary) {
    if (err) {
      console.log('*** customersSummary err');
      res.json({
        data: customersSummary
      });
    } else {
      console.log('*** customersSummary ok');
      res.json(customersSummary);
    }
  });
};

exports.checkemail = function (req, res) {
  console.log('*** checkemail');

  db.getCustomerEmail(req.query.value, function(err, customer) {
    if (err) {
      console.log('*** getCustomerEmail err');
      res.json({
        customer: customer
      });
    } else {
      console.log('*** getCustomerEmail ok');
      res.json({'status': (customer === undefined)});
    }
  });
};





