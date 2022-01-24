'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here      
      this.hasMany(models.Recipe, {
        foreignKey: 'result_item_id'
      });
      models.Recipe.belongsTo(this);

      this.hasMany(models.Ingredient, {
        foreignKey: 'item_id'
      });
      models.Ingredient.belongsTo(this);
    }
  }
  Item.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    is_craftable: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    }
  }, {
    sequelize,
    modelName: 'Item',
    timestamps: true
  });
  return Item;
};