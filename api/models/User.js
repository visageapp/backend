var sqlite3 = require('sqlite3').verbose(),
    f       = require('faker'),
    db      = new sqlite3.Database(':memory:');


module.exports = {
    seed(){
        db.serialize(function() {
            db.run(`
                CREATE TABLE users(
                    id INT 
                    full_name VARCHAR,
                    email VARCHAR,
                    phone_number VARCHAR
                );
            `);

            // var sql = db.prepare("INSERT INTO users VALUES ($full_name, $email)");
            for (var i = 0; i < 10; i++) {
                db.run('INSERT INTO users VALUES ($full_name, $email, $phone_number)', {
                    $full_name: f.name.findName(),
                    $email: f.internet.email(),
                    $phone_number: f.phone.phoneNumber()
                })
            }
            // sql.finalize();

            db.each("SELECT rowid AS id, info FROM users", function(err, row) {
                  console.log(row.id + ": " + row.info);
            });
        });

        db.close();
    }
}


