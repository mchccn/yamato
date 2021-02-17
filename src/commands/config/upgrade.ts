import { AeroEmbed, utils } from "@aeroware/aeroclient";
import { Command } from "@aeroware/aeroclient/dist/types";
import { MessageReaction, User } from "discord.js";
import ships, { IShip } from "../../database/models/ship";
import users from "../../database/models/user";
import weapons, { IWeapon } from "../../database/models/weapon";
import { calculateMaxHealth, calculateUpgradeCost } from "../../utils/calculate";

export default {
    name: "upgrade",
    args: true,
    usage: "<weapon/ship>",
    description: "Upgrade one of your items.",
    details: "Upgrading costs money and time!",
    category: "config",
    cooldown: 60,
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

        if (!items.length) {
            message.channel.send(`You don't have that item!`);
            return "invalid";
        }

        let item: IWeapon | IShip;

        if (items.length > 1) {
            await message.channel.send(
                `It seems that you have multiple items. Which one do you want to upgrade?`,
                new AeroEmbed()
                    .setColor("RANDOM")
                    .setTitle(`Pick a number:`)
                    .setDescription(
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

        const cost = calculateUpgradeCost(item);

        if (user.coins < cost) {
            message.channel.send(
                `You don't have enough coins! Upgrading a **level ${item.level} ${args[0]}** costs **${cost}** coins.`
            );
            return "invalid";
        }

        const confirm = await message.channel.send(
            `Are you sure you want to upgrade a **level ${item.level} ${item.name}** for **${cost}** coins?`
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
            message.channel.send(`Upgrade canceled.`);
            return "invalid";
        }

        if (ref instanceof weapons) {
            const weapon = user.weapons.find((w) => w._id === item._id)!;

            if (weapon.level !== weapon.maxLevel) {
                weapon.level++;

                user.coins -= cost;
                await user.save();

                return message.channel.send(
                    `You upgraded your **level ${weapon.level - 1} ${
                        weapon.name
                    }** to level **${weapon.level}**!`
                );
            } else return message.channel.send(`That weapon is at max level!`);
        } else {
            const ship = user.ships.find((s) => s._id === item._id)!;

            if (ship.level !== ship.maxLevel) {
                ship.level++;

                ship.maxHealth = ship.health = calculateMaxHealth(ship);

                user.coins -= cost;
                await user.save();

                return message.channel.send(
                    `You upgraded your **level ${ship.level - 1} ${ship.name}** to level **${
                        ship.level
                    }**!`
                );
            } else return message.channel.send(`That ship is at max level!`);
        }
    },
} as Command;
