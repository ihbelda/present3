import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
  var signin: () => Promise<string[]>;
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'dasdsa';

  const mongo = await MongoMemoryServer.create();
  console.log("Mongo: ", mongo);
  const mongoUri = mongo.getUri();
  console.log('Mongo URI: ', mongoUri);
  await mongoose.connect(mongoUri, {});
  console.log('Mongoose: ', mongoose);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = async () => {
  const username = 'test';
  const password = 'password';
  const role = 'user';

  const response = await request(app)
    .post('/api/users/signup')
    .send({ username, password, role })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
