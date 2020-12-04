import request from 'supertest';
import app from '../src/app';

describe('Testando rota do accounts', () => {
  it('GET /accounts/ - Deve retornar statucCode 200', async () => {
    const resultado = await request(app)
      .get('/accounts/');

    expect(resultado.status).toEqual(200);
    expect(Array.isArray(resultado.body)).toBeTruthy();
  })

  it('POST /accounts/ - Deve retornar statucCode 201', async () => {
    const payload = {
      id: 1,
      name: 'leonardo',
      email: 'leo@mail.com',
      password: '12345678',
      status: 100,
    }

    const resultado = await request(app)
      .post('/accounts/')
      .send(payload)

    expect(resultado.status).toEqual(201);
    expect(resultado.body.id).toBe(1);
  })

  it('POST /accounts/ - Deve retornar statucCode 422', async () => {
    const payload = {
      id: 1,
      street: 'rua qualquer',
      city: 'cidade nova',
      state: 'MS',
    }

    const resultado = await request(app)
      .post('/accounts/')
      .send(payload)

    expect(resultado.status).toEqual(422);
  })

  it('PACH /accounts/:id - Deve retornar statucCode 200', async () => {
    const payload = {
      name: 'leonardo2',
      email: 'leo@mail.com',
      password: '123456789',
    }

    const resultado = await request(app)
      .patch('/accounts/1')
      .send(payload)

    expect(resultado.status).toEqual(200);
    expect(resultado.body.id).toEqual(1);
  })

  it('PACH /accounts/:id - Deve retornar statucCode 400', async () => {
    const payload = {
      name: 'leonardo2',
      email: 'leo@mail.com',
      password: '123456789',
    }

    const resultado = await request(app)
      .patch('/accounts/abc')
      .send(payload)

    expect(resultado.status).toEqual(400);
  })

  it('PACH /accounts/:id - Deve retornar statucCode 404', async () => {
    const payload = {
      name: 'leonardo2',
      email: 'leo@mail.com',
      password: '123456789',
    }

    const resultado = await request(app)
      .patch('/accounts/-1')
      .send(payload)

    expect(resultado.status).toEqual(404);
  })

  it('GET /accounts/:id - Deve retornar statucCode 200', async () => {
    const resultado = await request(app)
      .get('/accounts/1');

    expect(resultado.status).toEqual(200);
    expect(resultado.body.id).toBe(1);
  })

  it('GET /accounts/:id - Deve retornar statucCode 404', async () => {
    const resultado = await request(app)
      .get('/accounts/-1');

    expect(resultado.status).toEqual(404);
  })

  it('GET /accounts/:id - Deve retornar statucCode 400', async () => {
    const resultado = await request(app)
      .get('/accounts/abc');

    expect(resultado.status).toEqual(400);
  })

})