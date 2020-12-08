import { Request, Response } from 'express';
import repository from '../models/contactRepository';
import controllerCommons from 'ms-commons/api/controllers/controller';
import { Token } from 'ms-commons/api/auth';

async function getContacts(req: Request, res: Response, next: any) {
  try {
    const token = controllerCommons.getToken(res) as Token;
    const contacts = await repository.findAll(token.accountId);
    res.json(contacts);
  } catch (error) {
    console.log(`getContacts: ${error}`)
    res.status(400).end();
  }
}

async function getContact(req: Request, res: Response, next: any) {
  try {
    const contactId = parseInt(req.params.id);
    if (!contactId) return res.status(400).end();

    const token = controllerCommons.getToken(res) as Token;
    const contact = await repository.findById(contactId, token.accountId);

    if (contact === null) return res.status(404).end();
    else return res.json(contact);
  } catch (error) {
    console.log(`getContact: ${error}`)
    res.status(400).end();
  }
}

export default { getContacts, getContact };