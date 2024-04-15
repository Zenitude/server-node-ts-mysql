"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongo = void 0;
const mongoose_1 = require("mongoose");
const connectMongo = () => {
    try {
        (0, mongoose_1.connect)(`${process.env.URL_DATABASE}`)
            .then(() => console.log('Connexion à MongoDB réussie !'))
            .catch((error) => { throw new Error(error); });
    }
    catch (error) {
        console.log(`Erreur MongoDB : ${error}`);
    }
};
exports.connectMongo = connectMongo;
