var sqlite3 = require('sqlite3').verbose(),
    f       = require('faker'),
    db      = new sqlite3.Database('./api/db/visage.db');


module.exports = {
    create(values) {
        return new Promise((fulfill, reject) => {
            db.run(`INSERT into goals (title, amount, url) VALUES ($title, $amount, $url')`, {
                $title: values.title,
                $amount: values.amount,
                $url: values.url
            }, function(err) {
                if(err) reject(err);
                else fulfill(this.lastID);
            });
        });
    },
    find(id) {
        return new Promise((fulfill, reject) => {
            db.run(`SELECT * FROM goals where id = $id`, {
                $id: id
            }, (err, row) => {
                if(err) reject(err);
                else fulfill(row);
            });
        });
    },
    seed(){
        db.serialize(function() {
            db.run(`CREATE TABLE goals (
                    ID INT PRIMARY KEY NOT NULL,
                    title VARCHAR,
                    amount VARCHAR,
                    url VARCHAR
                )`);
        });
    }
}
