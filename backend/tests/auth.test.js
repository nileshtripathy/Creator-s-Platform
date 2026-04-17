const request = require('supertest');
const app = require('../app');
const userStore = require('../models/userStore');

describe('Auth integration tests', () => {
  const server = request(app);

  beforeEach(() => {
    // Ensure clean state before each test
    userStore.clearAll();
  });

  afterAll(() => {
    // nothing to close for in-memory store
  });

  describe('POST /api/auth/register', () => {
    test('registers with valid data (success)', async () => {
      const res = await server.post('/api/auth/register').send({ email: 'a@test.com', password: 'pwd' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
    });

    test('register with existing email (failure)', async () => {
      // create user
      await server.post('/api/auth/register').send({ email: 'b@test.com', password: 'pwd' });
      const res = await server.post('/api/auth/register').send({ email: 'b@test.com', password: 'pwd' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    });

    test('register with missing fields (failure)', async () => {
      const res = await server.post('/api/auth/register').send({ email: 'c@test.com' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/auth/login', () => {
    test('login with correct credentials (success)', async () => {
      await server.post('/api/auth/register').send({ email: 'd@test.com', password: 'pwd' });
      const res = await server.post('/api/auth/login').send({ email: 'd@test.com', password: 'pwd' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
    });

    test('login with wrong password (failure)', async () => {
      await server.post('/api/auth/register').send({ email: 'e@test.com', password: 'pwd' });
      const res = await server.post('/api/auth/login').send({ email: 'e@test.com', password: 'wrong' });
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('success', false);
    });
  });
});
