import { Request, Response, NextFunction } from "express";
import { join } from "path";
import { verifInputs } from "../utils/functions/verifInput";
import { cleanValue } from "../utils/functions/cleanValue";
import { CustomType, OptionCookie } from "../utils/types/types";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { connectMySQL } from "../utils/database/mysql";

const signUser = async (req: Request, res: Response, idAddress?: String | Number) => {
    const session = req.session as CustomType;
    const connection = connectMySQL();
    const { firstname, lastname, email, password } = req.body;
    const hash = await bcrypt.hash(cleanValue(password), 10);
    
    const user = {
        firstname: cleanValue(firstname),
        lastname: cleanValue(lastname),
        email: cleanValue(email),
        password: hash,
        address: idAddress ? cleanValue(idAddress) : 1,
        role: 0
    };

    connection.then(mysql => {
        mysql?.query(
            'INSERT INTO users(lastname, firstname, email, password, role, address) VALUES(?, ?, ?, ?, ?, ?) ',
            [user.lastname, user.firstname, user.email, user.password, user.role, user.address],
            (error, result) => {
                if(error) { throw new Error(`${error}`) }
                const results = Object.entries(result);

                if(results) {
                    const idUser = results.filter(el => el[0] === 'insertId').map(el => el[1])[0];
                    session.userId = idUser;
                    session.isConnected = true;

                    const token : string = jwt.sign(
                        { userId: idUser },
                        process.env.SECRET_KEY_TOKEN as string,
                        { expiresIn: '7d'}
                    );

                    res.cookie('token', token, <OptionCookie>{
                        httpOnly: false,
                        secure: false,
                        maxAge: 604800000
                    });

                    const successMessage = `Bienvenue ${(user.lastname === '' || user.firstname === '') ? user.email : `${user.firstname} ${user.lastname}` }`;
                    res.status(200).json({url: '/', message: {type: 'success', text: successMessage}})
                }
            }
        )
    })
}

export const signin = (req: Request, res: Response) => {
    const session = req.session as CustomType;
    const isConnected = session.isConnected ? session.isConnected : false;
    const connection = connectMySQL();

    try {
        if(req.body.email && req.body.password) {
            if(isConnected) { res.status(200).json({url: '/', message: {type: '', text: ''}}); }

            const inputs = [
                {type: 'email', name: 'email', message: 'Email obligatoire'},
                {type: 'string', name: 'password', message: 'Mot de passe obligatoire'},
            ]

            verifInputs(req, res, inputs);

            connection.then(mysql => {
                mysql!.query(
                    'SELECT * FROM users WHERE email = ?',
                    [cleanValue(req.body.email)],
                    (error, result) => {
                        if(error) { throw new Error(`${error}`)}
                        const results = Object.entries(result);

                        if(results && results.length > 0) {
                            const user = results.map(el => el[1])[0];
                            const compare = bcrypt.compare(cleanValue(req.body.password), user.password);
                            compare.then(compared =>  {
                                if(compared) {
                                    session.isConnected = true;
                                    session.userId = user.id_user;
        
                                    const token = jwt.sign(
                                        {userId: user.id_user },
                                        process.env.SECRET_KEY_TOKEN as string,
                                        {expiresIn: '7d'}
                                    )
        
                                    res.cookie('token', token, {
                                        httpOnly: false,
                                        secure: false,
                                        maxAge: 604800000
                                    });
        
                                    const successMessage = `Bienvenue ${(user.lastname === '' || user.firstname === '') ? user.email : `${user.firstname} ${user.lastname}` }`;
                                    res.status(200).json({url: '/', message: {type: 'success', text: successMessage}})
                                } else {
                                    res.status(401).json({url: '/signin', message: {type: "error", text:'Identifiants incorrect'}})
                                }
                            }).catch(error => { throw new Error(`${error}`)});
                        } else {
                            res.status(401).json({url: '/signin', message: {type: "error", text:'Identifiants incorrect'}}) 
                        }
                    }
                )
            })
        } else {
            if(isConnected) {
                res.status(302).redirect('/');
            } else {
                res.status(200).render(join(__dirname, "../views/sign/signin.ejs"), { isConnected: isConnected })
            }
        }
    } catch(error) {
        console.log(`Erreur connexion : ${error}`);
        res.status(500).render(join(__dirname, "../views/errors/error-500.ejs"), { isConnected: isConnected, roleConnected: false})
    }
}

export const signup = (req: Request, res: Response) => {
    const session = req.session as CustomType;
    const isConnected = session.isConnected ?? false;
    const roleConnected = res.locals.roleUser ?? 0;
    const connection = connectMySQL();

    try {
        if(req.body.email || req.body.lastname || req.body.firstname || req.body.password || req.body.confirm || req.body.street || req.body.zipcode || req.body.city) {
            if(isConnected) { res.status(401).redirect('/'); }
            if(req.body.email && req.body.password && req.body.confirm) {
                if(req.body.password === req.body.confirm) {
                    const inputs = [
                        {type: 'string', name: 'lastname', message: ''},
                        {type: 'string', name: 'firstname', message: ''},
                        {type: 'email', name: 'email', message: 'Email obligatoire'},
                        {type: 'string', name: 'password', message: 'Mot de passe obligatoire'},
                        {type: 'string', name: 'confirm', message: 'Confirmation obligatoire'},
                        {type: 'string', name: 'street', message: ''},
                        {type: 'string', name: 'zipcode', message: ''},
                        {type: 'string', name: 'city', message: ''},
                    ]
        
                    verifInputs(req, res, inputs);
                    
                    const street = cleanValue(req.body.street);
                    const zipcode = cleanValue(req.body.zipcode);
                    const city = cleanValue(req.body.city);
                    
                    connection.then(mysql => {
                        mysql!.query(
                            'SELECT * FROM users WHERE email = ?',
                            [cleanValue(req.body.email)],
                            (error, result) => {
                                if(error) { throw new Error(`${error}`)}
                                const results = Object.entries(result);
                                if(results && results.length > 0) { 
                                    res.status(200).json({url: "/signup", message: {type: 'error', text:"Problème lors de l'inscription"}})
                                } else {
                                    if(street || zipcode || city) {
                                        if(street !== '' && zipcode !== '' && city !== '') {
                                            mysql!.query(
                                                'SELECT * FROM addressusers WHERE street = ? AND zipcode = ? AND city = ?',
                                                [street, zipcode, city],
                                                (error, result) => {
                                                    if(error) { throw new Error(`${error}`)}
                                                    const results = Object.entries(result);
                                                    console.log(results);
                                                    if(results && results.length > 0) {
                                                        const addressFound = results.map(el => el[1])[0];
                                                        console.log('addressfound : ', addressFound.id_address);
                                                        signUser(req, res, addressFound.id_address);
                                                    } else {
                                                        mysql!.query(
                                                            'INSERT INTO addressusers(street, zipcode, city) VALUES(?, ?, ?)',
                                                            [street, zipcode, city], 
                                                            (error, result) => {
                                                                if(error) { throw new Error(`${error}`)}
                                                                const results = Object.entries(result);

                                                                if(results) {
                                                                    const idAddress = results.filter(el => el[0] === 'insertId').map(el => el[1])[0];
                                                                    signUser(req, res, idAddress);
                                                                }
                                                            }
                                                        )
                                                    }
                                                }
                                            )
                                        } else {
                                            res.status(401).json({url: '/signup', message: {type: 'error', text: "Veuillez compléter tous les champs de votre adresse postal"}})
                                        }
                                    } else { signUser(req, res); }
                                }
                            }
                        )
                    })
                } else {
                    if(isConnected) {
                        res.status(401).redirect('/');
                    } else {
                        res.status(200).render(join(__dirname, "../views/sign/signup.ejs"), { isConnected: isConnected, roleConnected: roleConnected, message: {type: "error", text: "Le mot de passe et sa confirmation ne sont pas identique"}})
                    }
                }
            } else {
                res.status(200).render(join(__dirname, "../views/sign/signup.ejs"), { isConnected: isConnected, roleConnected: roleConnected, message: {type: "error", text: "Veuillez remplir les champs obligatoires"}})
            }
            
        } else {
            if(isConnected) {
                res.status(401).redirect('/');
            } else {
                res.status(200).render(join(__dirname, "../views/sign/signup.ejs"), { isConnected: isConnected, roleConnected: roleConnected})
            }
        }
    } catch(error) {
        console.log(error);
        res.status(500).render(join(__dirname, "../views/errors/error-500.ejs"), { isConnected: isConnected, roleConnected: roleConnected, message: {type: 'error', text:'Inscription'}})
    }
}

export const logout = (req: Request, res: Response) => {
    const session = req.session as CustomType;
    
    const isConnected = session.isConnected ?? false;
    const roleConnected = res.locals.roleUser ?? false;

    try {
        res.clearCookie('token');
        req.session.destroy((err: any) => { if(err) { throw new Error('Erreur Destroy Session')}});
        res.status(200).redirect('/');
    } catch(error) {
        console.log(`Erreur Déconnexion : ${error}`);
        res.status(500).render(join(__dirname, "../views/errors/error-500.ejs"), {isConnected: isConnected, roleConnected: roleConnected, message: {type: 'error', text: 'Disconnect'}})
    }
}