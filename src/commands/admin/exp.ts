import { Command } from "@aeroware/aeroclient/dist/types";
import users from "../../database/models/user";

export default {
    name: "exp",
    args: true,
    usage: "<exp>",
    category: "admin",
    hidden: true,
    staffOnly: true,
    async callback({ message, args }) {
        const exp = parseInt(args[0]) || 0;

        await users.findByIdAndUpdate(message.author.id, {
            $inc: {
                exp,
            },
        });

        return message.channel.send(`Added ${exp} exp to you!`);
    },
} as Command;
