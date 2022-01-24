'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ingredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Recipe, {
        foreignKey: 'recipe_id',
        as: 'recipe'
      });
      
      this.belongsTo(models.Item, {
        foreignKey: 'item_id',
        as: 'item'
      });
    }
  }
  ingredient.init({
    recipe_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    item_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Ingredient',
    timestamps: true
  });
  return ingredient;
};