/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , api = require('./routes/api')
    , DB = require('./accessDB').AccessDB
    , protectJSON = require('./lib/protectJSON')
    , loginCheck = require('./lib/logincheck');

//var app = module.exports = express();
var app = express();
var DB = require('./accessDB');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
var errorHandler = require('errorhandler')
app.use(methodOverride());
app.use(bodyParser());
app.use(cookieParser());
app.use(protectJSON);
app.use(session({secret: 'gopalapuram'})); //*
// Configuration


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');





app.use(express.static(__dirname + '/../'));
//app.use(app.router);





var conn = 'mongodb://localhost/shop';
var db;
db = new DB.startup(conn);

var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
    // configure stuff here

    app.use(errorHandler({dumpExceptions: true, showStack: true}));
}
else {
    app.use(errorHandler());
}


function csrf(req, res, next) {
    res.locals.token = req.session._csrf;
    next();
}

// Routes
// app.configure(function(){
//     app.use(loginCheck);
// });
//app.get('/', routes.index);
app.get('/', routes.index);


// JSON API
var router = express.Router();
var products = require('./routes/product')(router);
app.use('/api/products', products);
app.post('/api/dataservice/login', api.authenticate);
app.get('/api/dataservice/Customers', api.customers);
app.post('/api/dataservice/PostCustomer', api.addCustomer);
app.get('/api/dataservice/CheckUnique/:email', api.checkemail);

app.get('/api/dataservice/Branches', api.branches);
app.get('/api/dataservice/BranchesSummary', api.branchesSummary);

app.get('/api/dataservice/products', api.products);
app.get('/api/dataservice/productsSummary', api.productsSummary);
app.get('/api/dataservice/productById/:id', api.product);

app.use(loginCheck);



app.get('/api/dataservice/Customer/:id', api.customer);
app.put('/api/dataservice/PutCustomer/:id', api.editCustomer);
app.delete('/api/dataservice/DeleteCustomer/:id', api.deleteCustomer);

app.get('/api/dataservice/States', api.states);

app.get('/api/dataservice/CustomersSummary', api.customersSummary);
app.get('/api/dataservice/CustomerById/:id', api.customer);



app.post('/api/dataservice/addProduct', api.addProduct);
app.delete('/api/dataservice/DeleteProduct/:id', api.deleteProduct);
app.get('/api/dataservice/buyProduct/:id', api.addOrderToCustomer);
// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(3000, function () {
    console.log("CustMgr Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});