import { Request, Response, NextFunction } from "express";
import { connectMySQL } from "../../database/mysql";
import { join } from "path";
import { CustomType } from "../../types/types";

export const getRole = (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as CustomType;
    const isConnected = session.isConnected ?? false;
    const roleConnected = res.locals.roleUser ?? false;
    const connection = connectMySQL();

    try {
        const token = session.decodedToken ?? false;
        if (!token) { 
            session.isConnected = false;
            res.locals.roleUser = 0;
            next(); 
        }
        else {
            connection.then(mysql => {
                mysql?.query(
                    `SELECT * FROM users WHERE id_user = ?`,
                    [token.userId],
                    (error, result) => {
                        if(error) { throw new Error(`${error}`)}
                        const results = Object.entries(result);

                        if(results) {
                            const user = results.map(el => el[1])[0];
                            res.locals.roleUser = user.role;
                            next();
                        } else {
                            session.isConnected = false;
                            res.locals.roleUser = 0;
                            next();
                        }
                    }
                )
            })
            
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
    } catch(error) {
        console.log(`${error}`);
        res.status(401).render(join(__dirname, "../../views/errors/error-401.ejs"), {isConnected: isConnected, roleConnected: roleConnected});
        //sendView(res, 401, 'error', { isConnected: isConnected, roleConnected: roleConnected, message: {type: 'error', text: 'Erreur Role'}})
    }
}