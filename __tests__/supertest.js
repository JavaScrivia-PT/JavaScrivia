const request = require('supertest');
const db = require('../server/userModels');

const server = 'http://localhost:3000';

describe('Route Integration', () => {
  jest.setTimeout(15000);
  describe('/', () => {
    describe('GET', () => {
      it('responds with status of 200 and text/html content type', () => {
        return request(server)
          .get('/')
          .expect('Content-Type', /text\/html/)
          .expect(200);
      });
    });
  });
  describe('/bundleFolder/bundle.js', () => {
    it('responds with status of 200 and application/javascript content type', () => {
      return request(server)
        .get('/bundleFolder/bundle.js')
        .expect('Content-Type', /application\/javascript/)
        .expect(200);
    });
  });
  describe('/api', () => {
    describe('POST', () => {
      it('returns true indicating that the user was created', (done) => {
        const body = { username: 'Test', password: 'Test' };
        request(server)
          .post('/api')
          .expect('Content-Type', /application\/json/)
          .send(body)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            if (res.body === false) return done('response should be true');
            return done();
          });
      });
      describe('GET', () => {
        it('returns true indicating that the user has successfully logged in', (done) => {
          request(server)
            .get('/api?username=Test&password=Test')
            .expect('Content-Type', /application\/json/)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              if (!res.body) {
                return done(
                  `response should be "true". Instead received ${res.body}`
                );
              }
              return done();
            });
        });
      });
      describe('PATCH', () => {
        describe('/api', () => {
          it('returns "score updated" to indicate that the score has been updated', (done) => {
            request(server)
              .patch('/api')
              .send({ username: 'Test', score: 2 })
              .expect('Content-Type', /application\/json/)
              .expect(200)
              .end((err, res) => {
                if (err) return done(err);
                if (res.body !== 'score updated')
                  return done(
                    `Expected response of "score updated". Instead received ${res.body}`
                  );
                return done();
              });
          });
        });
        describe('/api/updateProgress', () => {
          it('returns updated user progress for a given user', (done) => {
            request(server)
              .patch('/api/updateProgress')
              .send({ username: 'Test', progress: '2' })
              .expect('Content-Type', /application\/json/)
              .expect(200)
              .end((err, res) => {
                if (err) return done(err);
                if (res.body.progress !== '2')
                  return done(
                    `Expected progress to be '2'. Instead received ${res.body.progress}`
                  );
                return done();
              });
          });
        });
      });
    });
  });
  describe('GET /board', () => {
    it('returns an array of objects', (done) => {
      request(server)
        .get('/board')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          if (!Array.isArray(res.body))
            return done(
              `Expected to receive and array. Instead received ${typeof res.body}`
            );
          if (res.body.length < 1)
            return done(
              `Expected array of length greater than 0. Instead received length of ${res.body.length}`
            );
          if (res.body[res.body.length - 1].username !== 'Test')
            return done(
              `Expected username of last element in array to be 'Test'. Instead received ${
                res.body[res.body.length].username
              }`
            );
          if (res.body[res.body.length - 1].score !== 2)
            return done(
              `Expected score of last element in array to be 2. Instead received ${
                res.body[res.body.length].score
              }`
            );
          return done();
        });
    });
  });
  describe('GET /user', () => {
    it('returns score and progress for given user', (done) => {
      request(server)
        .get('/user?username=Test')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          if (res.body.score !== 2)
            return done(
              `Expected score to be 2. Instead received ${res.body.score}.`
            );
          if (res.body.progress !== '2')
            return done(
              `Expected progress to be 2. Instead received ${res.body.progress}`
            );
          return done();
        });
    });
  });
  describe('/* error handler unknown route', () => {
    it('returns a status of 404 and sends back "THIS ENDPOINT DOES NOT EXIST', (done) => {
      request(server)
        .get('/testUnknown')
        .expect('Content-Type', /text\/html/)
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          if (res.text !== 'THIS ENDPOINT DOES NOT EXIST')
            return done(
              `Expected to receive "THIS ENDPOINT DOES NOT EXIST. Instead received ${res.body}`
            );
          return done();
        });
    });
  });
  afterAll((done) => {
    const query = "DELETE FROM user_final WHERE username = 'Test';";
    db.query(query).then(() => done());
  });
});
