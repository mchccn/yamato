import { Command } from "@aeroware/aeroclient/dist/types";
import users from "../../database/models/user";

export default {
    name: "coins",
    args: true,
    usage: "<coins>",
    category: "admin",
    hidden: true,
    staffOnly: true,
    async callback({ message, args }) {
        const coins = parseInt(args[0]) || 0;

        await users.findByIdAndUpdate(message.author.id, {
            $inc: {
                coins,
            },
        });

        return message.channel.send(`Added ${coins} coin${coins !== 1 ? "s" : ""} to you!`);
    },
} as Command;
