const { Pool } = require('pg');

// const PG_URI = 'postgres://iuocgmic:5N7Ffkkg8QuAhPSLRn13KxMa9U0kdL9n@chunee.db.elephantsql.com/iuocgmic';

const PG_URI = 'postgres://sutqhydc:w1SwojeWVPOgN2z9xyjyGgbqOExwBVsR@jelani.db.elephantsql.com/sutqhydc';

const pool = new Pool({
  connectionString: PG_URI
});

module.exports = {
// text will be the SQL string
  query: (text, params, callback) => {
// console.log('executed query', text);
    return pool.query(text, params, callback);
  }
};