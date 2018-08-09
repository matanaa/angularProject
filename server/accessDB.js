// Module dependencies
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Customer = require('./models/customer')
  , Product = require('./models/product')
  , Branch = require('./models/branch')
  , State = require('./models/state')
  , util = require('util');

var jwt= require('jsonwebtoken'); // used to create, sign, and verify tokens

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
        Product.find({},{"_id" :0,"name" : 1,"price" : 1,"type" : 1,"bought" : 1,"producer" : 1,"images" : 1}, function(err, Product) {
            for (var i = 0; i < Product.length; i++) {
                Product[i]._doc.label=Product[i].name;
                Product[i]._doc.count=Product[i].bought;

            }
            callback(null, Product);
        });
    },

    // get a  customer
    getProduct: function(id, callback) {
        console.log('*** accessDB.getProduct');
        Product.findOne({'id': id}, {}, function(err, product) {
            callback(null, product);
        });
    },


    getProductsSummary: function(callback) {
        console.log('*** accessDB.getProductsSummary');
        Product.find({}, function(err, productsSummary) {

            callback(null, productsSummary);
        });
    },


    // insert a  Product
    insertProduct: function(req_body,  callback) {
        console.log('*** accessDB.insertProduct');

        var product = new Product();
        // var s = {'id': state[0].id, 'abbreviation': state[0].abbreviation, 'name': state[0].name}

        product.name = req_body.name;
        product.price = req_body.price;
        product.type = req_body.type;
        product.bought = req_body.bought;
        product.producer = req_body.producer;
        product.images = req_body.images;
        product.save(function(err, product) {
            if (err) {console.log('*** new product save err: ' + err); return callback(err); }

            callback(null, product._id);
        });
    },

    deleteProduct: function(id, callback) {
        console.log('*** accessDB.deleteProduct');
        Product.remove({'id': id}, function(err, product) {
            callback(null);
        });
    },


    groupByAllProducer: function(producer1,callback){
        Product.aggregate(
            [
                 { $group : { _id : "$producer", "count" : { $sum : 1 } } },


            ],
            function(err,results) {
                if (err){
                    callback("cant groupby:"+err, null);
                }
                else{
                    for (var i = 0; i < results.length; i++) {
                        results[i].label=results[i]._id;
                    }


                        callback(null, results);
                }
            }
        )
    },


    groupByProducer: function(producer,callback){
        Product.aggregate(
            [
                { "$match": { "producer": { "$gte": producer, "$lte": producer }}},
                { "$group": {
                        "_id": producer,
                        "total" : { $sum : 1 }
                    }},
            ],
            function(err,results) {
                if (err){
                    callback("cant groupby:"+err, null);
                }
                else{
                    callback(null, results);
                }
            }
        )
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
        Branch.find({}, {}, function(err, branchesSummary) {
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


    // get all the customers
    getCustomers: function(callback) {
        console.log('*** accessDB.getCustomers');
        Customer.find({}, {'_id': 0, 'firstName':1, 'lastName':1, 'city': 1, 'state': 1, 'stateId': 1, 'orders': 1, 'orderCount': 1, 'gender': 1, 'id': 1}, function(err, customers) {
            callback(null, customers);
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
            callback(null, customer[0]);
        });
    },

    // insert a  customer
    insertCustomer: function(req_body, callback) {
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

        Customer.find({'id': id}, {'_id': 1, 'firstName':1, 'lastName':1, 'city': 1, 'state': 1, 'stateId': 1, 'gender': 1, 'id': 1}, function(err, customer) {
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

    editProduct: function(id, req_body, callback) {
        console.log('*** accessDB.editProduct');


        Product.find({'id': id}, {'_id': 1, 'name':1, 'price':1, 'type': 1, 'bought': 1, 'producer': 1, 'images': 1, 'id': 1}, function(err, product) {
            if (err) { return callback(err); }

            product.name = req_body.name;
            product.price = req_body.price;
            product.type = req_body.type;
            product.bought = req_body.bought;
            product.producer = req_body.producer;
            product.images = req_body.images;

            product.save(function(err) {
                if (err) { console.log('*** accessDB.editProduct err: ' + err); return callback(err); }

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

    addOrderToCustomer: function(req_body, cust_id, callback){
        console.log('*** accessDB.addOrderToCustomer');
        Customer.findOne({'id': cust_id}, function(err, user) {
            if (err || user==null) { console.log('*** accessDB.addOrderToCustomer:customer not found ' + err);
                callback("customer not found ",null); }
            else
            {
                Product.findOne({'id': req_body[0]}, function(error, product) {
                    if (err || product==null) { console.log('*** accessDB.addOrderToCustomer:product not found ' + err);
                        callback("product not found ",null); }
                    else
                    {
                        var date = new Date();
                        //ord = {'product': product.name, 'price': product.price};
                        user.orders.push({'dateTime': date.toDateString(),
                            'product': product.name ,
                            'price': product.price,
                            'amount': req_body[1],
                            'total': product.price*req_body[1]});

                        product.bought += req_body[1];

                        user.save(function(err) {
                            if (err) { console.log('*** accessDB.addOrderToCustomer err: ' + err); return callback(err); }
                            else
                            {
                                product.save(function(err) {
                                    if (err) { console.log('*** accessDB.addOrderToCustomer err: ' + err); return callback(err); }

                                    callback(null);
                                });
                            }
                        });

                    }
                })
            }
        });
    },

    addCommentToProduct: function(req_body, cust_id,  callback){
        console.log('*** accessDB.addCommentToProduct');
        Customer.findOne({'id': cust_id}, function(err, user) {
            if (err || user==null) { console.log('*** accessDB.addCommentToProduct:customer not found ' + err);
                callback("customer not found ",null); }
            else
            {
                Product.findOne({'id': req_body[1]}, function(error, product) {
                    if (err || product==null) { console.log('*** accessDB.addCommentToProduct:product not found ' + err);
                        callback("product not found ",null); }
                    else
                    {
                        var amnt = 1;
                        var date = new Date()
                        //ord = {'product': product.name, 'price': product.price};
                        product.comments.push({'dateTime': date.toDateString(),
                            'customerName': user.firstName + " " + user.lastName,
                            'customerId': user.id,
                            'textContent': req_body[0]});

                        product.save(function(err) {
                            if (err) { console.log('*** accessDB.addCommentToProduct err: ' + err); return callback(err); }

                            callback(null);
                        });
                    }
                })
            }
        });
    },


    authenticate: function(email,password, callback){
        console.log('*** accessDB.authenticate');
        Customer.findOne({'email': email}, function(err, user) {
            if (err || user==null) { console.log('*** accessDB.authenticate:customer not found ' + err);
                callback("customer not found ",null); }
            else if (user.password != password){
                console.log('*** accessDB.authenticate:customer worng password ');
                callback("wrong Password", null);
            }else{

                const payload = {
                    admin: user.isAdmin,
                    user: user.firstName+ " "+user.lastName,
                    userid: user.id

                };
                var token = jwt.sign(payload, "mamamama", {
                   // expiresInMinutes: 1440 // expires in 24 hours
                });

                if ( typeof user.isAdmin  === 'undefined'){
                    user.isAdmin=false;
                }
                const retVal = {
                    admin: user.isAdmin,
                    user: user.firstName+ " "+user.lastName,
                    token : token,
                    userid: user.id


                };
                console.log('*** accessDB.authenticate:customer send token');
                callback(null, retVal);

            }

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
