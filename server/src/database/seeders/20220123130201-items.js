'use strict';

const BASE_ITEM = require('../seed_json/base_item.json');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Items', BASE_ITEM.map( i => {
      i.createdAt = new Date();
      i.updatedAt = new Date();
      return i;
    }), {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Items', null, {});
  }
};
