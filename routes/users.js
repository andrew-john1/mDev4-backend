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
	            console.log("err: " + err);}
	    });

	    var resultTotal = [];

	    var promise = new Promise(function(resolve, reject) {
			
	    	request.on('row', function(columns) {

	    		var user = {};

		        columns
		        	.map(function(row) {

		        		switch(row.metadata.colName) {
						    case "id":
						        user.id = row.value;
						        break;
						    case "username":
						        user.uesrname = row.value;
						        break;
					        case "password":
						        user.password = row.value;
						        break;
					        case "clearance":
						        user.clearance = row.value;
						        break;
					        case "email":
						        user.email = row.value;
						        break;
					        case "phone":
						        user.phone = row.value;
						        break;
					        case "first_name":
						        user.first_name = row.value;
						        break;
					        case "last_name":
						        user.last_name = row.value;
						        break;
					        case "sex":
						        user.sex = row.value;
						        resultTotal.push(user);
						        break;
						    default:
						        user.error = row.value;
						}
		        		
			    	});

		    	resolve(resultTotal);	
		    });

	    });

	    promise.then(function(result) {
	    	res.send(result);
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

	    var resultTotal = [];

	    var promise = new Promise(function(resolve, reject) {
			
	    	request.on('row', function(columns) {

	    		var group = {};

		        columns
		        	.map(function(row) {

		        		switch(row.metadata.colName) {
						    case "id":
						        group.id = row.value;
						        break;
						    case "uesrname":
						        group.uesrname = row.value;
						        break;
					        case "password":
						        group.password = row.value;
						        break;
					        case "email":
						        group.email = row.value;
						        break;
					        case "phone":
						        group.phone = row.value;
						        break;
					        case "first_name":
						        group.first_name = row.value;
						        break;
					        case "last_name":
						        group.last_name = row.value;
						        resultTotal.push(group);
						        break;
						    default:
						        group.error = row.value;
						}
		        		
			    	});

		    	resolve(resultTotal);	
		    });

	    });

	    promise.then(function(result) {
	    	res.send(result);
	    })
	   
	    request.on('done', function(rowCount, more) {
	        console.log(rowCount + ' rows returned');
	    });
	    connection.execSql(request);
	}
	
});

module.exports = router;