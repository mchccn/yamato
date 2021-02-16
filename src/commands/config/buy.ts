import { Command } from "@aeroware/aeroclient/dist/types";
import { MessageReaction, User } from "discord.js";
import ships from "../../database/models/ship";
import users from "../../database/models/user";
import weapons from "../../database/models/weapon";

export default {
    name: "buy",
    aliases: ["purchase", "acquire", "get"],
    args: true,
    usage: "<weapon/ship>",
    description: "Buy a weapon or ship.",
    details: "Asks you to confirm your purchase.",
    category: "config",
    cooldown: 5,
    async callback({ message, args }) {
        const item =
            (await weapons.findOne({
                name: args[0],
            })) ||
            (await ships.findOne({
                name: args[0],
            }));

        if (!item) {
            message.channel.send(`No item found.`);
            return "invalid";
        }

        const user = (await users.findById(message.author.id))!;

        const { cost } = item;

        if (user.coins < cost) {
            message.channel.send(
                `You don't have enough coins! **${args[0]}** costs **${cost}** coins.`
            );
            return "invalid";
        }

        if (item instanceof weapons) {
            if (user.weapons.length >= 64) {
                message.channel.send(`You don't have enough space in your inventory!`);
                return "invalid";
            }
        } else {
            if (user.ships.length >= 16) {
                message.channel.send(`You don't have enough space in your inventory!`);
                return "invalid";
            }
        }

        const confirm = await message.channel.send(
            `Are you sure you want to purchase **${args[0]}** for **${cost}** coins?`
        );

        await confirm.react("❌");
        await confirm.react("✅");

        const choice = (
            await confirm.awaitReactions(
                (r: MessageReaction, u: User) =>
                    u.id === message.author.id && ["❌", "✅"].includes(r.emoji.name),
                {
                    max: 1,
                    time: 10000,
                }
            )
        ).first()?.emoji.name;

        if (!choice) return;

        if (choice === "❌") {
            message.channel.send(`Purchase canceled.`);
            return "invalid";
        }

        user.coins -= cost;

        if (item instanceof weapons) {
            user.weapons.push(item);
        } else {
            user.ships.push(item);
        }

        await user.save();

        return message.channel.send(
            `You purchased a new **${args[0]}** for **${cost}** coins!`
        );
    },
} as Command;
