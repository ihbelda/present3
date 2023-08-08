import request from 'supertest';
import { app } from '../../app';

it('fails when an username that does not exist', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      username: 'test',
      password: 'password',
    })
    .expect(400);
});

it('fails when an incorrect password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      username: 'test',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      username: 'test',
      password: 'notvalid',
    })
    .expect(400);
});

it('respond with a cookie when given valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      username: 'test',
      password: 'password',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      username: 'test',
      password: 'password',
    })
    .expect(200);
  expect(response.get('Set-Cookie')).toBeDefined();
});
