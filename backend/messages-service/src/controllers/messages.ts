import { Request, Response } from 'express';
import repository from '../models/messageRepository';
import controllerCommons from 'ms-commons/api/controllers/controller';
import { Token } from 'ms-commons/api/auth';
import { IMessage } from '../models/message';
import { MessageStatus } from '../models/messageStatus';
import { getContacts } from 'ms-commons/clients/contactsService';
import queueService from '../queueService';
import { IQueueMessage } from '../models/queueMessage';

async function getMessages(req: Request, res: Response, next: any) {
  try {
    const includeRemoved = req.query.includeRemoved === 'true';
    const token = controllerCommons.getToken(res) as Token;
    const messages = await repository.findAll(token.accountId, includeRemoved);
    res.json(messages);
  } catch (error) {
    console.log(`getMessages: ${error}`)
    res.sendStatus(400);
  }
}

async function getMessage(req: Request, res: Response, next: any) {
  try {
    const messageId = parseInt(req.params.id);
    if (!messageId) return res.status(400).json({ message: 'id is required' });

    const token = controllerCommons.getToken(res) as Token;
    const message = await repository.findById(messageId, token.accountId);

    if (message === null) return res.sendStatus(404);
    else return res.json(message);
  } catch (error) {
    console.log(`getMessage: ${error}`)
    res.sendStatus(400);
  }
}

async function addMessage(req: Request, res: Response, next: any) {
  try {
    const token = controllerCommons.getToken(res) as Token;
    const message = req.body as IMessage;

    const result = await repository.add(message, token.accountId);

    return res.status(201).json(result);
  } catch (error) {
    console.log(`addMessage: ${error}`)
    res.sendStatus(400);
  }
}

async function setMessage(req: Request, res: Response, next: any) {
  try {
    const messageId = parseInt(req.params.id);
    if (!messageId) return res.status(400).json({ message: 'id is required' });

    const token = controllerCommons.getToken(res) as Token;
    const message = req.body as IMessage;

    const result = await repository.set(messageId, message, token.accountId);
    if (!result) return res.status(404).end();

    return res.json(result);
  } catch (error) {
    console.log(`setMessage: ${error}`)
    res.sendStatus(400);
  }
}

async function deleteMessage(req: Request, res: Response, next: any) {
  try {
    const messageId = parseInt(req.params.id);
    if (!messageId) return res.status(400).json({ message: 'id is required' });

    const token = controllerCommons.getToken(res) as Token;

    if (req.query.force === 'true') {
      await repository.removeById(messageId, token.accountId);
      return res.sendStatus(204); //NO CONTENT
    }
    else {
      const messageParams = { status: MessageStatus.REMOVED } as IMessage;
      const updatedMessage = await repository.set(messageId, messageParams, token.accountId);
      if (updatedMessage)
        return res.status(200).json(updatedMessage);
      else
        return res.sendStatus(403);
    }
  } catch (error) {
    console.log(`deleteMessage: ${error}`);
    return res.sendStatus(400);
  }
}

async function sendMessage(req: Request, res: Response, next: any) {
  try {
    const messageId = parseInt(req.params.id);
    if (!messageId) return res.status(400).json({ message: 'id is required' });

    //Getting message
    const token = controllerCommons.getToken(res) as Token;
    const message = repository.findById(messageId, token.accountId);
    if (!message) return res.sendStatus(403);

    //Getting contacts
    const contacts = await getContacts(token.jwt!);
    if (!contacts || contacts.length === 0) return res.sendStatus(400);

    //Send messages to queue
    const promisses = contacts.map(item => {
      return queueService.sendMessage({
        accountId: token.accountId,
        contactId: item.id,
        messageId
      } as IQueueMessage)
    })
    await Promise.all(promisses);

    //Updating message
    const messageParms = {
      status: MessageStatus.SENT,
      sendDate: new Date(),
    } as IMessage;

    const updatedMessage = await repository.set(messageId, messageParms, token.accountId);
    if (updatedMessage) return res.send(updatedMessage);
    else return res.status(403).end();

  } catch (error) {
    console.log(`sendMessage: ${error}`);
    return res.sendStatus(400);
  }
}

export default {
  getMessages, getMessage, addMessage,
  setMessage, deleteMessage, sendMessage
};