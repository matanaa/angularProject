// Module dependencies
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Customer = require('./models/customer')
  , Product = require('./models/product')
  , Branch = require('./models/branch')
  , State = require('./models/state')
  , util = require('util');

// connect to database
module.exports = {
  // Define class variable
  myEventID: null,

  // initialize DB
  startup: function(dbToUse) {
    mongoose.connect(dbToUse);
    // Check connection to mongoDB
    mongoose.connection.on('open', function() {
      console.log('We have connected to mongodb');
    });

  },

  // disconnect from database
  closeDB: function() {
    mongoose.disconnect();
  },


    // get all the Products
    getProducts: function(callback) {
        console.log('*** accessDB.getProducts');
        Product.find({},{"_id" :0,"name" : 1,"price" : 1,"type" : 1,"stock" : 1,"producer" : 1,"images" : 1}, function(err, Product) {
            callback(null, Product);
        });
    },


    // insert a  Product
    insertProduct: function(req_body,  callback) {
        console.log('*** accessDB.insertProduct');

        var product = new Product();
        // var s = {'id': state[0].id, 'abbreviation': state[0].abbreviation, 'name': state[0].name}

        product.Name = req_body.Name;
        product.price = req_body.price;
        product.type = req_body.type;
        product.stock = req_body.stock;
        product.producer = req_body.producer;
        product.save(function(err, product) {
            if (err) {console.log('*** new product save err: ' + err); return callback(err); }

            callback(null, product._id);
        });
    },



    // get all the branches
    getBranches: function(callback) {
        console.log('*** accessDB.getBranches');
        Branch.find({}, {}, function(err, branches) {
            callback(null, branches[0]);
        });
    },

    // get the branch summary
    getBranchesSummary: function(callback) {
        console.log('*** accessDB.getBranchesSummary');
        Branch.find({}, {'_id': 0, 'name':1, 'phone':1, 'openingHours': 1, 'longitude': 1, 'latitude': 1, 'id': 1}, function(err, branchesSummary) {
            callback(null, branchesSummary);
        });
    },

    // get a  branch
    getBranch: function(id, callback) {
        console.log('*** accessDB.getBranch');
        Branch.find({'id': id}, {}, function(err, branch) {
            callback(null, branch);
        });
    },


    // get a  customer
    getCustomers: function(id, callback) {
        console.log('*** accessDB.getCustomers');
        Customer.find({'id': id}, {}, function(err, customer) {
            callback(null, customers[0]);
        });
    },

    // get the customer summary
    getCustomersSummary: function(callback) {
        console.log('*** accessDB.getCustomersSummary');
        Customer.find({}, {'_id': 0, 'firstName':1, 'lastName':1, 'city': 1, 'state': 1, 'stateId': 1, 'orders': 1, 'orderCount': 1, 'gender': 1, 'id': 1}, function(err, customersSummary) {
            callback(null, customersSummary);
        });
    },

    // get a  customer
    getCustomer: function(id, callback) {
        console.log('*** accessDB.getCustomer');
        Customer.find({'id': id}, {}, function(err, customer) {
            callback(null, customers[0]);
        });
    },

    // insert a  customer
    insertCustomer: function(req_body, state, callback) {
        console.log('*** accessDB.insertCustomer');

        var customer = new Customer();
        // var s = {'id': state[0].id, 'abbreviation': state[0].abbreviation, 'name': state[0].name}

        customer.firstName = req_body.firstName;
        customer.lastName = req_body.lastName;
        customer.email = req_body.email;
        customer.address = req_body.address;
        customer.city = req_body.city;
        //customer.state = s;
        //customer.stateId = state[0].id;
        //customer.zip = req_body.zip;
        customer.gender = req_body.gender;
        customer.id = 1; // The id is calculated by the Mongoose pre 'save'.
        customer.password=req_body.password;
        customer.isAdmin=req_body.isAdmin;
        customer.creditCard=req_body.creditCard;
        customer.save(function(err, customer) {
            if (err) {console.log('*** new customer save err: ' + err); return callback(err); }

            callback(null, customer.id);
        });
    },

    editCustomer: function(id, req_body, state, callback) {
        console.log('*** accessDB.editCustomer');

        var s = {'id': state[0].id, 'abbreviation': state[0].abbreviation, 'name': state[0].name}

        Customer.findOne({'id': id}, {'_id': 1, 'firstName':1, 'lastName':1, 'city': 1, 'state': 1, 'stateId': 1, 'gender': 1, 'id': 1}, function(err, customer) {
            if (err) { return callback(err); }

            customer.firstName = req_body.firstName || customer.firstName;
            customer.lastName = req_body.lastName || customer.lastName;
            customer.email = req_body.email || customer.email;
            customer.address = req_body.address || customer.address;
            customer.city = req_body.city || customer.city;
            customer.state = s;
            customer.stateId = s.id;
            customer.zip = req_body.zip || customer.zip;
            customer.gender = req_body.gender || customer.gender;


            customer.save(function(err) {
                if (err) { console.log('*** accessDB.editCustomer err: ' + err); return callback(err); }

                callback(null);
            });

        });
    },

    // delete a customer
    deleteCustomer: function(id, callback) {
        console.log('*** accessDB.deleteCustomer');
        Customer.remove({'id': id}, function(err, customer) {
            callback(null);
        });
    },



  // get a  customer's email
  getCustomerEmail: function(email, callback) {
    console.log('*** accessDB.getCustomerEmail');
    Customer.find({'email': email}, {'_id': 1}, function(err, customer) {
      callback(null, customer[0]);
    });
  }

// get all the states
//   getStates: function(callback) {
//     console.log('*** accessDB.getStates');
//     State.find({}, {}, function(err, states) {
//       callback(null, states);
//     });
//   },

// get a state
//   getState: function(stateId, callback) {
//     console.log('*** accessDB.getState');
//     State.find({'id': stateId}, {}, function(err, state) {
//       callback(null, state);
//     });
//   }


}
