var jwt= require('jsonwebtoken'); // used to create, sign, and verify tokens

module.exports =function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token="";
    try {

        token = req.cookies['token'] ||req.body.token || req.query.token || req.headers['x-access-token']||req.headers['Authorization'];

    }catch (e) {
        token=false;
        console.log('*** logincheck cant find token');

    }

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token,'mamamama' /*app.get('mamamama')*/, function(err, decoded) {
            if (err) {
                console.log('*** logincheck Failed to authenticate token.');
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                //console.log('*** logincheck login');
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        console.log('*** logincheck cant find token');

        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
}