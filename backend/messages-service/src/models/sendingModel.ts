import Sequelize, { Model, Optional } from 'sequelize'
import database from 'ms-commons/data/db';
import { ISending } from './sending';

interface ISendingCreationAttributes extends Optional<ISending, "id"> { }

export interface ISendingModel extends Model<ISending, ISendingCreationAttributes>, ISending { }

const Sending = database.define<ISendingModel>('sending', {
  id: {
    type: Sequelize.STRING(36),
    primaryKey: true,
    allowNull: false,
  },
  accountId: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
  },
  contactId: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
  },
  messageId: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
  },
  sendDate: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  status: {
    type: Sequelize.SMALLINT.UNSIGNED,
    allowNull: false,
    defaultValue: 100,
  },
})

Sending.sync();

export default Sending;
