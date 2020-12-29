import request from 'supertest';
import app from '../src/app';

import { IAccount } from '../src/models/account';
import accountRepository from '../src/models/accountRepository';

import auth from '../src/auth';
import emailService from '../../__commons__/src/clients/emailService';

import accountEmailRepository from '../src/models/accountEmailRepository';
import { IAccountEmail } from '../src/models/accountEmail';

const hashPassword = '$2a$10$hDEgCZwBW3lTBIWou2N4YuYkrD5y25K7DV5nTeaF5CSFDpFsNULjq'; //senha1234

//'Testando as rotas do accounts/settings'
let testAccountId: number;
let jwt: string;
const testEmail: string = 'test-email@settings.com';
const testDomain: string = 'settings.com';

//'Testando as rotas do accounts/settings/accountEmails'
let testAccountId2: number;
let jwt2: string;
const testEmail2: string = 'jest-account-emails@settings2.com';
const testDomain2: string = 'settings2.com';

let testEmail2AccountEmailId: number;
const testEmail2AccountEmail: string = 'test_AccountEmail@settings2.com';
const testEmail2AccountEmail2: string = 'test_AccountEmail2@settings2.com';

let testEmail2AccountEmailIdToDelete: number;
const testEmail2AccountEmailToDelete: string = 'test_AccountEmail-delete@settings2.com';


afterAll(async () => {
  jest.setTimeout(20000); // ajusta o JEST para aguardar até 20s antes de considerar o teste como falho  

  //'Testando as rotas do accounts/settings'
  await emailService.removeEmailIdentity(testDomain);
  await emailService.removeEmailIdentity(testEmail);
  await accountRepository.removeByEmail(testEmail);

  //'Testando as rotas do accounts/settings/accountEmails'
  await accountEmailRepository.removeByEmail(testEmail2AccountEmail, testAccountId2);
  await accountEmailRepository.removeByEmail(testEmail2AccountEmail2, testAccountId2);

  await accountEmailRepository.removeByEmail(testEmail2AccountEmailToDelete, testAccountId2);
  await emailService.removeEmailIdentity(testEmail2AccountEmailToDelete);

  await accountRepository.removeByEmail(testEmail2);
  await emailService.removeEmailIdentity(testDomain2);

  await emailService.removeEmailIdentity(testEmail2AccountEmail);
  await emailService.removeEmailIdentity(testEmail2AccountEmail2);

});

describe('Testando as rotas do accounts/settings', () => {

  beforeAll(async () => {
    jest.setTimeout(20000);
    const testAccount: IAccount = {
      name: 'jest',
      email: testEmail,
      domain: testDomain,
      password: hashPassword
    }
    const result = await accountRepository.add(testAccount);
    testAccountId = result.id!;
    jwt = auth.sign(testAccountId);

    await emailService.createAccountSettings(testDomain);
  })

  it('GET /accounts/settings - Deve retornar statusCode 200', async () => {
    const resultado = await request(app)
      .get('/accounts/settings')
      .set('x-access-token', jwt);

    expect(resultado.status).toEqual(200);
    expect(resultado.body).toBeTruthy();
  })

  it('GET /accounts/settings - Deve retornar statusCode 401', async () => {
    const resultado = await request(app)
      .get('/accounts/settings')

    expect(resultado.status).toEqual(401);
  })

  it('POST /accounts/settings - Deve retornar statusCode 200', async () => {
    const resultado = await request(app)
      .post('/accounts/settings')
      .set('x-access-token', jwt);

    expect(resultado.status).toEqual(200);
    expect(resultado.body).toBeTruthy();
  })

  it('POST /accounts/settings?force=true - Deve retornar statusCode 201', async () => {
    const resultado = await request(app)
      .post('/accounts/settings?force=true')
      .set('x-access-token', jwt);

    expect(resultado.status).toEqual(201);
    expect(resultado.body).toBeTruthy();
  })

  it('POST /accounts/settings - Deve retornar statusCode 401', async () => {
    const resultado = await request(app)
      .post('/accounts/settings')

    expect(resultado.status).toEqual(401);
  })
})

describe('Testando as rotas do accounts/settings/accountEmails', () => {

  beforeAll(async () => {
    jest.setTimeout(20000);
    const testAccount: IAccount = {
      name: 'jest2',
      email: testEmail2,
      domain: testDomain2,
      password: hashPassword
    }
    const result = await accountRepository.add(testAccount);
    testAccountId2 = result.id!;
    jwt2 = auth.sign(testAccountId2);

    await emailService.createAccountSettings(testDomain2);

    const accountEmail: IAccountEmail = {
      name: 'jest-account-email',
      email: testEmail2AccountEmail,
      accountId: testAccountId2
    }

    const result2 = await accountEmailRepository.add(accountEmail);
    testEmail2AccountEmailId = result2.id!;

    await emailService.addEmailIdentity(testEmail2AccountEmail);


    const accountEmailToDelete: IAccountEmail = {
      name: 'jest-account-email',
      email: testEmail2AccountEmailToDelete,
      accountId: testAccountId2
    }

    const result2ToDelete = await accountEmailRepository.add(accountEmailToDelete);
    testEmail2AccountEmailIdToDelete = result2ToDelete.id!;

    await emailService.addEmailIdentity(testEmail2AccountEmailToDelete);
  })

  it('GET /accounts/settings/accountEmails - Deve retornar statusCode 200', async () => {
    const resultado = await request(app)
      .get('/accounts/settings/accountEmails')
      .set('x-access-token', jwt2);

    expect(resultado.status).toEqual(200);
    expect(resultado.body).toBeTruthy();
  })

  it('PUT /accounts/settings/accountEmails - Deve retornar statusCode 201', async () => {
    const payload = {
      name: 'jest-3',
      email: testEmail2AccountEmail2
    } as IAccountEmail;

    const resultado = await request(app)
      .put('/accounts/settings/accountEmails')
      .send(payload)
      .set('x-access-token', jwt2);

    expect(resultado.status).toEqual(201);
    expect(resultado.body).toBeTruthy();
  })

  it('PUT /accounts/settings/accountEmails - Deve retornar statusCode 400', async () => {
    //email repetido (inserido no beforeAll)
    const payload = {
      name: 'jest-3',
      email: testEmail2AccountEmail
    } as IAccountEmail;

    const resultado = await request(app)
      .put('/accounts/settings/accountEmails')
      .send(payload)
      .set('x-access-token', jwt2);

    expect(resultado.status).toEqual(400);
  })

  it('PUT /accounts/settings/accountEmails - Deve retornar statusCode 401', async () => {
    const payload = {
      name: 'jest-3',
      email: testEmail2AccountEmail2
    } as IAccountEmail;

    const resultado = await request(app)
      .put('/accounts/settings/accountEmails')
      .send(payload)

    expect(resultado.status).toEqual(401);
  })

  it('PUT /accounts/settings/accountEmails - Deve retornar statusCode 403', async () => {
    const payload = {
      name: 'jest-3',
      email: testEmail2AccountEmail2 + '.tk'
    } as IAccountEmail;

    const resultado = await request(app)
      .put('/accounts/settings/accountEmails')
      .send(payload)
      .set('x-access-token', jwt2);

    expect(resultado.status).toEqual(403);
  })

  it('PUT /accounts/settings/accountEmails - Deve retornar statusCode 422', async () => {
    const payload = {
      street: 'jest-3',
      address: testEmail2AccountEmail2
    };

    const resultado = await request(app)
      .put('/accounts/settings/accountEmails')
      .send(payload)
      .set('x-access-token', jwt2);

    expect(resultado.status).toEqual(422);
  })

  it('PATCH /accounts/settings/accountEmails/:id - Deve retornar statusCode 200', async () => {
    const payload = {
      name: 'jest-3 updated',
    } as IAccountEmail;

    const resultado = await request(app)
      .patch('/accounts/settings/accountEmails/' + testEmail2AccountEmailId)
      .send(payload)
      .set('x-access-token', jwt2);

    expect(resultado.status).toEqual(200);
    expect(resultado.body.name).toEqual(payload.name);
  })

  it('PATCH /accounts/settings/accountEmails/:id - Deve retornar statusCode 400', async () => {
    const payload = {
      name: 'jest-3 updated',
    } as IAccountEmail;

    const resultado = await request(app)
      .patch('/accounts/settings/accountEmails/abc')
      .send(payload)
      .set('x-access-token', jwt2);

    expect(resultado.status).toEqual(400);
  })

  it('PATCH /accounts/settings/accountEmails/:id - Deve retornar statusCode 401', async () => {
    const payload = {
      name: 'jest-3 updated',
    } as IAccountEmail;

    const resultado = await request(app)
      .patch('/accounts/settings/accountEmails/' + testEmail2AccountEmailId)
      .send(payload)

    expect(resultado.status).toEqual(401);
  })

  it('PATCH /accounts/settings/accountEmails/:id - Deve retornar statusCode 404', async () => {
    const payload = {
      name: 'jest-3 updated',
    };

    const resultado = await request(app)
      .patch('/accounts/settings/accountEmails/-1')
      .send(payload)
      .set('x-access-token', jwt2);

    expect(resultado.status).toEqual(404);
  })

  it('PATCH /accounts/settings/accountEmails/:id - Deve retornar statusCode 422', async () => {
    const payload = {
      street: 'jest-3 updated',
    };

    const resultado = await request(app)
      .patch('/accounts/settings/accountEmails/' + testEmail2AccountEmailId)
      .send(payload)
      .set('x-access-token', jwt2);

    expect(resultado.status).toEqual(422);
  })

  it('DELETE /accounts/settings/accountEmails/:id- Deve retornar statusCode 200', async () => {
    const resultado = await request(app)
      .delete('/accounts/settings/accountEmails/' + testEmail2AccountEmailIdToDelete)
      .set('x-access-token', jwt2);

    expect(resultado.status).toEqual(200);
  })

  it('DELETE /accounts/settings/accountEmails/:id- Deve retornar statusCode 400', async () => {
    const resultado = await request(app)
      .delete('/accounts/settings/accountEmails/abc')
      .set('x-access-token', jwt2);

    expect(resultado.status).toEqual(400);
  })

  it('DELETE /accounts/settings/accountEmails/:id- Deve retornar statusCode 401', async () => {
    const resultado = await request(app)
      .delete('/accounts/settings/accountEmails/' + testEmail2AccountEmailIdToDelete)

    expect(resultado.status).toEqual(401);
  })

  it('DELETE /accounts/settings/accountEmails/:id- Deve retornar statusCode 404', async () => {
    const resultado = await request(app)
      .delete('/accounts/settings/accountEmails/-1')
      .set('x-access-token', jwt2);

    expect(resultado.status).toEqual(404);
  })
})