const { ModuleFilenameHelpers } = require('webpack');
const db = require('./userModels');

const userController = {};

    userController.createUser = (req, res, next) => { //post part 2
        //post request req.body.
        // console.log('inside create user: ', req.body);
      const values = [req.body.username, req.body.password, 0];
        const query = `INSERT INTO user_final (username, password, score) VALUES ($1, $2, $3);`; 
            db.query(query, values)
            .then(response => {
                // console.log('inside db query create user: ', response);
                // res.locals.user = response;
                return next();
            })
            .catch(err => {
            return next({
                log: 'Express error handler caught unknown middleware error',
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
        //req.query.username and req.query.password
      const values = [req.query.username, req.query.password];
      // console.log('Making sure this is username / password', values);
      const query = `SELECT "username", "password" 
      FROM user_final
      WHERE username = $1 AND password = $2;
      `;
      db.query(query, values)
        .then((data) => {
          //console.log('username and password exists in DB', data.rows[0]);
          if (!data.rows.length) {
            res.locals.exists = false;
          } else {
            res.locals.exists = true;
          }
          console.log(res.locals.exists);
          return next();
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
      SELECT username, score
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
      const values = [req.body.username, req.body.progress]
      const query = `
        UPDATE user_final
        SET progess = $2
        WHERE username = $1;
        `;
      db.query(query, values)
        .then(response => {
          res.locals.data = {
            progress: response.rows[0].progress
          };
          return next();
        })
        .catch(err => {
          return next({
            log: 'error in update progress middleware',
            status: 400,
            message: {err : 'error in upate progress middleware'},
          })
        })
    }


module.exports = userController;