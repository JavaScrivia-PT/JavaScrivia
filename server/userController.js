const { ModuleFilenameHelpers } = require('webpack');
const db = require('./userModels');
const bcrypt = require('bcryptjs');
const { user } = require('pg/lib/defaults');

const userController = {};

    userController.createUser = async (req, res, next) => { //post part 2
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.password, salt);
      const values = [req.body.username, password, 0];
        const query = `INSERT INTO user_final (username, password, score) VALUES ($1, $2, $3);`; 
            db.query(query, values)
            .then(response => {
                return next();
            })
            .catch(err => {
            return next({
                log: 'Express error handler caught userController.createUser error',
                status: 400,
                message: { err : 'error in create user middleware' },
            });
            });
        };


    // rename
    userController.checkSign = (req, res, next) => { //post part 1
      console.log('we are in the check sign:  ', req.body.username);
      const values = [req.body.username];
      const query = `
        SELECT username
        FROM user_final
        WHERE username = $1;
      `;
        db.query(query, values)
            .then((data) => {
              //console.log('username and password exists in DB', data.rows[0]);
              // console.log(data.rows[0]);
              //if the user exists, send back false
              // console.log(data.rows);
              if (data.rows.length) return res.status(200).send(false);
              
              return next();
            })
            .catch(err => console.log(err));
        };

    

    userController.checkLog = (req, res, next) => { //get request
        //localhost:3000/api?username=mike&password=mezh
      const values = [req.query.username];
      const password = req.query.password;
      const query = `SELECT "username", "password" 
      FROM user_final
      WHERE username = $1;
      `;
      db.query(query, values)
        .then((data) => {
          if (data.rows.length) {
            bcrypt.compare(password, data.rows[0].password)
            .then(match => {
              if (match) res.locals.exists = true;
              else res.locals.exists = false;
              return next();
            })
          } else {
            res.locals.exists = false;
            return next();
          }
        })
        .catch(err => console.log(err));

    };


    userController.updateScore = (req, res, next) => { //patch request
       console.log('we are in the update score: ', req.body);
        const values = [req.body.username, req.body.score];
        const query = `
        UPDATE user_final
        SET score = $2
        WHERE username = $1;
        `;
        db.query(query, values)
        .then(() => {
          return next();
        })
        .catch(err => {
          console.log(err);
        })
      };


    userController.leaderBoard = (req, res, next) => { //get request
      const query = `
      SELECT username, score, progress
      FROM user_final
      ;`;
      db.query(query)
      .then(response => {
        // console.log(response);
        res.locals.board = response.rows;
        return next();
      })
      .catch(err => console.log(err));
    };

    //get progress as well 
    userController.getScore = (req, res, next) => {
      // console.log('we are inside the get score: ', req.query);
      const values = [req.query.username]
      const query = `
      SELECT score, progress
      FROM user_final
      WHERE username=$1
      ;`;
      db.query(query, values)
      .then(response => {
        res.locals.data = {
          score: response.rows[0].score,
          progress: response.rows[0].progress
        };
        return next();
      })
      .catch(err => {
        return next({
          log: 'error in get score middleware',
          status: 400,
          message: { err : 'error in get score middleware' },
        })
      })
    };

    //middleware function that on handleclick for the next question query for the username and progress and
    //increment progress req.body
    userController.updateProgress = (req, res, next) => {
      console.log(req.body);
      const values = [req.body.username, req.body.progress]
      const queryGet = `SELECT progress FROM user_final WHERE username = '${req.body.username}'`
      const query = `
        UPDATE user_final
        SET progress = $2
        WHERE username = $1;
        `;
      db.query(query, values)
        .then(() => db.query(queryGet))
        .then(response => {
          console.log(response.rows);
          res.locals.data = {
            progress: response.rows[0].progress
          };
          return next();
        })
        .catch(err => {
          return next({
            log: 'error in update progress middleware',
            status: 400,
            message: {err : 'error in update progress middleware'},
          })
        })
    }

    userController.addToFavorites = (req, res, next) => {
      const { username, question } = req.body;
      const values = [username, question];
      const query = `
        INSERT INTO user_favorites(username, question)
        VALUES($1, $2);`;
      db.query(query, values)
        .then(() => next())
        .catch(err => {
          return next({
            log: 'error in add to favorites middleware',
            status: 400,
            message: {err : 'error in add to favorites middleware'},
          })
        })
    }

    userController.removeFromFavorites = (req, res, next) => {
      const { username, question } = req.body;
      const values = [username, question];
      const query = `
        DELETE FROM user_favorites
        WHERE username = $1 AND question = $2`;
      db.query(query, values)
        .then(() => next())
        .catch(err => {
          return next({
            log: 'error in add to favorites middleware',
            status: 400,
            message: {err : 'error in add to favorites middleware'},
          })
        })
    }

    userController.checkFavorites = (req, res, next) => {
      const { username, question } = req.query;
      const values = [username, question];
      const query = `
        SELECT * FROM user_favorites
        WHERE username = $1 AND question = $2;`;
      db.query(query, values)
        .then(data => {
          if (data.rows.length) {
            res.locals.isFavorite = true;
          } else {
            res.locals.isFavorite = false;
          }
          return next();
        })
        .catch(err => {
          return next({
            log: 'error in check favorites middleware',
            status: 400,
            message: {err : 'error in check favorites middleware'},
          })
        })
    }


    //middleware function that resets the score and progress
    userController.reset = (req, res, next) => {
      const values = [req.body.username];
      //console.log('this is the reset req.body', req.body)
      const queryReset = `
      UPDATE user_final
      SET progress = 0, score = 0
      WHERE username = $1;
      `;
      const getReset = `SELECT progress, score FROM user_final where username = '${req.body.username}' `
      db.query(queryReset, values)
        .then(() => db.query(getReset))
        .then(response => {
          //console.log('resetResponse: ', response)
          res.locals.data = {
            progress: response.rows[0].progress,
            score: response.rows[0].score
          }
          //console.log('res.locals.data: ',res.locals.data);
          return next();
        })
        .catch(err => {
          return next({
            log: 'error in reset middleware',
            status: 400,
            message: {err : 'error in reset middleware'},
          })
        })
    }


module.exports = userController;