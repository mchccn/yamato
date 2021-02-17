import { Command } from "@aeroware/aeroclient/dist/types";
import users from "../../database/models/user";
import addExp from "../../utils/leveling";
import { supplyCrates } from "../../utils/trophies";

export default {
    name: "supplies",
    aliases: ["supply", "crate", "daily", "rewards"],
    description: "Get your daily supply crate!",
    details: "Includes coins and exp.",
    category: "economy",
    cooldown: 86400,
    async callback({ message, client }) {
        const user = (await users.findById(message.author.id))!;

        const supplies = supplyCrates[user.league];

        const coins = Math.floor(
            (Math.random() * (supplies.coins.max - supplies.coins.min) + supplies.coins.min) *
                (1 + user.rank)
        );

        const exp = Math.floor(
            (Math.random() * (supplies.exp.max - supplies.exp.min) + supplies.exp.min) *
                (1 + user.rank)
        );

        user.coins += coins;
        await addExp(user._id, exp, client);

        await user.save();

        return message.channel.send(
            `You received ${coins} coins and ${exp} exp in your daily supply crate!`
        );
    },
} as Command;
