import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';

let token = '';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || '', { dbName: 'testdb' });
  await request(app).post('/auth/register').send({ email: 'newsapi@example.com', password: 'password123' });
  const res = await request(app).post('/auth/login').send({ email: 'newsapi@example.com', password: 'password123' });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('NewsAPI Integration', () => {
  it('should fetch news from NewsAPI.org', async () => {
    const res = await request(app)
      .get('/news/external')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
}); 