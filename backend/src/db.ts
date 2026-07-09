import knex from 'knex';

const knexfile = require('../knexfile').default;

const db = knex(knexfile.development);

export default db;