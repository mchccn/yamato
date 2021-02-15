import { utils } from "@aeroware/aeroclient";
import { Command } from "@aeroware/aeroclient/dist/types";
import users, { IPureUser } from "../../database/models/user";

export default {
    name: "ocean",
    usage: "[ocean]",
    description: "See the world.",
    details: "Travel between different oceans.",
    category: "utility",
    cooldown: 60,
    async callback({ message, args }) {
        const user = (await users.findById(message.author.id))!;

        if (!args.length)
            return message.channel.send(
                `You are currently in the ${utils.formatMacroCase(user.ocean)} ocean!`
            );

        if (
            ![
                "NORTH_PACIFIC",
                "SOUTH_PACIFIC",
                "NORTH_ATLANTIC",
                "SOUTH_ATLANTIC",
                "INDIAN",
                "ARCTIC",
            ].includes(args[0].toUpperCase())
        ) {
            message.channel.send(`That's not an ocean.`);
            return "invalid";
        }

        user.ocean = args[0].toUpperCase() as IPureUser["ocean"];

        await user.save();

        return message.channel.send(
            `You are now at the ${utils.formatMacroCase(user.ocean)} ocean!`
        );
    },
} as Command;
