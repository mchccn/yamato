import { Command } from "@aeroware/aeroclient/dist/types";
import users from "../../database/models/user";

export default {
    name: "levels",
    args: true,
    usage: "<levels>",
    category: "admin",
    hidden: true,
    async callback({ message, args }) {
        const levels = parseInt(args[0]) || 0;

        await users.findByIdAndUpdate(message.author.id, {
            $inc: {
                level: levels,
            },
        });

        return message.channel.send(`Added ${levels} level${levels !== 1 ? "s" : ""} for you!`);
    },
} as Command;
