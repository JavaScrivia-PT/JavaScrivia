const fs = require('fs');
const path = require('path');
const { leaderBoard, getScore, updateProgress } = require('../server/userController.js');
const db = require('../server/userModels');


describe('db unit tests', () => {
  beforeAll((done) => {
    const values = ['Test', 'Test', 0];
    const query = `INSERT INTO user_final (username, password, score) VALUES ($1, $2, $3);`
    db.query(query, values).then(() => done());
  })
  describe('leaderBoard', () => {
    it('returns all usernames and corresponding scores from database as array', async () => {
      const request = {};
      const response = { locals: {} };
      const result = await new Promise((resolve) => {
        leaderBoard(request, response, (err) => {
          if (!err) {
            resolve(response.locals.board);
          }
        });
      });
      const boardPayload = response.locals.board;
      expect(result).not.toBeInstanceOf(Error);
      expect(Array.isArray(result)).toBe(true);
      expect(Array.isArray(boardPayload)).toBe(true);
      expect(result).toBe(boardPayload);
      expect(result[result.length - 1]).toEqual({username: 'Test', score: 0})
    });
  });
  describe('getScore', () => {
    it('returns the score and progress for the specified user', async () => {
      const request = { query: { username: 'Test' } };
      const response = { locals: {} };
      const result = await new Promise((resolve) => {
        getScore(request, response, (err) => {
          if (!err) {
            resolve(response.locals.data);
          }
        });
      });
      const data = response.locals.data;
      expect(result).not.toBeInstanceOf(Error);
      expect(typeof result).toBe('object');
      expect(data.score).toBe(0);
      expect(data.progress).toBe(null);
    });
  });
  describe('updateProgress', () => {
    it('updates progress for the specified user', async () => {
      const request = { body: { username: 'Test', progress: '3' } };
      const response = { locals: {} };
      const result = await new Promise((resolve) => {
        updateProgress(request, response, (err) => {
          if (!err) {
            resolve(response.locals.data);
          }
        });
      });
      const data = response.locals.data;
      expect(result).not.toBeInstanceOf(Error);
      expect(typeof result).toBe('object');
      expect(data.progress).toBe('3');
    });
  });
  afterAll((done) => {
    const query = "DELETE FROM user_final WHERE username = 'Test';"
    db.query(query).then(()=> done());
  })
});
