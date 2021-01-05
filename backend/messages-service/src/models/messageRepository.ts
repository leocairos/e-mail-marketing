import { IMessage } from './message';
import messageModel, { IMessageModel } from './messageModel';
import { MessageStatus } from './messageStatus';

function findAll(accountId: number, includeRemoved: boolean) {
  if (includeRemoved)
    return messageModel.findAll<IMessageModel>({ where: { accountId } });
  else
    return messageModel.findAll<IMessageModel>({
      where: {
        accountId,
        status: [MessageStatus.CREATED, MessageStatus.SENT]
      }
    });
}

async function findById(messageId: number, accountId: number) {
  try {
    const message = await messageModel.findOne<IMessageModel>({
      where: { id: messageId, accountId }
    });
    return message;
  } catch (error) {
    console.log(`messageRepository.findById: ${error}`)
    return null;
  }
}

async function add(message: IMessage, accountId: number) {
  message.accountId = accountId;
  const result = await messageModel.create(message);
  message.id = result.id!;
  return message;
}

async function set(messageId: number, message: IMessage, accountId: number) {
  const originalMessage = await messageModel.findOne<IMessageModel>({ where: { id: messageId, accountId } });

  if (originalMessage === null) return null;

  if (message.subject && message.subject !== originalMessage.subject)
    originalMessage.subject = message.subject;

  if (message.body && message.body !== originalMessage.body)
    originalMessage.body = message.body;

  if (message.accountEmailId && message.accountEmailId !== originalMessage.accountEmailId)
    originalMessage.accountEmailId = message.accountEmailId;

  if (message.status && message.status !== originalMessage.status)
    originalMessage.status = message.status;

  if (message.sendDate && message.sendDate !== originalMessage.sendDate)
    originalMessage.sendDate = message.sendDate;

  const result = await originalMessage.save();
  message.id = result.id;
  return message;
}

function removeById(messageId: number, accountId: number) {
  return messageModel.destroy({ where: { id: messageId, accountId } })
}

export default { findAll, findById, add, set, removeById };