'use strict';

const BASE_ITEM = require('../seed_json/base_item.json');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Items', BASE_ITEM, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Items', null, {});
  }
};
