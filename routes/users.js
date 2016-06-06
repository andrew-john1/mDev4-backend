var express = require('express');
var router = express.Router();

var Connection = require('tedious').Connection;
var config = require('../config');

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
    var TYPES = require('tedious').TYPES;

    function executeStatement() {
        request = new Request("SELECT * FROM [LVS].[User]", function(err) {
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
                        if (user.id === row.value)
                            resultTotal.push(user);
                        
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
    var TYPES = require('tedious').TYPES;

    function executeStatement() {
        request = new Request(`SELECT * FROM [LVS].[User] AS userInfo WHERE userInfo.id = ${id}`, function(err) {
            if (err) {
                console.log("err: " + err);}
        });

        var promise = new Promise(function(resolve, reject) {
            
            request.on('row', function(columns) {

                var user = {};

                columns
                    .forEach(function(row) {

                        user[row.metadata.colName] = row.value;
                        
                    });

                resolve(user);   
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
        request = new Request(`SELECT * FROM [LVS].[User] WHERE [LVS].[User].username = '${data.username}'`, function(err) {
            if (err) {
                console.log("err: " + err);}
        });

        var promise = new Promise(function(resolve, reject) {
            
            request.on('row', function(columns) {

                var user = {};

                columns
                    .forEach(function(row) {

                        user[row.metadata.colName] = row.value;

                    });

                resolve(user);  
            });

        });

        promise.then(function(user) {
            if (data.password === user.password) {
                res.json(user);
            } else {
                res.json({error: "Login failed"});
            }
        });
       
        request.on('done', function(rowCount, more) {
            console.log(rowCount + ' rows returned');
        });
        connection.execSql(request);
    }
});

router.post('/create', function(req, res) {
    var data = {
        student_code: req.body.student_code,
        particulars: req.body.particulars,
        birth_date: req.body.birth_date,
        first_name: req.body.first_name,
        middle_name: req.body.middle_name,
        last_name: req.body.last_name,
        start_year: req.body.start_year,
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
    var TYPES = require('tedious').TYPES;

    function executeStatement() {
        request = new Request(`INSERT INTO [LVS].[Student] ([student_code], [particulars], [birth_date], [first_name], [middle_name], [last_name], [start_year], [sex])
VALUES ('${data.student_code}', '${data.particulars}', '${data.birth_date}', '${data.first_name}', '${data.middle_name}', '${data.last_name}', ${data.start_year}, '${data.sex}');`, function(err) {
            if (err) {
                console.log("err: " + err);
                res.json({error: err});
            } else {
                res.json({success: "Student created successfully!"});
                console.log("Student created successfully!");
            }
        });
       
        request.on('done', function(rowCount, more) {
            console.log(rowCount + ' rows returned');
        });
        connection.execSql(request);
    }
});

module.exports = router;