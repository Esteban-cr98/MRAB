const mysql = require('mysql');

module.exports = () => {
    return mysql.createConnection({
        host: 'us-cdbr-east-03.cleardb.com',
        user: 'b0a7cc111d41aa',
        password:'02483f1e',
        database: 'heroku_004dcd9e98630db'
    });
}
