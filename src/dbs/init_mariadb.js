const { Sequelize } = require('sequelize');

const {
  app: { mariadbHost, mariadbUser, mariadbPassword, mariadbDatabase },
} = require('../config/config.app');

const sequelize = new Sequelize(mariadbDatabase, mariadbUser, mariadbPassword, {
  host: mariadbHost,
  dialect: 'mariadb',
  logging: false,
  define: {
    freezeTableName: true
  }
});

async function connect() {
  try {
    await sequelize.authenticate();
    console.log('MariaDB connection established');

    // await sequelize.sync({ alter: true})

  } catch (error) {
    console.error('Unable to connect to MariaDB:', error.message);
  }
}

connect();

// Handle shutdown gracefully
process.on('SIGINT', async () => {
  await sequelize.close();
  process.exit(0);
});

module.exports = sequelize;
