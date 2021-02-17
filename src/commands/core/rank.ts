import { Command } from "@aeroware/aeroclient/dist/types";
import { MessageReaction, User } from "discord.js";
import users from "../../database/models/user";

export default {
    name: "rank",
    description: "Rank up to get a small bonus!",
    details: "You must be in the Supreme League and at least level 100 to rank up.",
    category: "core",
    cooldown: 5,
    async callback({ message }) {
        const user = (await users.findById(message.author.id))!;

        if (user.league !== "SUPREME" || user.level < 100) {
            message.channel.send(
                `Sorry, you need to be in the Supreme League and at least level 100 to rank up.`
            );
            return "invalid";
        }

        const confirm = await message.channel.send(
            `Are you sure you want to rank up? You will lose all your progress but you will get a bonus!`
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
            message.channel.send(`Rank up canceled.`);
            return "invalid";
        }

        const confirm2 = await message.channel.send(
            `Are you *really* sure you want to rank up? You don't have to, you know?`
        );

        await confirm2.react("❌");
        await confirm2.react("✅");

        const choice2 = (
            await confirm.awaitReactions(
                (r: MessageReaction, u: User) =>
                    u.id === message.author.id && ["❌", "✅"].includes(r.emoji.name),
                {
                    max: 1,
                    time: 10000,
                }
            )
        ).first()?.emoji.name;

        if (!choice2) return;

        if (choice2 === "❌") {
            message.channel.send(`Rank up canceled.`);
            return "invalid";
        }

        const confirm3 = await message.channel.send(
            `Are you really *really* **really** sure that you want to lose your hard work just to gain a little boost?`
        );

        await confirm3.react("❌");
        await confirm3.react("✅");

        const choice3 = (
            await confirm.awaitReactions(
                (r: MessageReaction, u: User) =>
                    u.id === message.author.id && ["❌", "✅"].includes(r.emoji.name),
                {
                    max: 1,
                    time: 10000,
                }
            )
        ).first()?.emoji.name;

        if (!choice3) return;

        if (choice3 === "❌") {
            message.channel.send(`Rank up canceled.`);
            return "invalid";
        }

        user.level = 0;
        user.exp = 0;
        user.coins = 0;
        user.weapons = [];
        user.ships = [];
        user.shipSlots = 1;
        user.fleet = [];
        user.wins = 0;
        user.battles = 0;
        user.log = [];
        user.trophies = 0;
        user.league = "BRONZE";
        user.ocean = "NORTH_PACIFIC";

        user.rank++;

        await user.save();

        return message.channel.send(
            `You have ranked up to rank **${user.rank}**! Don't blame me if you lost everything. I warned you...`
        );
    },
} as Command;
