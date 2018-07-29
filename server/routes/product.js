var api = require('./api');
module.exports = function (router) {
    router.get('/products', api.products);
    router.get('/productsSummary', api.productsSummary);
    router.post('/addProduct', api.addProduct);
    router.delete('/DeleteProduct/:id', api.deleteProduct);
return router;
}