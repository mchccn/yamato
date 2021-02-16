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
    wins: IUser["wins"];
    battles: IUser["battles"];
    log: IUser["log"];
    trophies: IUser["trophies"];
    league: IUser["league"];
    ocean: IUser["ocean"];
    coinBoost: IUser["coinBoost"];
    expBoost: IUser["expBoost"];
    banned: IUser["banned"];
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
    wins: number;
    battles: number;
    log: {
        time: number;
        opponent: string;
        allyShipsSunk: number;
        enemyShipsSunk: number;
        lost: boolean;
    }[];
    trophies: number;
    league:
        | "BRONZE"
        | "SILVER"
        | "GOLD"
        | "DIAMOND"
        | "EMERALD"
        | "PLATINUM"
        | "EXPERT"
        | "MASTER"
        | "GRANDMASTER"
        | "SUPREME";
    ocean:
        | "NORTH_PACIFIC"
        | "SOUTH_PACIFIC"
        | "NORTH_ATLANTIC"
        | "SOUTH_ATLANTIC"
        | "INDIAN"
        | "ARCTIC";
    coinBoost: boolean;
    expBoost: boolean;
    banned: boolean;
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
    wins: {
        type: Number,
        default: 0,
    },
    battles: {
        type: Number,
        default: 0,
    },
    log: {
        type: [
            {
                time: {
                    type: Number,
                    required: true,
                },
                opponent: {
                    type: String,
                    required: true,
                },
                allyShipsSunk: {
                    type: String,
                    required: true,
                },
                enemyShipsSunk: {
                    type: String,
                    required: true,
                },
                lost: {
                    type: Boolean,
                    required: true,
                },
            },
        ],
        default: [],
    },
    trophies: {
        type: Number,
        default: 0,
    },
    league: {
        type: String,
        enum: [
            "BRONZE",
            "SILVER",
            "GOLD",
            "DIAMOND",
            "EMERALD",
            "PLATINUM",
            "EXPERT",
            "MASTER",
            "GRANDMASTER",
            "SUPREME",
        ],
        default: "BRONZE",
    },
    ocean: {
        type: String,
        enum: [
            "NORTH_PACIFIC",
            "SOUTH_PACIFIC",
            "NORTH_ATLANTIC",
            "SOUTH_ATLANTIC",
            "INDIAN",
            "ARCTIC",
        ],
        default: "NORTH_PACIFIC",
    },
    coinBoost: {
        type: Boolean,
        default: false,
    },
    expBoost: {
        type: Boolean,
        default: false,
    },
    banned: {
        type: Boolean,
        default: false,
    },
});

const users = mongoose.model<IUser>("users", userSchema);

export default users;
