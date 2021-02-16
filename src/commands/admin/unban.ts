import { Command } from "@aeroware/aeroclient/dist/types";
import users from "../../database/models/user";

export default {
    name: "unban",
    args: true,
    usage: "<ids>",
    category: "admin",
    hidden: true,
    staffOnly: true,
    async callback({ message, args }) {
        for (const arg of args) {
            const user = await users.findById(arg);

            if (user) {
                user.banned = false;
                await user.save();
            }
        }

        return message.react("👌");
    },
} as Command;
