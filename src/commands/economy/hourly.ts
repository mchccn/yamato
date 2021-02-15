import { Command } from "@aeroware/aeroclient/dist/types";
import users from "../../database/models/user";
import { YAMATO_COIN } from "../../utils/emoji";

export default {
    name: "hourly",
    aliases: ["income", "hour", "salary"],
    description: "Your hourly income.",
    details: "Gives you your hourly income, which is based on your trophy count.",
    category: "economy",
    cooldown: 3600,
    async callback({ message }) {
        const user = (await users.findById(message.author.id))!;

        const coins = Math.max(user.trophies + Math.floor(Math.random() * 10 - 5), 0);

        return message.channel.send(
            `${YAMATO_COIN} You received ${coins} coin${coins !== 1 ? "s" : ""}!`
        );
    },
} as Command;
