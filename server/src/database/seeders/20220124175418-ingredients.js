'use strict';

const BASE_INGREDIENTS = require('../seed_json/base_ingredients.json');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Ingredients', BASE_INGREDIENTS.map( i => {
      i.createdAt = new Date();
      i.updatedAt = new Date();
      return i;
    }), {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Ingredients', null, {});
  }
};
