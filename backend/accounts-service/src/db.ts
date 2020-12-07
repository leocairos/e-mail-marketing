import { Sequelize } from 'sequelize';

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;
const logging = process.env.SQL_LOG ? true : false;

const sequelize = new Sequelize(DB_NAME!, DB_USER!, DB_PASSWORD, {
  dialect: 'mysql',
  host: DB_HOST,
  logging,
})

export default sequelize;