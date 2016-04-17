var sqlite3 = require('sqlite3').verbose(),
    f       = require('faker'),
    db      = new sqlite3.Database('./api/db/visage.db');


module.exports = {
    find(id) {
        return new Promise((fulfill, reject) => {
            db.run(`SELECT * FROM users where id = $id`, {
                $id: id
            }, (err, row) => {
                if(err) reject(err);
                else fulfill(row);
            });
        });
    },
    findByMessenger(messenger_id){
        return new Promise((fulfill, reject) => {
            db.run(`SELECT * FROM users where messenger_id = $id`, {
                $id: messenger_id
            }, (err, row) => {
                if(err) reject(err);
                else fulfill(row);
            });
        });
    },
    seed(){
        db.serialize(function() {
            db.run(`CREATE TABLE users (
                    ID INT PRIMARY KEY NOT NULL,
                    full_name VARCHAR,
                    email VARCHAR,
                    phone_number VARCHAR,
                    messenger_id VARCHAR,
                    facebook_id VARCHAR,
                    visa_doc_id VARCHAR
                )`);
        });
    }
}
