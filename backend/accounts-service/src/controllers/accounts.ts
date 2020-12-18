import { Request, Response } from 'express';
import { IAccount } from '../models/account';
import repository from '../models/accountRepository';
import auth from '../auth';
import controllerCommons from 'ms-commons/api/controllers/controller';
import { Token } from 'ms-commons/api/auth';
import { AccountStatus } from '../models/accountStatus';

async function getAccounts(req: Request, res: Response, next: any) {
  const includeRemoved = req.query.includeRemoved === 'true';
  const accounts: IAccount[] = await repository.findAll(includeRemoved);

  res.json(accounts.map(item => {
    item.password = '';
    return item;
  }));
}

async function getAccount(req: Request, res: Response, next: any) {
  try {
    const accountId = parseInt(req.params.id);
    if (!accountId) return res.status(400).json({ message: 'id is required' });

    const token = controllerCommons.getToken(res) as Token;
    if (accountId !== token.accountId) return res.sendStatus(403);

    const account = await repository.findById(accountId);
    if (account === null) {
      return res.sendStatus(404);
    } else {
      account.password = '';
      return res.json(account);
    }
  } catch (error) {
    console.log(`getAccount: ${error}`);
    res.status(400).end();
  }
}

async function addAccount(req: Request, res: Response, next: any) {
  try {
    const newAccount = req.body as IAccount;
    newAccount.password = auth.hashPassword(newAccount.password);
    const result = await repository.add(newAccount);
    newAccount.id = result.id;
    newAccount.password = '';
    res.status(201).json(newAccount);
  } catch (error) {
    console.log(`addAccount: ${error}`);
    res.status(400).end();
  }
}

async function setAccount(req: Request, res: Response, next: any) {
  try {
    const accountId = parseInt(req.params.id);
    if (!accountId) return res.status(400).json({ message: 'id is required' });

    const token = controllerCommons.getToken(res) as Token;
    if (accountId !== token.accountId) return res.sendStatus(403);

    const accountParams = req.body as IAccount;
    if (accountParams.password) {
      accountParams.password = auth.hashPassword(accountParams.password);
    }

    const updatedAccount = await repository.set(accountId, accountParams);

    if (updatedAccount !== null) {
      updatedAccount.password = '';

      res.status(200).json(updatedAccount);
    } else {
      res.sendStatus(404);
    }

  } catch (error) {
    console.log(`setAccount: ${error}`);
    res.sendStatus(400);
  }
}

async function loginAccount(req: Request, res: Response, next: any) {
  try {
    const loginParams = req.body as IAccount;
    const account = await repository.findByEmail(loginParams.email);
    if (account !== null) {
      const isValid = auth.comparePassword(loginParams.password, account.password)
      if (isValid) {
        const token = await auth.sign(account.id!);
        return res.json({ auth: true, token })
      }
    }
    return res.sendStatus(401);
  } catch (error) {
    console.log(`loginAccount: ${error}`);
    return res.sendStatus(400);
  }

}

function logoutAccount(req: Request, res: Response, next: any) {
  res.json({ auth: false, token: null })
}

async function deleteAccount(req: Request, res: Response, next: any) {
  try {

    const accountId = parseInt(req.params.id);
    if (!accountId) return res.status(400).json({ message: 'id is required' });

    const token = controllerCommons.getToken(res) as Token;
    if (accountId !== token.accountId) return res.sendStatus(403);

    if (req.query.force === 'true') {
      await repository.remove(accountId);
      return res.sendStatus(204); //NO CONTENT
    }
    else {
      const accountParams = { status: AccountStatus.REMOVED } as IAccount;
      const updatedAccount = await repository.set(accountId, accountParams);
      return res.status(200).json(updatedAccount);
    }
  } catch (error) {
    console.log(`deleteAccount: ${error}`);
    return res.sendStatus(400);
  }

}

export default {
  getAccounts,
  getAccount,
  addAccount,
  setAccount,
  loginAccount,
  logoutAccount,
  deleteAccount
};