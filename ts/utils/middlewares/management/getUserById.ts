import { Request, Response, NextFunction } from "express";
import { connectMySQL } from "../../database/mysql";
import { cleanValue } from "../../functions/cleanValue";
import { CustomType } from "../../types/types";
import { join } from "path";

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as CustomType;
    const isConnected = session.isConnected ?? false ;
    const roleConnected = res.locals.roleUser ?? 0;
    const connection = connectMySQL();

    try{
        connection.then(mysql => {
            mysql!.query(
                'SELECT * FROM users FULL JOIN addressusers ON address = id_address WHERE id_user = ?',
                [cleanValue(req.params.id)],
                (error, result) => {
                    if(error) { throw new Error(`${error}`)}
                    const results = Object.entries(result);

                    if(results) {
                        const user = results.map(el => el[1])[0];
                        res.locals.detailsUser = user;
                        next();
                    } else {
                        throw new Error(`user not found`)
                    }
                }
            )
        })
    } catch(error) {
        console.log(`Error GetUserById : ${error}`);
        res.status(500).render(join(__dirname, "../views/errors/error-500.ejs"), { isConnected: isConnected, roleConnected: roleConnected, message: {type: "error", text:"Get User"}})
    }
}