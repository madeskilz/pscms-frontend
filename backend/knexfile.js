require('dotenv').config();
const path = require('path');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: process.env.DATABASE_FILE || path.resolve(__dirname, '../data/cms.sqlite')
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb)
    }
  },
  production: {
    client: 'sqlite3',
    connection: {
      filename: process.env.DATABASE_FILE || path.resolve(__dirname, '../data/cms.sqlite')
    },
    useNullAsDefault: true
  }
};
