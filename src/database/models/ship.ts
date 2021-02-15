import mongoose, { Document } from "mongoose";
import { IWeapon, weaponSchema } from "./weapon";

export interface IPureShip {
    name: IShip["name"];
    description: IShip["description"];
    class: IShip["class"];
    health: IShip["health"];
    maxHealth: IShip["maxHealth"];
    level: IShip["level"];
    maxLevel: IShip["maxLevel"];
    speed: IShip["speed"];
    weapons: IShip["weapons"];
    levelRequired: IShip["levelRequired"];
    cost: IShip["cost"];
}

export interface IShip extends Document {
    name: string;
    description: string;
    class:
        | "BATTLESHIP"
        | "FLAGSHIP"
        | "FRIGATE"
        | "CARRIER"
        | "CRUISER"
        | "DESTROYER"
        | "SUBMARINE";
    health: number;
    maxHealth: number;
    level: number;
    maxLevel: number;
    speed: number;
    weapons: {
        heavies: IWeapon[];
        heavySlots: number;
        mediums: IWeapon[];
        mediumSlots: number;
        lights: IWeapon[];
        lightSlots: number;
    };
    levelRequired: number;
    cost: number;
}

export const shipSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    class: {
        type: String,
        enum: [
            "BATTLESHIP",
            "FLAGSHIP",
            "FRIGATE",
            "CARRIER",
            "CRUISER",
            "DESTROYER",
            "SUBMARINE",
        ],
        required: true,
    },
    health: {
        type: Number,
        required: true,
    },
    maxHealth: {
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
    speed: {
        type: Number,
        required: true,
    },
    weapons: {
        heavies: {
            type: [weaponSchema],
            default: [],
        },
        heavySlots: {
            type: Number,
            required: true,
        },
        mediums: {
            type: [weaponSchema],
            default: [],
        },
        mediumSlots: {
            type: Number,
            required: true,
        },
        lights: {
            type: [weaponSchema],
            default: [],
        },
        lightSlots: {
            type: Number,
            required: true,
        },
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

const ships = mongoose.model<IShip>("ships", shipSchema);

export default ships;
