var loopback = require('loopback');

module.exports = function(TestModel) {

	TestModel.observe('after save', function observer(ctx, next) {
		var Role = TestModel.app.models.Role;

		var current = loopback.getCurrentContext();
		console.log(current.active.accessToken);
    if (! current) {
        console.log("after save: context not set");
        next("No Context");
        return;
    }   


		//console.log(current);
		Role.isInRole("admin", current, function(err, isInRole) {
			if (err)
				return console.log(err);
			
      console.log("Is User an admin: ");
			console.log(isInRole);
			next();

		});
	});

};
