var express = require('express');
var router = express.Router();

var Connection = require('tedious').Connection;
var config = require('../config');

/* GET students listing. */
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
//    var TYPES = require('tedious').TYPES;

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
        student_code: req.body.student_code,
        particulars: req.body.particulars,
        birth_date: req.body.birth_date,
        first_name: req.body.first_name,
        middle_name: req.body.middle_name,
        last_name: req.body.last_name,
        start_year: req.body.start_year,
        sex: req.body.sex
    };

    console.log(data);
    
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
        request = new Request(`UPDATE [LVS].[Student] SET [alumni] = 1 WHERE id = '${id}';`, function(err) {
            if (err) {
                console.log("err: " + err);
                res.json({error: err});
            } else {
                res.json({success: "Student deactivated successfully!"});
                console.log("Student deactivated successfully!");
            }
        });
       
        request.on('done', function(rowCount, more) {
            console.log(rowCount + ' rows returned');
        });
        connection.execSql(request);
    }
});

module.exports = router;