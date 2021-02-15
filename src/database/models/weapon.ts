import mongoose, { Document } from "mongoose";

export interface IPureWeapon {
    name: IWeapon["name"];
    description: IWeapon["description"];
    damage: IWeapon["damage"];
    type: IWeapon["type"];
    effect: IWeapon["effect"];
    deviation: IWeapon["deviation"];
    critChance: IWeapon["critChance"];
    level: IWeapon["level"];
    maxLevel: IWeapon["maxLevel"];
    levelRequired: IWeapon["levelRequired"];
    cost: IWeapon["cost"];
}

export interface IWeapon extends Document {
    name: string;
    description: string;
    damage: number;
    type: "LIGHT" | "MEDIUM" | "HEAVY";
    effect: "CRYO" | "PYRO" | "KINETIC" | "TOXIC" | "CORROSION" | "SUPRESSION" | "NONE";
    deviation: number;
    critChance: number;
    level: number;
    maxLevel: number;
    levelRequired: number;
    cost: number;
}

export const weaponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    damage: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ["LIGHT", "MEDIUM", "HEAVY"],
        required: true,
    },
    effect: {
        type: String,
        enum: ["CRYO", "PYRO", "KINETIC", "TOXIC", "CORROSION", "SUPRESSION", "NONE"],
        required: true,
    },
    deviation: {
        type: Number,
        required: true,
    },
    critChance: {
        type: Number,
        required: true,
    },
    level: {
        type: Number,
        required: true,
    },
    maxLevel: {
        type: Number,
        required: true,
    },
    levelRequired: {
        type: Number,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
});

const weapons = mongoose.model<IWeapon>("weapons", weaponSchema);

export default weapons;
