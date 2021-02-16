import { Command } from "@aeroware/aeroclient/dist/types";
import users from "../../database/models/user";
import { YAMATO_COIN } from "../../utils/emoji";

export default {
    name: "gimme",
    aliases: ["pls", "coins", "give"],
    description: "Gives you some coins.",
    details: "Scream at the bot to get even more money.",
    category: "economy",
    cooldown: 3600,
    async callback({ message, args, client }) {
        const user = (await users.findById(message.author.id))!;

        const coins =
            Math.max(
                args.filter((a) => a.toUpperCase() === a).length +
                    Math.floor(Math.random() * 5) +
                    5,
                25 + Math.floor(Math.random() * 5)
            ) *
            (user.level + 1);

        user.coins += coins;

        await user.save();

        return message.channel.send(`${YAMATO_COIN} You earned ${coins} coins!`);
    },
} as Command;
