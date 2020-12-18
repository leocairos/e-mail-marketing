import request from 'supertest';
import app from '../src/app';
import accountsApp from '../../accounts-service/src/app';
import { IMessage } from '../src/models/message';

import repository from '../src/models/messageRepository';
import { MessageStatus } from '../src/models/messageStatus';
const testEmail = 'jest@message.com';
const testPassword = 'senha1234'

let token: string = '';
let testAccountId: number = 0;
let testMessageId: number = 0;
let testMessageId2: number = 0;

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
  await repository.removeById(testMessageId2 | 0, testAccountId);

  await request(accountsApp)
    .post('/accounts/logout')
    .set('x-access-token', token);

  await request(accountsApp)
    .delete(`/accounts/${testAccountId}?force=true`)
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

  it('GET /messages/ - Deve retornar statusCode 401', async () => {
    const resultado = await request(app)
      .get('/messages/')

    expect(resultado.status).toEqual(401);
  })

  it('GET /messages/:id - Deve retornar statusCode 200', async () => {
    const resultado = await request(app)
      .get('/messages/' + testMessageId)
      .set('x-access-token', token);

    expect(resultado.status).toEqual(200);
    expect(resultado.body.id).toEqual(testMessageId);
  })

  it('GET /messages/:id - Deve retornar statusCode 401', async () => {
    const resultado = await request(app)
      .get('/messages/' + testMessageId)

    expect(resultado.status).toEqual(401);
  })

  it('GET /messages/:id - Deve retornar statusCode 400', async () => {
    const resultado = await request(app)
      .get('/messages/' + 'abc')
      .set('x-access-token', token);

    expect(resultado.status).toEqual(400);
  })

  it('GET /messages/:id - Deve retornar statusCode 404', async () => {
    const resultado = await request(app)
      .get('/messages/' + '-1')
      .set('x-access-token', token);

    expect(resultado.status).toEqual(404);
  })

  it('POST /messages/ - Deve retornar statusCode 201', async () => {
    const payload = {
      accountId: testMessageId,
      subject: "outro subject",
      body: "outro body"
    } as IMessage;


    const resultado = await request(app)
      .post('/messages/')
      .send(payload)
      .set('x-access-token', token);

    testMessageId2 = parseInt(resultado.body.id);
    expect(resultado.status).toEqual(201);
    expect(resultado.body.id).toBeTruthy();
  })

  it('POST /messages/ - Deve retornar statusCode 422', async () => {
    const payload = {
      street: "outro subject",
      body: "outro body"
    };

    const resultado = await request(app)
      .post('/messages/')
      .send(payload)
      .set('x-access-token', token);

    expect(resultado.status).toEqual(422);
  })

  it('POST /messages/ - Deve retornar statusCode 401', async () => {
    const payload = {
      accountId: testMessageId,
      subject: "outro subject",
      body: "outro body"
    } as IMessage;

    const resultado = await request(app)
      .post('/messages/')
      .send(payload)

    expect(resultado.status).toEqual(401);
  })

  it('PATCH /messages/ - Deve retornar statusCode 200', async () => {
    const payload = {
      subject: 'Jest message Updated',
    };

    const resultado = await request(app)
      .patch('/messages/' + testMessageId)
      .set('x-access-token', token)
      .send(payload);

    expect(resultado.status).toEqual(200);
    expect(resultado.body.subject).toEqual(payload.subject);
  })

  it('PATCH /messages/ - Deve retornar statusCode 401', async () => {
    const payload = {
      subject: 'Jest message Updated',
    };

    const resultado = await request(app)
      .patch('/messages/' + testMessageId)
      .send(payload);

    expect(resultado.status).toEqual(401);
  })

  it('PATCH /messages/ - Deve retornar statusCode 422', async () => {
    const payload = {
      street: 'Street ted',
    };

    const resultado = await request(app)
      .patch('/messages/' + testMessageId)
      .set('x-access-token', token)
      .send(payload);

    expect(resultado.status).toEqual(422);

  })

  it('PATCH /messages/ - Deve retornar statusCode 404', async () => {
    const payload = {
      subject: 'Jest Message Updated',
    };

    const resultado = await request(app)
      .patch('/messages/-1')
      .set('x-access-token', token)
      .send(payload);

    expect(resultado.status).toEqual(404);
  })

  it('PATCH /messages/ - Deve retornar statusCode 400', async () => {
    const payload = {
      subject: 'Jest Messages Updated',
    };

    const resultado = await request(app)
      .patch('/messages/abc')
      .set('x-access-token', token)
      .send(payload);

    expect(resultado.status).toEqual(400);
  })

  it('DELETE /messages/:id - Deve retornar statusCode 200', async () => {
    const resultado = await request(app)
      .delete(`/messages/${testMessageId}`)
      .set('x-access-token', token);

    expect(resultado.status).toEqual(200);
    expect(resultado.body.status).toEqual(MessageStatus.REMOVED);
  })

  it('DELETE /messages/:id?force=true - Deve retornar statusCode 204', async () => {
    const resultado = await request(app)
      .delete(`/messages/${testMessageId}?force=true`)
      .set('x-access-token', token);

    expect(resultado.status).toEqual(204);
  })

  it('DELETE /messages/:id - Deve retornar statusCode 403', async () => {
    const resultado = await request(app)
      .delete(`/messages/-1`)
      .set('x-access-token', token);

    expect(resultado.status).toEqual(403);
  })

})