import request from 'supertest';
import app from '../src/app';
import accountsApp from '../../accounts-service/src/app';
import { IContact } from '../src/models/contact';

import repository from '../src/models/contactRepository';
import { ContactStatus } from '../src/models/contactStatus';
const testEmail = 'jest@contact.com';
const testPassword = 'senha1234'
const testEmail2 = 'jest2@contact.com';

let token: string = '';
let testAccountId: number = 0;
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

  const result = await request(accountsApp)
    .post('/accounts/login')
    .send({
      email: testEmail,
      password: testPassword
    })

  token = result.body.token;
  const testContact = {
    name: 'Jest Contact BeforeAll',
    email: testEmail,
    phone: '99789541236'
  } as IContact;
  const result2 = await repository.add(testContact, testAccountId);
  testContactId = result2.id!;
})

afterAll(async () => {
  await repository.removeByEmail(testEmail, testAccountId);
  await repository.removeByEmail(testEmail2, testAccountId);

  await request(accountsApp)
    .post('/accounts/logout')
    .set('x-access-token', token);

  await request(accountsApp)
    .delete(`/accounts/${testAccountId}?force=true`)
    .set('x-access-token', token);

})

describe('Testando rota do contacts', () => {
  it('GET /contacts/ - Deve retornar statusCode 200', async () => {
    const resultado = await request(app)
      .get('/contacts/')
      .set('x-access-token', token);

    expect(resultado.status).toEqual(200);
    expect(Array.isArray(resultado.body)).toBeTruthy();
  })

  it('GET /contacts/ - Deve retornar statusCode 401', async () => {
    const resultado = await request(app)
      .get('/contacts/')

    expect(resultado.status).toEqual(401);
  })

  it('GET /contacts/:id - Deve retornar statusCode 200', async () => {
    const resultado = await request(app)
      .get('/contacts/' + testContactId)
      .set('x-access-token', token);

    expect(resultado.status).toEqual(200);
    expect(resultado.body.id).toEqual(testContactId);
  })

  it('GET /contacts/:id - Deve retornar statusCode 404', async () => {
    const resultado = await request(app)
      .get('/contacts/-1')
      .set('x-access-token', token);

    expect(resultado.status).toEqual(404);
  })

  it('GET /contacts/:id - Deve retornar statusCode 400', async () => {
    const resultado = await request(app)
      .get('/contacts/abc')
      .set('x-access-token', token);

    expect(resultado.status).toEqual(400);
  })

  it('GET /contacts/:id - Deve retornar statusCode 401', async () => {
    const resultado = await request(app)
      .get('/contacts/' + testContactId)

    expect(resultado.status).toEqual(401);
  })

  it('POST /contacts/ - Deve retornar statusCode 201', async () => {
    const payload = {
      name: 'Jest Contact',
      email: testEmail2,
      phone: '99789541236'
    } as IContact;

    const resultado = await request(app)
      .post('/contacts/')
      .set('x-access-token', token)
      .send(payload);

    expect(resultado.status).toEqual(201);
    expect(resultado.body.id).toBeTruthy();
  })

  it('POST /contacts/ - Deve retornar statusCode 422', async () => {
    const payload = {
      street: 'Jest Street',
    };

    const resultado = await request(app)
      .post('/contacts/')
      .set('x-access-token', token)
      .send(payload);

    expect(resultado.status).toEqual(422);
  })

  it('POST /contacts/ - Deve retornar statusCode 401', async () => {
    const payload = {
      name: 'Jest Contact',
      email: testEmail2,
      phone: '99789541236'
    } as IContact;

    const resultado = await request(app)
      .post('/contacts/')
      .send(payload);

    expect(resultado.status).toEqual(401);

  })

  it('POST /contacts/ - Deve retornar statusCode 400', async () => {
    const payload = {
      name: 'Jest Contact',
      email: testEmail,
      phone: '99789541236'
    } as IContact;

    const resultado = await request(app)
      .post('/contacts/')
      .set('x-access-token', token)
      .send(payload);

    expect(resultado.status).toEqual(400);
  })

  it('PATCH /contacts/ - Deve retornar statusCode 200', async () => {
    const payload = {
      name: 'Jest Contact Updated',
    };

    const resultado = await request(app)
      .patch('/contacts/' + testContactId)
      .set('x-access-token', token)
      .send(payload);

    expect(resultado.status).toEqual(200);
    expect(resultado.body.name).toEqual(payload.name);
  })

  it('PATCH /contacts/ - Deve retornar statusCode 401', async () => {
    const payload = {
      name: 'Jest Contact Updated',
    };

    const resultado = await request(app)
      .patch('/contacts/' + testContactId)
      .send(payload);

    expect(resultado.status).toEqual(401);
  })

  it('PATCH /contacts/ - Deve retornar statusCode 422', async () => {
    const payload = {
      street: 'Street ted',
    };

    const resultado = await request(app)
      .patch('/contacts/' + testContactId)
      .set('x-access-token', token)
      .send(payload);

    expect(resultado.status).toEqual(422);

  })

  it('PATCH /contacts/ - Deve retornar statusCode 404', async () => {
    const payload = {
      name: 'Jest Contact Updated',
    };

    const resultado = await request(app)
      .patch('/contacts/-1')
      .set('x-access-token', token)
      .send(payload);

    expect(resultado.status).toEqual(404);
  })

  it('PATCH /contacts/ - Deve retornar statusCode 400', async () => {
    const payload = {
      name: 'Jest Contact Updated',
    };

    const resultado = await request(app)
      .patch('/contacts/abc')
      .set('x-access-token', token)
      .send(payload);

    expect(resultado.status).toEqual(400);
  })

  it('DELETE /contacts/:id - Deve retornar statusCode 200', async () => {
    const resultado = await request(app)
      .delete(`/contacts/${testContactId}`)
      .set('x-access-token', token);

    expect(resultado.status).toEqual(200);
    expect(resultado.body.status).toEqual(ContactStatus.REMOVED);
  })

  it('DELETE /contacts/:id?force=true - Deve retornar statusCode 204', async () => {
    const resultado = await request(app)
      .delete(`/contacts/${testContactId}?force=true`)
      .set('x-access-token', token);

    expect(resultado.status).toEqual(204);
  })

  it('DELETE /contacts/:id - Deve retornar statusCode 403', async () => {
    const resultado = await request(app)
      .delete(`/contacts/-1`)
      .set('x-access-token', token);

    expect(resultado.status).toEqual(403);
  })
})