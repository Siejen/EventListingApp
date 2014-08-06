function User(sequelize, DataTypes){

    /* sequelize.define(modelName, attributes, options);
        create a  model like `user`
        with attributes like `firstname` and `lastname`
    */
    return sequelize.define('user',{
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
    		allowNull: false
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
            allowNull: false    		
    	},
    });
}

module.exports = User;
