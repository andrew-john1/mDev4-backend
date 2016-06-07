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
	    request = new Request(`SELECT [LVS].[Announcement].*, [LVS].[User].first_name, [LVS].[User].last_name 
									FROM [LVS].[Announcement]
									LEFT JOIN [LVS].[User] ON [LVS].[Announcement].author = [LVS].[User].id
	    						`, function(err) {
	        if (err) {
	            console.log("err: " + err);}
	    });

	    var resultTotal = [];

	    var promise = new Promise(function(resolve, reject) {
			
	    	request.on('row', function(columns) {

	    		var announcement = {};

		        columns
		        	.map(function(row) {

		        		announcement[row.metadata.colName] = row.value;
		        		if (announcement.id === row.value) {
                            resultTotal.push(announcement);
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
	var TYPES = require('tedious').TYPES;

	function executeStatement() {
	    request = new Request(`SELECT * FROM [LVS].[Announcement] AS announcementInfo WHERE announcementInfo.id = ${id}`, function(err) {
	        if (err) {
	            console.log("err: " + err);}
	    });

	    var resultTotal = [];

	    var promise = new Promise(function(resolve, reject) {
			
	    	request.on('row', function(columns) {

	    		var group = {};

		        columns
		        	.map(function(row) {

		        		announcement[row.metadata.colName] = row.value;
		        		if (announcement.id === row.value) {
                            resultTotal.push(announcement);
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

module.exports = router;