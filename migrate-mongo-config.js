/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config();
const path = require('path');

module.exports = {
  mongodb: {
    url: process.env.MONGO_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  migrationsDir: path.join('src', 'migrations'),
  changelogCollectionName: 'changelog',
  moduleSystem: 'esm',
};
