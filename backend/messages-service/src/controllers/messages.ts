import { Request, Response } from 'express';
import repository from '../models/messageRepository';
import controllerCommons from 'ms-commons/api/controllers/controller';
import { Token } from 'ms-commons/api/auth';
import { IMessage } from 'src/models/message';

async function getMessages(req: Request, res: Response, next: any) {
  try {
    const token = controllerCommons.getToken(res) as Token;
    const messages = await repository.findAll(token.accountId);
    res.json(messages);
  } catch (error) {
    console.log(`getMessages: ${error}`)
    res.sendStatus(400);
  }
}

export default { getMessages };