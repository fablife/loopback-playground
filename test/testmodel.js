var lt      	= require('loopback-testing');
var assert  	= require('assert');
var app     	= require('../server/server.js');
var status  	= require('http-status');


var obj = {
  testprop:  "hello"
}

setTimeout(function() {

	after(function(done) {
		var TestModel = app.models.TestModel;
		TestModel.destroyAll({where: {testprop: {like: "hallo%"}}}, function(err, results) {
			if (err) {
				console.log(err);
				done(err);
			}
			console.log("success");
			console.log(results);
		});
	});

	describe('/test', function() {
		lt.beforeEach.withApp(app); 

		lt.beforeEach.withUserModel("User");
	 

		lt.describe.whenLoggedInAsUser({"username":"testadmin","password":"testpassword"},function() {
			lt.describe.whenCalledRemotely('POST',  '/api/testmodels', obj, function() {
					lt.it.shouldBeAllowed();
			});
		});

	});

	run();
}, 2000);

