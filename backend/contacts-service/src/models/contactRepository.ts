import { IContact } from './contact';
import contactModel, { IContactModel } from './contactModel';
import { ContactStatus } from './contactStatus';

function findAll(accountId: number, includeRemoved: boolean) {
  if (includeRemoved)
    return contactModel.findAll<IContactModel>({ where: { accountId } });
  else
    return contactModel.findAll<IContactModel>({
      where: {
        accountId,
        status: [ContactStatus.SUBSCRIBED, ContactStatus.UNSUBSCRIBED]
      }
    });
}

function findById(contactId: number, accountId: number) {
  return contactModel.findOne<IContactModel>({ where: { id: contactId, accountId } });
}

async function add(contact: IContact, accountId: number) {
  contact.accountId = accountId;
  const result = await contactModel.create(contact);
  contact.id = result.id!;
  return contact;
}

async function set(contactId: number, contact: IContact, accountId: number) {
  const originalContact = await contactModel.findOne<IContactModel>({ where: { id: contactId, accountId } });

  if (originalContact === null) return null;

  if (contact.name) originalContact.name = contact.name;
  if (contact.phone) originalContact.phone = contact.phone;
  if (contact.status) originalContact.status = contact.status;

  const result = await originalContact.save();
  contact.id = result.id;
  return contact;
}

function removeById(contactId: number, accountId: number) {
  return contactModel.destroy({ where: { id: contactId, accountId } })
}

function removeByEmail(email: string, accountId: number) {
  return contactModel.destroy({ where: { email, accountId } })
}

export default { findAll, findById, add, set, removeById, removeByEmail };