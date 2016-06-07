var express = require('express');
var router = express.Router();

var Connection = require('tedious').Connection;
var config = require('../config');

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* GET users listing. */
router.get('/', function(req, res) {
    // connect database
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        // If no error, then good to proceed.
        console.log("Connected");
        executeStatement();
    });

    // execute a query
    var Request = require('tedious').Request;

    function executeStatement() {
        request = new Request("SELECT * FROM [LVS].[User] ", function(err) {
            if (err) {
                console.log("err: " + err);
            }
        });

        var resultTotal = [];

        var promise = new Promise(function(resolve, reject) {
            
            request.on('row', function(columns) {

                var user = {};

                columns
                    .forEach(function(row) {

                        user[row.metadata.colName] = row.value;
                        if (user.id === row.value) {
                            resultTotal.push(user);
                        }
                        
                    });

                resolve(resultTotal);   
            });

        });

        promise.then(function(result) {
            res.json(result);
        })
       
        request.on('done', function(rowCount, more) {
            console.log(rowCount + ' rows returned');
        });
        connection.execSql(request);
    }
});

router.get('/:id', function(req, res) {
    var id = req.params.id;

    // connect database
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        // If no error, then good to proceed.
        console.log("Connected");
        executeStatement();
    });

    // execute a query
    var Request = require('tedious').Request;

    function executeStatement() {
        request = new Request(`SELECT * FROM [LVS].[User] AS userInfo WHERE userInfo.id = ${id}`, function(err) {
            if (err) {
                console.log("err: " + err);}
        });
            
        request.on('row', function(columns) {

            var user = {};

            columns
                .forEach(function(row) {

                    user[row.metadata.colName] = row.value;
                    
                });

            res.json(user);  
        });
        
        connection.execSql(request);
    }
});

router.post('/login', function(req, res) {
    var data = {
        username: req.body.username,
        password: req.body.password
    };

    // connect database
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        // If no error, then good to proceed.
        console.log("Connected");
        executeStatement();
    });

    // execute a query
    var Request = require('tedious').Request;
    var TYPES = require('tedious').TYPES;

    function executeStatement() {
        request = new Request(`SELECT * FROM [LVS].[User] WHERE [LVS].[User].username = '${data.username}'`, function(err, rowCount) {
            if (err) {
                console.log("err: " + err);
            } if (rowCount === 0) {
                res.json({error: "Login failed"});
            }
        });

            
        request.on('row', function(columns) {

            var user = {};

            columns
                .forEach(function(row) {

                    user[row.metadata.colName] = row.value;

                });

            if (data.password === user.password) {
                res.json(user);
            } else {
                res.json({error: "Login failed"});
            }
           
        });

        connection.execSql(request);       
    };
});


router.post('/create', function(req, res) {
    var data = {
        username: req.body.username,
        password: req.body.password,
        clearance: req.body.clearance,
        email: req.body.email,
        phone: req.body.phone,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        sex: req.body.sex
    };

    // connect database
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        // If no error, then good to proceed.
        console.log("Connected");
        executeStatement();
    });

    // execute a query
    var Request = require('tedious').Request;

    function executeStatement() {
        request = new Request(`INSERT INTO [LVS].[User] 
                                    ([LVS].[User].username, [LVS].[User].password, 
                                        [LVS].[User].clearance, [LVS].[User].email, 
                                        [LVS].[User].phone, [LVS].[User].first_name, 
                                        [LVS].[User].last_name, [LVS].[User].sex) 
                                VALUES ('${data.username}', '${data.password}', '${data.clearance}', '${data.email}', 
                                        '${data.phone}', '${data.first_name}', '${data.last_name}', '${data.sex}');`, 
                                function(err) {
            if (err) {
                console.log("err: " + err);
                res.json({error: err});
            } else {
                res.json(data);
            }
        });
       
        request.on('done', function(rowCount, more) {
            console.log(rowCount + ' rows returned');
        });
        connection.execSql(request);
    }
});

router.post('/deactivate', function(req, res) {
    var id = req.body.id;

    // connect database
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        // If no error, then good to proceed.
        console.log("Connected");
        executeStatement();
    });

    // execute a query
    var Request = require('tedious').Request;

    function executeStatement() {
        request = new Request(`UPDATE [LVS].[User] SET [active] = 0 WHERE id = '${id}';`, function(err) {
            if (err) {
                console.log("err: " + err);
                res.json({error: err});
            } else {
                res.json({success: "User deactivated successfully!"});
                console.log("User deactivated successfully!");
            }
        });
       
        request.on('done', function(rowCount, more) {
            console.log(rowCount + ' rows returned');
        });
        connection.execSql(request);
    }
});

module.exports = router;