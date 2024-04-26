import mysql from "mysql2";

export const connectMySQL = async () => {
    try{
        const connection = mysql.createPool({
            host: process.env.HOST_SQL,
            user: process.env.USER_SQL,
            password: process.env.PASSWORD_SQL,
            database: process.env.DATABASE_SQL
        });

        connection.query(`CREATE TABLE IF NOT EXISTS addressusers(
            id_address INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
            street VARCHAR(255) NOT NULL,
            zipcode VARCHAR(5) NOT NULL,
            city VARCHAR(255) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`, (error, result) => {
            if(error) { console.log('Error CREATE addressusers : ', error); }
            const results = Object.entries(result);

            if(results && results.length > 0) {
                const id = results.filter(el => el[0] === 'insertId').map(el => el[1])[0]
                if(id !== 0) {
                    console.log('CREATE TABLE users SUCCESS')
                }
            }
        })

        connection.query(`CREATE TABLE IF NOT EXISTS users(
            id_user INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
            lastname VARCHAR(255),
            firstname VARCHAR(255),
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            role INT(1) NOT NULL DEFAULT 0,
            address INT(11) NOT NULL DEFAULT 1,
            CONSTRAINT FK_users_addressusers FOREIGN KEY (address) REFERENCES addressusers(id_address)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`, (error, result) => {
            if(error) { console.log('Error CREATE users : ', error); }
            const results = Object.entries(result);

            if(results && results.length > 0) {
                const id = results.filter(el => el[0] === 'insertId').map(el => el[1])[0]
                if(id !== 0) {
                    console.log('CREATE TABLE users SUCCESS')
                }
            }
        })

        return connection;
    } catch(error) {
        console.log(error);
    }
}