"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = void 0;
const mysql_1 = require("../../database/mysql");
const cleanValue_1 = require("../../functions/cleanValue");
const path_1 = require("path");
const getUserById = async (req, res, next) => {
    const session = req.session;
    const isConnected = session.isConnected ?? false;
    const roleConnected = res.locals.roleUser ?? 0;
    const connection = (0, mysql_1.connectMySQL)();
    try {
        connection.then(mysql => {
            mysql.query('SELECT * FROM users FULL JOIN addressusers ON address = id_address WHERE id_user = ?', [(0, cleanValue_1.cleanValue)(req.params.id)], (error, result) => {
                if (error) {
                    throw new Error(`${error}`);
                }
                const results = Object.entries(result);
                if (results) {
                    const user = results.map(el => el[1])[0];
                    res.locals.detailsUser = user;
                    next();
                }
                else {
                    throw new Error(`user not found`);
                }
            });
        });
    }
    catch (error) {
        console.log(`Error GetUserById : ${error}`);
        res.status(500).render((0, path_1.join)(__dirname, "../views/errors/error-500.ejs"), { isConnected: isConnected, roleConnected: roleConnected, message: { type: "error", text: "Get User" } });
    }
};
exports.getUserById = getUserById;
