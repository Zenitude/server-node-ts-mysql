"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRole = void 0;
const mysql_1 = require("../../database/mysql");
const path_1 = require("path");
const getRole = (req, res, next) => {
    const session = req.session;
    const isConnected = session.isConnected ?? false;
    const roleConnected = res.locals.roleUser ?? false;
    const connection = (0, mysql_1.connectMySQL)();
    try {
        const token = session.decodedToken ?? false;
        if (!token) {
            session.isConnected = false;
            res.locals.roleUser = 0;
            next();
        }
        else {
            connection.then(mysql => {
                mysql?.query(`SELECT * FROM users WHERE id_user = ?`, [token.userId], (error, result) => {
                    if (error) {
                        throw new Error(`${error}`);
                    }
                    const results = Object.entries(result);
                    if (results) {
                        const user = results.map(el => el[1])[0];
                        res.locals.roleUser = user.role;
                        next();
                    }
                    else {
                        session.isConnected = false;
                        res.locals.roleUser = 0;
                        next();
                    }
                });
            });
            // User.findOne({_id: token.userId})
            // .then(user => {
            //     if(user) {
            //         res.locals.roleUser = user.role;
            //         next();
            //     } else {
            //         throw new Error(`Error User not found`);
            //     }
            // }).catch(error => { 
            //     throw new Error(`Error find User GetRole : ${error}`)
            // });
        }
    }
    catch (error) {
        console.log(`${error}`);
        res.status(401).render((0, path_1.join)(__dirname, "../../views/errors/error-401.ejs"), { isConnected: isConnected, roleConnected: roleConnected });
        //sendView(res, 401, 'error', { isConnected: isConnected, roleConnected: roleConnected, message: {type: 'error', text: 'Erreur Role'}})
    }
};
exports.getRole = getRole;
