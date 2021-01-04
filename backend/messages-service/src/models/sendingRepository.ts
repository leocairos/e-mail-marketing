import { ISending } from './sending';
import sendingModel, { ISendingModel } from './sendingModel';
import { SendingStatus } from './sendingStatus';
import { v4 as uuid } from 'uuid';

async function findQueuedOne(
  id: string, messageId: number, accountId: number, contactId: number) {
  try {
    const sending = await sendingModel.findOne<ISendingModel>({
      where: {
        id, contactId, messageId, accountId, status: SendingStatus.QUEUED
      }
    })
    return sending;
  } catch (error) {
    console.log(`findQueuedOne: ${error}`);
    return null;
  }
}

async function findByMessageId(messageId: number, accountId: number) {
  try {
    const sending = await sendingModel.findOne<ISendingModel>({
      where: {
        messageId, accountId
      }
    })
    return sending;
  } catch (error) {
    console.log(`findByMessageId: ${error}`)
    return null;
  }
}

async function findByContactId(contactId: number, accountId: number) {
  try {
    const sending = await sendingModel.findOne<ISendingModel>({
      where: {
        contactId, accountId
      }
    })
    return sending;
  } catch (error) {
    console.log(`findByContactId: ${error}`)
    return null;
  }
}

async function add(sending: ISending) {
  try {
    sending.id = uuid();
    const result = await sendingModel.create(sending);
    return result;
  } catch (error) {
    console.log(`add: ${error}`)
    return null;
  }
}

async function addAll(sendings: ISending[]) {
  try {
    if (!sendings || sendings.length === 0) return null;

    sendings.forEach(sending => sending.id = uuid());
    const result = await sendingModel.bulkCreate(sendings);

    return result;
  } catch (error) {
    console.log(`addAll: ${error}`)
    return null;
  }
}

async function set(sendingId: string, sending: ISending, accountId: number) {
  try {
    const originalSending = await sendingModel.findOne({
      where: { id: sendingId, accountId }
    })
    if (!originalSending) return null;

    if (sending.status && sending.status != originalSending.status)
      originalSending.status = sending.status;

    if (sending.sendDate && sending.sendDate != originalSending.sendDate)
      originalSending.sendDate = sending.sendDate;

    const result = await originalSending.save();

    return result;
  } catch (error) {
    console.log(`set: ${error}`)
    return null;
  }
}

async function removeById(sendingId: string, accountId: number) {
  try {
    return await sendingModel.destroy({ where: { id: sendingId, accountId } });
  } catch (error) {
    console.log(`removeById: ${error}`)
    return null;
  }
}

async function hasQueuedSendings(messageId: number, accountId: number) {
  try {
    return await sendingModel.count({
      where: { messageId, accountId, status: SendingStatus.QUEUED }
    }) > 0;
  } catch (error) {
    console.log(`hasQueuedSendings: ${error}`)
    return null;
  }
}

export default {
  findQueuedOne, findByMessageId,
  findByContactId, add, addAll,
  set, removeById,
  hasQueuedSendings
}