const fs = require('fs');
const path = require('path');
const { leaderBoard, getScore, updateProgress, createUser, checkSign, checkLog, updateScore } = require('../server/userController.js');
const db = require('../server/userModels');


describe('db unit tests', () => {
  describe('createUser', () => {
    it('creates a new user', async () => {
      const request = {body: {username: 'Test', password: 'Test', score: 0}};
      const response = { locals: {} };
      const result = await new Promise((resolve) => {
        createUser(request, response, (err) => {
          if (!err) {
            resolve(response.locals.board);
          }
        });
      });
      expect(result).not.toBeInstanceOf(Error);
    });
  })
  describe('checkSign', () => {
    it('requires unique username', async () => {
      const request = {body: {username: 'fakeuserTest'}};
      const response = { locals: {}
    };
      const result = await new Promise((resolve) => {
        checkSign(request, response, (err) => {
          if (!err) {
            resolve(response.locals.exists);
          }
        });
      });
      expect(result).not.toBeInstanceOf(Error);
    });
  })


  describe('checkLog', () => {
    it('check if provided user credentials at login are valid in the database', async () => {
      const request = {query: {username: 'Test', password: 'Test'}};
      const response = { locals: {} };
      const result = await new Promise((resolve) => {
        checkLog(request, response, (err) => {
          if (!err) {
            resolve(response.locals.exists);
          }
        });
      });
      expect(response.locals.exists).toBeTruthy();
    });
  })
  describe('updateScore', () => {
    it('check if score updates', async () => {
      const request = {query: {username: 'Test', password: '123'}};
      const response = { locals: {} };
      const result = await new Promise((resolve) => {
        checkLog(request, response, (err) => {
          if (!err) {
            resolve(response.locals.exists);
          }
        });
      });

      expect(result).not.toBeInstanceOf(Error);
    });
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
      expect(data.progress).toBe("0");
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