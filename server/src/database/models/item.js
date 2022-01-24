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

      this.hasMany(models.Ingredient, {
        foreignKey: 'item_id'
      });
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
    },
    market_price: {
      allowNull: true,
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Item',
    timestamps: true
  });
  return Item;
};