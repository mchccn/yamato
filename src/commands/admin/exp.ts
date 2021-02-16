import { Command } from "@aeroware/aeroclient/dist/types";
import addExp from "../../utils/leveling";

export default {
    name: "exp",
    args: true,
    usage: "<exp>",
    category: "admin",
    hidden: true,
    staffOnly: true,
    async callback({ message, args, client }) {
        const exp = parseInt(args[0]) || 0;

        await addExp(message.author.id, exp, client);

        return message.channel.send(`Added ${exp} exp to you!`);
    },
} as Command;
