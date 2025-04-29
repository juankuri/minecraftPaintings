'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Paintings', 'width');
    await queryInterface.removeColumn('Paintings', 'height');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Paintings', 'width', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('Paintings', 'height', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};
