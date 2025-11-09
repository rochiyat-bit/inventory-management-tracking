import { Sequelize } from 'sequelize';
import { logger } from '../utils/logger';

const env = process.env.NODE_ENV || 'development';
const config = require('./config.js')[env];

/**
 * Initialize Sequelize instance with configuration
 */
let sequelize: Sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]!, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

/**
 * Test database connection
 */
export async function testConnection() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    return true;
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    return false;
  }
}

export { sequelize };
export default sequelize;
