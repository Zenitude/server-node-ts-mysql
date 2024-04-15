import { Request, Response, NextFunction } from "express";
import { join } from "path";
import { isNumeric } from "validator";
import { Types } from "mongoose";
import bcrypt from "bcrypt";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
import User from "../models/User";
import { verifInputs } from "../utils/functions/verifInput";
import { findUserByMail } from "../utils/functions/findUserByMail";
import { createAddress } from "../utils/functions/createAddress";
import { findAddress } from "../utils/functions/findAddress";
import { sendView } from "../utils/functions/sendView";
import { cleanValue } from "../utils/functions/cleanValue";
import { UserModel, AddressUserModel, CustomType } from "../utils/types/types";

const findUsers = async () => {
    return await User.find().populate('address');
}

const newUser = async (req: Request, res: Response, idAddress?: Types.ObjectId) => {
    const { firstname, lastname, email, password, role } = req.body;
    const hash = await bcrypt.hash(cleanValue(password), 10);
    
    const user = new User({
        firstname: cleanValue(firstname),
        lastname: cleanValue(lastname),
        email: cleanValue(email),
        password: hash,
        address: idAddress && cleanValue(idAddress),
        role: (isNumeric(cleanValue(role)) && cleanValue(role).length === 1) ? parseInt(cleanValue(role)) : 0
    });

    user.save().then(result => {
        const message = `Utilisateur ${(result.lastname === '' || result.firstname === '') ? result.email : `${result.firstname} ${result.lastname}`} créé avec succès`;
        res.status(201).json({url: '/users/create', message: {type: 'success', text: message}});
    }).catch(error => {
        throw new Error(`Erreur Save User : ${error}`);
    })
}

const refreshUser = async (req: Request, res: Response, user: UserModel, idAddress?: Types.ObjectId, ) => {
    const { firstname, lastname, email, role } = await req.body;
    
    let updatedUser = <UserModel>{
        _id: cleanValue(req.params.id),
        firstname: cleanValue(firstname),
        lastname: cleanValue(lastname),
        password: user!.password,
        address: idAddress! && idAddress,
        role: parseInt(cleanValue(role))
    }

    if(email && user!.email !== cleanValue(email)) {
        updatedUser.email = cleanValue(email)
    }
    
    await User.updateOne({ _id: cleanValue(req.params.id)}, {...updatedUser})
    .then(result => {
        const message = `Utilisateur ${(updatedUser.lastname === '' || updatedUser.firstname === '') ? updatedUser.email : `${updatedUser.firstname} ${updatedUser.lastname}`} créé avec succès`;
        res.status(201).json({url: `/users/${req.params.id}/update`, message: {type: 'success', text: message}});
    }).catch(error => {
        console.log(error)
        throw new Error(`Erreur UpdateOne User : ${error}`);
    })
}

const verifEmail = async (req: Request, res: Response, detailsUser: UserModel, address?: AddressUserModel) => {
    if(req.body.email && detailsUser.email !== cleanValue(req.body.email)) {
        await User.findOne({email: cleanValue(req.body.email)})
        .then(emailExist => {
            if(emailExist) {
                const message = "L'email saisie existe déjà dans la base de données"
                res.status(200).json({url: `/users/${req.params.id}/update`, message: {type: 'error', text: message}})
            }
            else {
                if(address) {
                    refreshUser(req, res, detailsUser, address!._id);
                } else {
                    refreshUser(req, res, detailsUser);
                }
            }
        })
        .catch(error => { throw new Error(`Erreur findUserByMail update user : ${error}`)}) 
    } else {
        if(address) {
            refreshUser(req, res, detailsUser, address!._id);
        } else {
            refreshUser(req, res, detailsUser);
        }
    }
}

export const list = async (req: Request, res: Response) => {
    const session = req.session as CustomType;
    const isConnected = session.isConnected ?? false;
    const roleConnected = res.locals.roleUser ?? 0;

    try {
        if(roleConnected !== 1) {
            sendView(res, 401, "error", {isConnected: isConnected, roleConnected: roleConnected});
        } else {
            await findUsers()
            .then(users => {
                sendView(res, 200, 'list-user', {isConnected: isConnected, roleConnected: roleConnected, users: users});
            })
            .catch(error => { throw new Error(`Error findUsers List Users : ${error}`)});
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
            sendView(res, 200, 'details-user', {user: user, isConnected: isConnected, roleConnected: roleConnected});
        }
    } catch(error) {
        console.log(`Erreur details User : ${error}`);
        sendView(res, 500, 'error', {isConnected: isConnected, roleConnected: roleConnected, message: {type: "error", text:"Détails User"}});
    }
}

export const create = (req: Request, res: Response) => {
    const session = req.session as CustomType;
    const isConnected = session.isConnected ?? false;
    const roleConnected = res.locals.roleUser ?? 0;

    try {
        if(req.body.email || req.body.lastname || req.body.firstname || req.body.password || req.body.confirm || req.body.street || req.body.zipcode || req.body.city) {
            if(!isConnected || roleConnected !== 1) { sendView(res, 200, '/'); }
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

                    findUserByMail(req)
                    .then(user => {
                        if(user) { res.status(401).json({url: '/users/create', message: {type: "error", text: "Problème lors de la création"}})
                        } else {
                            if(street || zipcode || city) {
                                if(street && zipcode && city) {
                                    findAddress(req)
                                    .then(address => {
                                        if(address) { newUser(req, res, address._id); } 
                                        else {
                                            createAddress(req)
                                            .then(result => { newUser(req, res, result.id); })
                                            .catch(error => {
                                                throw new Error(`Erreur CreateAdress Create User : ${error}`)
                                            })
                                        }
                                    })
                                    .catch(error => { 
                                        throw new Error(`Error findAddress Create User : ${error}`);
                                    })
                                } else {
                                    res.status(401).json({url: '/users/create', message: {type: "error", text: "Veuillez compléter tous les champs de votre adresse postal"}})
                                }
                            } else {
                                newUser(req, res);
                            }
                        }
                    })
                    .catch(error => {
                        throw new Error(`Error findUserByMail : ${error}`);
                    });
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

export const update = (req: Request, res: Response) => {
    const session = req.session as CustomType;
    const isConnected = session.isConnected ?? false;
    const roleConnected = res.locals.roleUser ?? false;
    const detailsUser = res.locals.detailsUser ?? false;
    
    try {
        if(req.body.email || req.body.lastname || req.body.firstname || req.body.street || req.body.zipcode || req.body.city) {
            console.log('id update : ', req.params.id);
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

            if(street || zipcode || city) {
                if(street !== "" && zipcode !== "" && city !== "") {
                    findAddress(req)
                    .then(address => {
                        if(address) {
                            verifEmail(req, res, detailsUser, address);
                            // if(req.body.email && detailsUser.email !== cleanValue(req.body.email)) {
                            //     User.findOne({email: cleanValue(req.body.email)})
                            //     .then(emailExist => {
                            //         if(emailExist) {
                            //             const message = "L'email saisie existe déjà dans la base de données"
                            //             res.status(200).json({url: `/users/${detailsUser._id}/update`, message: {type: 'error', text: message}})
                            //         }
                            //         else {
                            //             refreshUser(req, res, detailsUser, address._id);
                            //         }
                            //     })
                            //     .catch(error => { throw new Error(`Erreur findUserByMail update user : ${error}`)}) 
                            // } else {
                            //     refreshUser(req, res, detailsUser, address._id);
                            // }
                        } else {
                            createAddress(req)
                            .then(result => {
                                verifEmail(req, res, detailsUser, result);
                                // if(req.body.email && detailsUser.email !== cleanValue(req.body.email)) {   
                                //     User.findOne({email: cleanValue(req.body.email)})
                                //     .then(emailExist => {
                                //         if(emailExist) {
                                //             const message = "L'email saisie existe déjà dans la base de données";
                                //             res.status(200).json({url: `/users/${detailsUser._id}/update`, message: {type: 'error', text: message}});
                                //         }
                                //         else {
                                //             refreshUser(req, res, detailsUser, result._id);
                                //         }
                                //     })
                                //     .catch(error => { throw new Error(`Erreur findUserByMail update user : ${error}`)})
                                // } else {
                                //     refreshUser(req, res, detailsUser, result._id);
                                // }
                            })
                            .catch(error => { throw new Error(`Error createAddress Update User : ${error}`)});
                        }
                    })
                    .catch(error => { throw new Error(`Error findAddress Update User : ${error}`)})
                } else {
                    const message = "Veuillez compléter tous les champs de votre adresse postal";
                    res.status(401).json({url: `/users/${detailsUser._id}/update`, message: {type: 'error', text: message}});
                }
            } else {
                verifEmail(req, res, detailsUser);
                // if(req.body.email && detailsUser.email !== cleanValue(req.body.email)) {
                //     User.findOne({email: cleanValue(req.body.email)})
                //     .then(emailExist => {
                //         if(emailExist) {
                //             const message = "L'email saisie existe déjà dans la base de données";
                //             res.status(200).json({url: `/users/${detailsUser._id}/update`, message: {type: 'error', text: message}});
                //         }
                //         else {
                //             refreshUser(req, res, detailsUser);
                //         }
                //     })
                //     .catch(error => { throw new Error(`Erreur findUserByMail update user : ${error}`)}) 
                // } else {
                //     refreshUser(req, res, detailsUser);
                // }
            }
            
        } else {
            sendView(res, 200, 'update-user', { isConnected: isConnected, roleConnected: roleConnected, user: detailsUser});
        }
    } catch(error) {
        console.log(`${error}`);
        sendView(res, 401, 'error', {isConnected: isConnected, roleConnected: roleConnected, message: {type: "error", text: 'Update User'}});
    }
}

export const remove = (req: Request, res: Response) => {
    const session = req.session as CustomType;
    const isConnected = session.isConnected ?? false; 
    const roleConnected = res.locals.roleUser ?? 0; 
    const detailsUser = res.locals.detailsUser ?? false;

    try {
        if(req.method === 'DELETE') {
            User.deleteOne({_id: cleanValue(req.params.id) })
            .then(() => {
                const message = `Utilisateur supprimé avec succès`
                res.status(200).json({url: `/users/`, message: {type: 'success', text: message}});
            }).catch(error => {throw new Error(`Error deleteOne Delete User : ${error}`)});
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