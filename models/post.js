function Post(sequelize, DataTypes){

    /* sequelize.define(modelName, attributes, options);
        create a  model like `post`
        with attributes like `firstname` and `lastname`
    */
    return sequelize.define('post',{
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
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			foreignKey: true
		}
    });
}

module.exports = Post;








