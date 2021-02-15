import mongoose, { Document } from "mongoose";
import { IShip, shipSchema } from "./ship";
import { IWeapon, weaponSchema } from "./weapon";

export interface IPureUser {
    _id: IUser["_id"];
    level: IUser["level"];
    exp: IUser["exp"];
    coins: IUser["coins"];
    weapons: IUser["weapons"];
    ships: IUser["ships"];
    shipSlots: IUser["shipSlots"];
    fleet: IUser["fleet"];
}

export interface IUser extends Document {
    _id: string;
    level: number;
    exp: number;
    coins: number;
    weapons: IWeapon[];
    ships: IShip[];
    shipSlots: number;
    fleet: IShip[];
}

export const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    level: {
        type: Number,
        default: 0,
    },
    exp: {
        type: Number,
        default: 0,
    },
    coins: {
        type: Number,
        default: 0,
    },
    weapons: {
        type: [weaponSchema],
        default: [],
    },
    ships: {
        type: [shipSchema],
        default: [],
    },
    shipSlots: {
        type: Number,
        default: 1,
    },
    fleet: {
        type: [shipSchema],
        default: [],
    },
});

const users = mongoose.model<IUser>("users", userSchema);

export default users;
