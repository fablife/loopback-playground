var path = require('path');
var app = require(path.resolve(__dirname, '../server/server'));

require('events').EventEmitter.prototype._maxListeners = 40;

var dataSource = app.dataSources.db;

// Migrate all models
	dataSource.automigrate(function(err) {
  if (err) {
    console.log("Error migrating models: " + err);
  }
  else {
    console.log("Successfully migrated models");
  }
  process.exit();
});
