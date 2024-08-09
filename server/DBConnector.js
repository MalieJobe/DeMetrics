import sqlite3 from 'sqlite3';

let sql;

const db = new sqlite3.Database('./data/demographics.sqlite', sqlite3.OPEN_READWRITE, (err) => {
    if (err) console.error(err.message);
});

// sql = `SELECT * FROM age WHERE age = "98_99"`;
sql = `UPDATE age SET male_percent = "0,000048366" WHERE age = "99_100"`;

db.run(sql)
// db.all(sql, [], (err, rows) => {
//     if (err) {
//         console.log(err.message);
//     }
//     rows.forEach((row) => {
//         console.log(row);
//     });
// });
