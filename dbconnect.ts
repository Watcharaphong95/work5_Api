import mysql from "mysql";
import util from "util";

export const conn = mysql.createPool({
    connectionLimit: 10,
    host: "sql6.freesqldatabase.com",
    user: "sql6689141",
    password: "B3KexaLmVV",
    database: "sql6689141",
});

export const queryAsync = util.promisify(conn.query).bind(conn);
