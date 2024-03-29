import Sequelize, { Model, Optional } from 'sequelize'
import database from 'ms-commons/data/db';
import { IMessage } from './message';
import Sending from './sendingModel';

interface IMessageCreationAttributes extends Optional<IMessage, "id"> { }

export interface IMessageModel extends Model<IMessage, IMessageCreationAttributes>, IMessage { }

const Message = database.define<IMessageModel>('message', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  accountId: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
  },
  accountEmailId: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
  },
  subject: {
    type: Sequelize.STRING(150),
    allowNull: false,
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  status: {
    type: Sequelize.SMALLINT.UNSIGNED,
    allowNull: false,
    defaultValue: 100,
  },
  sendDate: {
    type: Sequelize.DATE,
    allowNull: true,
  },
})

Message.hasMany(Sending, {
  constraints: true,
  foreignKey: 'messageId'
})

Sending.belongsTo(Message, {
  constraints: true,
  foreignKey: 'messageId'
})

export default Message;
