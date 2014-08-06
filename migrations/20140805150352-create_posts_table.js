module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished

    migration.createTable('posts', {
    	id: {
    		type: DataTypes.INTEGER,
    		primaryKey: true,
    		autoIncrement: true
    	},
    	// REQUIRED: createdAt and updatedAT
    	createdAt: DataTypes.DATE,
    	updatedAt: DataTypes.DATE,
    	eventName: {
    		type: DataTypes.STRING,
    		allowNull: false
    	},
    	eventLocation: {
    		type: DataTypes.STRING,
    		allowNull: false
    	},
    	eventCityAndState: {
    		type: DataTypes.STRING,
    		allowNull: false
    	},
    	eventDate: {
    		type: DataTypes.STRING,
    		allowNull: false
    	},
    	eventTime: {
    		type: DataTypes.STRING,
    		allowNull: false
    	},
    	eventCost: {
    		type: DataTypes.STRING,
    		allowNull: false
    	},
		eventURL: {
			type: DataTypes.STRING,
			allowNull: false
		},
    })
    .complete(done);
  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    migration.dropTable('posts')
    .complete(done);
  }
};
