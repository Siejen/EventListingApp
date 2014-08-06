module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished

    migration.createTable('users', {
    	id: {
    		type: DataTypes.INTEGER,
    		primaryKey: true,
    		autoIncrement: true
    	},
    	// REQUIRED: createdAt and updatedAT
    	createdAt: DataTypes.DATE,
    	updatedAt: DataTypes.DATE,
    	organizationName: {
    		type: DataTypes.STRING,
    		allowNull: false
    	},
    	username: {
    		type: DataTypes.STRING,
    		unique: true,
    		allowNull: false
    	},
    	passwordHash: {
    		type: DataTypes.STRING,
    		allowNull: false,
    	},
		organizationURL: {
			type: DataTypes.STRING,
			allowNull: false
		},    	
    	firstname: {
    		type: DataTypes.STRING,
    		allowNull: false
    	},    	
    	lastname: {
    		type: DataTypes.STRING,
    		allowNull: false
    	},

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            	isEmail: true
            }    		
    	},
    })
    .complete(done);
  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    migration.dropTable('users')
    .complete(done);
  }
};
