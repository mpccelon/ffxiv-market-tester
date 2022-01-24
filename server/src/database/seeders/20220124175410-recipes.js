'use strict';

const BASE_RECIPES = require('../seed_json/base_recipes.json');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Recipes', BASE_RECIPES.map( i => {
      i.createdAt = new Date();
      i.updatedAt = new Date();
      return i;
    }), {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Recipes', null, {});
  }
};
