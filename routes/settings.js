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
	    request = new Request("SELECT * FROM [LVS].[UserSettings]", function(err) {
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
						    case "username":
						        group.username = row.value;
						        break;
					        case "refresh_rate":
						        group.refresh_rate = row.value;
						        break;
					        case "home_url":
						        group.home_url = row.value;
						        break;
					        case "selected_theme":
						        group.selected_theme = row.value;
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