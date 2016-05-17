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
	    request = new Request("SELECT * FROM [LVS].[Group]", function(err) {
	        if (err) {
	            console.log("err: " + err);}
	    });

	    var promise = new Promise(function(resolve, reject) {

	    	request.on('row', function(columns) {

		        var result = columns
			    	.map(function(row) {
			    		return row;
			    	});

		    	resolve(result);	
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
