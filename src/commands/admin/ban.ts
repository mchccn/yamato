import { Command } from "@aeroware/aeroclient/dist/types";
import users from "../../database/models/user";

export default {
    name: "ban",
    args: true,
    usage: "<ids>",
    category: "admin",
    hidden: true,
    staffOnly: true,
    async callback({ message, args }) {
        for (const arg of args) {
            const user = await users.findById(arg);

            if (user) {
                user.banned = true;
                await user.save();
            }
        }

        return message.react("👌");
    },
} as Command;
