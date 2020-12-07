import { DestroyOptions } from 'sequelize/types';
import { IAccount } from './account';
import accountModel, { IAccountModel } from './accountModel';

function findAll() {
  return accountModel.findAll<IAccountModel>();
}

function findByEmail(emailFilter: string) {
  return accountModel.findOne<IAccountModel>({ where: { email: emailFilter } });
}

function findById(id: number) {
  return accountModel.findByPk<IAccountModel>(id);
}

function add(account: IAccount) {
  return accountModel.create(account);
}

async function set(id: number, account: IAccount) {
  const originalAccount = await accountModel.findByPk<IAccountModel>(id);
  if (originalAccount !== null) {
    if (account.name)
      originalAccount.name = account.name;
    if (account.domain)
      originalAccount.domain = account.domain;
    if (account.status)
      originalAccount.status = account.status;
    if (account.password)
      originalAccount.password = account.password;
    await originalAccount.save();
    return originalAccount;
  }
  return null;
}

function remove(idToDelete: number) {
  return accountModel.destroy({ where: { id: idToDelete } } as DestroyOptions<IAccount>)
}

function removeByEmail(emailToDelete: string) {
  return accountModel.destroy({ where: { email: emailToDelete } } as DestroyOptions<IAccount>)
}

export default { findAll, findByEmail, findById, add, set, remove, removeByEmail };