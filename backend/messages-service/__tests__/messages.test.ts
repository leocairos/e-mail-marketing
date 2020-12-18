import request from 'supertest';
import app from '../src/app';
import accountsApp from '../../accounts-service/src/app';
import { IMessage } from '../src/models/message';

import repository from '../src/models/messageRepository';
const testEmail = 'jest@message.com';
const testPassword = 'senha1234'

let token: string = '';
let testAccountId: number = 0;
let testMessageId: number = 0;

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

  await request(accountsApp)
    .delete(`/accounts/${testAccountId}`)
    .set('x-access-token', token);

})

describe('Testando rota do messages', () => {
  it('GET /messages/ - Deve retornar statusCode 200', async () => {
    const resultado = await request(app)
      .get('/messages/')
      .set('x-access-token', token);

    expect(resultado.status).toEqual(200);
    expect(Array.isArray(resultado.body)).toBeTruthy();
  })

})