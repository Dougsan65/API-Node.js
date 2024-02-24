import { sql } from './db_connect.js';

sql `CREATE TABLE videos (
    id text PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    duration INT,
    zone VARCHAR(100)
);`.catch((error) => {console.log(error)})