import { utils } from "@aeroware/aeroclient";
import { Command } from "@aeroware/aeroclient/dist/types";
import users from "../../database/models/user";
import Embed from "../../utils/Embed";
import { expNeeded } from "../../utils/leveling";

export default {
    name: "profile",
    aliases: ["p", "about", "bio"],
    args: false,
    usage: "[user]",
    description: "View your profile and stats.",
    details: "Displays a user's profile if a user is supplied.",
    category: "utility",
    cooldown: 2.5,
    async callback({ message, args, client }) {
        if (args[0] && !/\d{18}/.test(args[0])) {
            message.channel.send(`That's not a valid user.`);
            return "invalid";
        }

        const user = await users.findById(args[0] || message.author.id);

        if (!user) {
            message.channel.send(`User could not be found!`);
            return "invalid";
        }

        const apiUser = await client.users.fetch(user._id);

        return message.channel.send(
            new Embed()
                .setTitle(apiUser.username)
                .addField(
                    `${utils.formatMacroCase(user.league)} league`,
                    `**${user.trophies} trophies**
${((user.wins / user.battles || 0) * 100).toFixed(2)}% win rate | ${user.battles} battles`
                )
                .addField(
                    `${user.coins} coins`,
                    `**Level ${user.level}**\n${user.exp} exp earned\n${`\`\`\`${"█"
                        .repeat((user.exp / expNeeded(user.level)) * 25)
                        .padEnd(25, " ")}\`\`\``}`
                )
                .setThumbnail(apiUser.displayAvatarURL({ dynamic: true }))
                .setColor("RANDOM")
        );
    },
} as Command;
