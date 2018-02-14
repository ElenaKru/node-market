var dal = require('./dal');
var models = require('./models');
var md5 = require('md5');

function login(params, callback) {
  //  console.log(md5(123), md5(params.password));
    dal.executeQuery('SELECT * FROM `users` WHERE email = ? AND password=?', [params.email, md5(params.password) ], function(err, rows) {
        if (err) {
            callback(err);
        }
        let userModel = {};
        if(rows && rows.length){
            userModel = new models.User(rows[0]);
        }
        callback(null, userModel);
    });
}

function register(params, callback) {

    dal.executeQuery('SELECT teudat_zehut FROM `users` WHERE teudat_zehut = ? LIMIT 1', [params.teudat_zehut],
        function(err,rows){
            if(err) {
                console.log('error sql', err);
                return callback('Register error');
            }
            if (!rows.length)
            {
                dal.executeQuery('INSERT INTO `users` (teudat_zehut, name, last_name, email, password, city, street, role) VALUES (?,?,?,?,?,?,?,?)',
                    [params.teudat_zehut, params.name, params.last_name, params.email, md5(params.password), params.city, params.street, params.role ],
                    function(err, rows) {
                        if (err) {
                            console.log('error sql', err);
                            return callback('Register error');
                        }
                        let userRegModel = new models.User(params);
                        callback(null, userRegModel);
                    });
            }
            else
            {
                callback('User already exists');
             //   console.log("User already exists");
            }
        });
}

function getFruits(params, callback) {
    dal.executeQuery('SELECT * FROM `products` WHERE category = ?',[params.category], function(err, rows) {
        if (err) {
            callback(err);
        }

        const fruitsObjectsArray = [];
        rows.forEach(function (row) {
            fruitsObjectsArray.push(new models.Fruit(row));
        });
        callback(null, fruitsObjectsArray);
    });
}
function getUserCart(tz, callback){
    dal.executeQuery('SELECT carts.id FROM carts LEFT JOIN orders ON carts.id = orders.cart WHERE carts.customer = ? AND orders.id IS NULL',
        [tz], function(err, rows) {
        if (err) {
            callback(err);
        } else{
            let cartId = 0;
            if(rows && rows.length){
                let cartRow = rows[0];
                cartId = cartRow.id;
            }
            callback(null,cartId);
        }
    });

}
function addToCart(params, callback) {
    var p1 = new Promise(function(resolve, reject){
        getUserCart(params.tz, function(err,data){
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

    p1.then(function(cartId) {
        if(!cartId){
            dal.executeQuery('INSERT INTO `carts` (id, customer, creation_date) VALUES (NULL, ?, NOW())' ,[params.tz], function(err, res) {
                if (err) {
                    callback(err);
                } else {
                    addCartItem(res.insertId, params, callback);
                }
            });
        } else {
            addCartItem(cartId, params, callback);
        }
    }, function(err){callback(err);});
}

function addCartItem(cartId, params, callback){
    console.log('fruits:::', cartId, params);
}

module.exports.fruits = {
    getFruits: getFruits
};


module.exports.auth = {
    login: login,
    register: register
};


module.exports.cart = {
    addToCart: addToCart
};