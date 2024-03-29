import { IAccountEmail } from './accountEmail';
import accountEmailModel, { IAccountEmailModel } from './accountEmailModel';

function findByEmail(email: string, accountId: number) {
  return accountEmailModel.findOne<IAccountEmailModel>({ where: { email, accountId } });
}

function findById(id: number, accountId: number, rawResult?: boolean) {
  return accountEmailModel.findOne<IAccountEmailModel>(
    { where: { id, accountId }, raw: rawResult ? true : false });
}

function add(accountEmail: IAccountEmail) {
  return accountEmailModel.create(accountEmail);
}

async function set(id: number, accountId: number, accountEmail: IAccountEmail) {
  if (!accountEmail.name) return null;

  const originalAccountEmail = await findById(id, accountId);
  if (originalAccountEmail !== null) {
    originalAccountEmail.name = accountEmail.name;
    await originalAccountEmail.save();
    return originalAccountEmail;
  }
  return null;
}

function remove(id: number, accountId: number) {
  return accountEmailModel.destroy({ where: { id, accountId } });
}

function removeByEmail(email: string, accountId: number) {
  return accountEmailModel.destroy({ where: { email, accountId } });
}

function removeAll(accountId: number) {
  return accountEmailModel.destroy({ where: { accountId } });
}


export default { findByEmail, findById, add, set, remove, removeByEmail, removeAll };