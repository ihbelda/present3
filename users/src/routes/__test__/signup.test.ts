import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on a successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      username: 'test',
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});

it('returns a 400 when an invalid username', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      username: 'tes',
      password: 'password',
    })
    .expect(400);
});

it('returns a 400 when an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      username: 'test',
      password: 'p',
    })
    .expect(400);
});

it('returns a 400 when missing username and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      username: 'test',
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'password',
    })
    .expect(400);
});

it('disallows duplicated username or email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      username: 'test',
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      username: 'test',
      password: 'password',
    })
    .expect(400);
  
  await request(app)
    .post('/api/users/signup')
    .send({
      username: 'test2',
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('set a cookie after a correct signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      username: 'test',
      password: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
