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
        },
        migrations: {
            directory: path.resolve(__dirname, 'src/migrations')
        },
    seeds: {
      directory: path.resolve(__dirname, 'src/seeds')
    }
  },
  production: {
    client: 'sqlite3',
    connection: {
      filename: process.env.DATABASE_FILE || path.resolve(__dirname, '../data/cms.sqlite')
    },
      useNullAsDefault: true,
      migrations: {
          directory: path.resolve(__dirname, 'src/migrations')
      },
    seeds: {
      directory: path.resolve(__dirname, 'src/seeds')
    }
  }
};
