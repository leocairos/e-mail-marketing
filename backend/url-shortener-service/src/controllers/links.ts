/* eslint-disable no-plusplus */
import { Request, Response } from 'express';
import { Link } from '../models/link';
import linkRepository from '../models/linksRepository';

function generateCode() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function postLink(req: Request, res: Response): Promise<void> {
  const link = req.body as Link;

  link.code = generateCode();
  link.hits = 0;

  const result = await linkRepository.add(link);

  if (!result.id) {
    res.sendStatus(400);
  } else {
    res.status(201).json(result);
  }
}

async function getLink(req: Request, res: Response): Promise<void> {
  const code = req.params.code as string;
  const link = await linkRepository.findByCode(code);

  if (!link) {
    res.sendStatus(404);
  } else {
    res.json(link);
  }
}

async function hitLink(req: Request, res: Response): Promise<void> {
  const code = req.params.code as string;
  const link = await linkRepository.hit(code);

  if (!link) {
    res.sendStatus(404);
  } else {
    res.json(link);
  }
}

export default {
  postLink,
  getLink,
  hitLink,
};
