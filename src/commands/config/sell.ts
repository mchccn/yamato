import { AeroEmbed, utils } from "@aeroware/aeroclient";
import { Command } from "@aeroware/aeroclient/dist/types";
import { MessageReaction, User } from "discord.js";
import ships, { IShip } from "../../database/models/ship";
import users from "../../database/models/user";
import weapons, { IWeapon } from "../../database/models/weapon";

export default {
    name: "sell",
    aliases: ["pawn", "put", "refund"],
    args: true,
    usage: "<weapon/ship>",
    description: "Sell a weapon or ship.",
    details: "Asks you to confirm your refund.",
    category: "config",
    cooldown: 5,
    async callback({ message, args }) {
        const user = (await users.findById(message.author.id))!;

        const ref =
            (await weapons.findOne({
                name: args[0],
            })) ||
            (await ships.findOne({
                name: args[0],
            }));

        if (!ref) {
            message.channel.send(`That item doesn't exist.`);
            return "invalid";
        }

        const items: (IWeapon | IShip)[] = [];

        if (ref instanceof weapons) {
            const w = user.weapons.filter((w) => w.name === ref.name);

            if (w.length) items.push(...w);
        } else {
            const s = user.ships.filter((w) => w.name === ref.name);

            if (s.length) items.push(...s);
        }

        let item: IWeapon | IShip;

        if (items.length > 1) {
            await message.channel.send(
                `It seems that you have multiple items. Which one do you want to sell?`,
                new AeroEmbed().setColor("RANDOM").setDescription(
                    items
                        .sort((a, b) => a.level - b.level)
                        .map((i, idx) => `${idx + 1} – lvl ${i.level} ${i.name}`)
                        .join("\n")
                )
            );

            const index = await utils.getReply(message, {
                time: 12000,
                regex: /^\d+$/,
            });

            if (!index) return "invalid";

            if (!items[parseInt(index.content) - 1]) {
                message.channel.send(`That wasn't a valid index.`);
                return "invalid";
            }

            item = items[parseInt(index.content) - 1];
        } else item = items[0];

        const refund = Math.round(item.cost / 3 + item.level);

        const confirm = await message.channel.send(
            `Are you sure you want to refund a **level ${item.level} ${item.name}** for **${refund}** coins?`
        );

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

        if (choice === "❌") {
            message.channel.send(`Refund canceled.`);
            return "invalid";
        }

        user.coins += refund;

        if (ref instanceof weapons) {
            user.weapons = user.weapons.filter((w) => w._id !== item._id);
        } else {
            user.ships = user.ships.filter((w) => w._id !== item._id);
        }

        return message.channel.send(
            `You sold a **level ${item.level} ${item.name}** and got **${refund}** coins back!`
        );
    },
} as Command;
