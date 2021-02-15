import { Command } from "@aeroware/aeroclient/dist/types";
import users from "../../database/models/user";

export default {
    name: "delete",
    args: true,
    usage: "<id>",
    category: "admin",
    hidden: true,
    async callback({ message, args }) {
        for (const arg of args) {
            const user = await users.findById(arg);

            if (user) await user.delete();
        }

        return message.react("👌");
    },
} as Command;
