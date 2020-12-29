import { Request, Response } from 'express';
import { IAccount } from '../models/account';
import auth from '../auth';
import controllerCommons from 'ms-commons/api/controllers/controller';
import { Token } from 'ms-commons/api/auth';
import { AccountStatus } from '../models/accountStatus';
import emailsService, { AccountSettings } from 'ms-commons/clients/emailService';
import accountRepository from '../models/accountRepository';
import { IAccountEmail } from '../models/accountEmail';
import accountEmailRepository from '../models/accountEmailRepository';

async function getAccounts(req: Request, res: Response, next: any) {
  const includeRemoved = req.query.includeRemoved === 'true';
  const accounts: IAccount[] = await accountRepository.findAll(includeRemoved);

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

    const account = await accountRepository.findById(accountId);
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
    const result = await accountRepository.add(newAccount);
    newAccount.id = result.id;
    newAccount.password = '';

    newAccount.settings = await emailsService.createAccountSettings(newAccount.domain);

    res.status(201).json(newAccount);
  } catch (error) {
    console.log(`addAccount: ${error}`);
    res.status(400).end();
  }
}

async function setAccount(req: Request, res: Response, next: any) {
  try {
    const accountParams = req.body as IAccount;
    if (accountParams.status === AccountStatus.REMOVED)
      return deleteAccount(req, res, next);

    const accountId = parseInt(req.params.id);
    if (!accountId) return res.status(400).json({ message: 'id is required' });

    const token = controllerCommons.getToken(res) as Token;
    if (accountId !== token.accountId) return res.sendStatus(403);


    if (accountParams.password) {
      accountParams.password = auth.hashPassword(accountParams.password);
    }

    const updatedAccount = await accountRepository.set(accountId, accountParams);

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
    const account = await accountRepository.findByEmail(loginParams.email);
    if (account !== null) {
      const isValid = auth.comparePassword(loginParams.password, account.password)
        && account.status !== AccountStatus.REMOVED;
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

    const account = await accountRepository.findByIdWithEmails(accountId);
    if (account === null) return res.sendStatus(404);

    const accountEmails = account.get('accountEmails', { plain: true }) as IAccountEmail[];
    if (accountEmails && accountEmails.length > 0) {
      const promises = accountEmails.map(item => {
        return emailsService.removeEmailIdentity(item.email);
      });
      await Promise.all(promises);
      await accountEmailRepository.removeAll(accountId);
    }
    await emailsService.removeEmailIdentity(account!.domain);

    if (req.query.force === 'true') {
      await accountRepository.remove(accountId);
      return res.sendStatus(204); //NO CONTENT
    }
    else {
      const accountParams = { status: AccountStatus.REMOVED } as IAccount;
      const updatedAccount = await accountRepository.set(accountId, accountParams);
      if (updatedAccount === null) return res.sendStatus(404);
      updatedAccount.password = ''
      return res.status(200).json(updatedAccount);
    }
  } catch (error) {
    console.log(`deleteAccount: ${error}`);
    return res.sendStatus(400);
  }

}

async function getAccountSettings(req: Request, res: Response, next: any) {
  try {
    const token = controllerCommons.getToken(res) as Token;
    const account = await accountRepository.findByIdWithEmails(token.accountId);

    if (!account) return res.sendStatus(404);

    let emails: string[] = [];
    const accountsEmails = account.get('accountEmails', { plain: true }) as IAccountEmail[];
    if (accountsEmails && accountsEmails.length > 0)
      emails = accountsEmails.map(item => item.email);

    const settings = await emailsService.getAccountSettings(account.domain, emails);

    return res.json(settings);
  } catch (error) {
    console.log(`getAccountSettings: ${error}`);
    res.sendStatus(400);
  }
}

async function createAccountSettings(req: Request, res: Response, next: any) {
  try {
    const token = controllerCommons.getToken(res) as Token;
    const account = await accountRepository.findById(token.accountId);

    if (!account) return res.sendStatus(404);

    let accountSettings: AccountSettings;
    if (req.query.force === 'true') {
      await emailsService.removeEmailIdentity(account.domain);
    } else {
      accountSettings = await emailsService.getAccountSettings(account.domain, []);
      if (accountSettings) return res.json(accountSettings);
    }

    accountSettings = await emailsService.createAccountSettings(account.domain);
    return res.status(201).json(accountSettings);
  } catch (error) {
    console.log(`createAccountSettings: ${error}`);
    res.sendStatus(400);
  }
}

async function addAccountEmail(req: Request, res: Response, next: any) {
  const accountEmail = req.body as IAccountEmail;
  const token = controllerCommons.getToken(res) as Token;
  try {

    const account = await accountRepository.findByIdWithEmails(token.accountId);
    if (!account) return res.sendStatus(404);

    if (!accountEmail.email.endsWith(`@${account.domain}`)) return res.sendStatus(403);

    const accountEmails = account.get('accountEmails', { plain: true }) as IAccountEmail[];
    let alreadyExists = false;
    if (accountEmails && accountEmails.length > 0)
      alreadyExists = accountEmails.some(item => item.email === accountEmail.email);

    if (alreadyExists) return res.sendStatus(400);

    accountEmail.accountId = token.accountId;
    const result = await accountEmailRepository.add(accountEmail);
    if (!result.id) return res.sendStatus(400);

    accountEmail.id = result.id!;
    const response = await emailsService.addEmailIdentity(accountEmail.email);

    return res.status(201).json(accountEmail);
  } catch (error) {
    console.log(`addAccountEmail: ${error}`);
    if (accountEmail.id)
      await accountEmailRepository.remove(accountEmail.id, token.accountId);
    res.sendStatus(400);
  }
}

async function getAccountEmails(req: Request, res: Response, next: any) {
  try {
    const token = controllerCommons.getToken(res) as Token;
    const account = await accountRepository.findByIdWithEmails(token.accountId);

    if (!account) return res.sendStatus(404);

    let emails: string[] = [];
    const accountsEmails = account.get('accountEmails', { plain: true }) as IAccountEmail[];
    if (accountsEmails && accountsEmails.length > 0)
      emails = accountsEmails.map(item => item.email);

    const settings = await emailsService.getEmailSettings(emails);

    return res.json(settings);
  } catch (error) {
    console.log(`getAccountEmails: ${error}`);
    res.sendStatus(400);
  }
}

async function getAccountEmail(req: Request, res: Response, next: any) {
  try {
    const id = parseInt(req.params.id);
    if (!id) return res.status(400).json({ message: 'id is required' });

    const token = controllerCommons.getToken(res) as Token;
    const accountEmail = await accountEmailRepository
      .findById(id, token.accountId, true) as IAccountEmail;

    if (!accountEmail) return res.sendStatus(404);

    const settings = await emailsService.getEmailSettings([accountEmail.email]);
    if (!settings || settings.length === 0) return res.sendStatus(404);

    accountEmail.settings = settings[0];
    return res.json(accountEmail);
  } catch (error) {
    console.log(`getAccountEmail: ${error}`);
    res.sendStatus(400);
  }
}

async function setAccountEmail(req: Request, res: Response, next: any) {
  try {
    const accountEmailId = parseInt(req.params.id);
    if (!accountEmailId) return res.status(400).json({ message: 'id is required' });

    const token = controllerCommons.getToken(res) as Token;
    const accountEmailParams = req.body as IAccountEmail;

    const updatedAccountEmail =
      await accountEmailRepository
        .set(accountEmailId, token.accountId, accountEmailParams);

    if (updatedAccountEmail !== null) {
      res.status(200).json(updatedAccountEmail);
    } else {
      res.sendStatus(404);
    }

  } catch (error) {
    console.log(`setAccountEmail: ${error}`);
    res.sendStatus(400);
  }
}

async function deleteAccountEmail(req: Request, res: Response, next: any) {
  try {
    const accountEmailId = parseInt(req.params.id);
    if (!accountEmailId) return res.status(400).json({ message: 'id is required' });

    const token = controllerCommons.getToken(res) as Token;

    const accountEmail = await accountEmailRepository.findById(accountEmailId, token.accountId);
    if (accountEmail === null) return res.sendStatus(404);

    await emailsService.removeEmailIdentity(accountEmail!.email);

    await accountEmailRepository.remove(accountEmailId, token.accountId);
    return res.sendStatus(200); //NO CONTENT

  } catch (error) {
    console.log(`deleteAccountEmail: ${error}`);
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
  deleteAccount,
  getAccountSettings,
  createAccountSettings,
  addAccountEmail,
  getAccountEmails,
  getAccountEmail,
  setAccountEmail,
  deleteAccountEmail
};