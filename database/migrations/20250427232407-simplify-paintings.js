'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Paintings', 'game_version');
    await queryInterface.removeColumn('Paintings', 'createdAt');
    await queryInterface.removeColumn('Paintings', 'updatedAt');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Paintings', 'game_version', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('Paintings', 'createdAt', {
      allowNull: false,
      type: Sequelize.DATE
    });
    await queryInterface.addColumn('Paintings', 'updatedAt', {
      allowNull: false,
      type: Sequelize.DATE
    });
  }
};
