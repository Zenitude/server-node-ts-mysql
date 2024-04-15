import { connect } from "mongoose";

export const connectMongo = () => {
    try {
        connect(`${process.env.URL_DATABASE}`)
        .then(() => console.log('Connexion à MongoDB réussie !'))
        .catch((error) => {throw new Error(error);});
    } catch(error) {
        console.log(`Erreur MongoDB : ${error}`);
    }
}