import pgPromise from 'pg-promise';

const pgp = pgPromise();

const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'app',
  user: 'postgres',
  password: '123456'
};

const db = pgp(dbConfig);

export { db, pgp };