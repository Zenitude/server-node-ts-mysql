import { Request, Response, NextFunction } from "express";
import { connectMySQL } from "../utils/database/mysql";
import { join } from "path";
import { isNumeric } from "validator";
import bcrypt from "bcrypt";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
import { verifInputs } from "../utils/functions/verifInput";
import { sendView } from "../utils/functions/sendView";
import { cleanValue } from "../utils/functions/cleanValue";
import { UserModel, AddressUserModel, CustomType } from "../utils/types/types";

const newUser = async (req: Request, res: Response, idAddress?: string | Number) => {
    const connection = connectMySQL();
    
    const firstname = cleanValue(req.body.firstname);
    const lastname = cleanValue(req.body.lastname);
    const email = cleanValue(req.body.email);
    const hash = await bcrypt.hash(cleanValue(req.body.password), 10);
    const role = (isNumeric(cleanValue(req.body.role)) && cleanValue(req.body.role).length === 1) ? parseInt(cleanValue(req.body.role)) : 0
    
    const user = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hash,
        address: idAddress ? cleanValue(idAddress) : 1,
        role: role
    };

    await connection.then(mysql => {
        if(idAddress) {
            mysql!.query(
                `INSERT INTO users(lastname, firstname, email, password, role, address) VALUES(?, ?, ?, ?, ?, ?)`,
                [ user.lastname, user.firstname, user.email, user.password, user.role, user.address ], 
                (error, result) => {
                    if(error) { throw new Error(`${error}`);}
                    console.log('sucess create user : ', result)
                    const message = `Utilisateur ${(user.lastname === '' || user.firstname === '') ? user.email : `${user.firstname} ${user.lastname}`} créé avec succès`;
                    res.status(201).json({url: '/users/create', message: {type: 'success', text: message}});
                }
            )
        } else {
            mysql!.query(
                `INSERT INTO users(lastname, firstname, email, password, role) VALUES(?, ?, ?, ?, ?)`,
                [ user.lastname, user.firstname, user.email, user.password, user.role ], 
                (error, result) => {
                    if(error) { throw new Error(`${error}`)}
                    console.log('sucess create user : ', result)
                    const message = `Utilisateur ${(user.lastname === '' || user.firstname === '') ? user.email : `${user.firstname} ${user.lastname}`} créé avec succès`;
                    res.status(201).json({url: '/users/create', message: {type: 'success', text: message}});
                }
            )
        }
        
    })

}

const refreshUser = (req: Request, res: Response, user: UserModel, idAddress?: string | number, ) => {
    const connection = connectMySQL();

    const lastname = cleanValue(req.body.lastname);
    const firstname = cleanValue(req.body.firstname);
    const role = (isNumeric(cleanValue(req.body.role)) && cleanValue(req.body.role).length === 1) ? parseInt(cleanValue(req.body.role)) : 0
    const address = idAddress ? idAddress : "";

    console.log('user datas update : ', {
        id : user.id_user,
        last: lastname,
        first: firstname,
        mail: user.email,
        role: role,
        address: address 
    })
    connection.then(mysql => {
        if(address !== "") {
            mysql!.query(
                'UPDATE users SET lastname = ?, firstname = ?, email = ?, role = ?, address = ? WHERE id_user = ?',
                [lastname, firstname, user.email, role, address, user.id_user],
                (error, result, fields) => {
                    if(error) { throw new Error(`${error}`)}
                    if(!result) { throw new Error('Problème requête')}
                    const results = Object.entries(result);
                    console.log(results);
                    console.log('filter : ', results.filter(el => el[0] === 'changedRows'))
                    console.log('map : ', results.filter(el => el[0] === 'changedRows').map(el => el[1]))
                                        
                    if(results && results.length > 0) {
                        const changedRow = results.filter(el => el[0] === 'changedRows').map(el => el[1])[0]

                        if(changedRow === 1) {
                            const message = `Utilisateur ${(lastname === '' || firstname === '') ? user!.email : `${firstname} ${lastname}`} mise à jour avec succès`;
                            res.status(201).json({url: `/users/${user.id_user}/update`, message: {type: 'success', text: message}});
                        } else {
                            res.status(404).json({url: `/users/${user.id_user}/update`, message: {type: 'error', text: "L'utilisateur n'a pas pu être modifié"}})
                        }
                    } else {
                        res.status(401).json({url: `/users/${user.id_user}/update`, message: {type: 'error', text: "L'utilisateur n'a pas pu être modifié"}})
                    }
                }
            )
        } else {
            mysql!.query(
                'UPDATE users SET lastname = ?, firstname = ?, email = ?, role = ? WHERE id_user = ?',
                [lastname, firstname, user.email, role, user.id_user],
                (error, result) => {
                    if(error) { throw new Error(`${error}`)}
                    if(!result) { throw new Error('Problème requête')}
                    const results = Object.entries(result);
                
                    if(results && results.length > 0) {
                        const changedRows = results.filter(el => el[0] === 'changedRows').map(el => el[1])[0]

                        if(changedRows === 1) {
                            const message = `Utilisateur ${(lastname === '' || firstname === '') ? user!.email : `${firstname} ${lastname}`} mise à jour avec succès`;
                            res.status(201).json({url: `/users/${user.id_user}/update`, message: {type: 'success', text: message}});
                        } else {
                            res.status(404).json({url: `/users/${user.id_user}/update`, message: {type: 'error', text: "L'utilisateur n'a pas pu être modifié"}})
                        }
                    } else {
                        res.status(401).json({url: `/users/${user.id_user}/update`, message: {type: 'error', text: "L'utilisateur n'a pas pu être modifié"}})
                    }
                }
            )
        }
    })
}

const verifEmail = async (req: Request, res: Response, detailsUser: UserModel, address?: number) => {
    const connection = connectMySQL();

    if(req.body.email && detailsUser.email !== cleanValue(req.body.email)) {
        await connection.then(mysql => {
            mysql!.query(
                'SELECT * FROM users WHERE email = ?',
                [cleanValue(req.body.email)],
                (error, result) => {
                    if(error) { throw new Error(`${error}`)}
                    const results = Object.entries(result);

                    if(results && results.length > 0) {
                        const message = "L'email saisie existe déjà dans la base de données";
                        res.status(200).json({url: `/users/${req.params.id}/update`, message: {type: 'error', text: message}})
                    } else {
                        detailsUser.email = cleanValue(req.body.email);
                        if(address) {
                            refreshUser(req, res, detailsUser, address);
                        } else {
                            refreshUser(req, res, detailsUser);
                        }
                    }
                }
            )
        }).catch(error => { throw new Error(`Erreur findUserByMail update user : ${error}`)}) 
    } else {
        if(address) {
            refreshUser(req, res, detailsUser, address);
        } else {
            refreshUser(req, res, detailsUser);
        }
    }
}

export const list = async (req: Request, res: Response) => {
    const session = req.session as CustomType;
    const isConnected = session.isConnected ?? false;
    const roleConnected = res.locals.roleUser ?? 0;
    const connection = connectMySQL();

    try {
        if(roleConnected !== 1) {
            sendView(res, 401, "error", {isConnected: isConnected, roleConnected: roleConnected});
        } else {
            await connection.then(mysql => {
                mysql!.query(
                    `SELECT * FROM users FULL JOIN addressusers ON address = id_address`,
                    [],
                    (error, result) => {
                        if(error) { throw new Error(`${error}`)}
                        const results = Object.entries(result);
                        if(results) {
                            const users = results.map(el => el[1]);
                            sendView(res, 200, 'list-user', {isConnected: isConnected, roleConnected: roleConnected, users: users});
                        } else {
                            const users = <UserModel[]>[];
                            sendView(res, 200, 'list-user', {isConnected: isConnected, roleConnected: roleConnected, users: users});
                        }
                    }
                )
            })
        }
    } catch(error) {
        console.log(`Erreur List Users : ${error}`);
        sendView(res, 401, 'error', {isConnected: isConnected, roleConnected: roleConnected, message: {type: 'error', text:'List Users'}});
    }
}

export const details = (req: Request, res: Response) => {
    const session = req.session as CustomType;
    const isConnected = session.isConnected ?? false;
    const roleConnected = res.locals.roleUser ?? false;

    try {
        if(roleConnected !== 1) {
            sendView(res, 401, "error", {isConnected: isConnected, roleConnected: roleConnected});
        } else {
            const user = res.locals.detailsUser ?? false;
            console.log('details : ', user);
            sendView(res, 200, 'details-user', {user: user, isConnected: isConnected, roleConnected: roleConnected});
        }
    } catch(error) {
        console.log(`Erreur details User : ${error}`);
        sendView(res, 500, 'error', {isConnected: isConnected, roleConnected: roleConnected, message: {type: "error", text:"Détails User"}});
    }
}

export const create = async (req: Request, res: Response) => {
    const session = req.session as CustomType;
    const isConnected = session.isConnected ?? false;
    const roleConnected = res.locals.roleUser ?? 0;
    const connection = connectMySQL();
    try {
        if(req.body.email || req.body.lastname || req.body.firstname || req.body.password || req.body.confirm || req.body.street || req.body.zipcode || req.body.city) {
            if(!isConnected || roleConnected !== 1) { res.status(302).json({url: '/', message: {type: '', text: ''}}) }
            if(req.body.email && req.body.password && req.body.confirm) {
                if(req.body.password === req.body.confirm) {
                    const inputs = [
                        {type: 'string', name: 'lastname', message: ''},
                        {type: 'string', name: 'firstname', message: ''},
                        {type: 'email', name: 'email', message: 'Email obligatoire'},
                        {type: 'string', name: 'password', message: 'Mot de passe obligatoire'},
                        {type: 'string', name: 'confirm', message: 'Confirmation obligatoire'},
                        {type: 'string', name: 'street', message: ''},
                        {type: 'number', name: 'zipcode', message: ''},
                        {type: 'string', name: 'city', message: ''},
                        {type: 'string', name: 'role', message: ''}
                    ]

                    verifInputs(req, res, inputs);

                    const street = cleanValue(req.body.street);
                    const zipcode = cleanValue(req.body.zipcode);
                    const city = cleanValue(req.body.city);

                    console.log('street : ', req.body.street)
                    console.log('zipcode : ', req.body.zipcode)
                    console.log('city : ', req.body.city)

                    await connection.then(mysql => {
                        mysql!.query(
                            'SELECT * FROM users WHERE email = ?', 
                            [cleanValue(req.body.email)],
                            (error, result) => {
                                if(error) { throw new Error(`${error}`)}
                                const users = Object.entries(result)[0]
                                if(users && users.length > 0) {
                                    res.status(401).json({url: '/users/create', message: {type: "error", text: "Problème lors de la création"}})
                                } else {
                                    if(street !== '' || zipcode !== '' || city !== '') {
                                        if(street !== '' && zipcode !== '' && city !='') {
                                            mysql!.query(
                                                'SELECT * FROM addressusers WHERE street = ? AND zipcode = ? AND city = ?',
                                                [street, zipcode, city],
                                                (error, resultFindAddress) => {
                                                    if(error) { throw new Error(`${error}`)}
                                                    const results = Object.entries(resultFindAddress)[0]
                                                    if(results && results.length > 0) { 
                                                        const addressFound = results.filter(el => typeof el !== 'string')[0];
                                                        console.log('addressFound : ', addressFound);
                                                        newUser(req, res, addressFound.id_address); 
                                                    } else {
                                                        mysql!.query(
                                                            'INSERT INTO addressusers(street, zipcode, city) VALUES(?, ?, ?)',
                                                            [street, zipcode, city],
                                                            (error, resultCreateAddress) => {
                                                                console.log('result : ', resultCreateAddress);
                                                                if(error) { throw new Error(`${error}`)}
                                                                const results = Object.entries(resultCreateAddress);
                                                                if(results && results.length > 0){
                                                                    const addressCreated = results.filter(el => el[0] === 'insertId')[0];
                                                                    console.log('addressCreated : ', addressCreated);
                                                                    newUser(req, res, addressCreated[1]);
                                                                }
                                                            }
                                                        )
                                                    }
                                                }
                                            )
                                        }
                                        else {
                                            res.status(401).json({url: '/users/create', message: {type: "error", text: "Veuillez compléter tous les champs de votre adresse postal"}})
                                        }
                                    }
                                    else { console.log('holla'); newUser(req, res); }
                                }
                            }
                        )   
                    })
                } else {
                    const message = "Le mot de passe et sa confirmation ne sont pas identique"
                    res.status(200).json({url: '/users/create', message: {type: "error", text: message}})
                }
            } else {
                const message = "Veuillez remplir tous les champs obligatoire";
                res.status(200).json({url: '/users/create', message: {type: "error", text: message}})
            }
        } else {
            if(!isConnected || roleConnected !== 1) {
                sendView(res, 200, '/');
            } else {
                sendView(res, 200, 'create-user', {isConnected: isConnected, roleConnected: roleConnected});
            }
        } 
    } catch(error) {
        console.log(`${error}`);
        sendView(res, 500, 'create-user', {isConnected: isConnected, roleConnected: roleConnected, message: {type: "error", text: "Erreur lors de la création d'un utilisateur"} });
    }
}

export const update = async (req: Request, res: Response) => {
    const session = req.session as CustomType;
    const isConnected = session.isConnected ?? false;
    const roleConnected = res.locals.roleUser ?? false;
    const detailsUser = res.locals.detailsUser ?? false;
    const connection = connectMySQL();

    try {
        if(req.body.email || req.body.lastname || req.body.firstname || req.body.street || req.body.zipcode || req.body.city) {

            if(!isConnected || roleConnected !== 1) { sendView(res, 200, '/'); }

            const inputs = [
                {type: 'string', name: 'lastname', message: ''},
                {type: 'string', name: 'firstname', message: ''},
                {type: 'email', name: 'email', message: 'Email obligatoire'},
                {type: 'string', name: 'street', message: ''},
                {type: 'string', name: 'zipcode', message: ''},
                {type: 'string', name: 'city', message: ''},
                {type: 'string', name: 'role', message: ''}
            ]

            verifInputs(req, res, inputs);

            const street = cleanValue(req.body.street);
            const zipcode = cleanValue(req.body.zipcode);
            const city = cleanValue(req.body.city);

            await connection.then(mysql => {
                if(street || zipcode || city) {
                    if(street !== "" && zipcode !== "" && city !== "") {
                        mysql!.query(
                            'SELECT * FROM addressusers WHERE street = ? AND zipcode = ? AND city = ?',
                            [street, zipcode, city],
                            (error, resultFindAddress) => {
                                if(error) { throw new Error(`${error}`)}
                                const results = Object.entries(resultFindAddress)

                                if(results && results.length > 0) { 
                                    const addressFound = results[0].filter(el => typeof el !== 'string')[0];
                                    verifEmail(req, res, detailsUser, addressFound.id_address); 
                                } else {
                                    mysql!.query(
                                        'INSERT INTO addressusers(street, zipcode, city) VALUES(?, ?, ?)',
                                        [street, zipcode, city],
                                        (error, resultCreateAddress) => {
                                            if(error) { throw new Error(`${error}`)}
                                            const results = Object.entries(resultCreateAddress);
                                            if(results && results.length > 0){
                                                const addressCreated = results.filter(el => el[0] === 'insertId')[0];
                                                verifEmail(req, res, detailsUser, addressCreated[1]);
                                            }
                                        }
                                    )
                                }
                            }
                        )
                    } else {
                        const message = "Veuillez compléter tous les champs de votre adresse postal";
                        res.status(401).json({url: `/users/${detailsUser.id_user}/update`, message: {type: 'error', text: message}});
                    }
                }
                else { verifEmail(req, res, detailsUser); }
            })
        } else {
            sendView(res, 200, 'update-user', { isConnected: isConnected, roleConnected: roleConnected, user: detailsUser});
        }
    } catch(error) {
        console.log(`${error}`);
        sendView(res, 401, 'error', {isConnected: isConnected, roleConnected: roleConnected, message: {type: "error", text: 'Update User'}});
    }
}

export const remove = async (req: Request, res: Response) => {
    const session = req.session as CustomType;
    const isConnected = session.isConnected ?? false; 
    const roleConnected = res.locals.roleUser ?? 0; 
    const detailsUser = res.locals.detailsUser ?? false;
    const connection = connectMySQL();

    try {
        if(req.method === 'DELETE') {
            await connection.then(mysql => {
                mysql!.query(
                    'DELETE FROM users WHERE id_user = ?',
                    [cleanValue(req.params.id)],
                    (error, result) => {
                        if(error) { throw new Error(`${error}`)}
                        const results = Object.entries(result);
                        
                        if(results && results.length > 0) {
                            const affectedRows = results.filter(el => el[0] === 'affectedRows').map(el => el[1])[0];

                            if(affectedRows === 1) {
                                const message = `Utilisateur supprimé avec succès`;
                                res.status(200).json({url: `/users`, message: {type: 'success', text: message}});
                            } else {
                                res.status(401).json({url: `/users/${cleanValue(req.params.id)}/delete`, message: {type: 'error', text: 'Error Delete User'}})
                            }
                        }
                    }
                )
            })
        } else { 
            if(!isConnected || roleConnected !== 1 || !detailsUser) { 
                res.status(302).redirect('/'); 
            } else {
                res.status(200).render(
                    join(
                        __dirname, 
                        `../views/management/users/delete-user.ejs`), { isConnected: isConnected, roleConnected: roleConnected, user: detailsUser});
            }
        }
    } catch(error) {
        console.log(`${error}`);
        res.status(200).render(join(__dirname, `../views/management/users/delete-user.ejs`), {isConnected: isConnected, roleConnected: roleConnected, user: detailsUser, message:{type: 'error', text:'Erreur lors de la tentative de suppression'}})
    }
}