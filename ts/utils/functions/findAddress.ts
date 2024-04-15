import { Request } from "express";
import AddressUser from "../../models/AddressUser";
import { cleanValue } from "./cleanValue";

export const findAddress = async (req: Request) => {
    const { street, zipcode, city } = req.body;
    return await AddressUser.findOne({
        street: cleanValue(street),
        zipcode: cleanValue(zipcode),
        city: cleanValue(city)
    })
}