import { Request } from "express";
import { cleanValue } from "./cleanValue";
import AddressUser from "../../models/AddressUser";

export const createAddress = async (req: Request) => {
    const { street, zipcode, city } = req.body;
    const newAddress = new AddressUser({
        street: cleanValue(street),
        zipcode: parseInt(cleanValue(zipcode)),
        city: cleanValue(city)
    });
    return await newAddress.save();
}