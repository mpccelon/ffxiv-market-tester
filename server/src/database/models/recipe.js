'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.User, {
        through: models.SavedRecipe,
        foreignKey: 'recipe_id',
        otherKey: 'user_id',
        as: 'user'
      });

      this.hasMany(models.Ingredient, {
        foreignKey: 'recipe_id',
        as: 'ingredients'
      });

      this.belongsTo(models.Item, {
        foreignKey: 'result_item_id',
        as: 'result_item'
      });
    }
  }
  Recipe.init({
    result_item_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    yield: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'Recipe',
    timestamps: true
  });
  return Recipe;
};