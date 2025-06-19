import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';

let token = '';
let articleId = '';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || '', { dbName: 'testdb' });
  await request(app).post('/auth/register').send({ email: 'articletest@example.com', password: 'password123' });
  const res = await request(app).post('/auth/login').send({ email: 'articletest@example.com', password: 'password123' });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('Article Endpoints', () => {
  it('should create an article', async () => {
    const res = await request(app)
      .post('/articles')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Article', content: 'Test content' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Article');
    articleId = res.body._id;
  });

  it('should get all articles', async () => {
    const res = await request(app)
      .get('/articles')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get a single article', async () => {
    const res = await request(app)
      .get(`/articles/${articleId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(articleId);
  });

  it('should update the article', async () => {
    const res = await request(app)
      .put(`/articles/${articleId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  it('should delete the article', async () => {
    const res = await request(app)
      .delete(`/articles/${articleId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Article deleted.');
  });
}); 