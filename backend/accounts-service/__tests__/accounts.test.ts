import request from 'supertest';
import app from '../src/app';
import { IAccount } from '../src/models/account';

import auth from '../src/auth';
import repository from '../src/models/accountRepository';
const testEmail = 'jest@account.com';
const testEmail2 = 'jest2@account.com';
const hashPassword = '$2a$10$hDEgCZwBW3lTBIWou2N4YuYkrD5y25K7DV5nTeaF5CSFDpFsNULjq'; //senha1234
let token: string = '';
let testId = 0;

beforeAll(async () => {
  const testAccount: IAccount = {
    name: 'Jest Account',
    email: testEmail,
    password: hashPassword,
    domain: 'jest.com'
  }
  const result = await repository.add(testAccount);
  testId = result.id!;
  token = await auth.sign(result.id!);
})

afterAll(async () => {
  await repository.removeByEmail(testEmail);
  await repository.removeByEmail(testEmail2);
})

describe('Testando rota do accounts', () => {
  it('GET /accounts/ - Deve retornar statucCode 200', async () => {
    const resultado = await request(app)
      .get('/accounts/')
      .set('x-access-token', token);

    expect(resultado.status).toEqual(200);
    expect(Array.isArray(resultado.body)).toBeTruthy();
  })

  it('POST /accounts/ - Deve retornar statucCode 201', async () => {
    const payload: IAccount = {
      name: 'Jest Account 2',
      email: testEmail2,
      password: 'senha123456',
      domain: 'jest.com'
    }

    const resultado = await request(app)
      .post('/accounts/')
      .send(payload)

    expect(resultado.status).toEqual(201);
    expect(resultado.body.id).toBeTruthy();
  })

  it('POST /accounts/ - Deve retornar statucCode 422', async () => {
    const payload = {
      id: 1,
      street: 'rua qualquer',
      city: 'cidade nova',
      state: 'MS',
      domain: 'domain.com',
    }

    const resultado = await request(app)
      .post('/accounts/')
      .send(payload)

    expect(resultado.status).toEqual(422);
  })

  it('PACH /accounts/:id - Deve retornar statucCode 200', async () => {
    const payload = {
      name: 'Jest Updated',
    }

    const resultado = await request(app)
      .patch(`/accounts/${testId}`)
      .send(payload)
      .set('x-access-token', token);

    expect(resultado.status).toEqual(200);
    expect(resultado.body.name).toEqual(payload.name);
    expect(resultado.body.id).toEqual(testId);
  })

  it('PACH /accounts/:id - Deve retornar statucCode 400', async () => {
    const payload = {
      name: 'Jest Updated 2',
    }

    const resultado = await request(app)
      .patch('/accounts/abc')
      .send(payload)
      .set('x-access-token', token);

    expect(resultado.status).toEqual(400);
  })

  it('PACH /accounts/:id - Deve retornar statucCode 404', async () => {
    const payload = {
      name: 'Jest Updated 3',
    }

    const resultado = await request(app)
      .patch('/accounts/-1')
      .send(payload)
      .set('x-access-token', token);

    expect(resultado.status).toEqual(404);
  })

  it('GET /accounts/:id - Deve retornar statucCode 200', async () => {
    const resultado = await request(app)
      .get(`/accounts/${testId}`)
      .set('x-access-token', token);

    expect(resultado.status).toEqual(200);
    expect(resultado.body.id).toBe(testId);
  })

  it('GET /accounts/:id - Deve retornar statucCode 404', async () => {
    const resultado = await request(app)
      .get('/accounts/-1')
      .set('x-access-token', token);

    expect(resultado.status).toEqual(404);
  })

  it('GET /accounts/:id - Deve retornar statucCode 400', async () => {
    const resultado = await request(app)
      .get('/accounts/abc')
      .set('x-access-token', token);

    expect(resultado.status).toEqual(400);
  })

})