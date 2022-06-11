'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "ALTER TABLE users RENAME COLUMN avatar TO avatar_old;" +
      "ALTER TABLE users ADD avatar VARCHAR(140);" +
      "UPDATE users SET avatar = CONCAT('user_avatat_', avatar_old)"
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "ALTER TABLE users DROP COLUMN avatar;"+
      "ALTER TABLE users RENAME COLUMN avatar_old TO avatar;"
    )
  }
};
