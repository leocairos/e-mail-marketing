import request from 'supertest';
import app from '../src/app';
import { IAccount } from '../src/models/account';
import repository from '../src/models/accountRepository';
import auth from '../src/auth';

const testEmail = 'jest@auth.com';
const hashPassword = '$2a$10$hDEgCZwBW3lTBIWou2N4YuYkrD5y25K7DV5nTeaF5CSFDpFsNULjq'; //senha1234
const testPassword = 'senha1234';
let testAccountId = 0;
let token = '';

beforeAll(async () => {
  const testAccount: IAccount = {
    name: 'Jest Auth',
    email: testEmail,
    password: hashPassword,
    domain: 'jest.com'
  }
  const result = await repository.add(testAccount);
  testAccountId = result.id!;
  token = auth.sign(testAccountId);
})

afterAll(async () => {
  await repository.removeByEmail(testEmail);
})

describe('Testando rota do auth', () => {

  it('POST /accounts/login - 200 ok', async () => {
    const resultado = await request(app)
      .post('/accounts/login')
      .send({
        email: testEmail,
        password: testPassword
      })

    expect(resultado.status).toEqual(200);
    expect(resultado.body.auth).toBeTruthy();
    expect(resultado.body.token).toBeTruthy();
  })

  it('POST /accounts/login - 422 Unprocessable Entity', async () => {
    const resultado = await request(app)
      .post('/accounts/login')
      .send({
        email: testEmail,
      })

    expect(resultado.status).toEqual(422);
  })

  it('POST /accounts/login - 401 Unauthorized', async () => {
    const resultado = await request(app)
      .post('/accounts/login')
      .send({
        email: testEmail,
        password: testPassword + '12'
      })

    expect(resultado.status).toEqual(401);

  })

  it('POST /accounts/logout - 200 Ok', async () => {
    const resultado = await request(app)
      .post('/accounts/logout')
      .set('x-access-token', token);

    expect(resultado.status).toEqual(200);
  })
})