'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SavedRecipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {      
    }
  }
  SavedRecipe.init({
    recipe_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Recipe',
        key: 'id'
      }
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'SavedRecipe',
  });
  return SavedRecipe;
};