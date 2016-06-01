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
        request = new Request(`SELECT [LVS].[Student].id AS student_id, [LVS].[Student].student_code,
                                    [LVS].[Student].particulars, [LVS].[Student].birth_date,
                                    [LVS].[Student].first_name, [LVS].[Student].middle_name,
                                    [LVS].[Student].last_name, [LVS].[Student].start_year,
                                    [LVS].[Student].sex,
                                    [LVS].[Test].id AS test_id, [LVS].[Test].date, [LVS].[Test].title,
                                    [LVS].[Test].description,
                                    [LVS].[Student_Test].grade
                                FROM [LVS].[Student]
                                LEFT JOIN [LVS].[Student_Test] ON [LVS].[Student].id = [LVS].[Student_Test].student_id
                                LEFT JOIN [LVS].[Test] ON [LVS].[Test].id = [LVS].[Student_Test].test_id
                                WHERE [LVS].[Student].id = ${id}`, function (err) {
            if (err) {
                console.log("err: " + err);
            }
        });

        var promise = new Promise(function (resolve, reject) {

            var totalResult = [];

            request.on('row', function (columns) {

                var student = {};
                var test = {};

                columns
                    .map(function (row) {

                        switch (row.metadata.colName) {
                            case "student_id":
                                student.id = row.value;
                                break;
                            case "student_code":
                                student.student_code = row.value;
                                break;
                            case "particulars":
                                student.particulars = row.value;
                                break;
                            case "birth_date":
                                student.birth_date = row.value;
                                break;
                            case "first_name":
                                student.first_name = row.value;
                                break;
                            case "middle_name":
                                student.middle_name = row.value;
                                break;
                            case "last_name":
                                student.last_name = row.value;
                                break;
                            case "start_year":
                                student.start_year = row.value;
                                break
                            case "sex":
                                student.sex = row.value;
                                totalResult.push(student);
                                break;

                            case "test_id":
                                test.id = row.value;
                                break;
                            case "date":
                                test.date = row.value;
                                break;
                            case "title":
                                test.title = row.value;
                                break;
                            case "description":
                                test.description = row.value;
                                break;
                            case "grade":
                                test.grade = row.value;
                                totalResult.push(test);
                                break;
                            default:
                                student.error = row.value;
                        }

                    });

                resolve(totalResult);
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