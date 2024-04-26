"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.signup = exports.signin = void 0;
const path_1 = require("path");
const verifInput_1 = require("../utils/functions/verifInput");
const sendView_1 = require("../utils/functions/sendView");
const cleanValue_1 = require("../utils/functions/cleanValue");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mysql_1 = require("../utils/database/mysql");
const signUser = async (req, res, idAddress) => {
    const session = req.session;
    const connection = (0, mysql_1.connectMySQL)();
    const { firstname, lastname, email, password } = req.body;
    const hash = await bcrypt_1.default.hash((0, cleanValue_1.cleanValue)(password), 10);
    const user = {
        firstname: (0, cleanValue_1.cleanValue)(firstname),
        lastname: (0, cleanValue_1.cleanValue)(lastname),
        email: (0, cleanValue_1.cleanValue)(email),
        password: hash,
        address: idAddress ? (0, cleanValue_1.cleanValue)(idAddress) : 1,
        role: 0
    };
    connection.then(mysql => {
        mysql?.query('INSERT INTO users(lastname, firstname, email, password, role, address) VALUES(?, ?, ?, ?, ?, ?) ', [user.lastname, user.firstname, user.email, user.password, user.role, user.address], (error, result) => {
            if (error) {
                throw new Error(`${error}`);
            }
            const results = Object.entries(result);
            if (results) {
                const idUser = results.filter(el => el[0] === 'insertId').map(el => el[1])[0];
                session.userId = idUser;
                session.isConnected = true;
                const token = jsonwebtoken_1.default.sign({ userId: idUser }, process.env.SECRET_KEY_TOKEN, { expiresIn: '7d' });
                res.cookie('token', token, {
                    httpOnly: false,
                    secure: false,
                    maxAge: 604800000
                });
                const successMessage = `Bienvenue ${(user.lastname === '' || user.firstname === '') ? user.email : `${user.firstname} ${user.lastname}`}`;
                res.status(200).json({ url: '/', message: { type: 'success', text: successMessage } });
            }
        });
    });
};
const signin = (req, res) => {
    const session = req.session;
    const isConnected = session.isConnected ? session.isConnected : false;
    const connection = (0, mysql_1.connectMySQL)();
    try {
        if (req.body.email && req.body.password) {
            if (isConnected) {
                res.status(200).json({ url: '/', message: { type: '', text: '' } });
            }
            const inputs = [
                { type: 'email', name: 'email', message: 'Email obligatoire' },
                { type: 'string', name: 'password', message: 'Mot de passe obligatoire' },
            ];
            (0, verifInput_1.verifInputs)(req, res, inputs);
            connection.then(mysql => {
                mysql.query('SELECT * FROM users WHERE email = ?', [(0, cleanValue_1.cleanValue)(req.body.email)], (error, result) => {
                    if (error) {
                        throw new Error(`${error}`);
                    }
                    const results = Object.entries(result);
                    if (results && results.length > 0) {
                        const user = results.map(el => el[1])[0];
                        const compare = bcrypt_1.default.compare((0, cleanValue_1.cleanValue)(req.body.password), user.password);
                        compare.then(compared => {
                            if (compared) {
                                session.isConnected = true;
                                session.userId = user.id_user;
                                const token = jsonwebtoken_1.default.sign({ userId: user.id_user }, process.env.SECRET_KEY_TOKEN, { expiresIn: '7d' });
                                res.cookie('token', token, {
                                    httpOnly: false,
                                    secure: false,
                                    maxAge: 604800000
                                });
                                const successMessage = `Bienvenue ${(user.lastname === '' || user.firstname === '') ? user.email : `${user.firstname} ${user.lastname}`}`;
                                res.status(200).json({ url: '/', message: { type: 'success', text: successMessage } });
                            }
                            else {
                                res.status(401).json({ url: '/signin', message: { type: "error", text: 'Identifiants incorrect' } });
                            }
                        }).catch(error => { throw new Error(`${error}`); });
                    }
                    else {
                        res.status(401).json({ url: '/signin', message: { type: "error", text: 'Identifiants incorrect' } });
                    }
                });
            });
        }
        else {
            if (isConnected) {
                res.status(302).redirect('/');
            }
            else {
                res.status(200).render((0, path_1.join)(__dirname, "../views/sign/signin.ejs"), { isConnected: isConnected });
            }
        }
    }
    catch (error) {
        console.log(`Erreur connexion : ${error}`);
        (0, sendView_1.sendView)(res, 500, "");
    }
};
exports.signin = signin;
const signup = (req, res) => {
    const session = req.session;
    const isConnected = session.isConnected ?? false;
    const roleConnected = res.locals.roleUser ?? 0;
    const connection = (0, mysql_1.connectMySQL)();
    try {
        if (req.body.email || req.body.lastname || req.body.firstname || req.body.password || req.body.confirm || req.body.street || req.body.zipcode || req.body.city) {
            if (isConnected) {
                (0, sendView_1.sendView)(res, 200, '/');
            }
            if (req.body.email && req.body.password && req.body.confirm) {
                if (req.body.password === req.body.confirm) {
                    const inputs = [
                        { type: 'string', name: 'lastname', message: '' },
                        { type: 'string', name: 'firstname', message: '' },
                        { type: 'email', name: 'email', message: 'Email obligatoire' },
                        { type: 'string', name: 'password', message: 'Mot de passe obligatoire' },
                        { type: 'string', name: 'confirm', message: 'Confirmation obligatoire' },
                        { type: 'string', name: 'street', message: '' },
                        { type: 'string', name: 'zipcode', message: '' },
                        { type: 'string', name: 'city', message: '' },
                    ];
                    (0, verifInput_1.verifInputs)(req, res, inputs);
                    const street = (0, cleanValue_1.cleanValue)(req.body.street);
                    const zipcode = (0, cleanValue_1.cleanValue)(req.body.zipcode);
                    const city = (0, cleanValue_1.cleanValue)(req.body.city);
                    connection.then(mysql => {
                        mysql.query('SELECT * FROM users WHERE email = ?', [(0, cleanValue_1.cleanValue)(req.body.email)], (error, result) => {
                            if (error) {
                                throw new Error(`${error}`);
                            }
                            const results = Object.entries(result);
                            if (results && results.length > 0) {
                                res.status(200).json({ url: "/signup", message: { type: 'error', text: "Problème lors de l'inscription" } });
                            }
                            else {
                                if (street || zipcode || city) {
                                    if (street !== '' && zipcode !== '' && city !== '') {
                                        mysql.query('SELECT * FROM addressusers WHERE street = ? AND zipcode = ? AND city = ?', [street, zipcode, city], (error, result) => {
                                            if (error) {
                                                throw new Error(`${error}`);
                                            }
                                            const results = Object.entries(result);
                                            console.log(results);
                                            if (results && results.length > 0) {
                                                const addressFound = results.map(el => el[1])[0];
                                                console.log('addressfound : ', addressFound.id_address);
                                                signUser(req, res, addressFound.id_address);
                                            }
                                            else {
                                                mysql.query('INSERT INTO addressusers(street, zipcode, city) VALUES(?, ?, ?)', [street, zipcode, city], (error, result) => {
                                                    if (error) {
                                                        throw new Error(`${error}`);
                                                    }
                                                    const results = Object.entries(result);
                                                    if (results) {
                                                        const idAddress = results.filter(el => el[0] === 'insertId').map(el => el[1])[0];
                                                        signUser(req, res, idAddress);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    else {
                                        res.status(401).json({ url: '/signup', message: { type: 'error', text: "Veuillez compléter tous les champs de votre adresse postal" } });
                                    }
                                }
                                else {
                                    signUser(req, res);
                                }
                            }
                        });
                    });
                }
                else {
                    if (isConnected) {
                        (0, sendView_1.sendView)(res, 200, "/");
                    }
                    else {
                        (0, sendView_1.sendView)(res, 200, 'signup', { isConnected: isConnected, roleConnected: roleConnected, message: { type: "error", text: "Le mot de passe et sa confirmation ne sont pas identique" } });
                    }
                }
            }
            else {
                (0, sendView_1.sendView)(res, 200, 'signup', { isConnected: isConnected, roleConnected: roleConnected, message: { type: "error", text: "Veuillez remplir les champs obligatoires" } });
            }
        }
        else {
            if (isConnected) {
                (0, sendView_1.sendView)(res, 200, '/');
            }
            else {
                (0, sendView_1.sendView)(res, 200, 'signup', { isConnected: isConnected, roleConnected: roleConnected });
            }
        }
    }
    catch (error) {
        console.log(error);
        (0, sendView_1.sendView)(res, 401, 'error', { isConnected: isConnected, roleConnected: roleConnected, message: { type: 'error', text: 'Inscription' } });
    }
};
exports.signup = signup;
const logout = (req, res) => {
    const session = req.session;
    const isConnected = session.isConnected ?? false;
    const roleConnected = res.locals.roleUser ?? false;
    try {
        res.clearCookie('token');
        req.session.destroy((err) => { if (err) {
            throw new Error('Erreur Destroy Session');
        } });
        res.status(200).redirect('/');
    }
    catch (error) {
        console.log(`Erreur Déconnexion : ${error}`);
        res.status(500).render((0, path_1.join)(__dirname, "../views/errors/error-500.ejs"), { isConnected: isConnected, roleConnected: roleConnected, message: { type: 'error', text: 'Disconnect' } });
    }
};
exports.logout = logout;
