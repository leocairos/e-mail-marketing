import request from 'supertest';
import app from '../src/app';

describe('Testando rota do accounts', () => {
  it('POST /accounts/login - 200 ok', async () => {
    const payload = {
      id: 1,
      name: 'leonardo',
      email: 'leo@mail.com',
      password: '12345678',
      status: 100,
    }

    await request(app)
      .post('/accounts/')
      .send(payload)

    const resultado = await request(app)
      .post('/accounts/login')
      .send({
        email: 'leo@mail.com',
        password: '12345678'
      })

    expect(resultado.status).toEqual(200);
    expect(resultado.body.auth).toBeTruthy();
    expect(resultado.body.token).toBeTruthy();
  })

  it('POST /accounts/login - 401 Unauthorized', async () => {
    const resultado = await request(app)
      .post('/accounts/login')
      .send({
        email: 'leo@mail.com',
        password: 'abcabcxs'
      })

    expect(resultado.status).toEqual(401);

  })

  it('POST /accounts/logout - 200 Ok', async () => {
    const resultado = await request(app)
      .post('/accounts/logout')
      .send()

    expect(resultado.status).toEqual(200);
    expect(resultado.body.auth).toBeFalsy();
    expect(resultado.body.token).toBeFalsy();
  })
})