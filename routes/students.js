var express = require('express');
var router = express.Router();

var Connection = require('tedious').Connection;
var config = require('../config');

/* GET users listing. */
router.get('/', function (req, res) {
    // connect database
    var connection = new Connection(config);
    connection.on('connect', function (err) {
        // If no error, then good to proceed.
        console.log("Connected");
        executeStatement();
    });

    // execute a query
    var Request = require('tedious').Request;
    var TYPES = require('tedious').TYPES;

    function executeStatement() {
        request = new Request("SELECT * FROM [LVS].[Student]", function (err) {
            if (err) {
                console.log("err: " + err);
            }
        });

        var resultTotal = [];

        var promise = new Promise(function (resolve, reject) {

            request.on('row', function (columns) {

                var group = {};

                columns
                    .map(function (row) {

                        switch (row.metadata.colName) {
                            case "id":
                                group.id = row.value;
                                break;
                            case "student_code":
                                group.student_code = row.value;
                                break;
                            case "particulars":
                                group.particulars = row.value;
                                break;
                            case "birth_date":
                                group.birth_date = row.value;
                                break;
                            case "first_name":
                                group.first_name = row.value;
                                break;
                            case "middle_name":
                                group.middle_name = row.value;
                                break;
                            case "last_name":
                                group.last_name = row.value;
                                break;
                            case "start_year":
                                group.start_year = row.value;
                                break;
                            case "sex":
                                group.sex = row.value;
                                resultTotal.push(group);
                                break;
                            default:
                                group.error = row.value;
                        }

                    });

                resolve(resultTotal);
            });

        });

        promise.then(function (result) {
            res.json(result);
        })

        request.on('done', function (rowCount, more) {
            console.log(rowCount + ' rows returned');
        });
        connection.execSql(request);
    }
});

router.get('/:id', function (req, res) {
    var id = req.params.id;

    // connect database
    var connection = new Connection(config);
    connection.on('connect', function (err) {
        // If no error, then good to proceed.
        console.log("Connected");
        executeStatement();
    });

    // execute a query
    var Request = require('tedious').Request;
    var TYPES = require('tedious').TYPES;

    function executeStatement() {
        request = new Request(`SELECT * FROM [LVS].[Student] AS studentInfo WHERE studentInfo.id = ${id}`, function (err) {
            if (err) {
                console.log("err: " + err);
            }
        });

        var resultTotal = [];

        var promise = new Promise(function (resolve, reject) {

            request.on('row', function (columns) {

                var group = {};

                columns
                    .map(function (row) {

                        switch (row.metadata.colName) {
                            case "id":
                                group.id = row.value;
                                break;
                            case "student_code":
                                group.student_code = row.value;
                                break;
                            case "particulars":
                                group.particulars = row.value;
                                break;
                            case "birth_date":
                                group.birth_date = row.value;
                                break;
                            case "first_name":
                                group.first_name = row.value;
                                break;
                            case "middle_name":
                                group.middle_name = row.value;
                                break;
                            case "last_name":
                                group.last_name = row.value;
                                break;
                            case "start_year":
                                group.start_year = row.value;
                                break
                            case "sex":
                                group.sex = row.value;
                                resultTotal.push(group);
                                break;
                            default:
                                group.error = row.value;
                        }

                    });

                resolve(resultTotal);
            });

        });

        promise.then(function (result) {
            res.json(result);
        })

        request.on('done', function (rowCount, more) {
            console.log(rowCount + ' rows returned');
        });
        connection.execSql(request);
    }
});

router.post('/create', function(req, res) {
    var data = {
        username: req.body.username,
        password: req.body.password,
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
    var TYPES = require('tedious').TYPES;

    function executeStatement() {
        request = new Request(`INSERT INTO [LVS].[User] ([username], [password], [email], [phone], [first_name], [last_name], [sex]) VALUES ('${data.username}', '${data.password}', '${data.email}', '${data.phone}', '${data.first_name}', '${data.last_name}',
	 '${data.sex}');`, function(err) {
            if (err) {
                console.log("err: " + err);
                res.json({error: err});
            } else {
                res.json({success: "User created successfully!"});
                console.log("User created successfully!");
                }
        });
       
        request.on('done', function(rowCount, more) {
            console.log(rowCount + ' rows returned');
        });
        connection.execSql(request);
    }
});

module.exports = router;