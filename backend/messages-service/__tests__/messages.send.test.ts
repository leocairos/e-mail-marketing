import request from 'supertest';
import app from '../src/app';
import accountsApp from '../../accounts-service/src/app';
import contactsApp from '../../contacts-service/src/app';
import { IMessage } from '../src/models/message';

import repository from '../src/models/messageRepository';
import { MessageStatus } from '../src/models/messageStatus';
const testEmail = 'jest@message.com';
const testPassword = 'senha1234'

let token: string = '';
let testAccountId: number = 0;
let testMessageId: number = 0;
let testContactId: number = 0;

beforeAll(async () => {
  const testAccount = {
    name: 'Jest Contact',
    email: testEmail,
    password: testPassword,
    domain: 'jestcontact.com'
  }
  const account = await request(accountsApp)
    .post('/accounts/')
    .send(testAccount)
  testAccountId = account.body.id;

  const loginResponse = await request(accountsApp)
    .post('/accounts/login')
    .send({
      email: testEmail,
      password: testPassword
    })
  token = loginResponse.body.token;

  const testContact = {
    accountId: testAccountId,
    name: 'Message Send Contact Teste',
    email: testEmail,
  }

  const contactResponse = await request(contactsApp)
    .post('/contacts')
    .send(testContact)
    .set('x-access-token', token);

  testContactId = contactResponse.body.id;

  const testMessage = {
    accountId: testAccountId,
    body: "corpo da messagem",
    subject: "assunto da mensagem"
  } as IMessage;
  const addResult = await repository.add(testMessage, testAccountId);
  testMessageId = addResult.id!;
})

afterAll(async () => {
  await repository.removeById(testMessageId, testAccountId);

  await request(accountsApp)
    .post('/accounts/logout')
    .set('x-access-token', token);

  await request(contactsApp)
    .delete(`/contacts/${testContactId}?force=true`)
    .set('x-access-token', token);

  await request(accountsApp)
    .delete(`/accounts/${testAccountId}?force=true`)
    .set('x-access-token', token);

})

describe('Testando rota do messages (SEND)', () => {

  it('POST /messages/:id/send - Deve retornar statusCode 200', async () => {
    const resultado = await request(app)
      .post(`/messages/${testMessageId}/send`)
      .set('x-access-token', token);

    expect(resultado.status).toEqual(200);
    expect(resultado.body.id).toEqual(testMessageId);
    expect(resultado.body.status).toEqual(MessageStatus.SENT);
  })

  it('POST /messages/:id/send - Deve retornar statusCode 401', async () => {
    const resultado = await request(app)
      .post(`/messages/${testMessageId}/send`)

    expect(resultado.status).toEqual(401);
  })

  it('POST /messages/:id/send - Deve retornar statusCode 403', async () => {
    const resultado = await request(app)
      .post(`/messages/-1/send`)
      .set('x-access-token', token);

    expect(resultado.status).toEqual(403);
  })

  it('POST /messages/:id/send - Deve retornar statusCode 400', async () => {
    const resultado = await request(app)
      .post(`/messages/abc/send`)
      .set('x-access-token', token);

    expect(resultado.status).toEqual(400);
  })

})