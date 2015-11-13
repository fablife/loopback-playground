var logger = require("tracer").colorConsole();

module.exports = function(app, cb) {

    var User				= app.models.User;
    var Role 				= app.models.Role;
    var RoleMapping = app.models.RoleMapping;

    //make sure an admin user always gets created
    User.findOrCreate({where: {'username':'admin'}}, 
      {	username: 'testadmin', 
        email: 'test@somewhere.com', 
        password: "testpassword" 
      },
      function(err, user) {
        if (err) {
          logger.error("User.findOrCreate");
          logger.error(err);
          return cb(err);
        }

        logger.info("admin user is: " + user.username);
			//create the admin role
			Role.findOrCreate({where: {name: 'admin'}},{
				name: 'admin'
			}, function(err, role) {
				if (err) cb(err);
	 
				//if this is not present, automigrate breaks
				if (!role) {
					return
				} 
				logger.info("admin role is: " + role.name);
				//make bob an admin
				role.principals({where: {principalId: user.id, roleId:role.id}}, function(err, principals) {
					if (principals && principals.length > 0) {
						logger.info("rolemapping: already exists.");
						cb();
						return;
					}
					role.principals.create({
						principalType: RoleMapping.USER,
						principalId: user.id
					}, function(err, principal) {
						cb(err);
					});
					logger.info("rolemapping: established.");
				});
			});
		});
}
