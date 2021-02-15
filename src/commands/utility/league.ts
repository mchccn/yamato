import { utils } from "@aeroware/aeroclient";
import { Command } from "@aeroware/aeroclient/dist/types";
import users from "../../database/models/user";
import Embed from "../../utils/Embed";
import { leagues } from "../../utils/trophies";

export default {
    name: "league",
    description: "View your league info.",
    details: "Shows current league details.",
    category: "utility",
    cooldown: 10,
    async callback({ message, client }) {
        const user = (await users.findById(message.author.id))!;

        const size = 10;

        return utils.paginate(
            message,
            [
                new Embed().setTitle(utils.formatMacroCase(user.league) + " league")
                    .setDescription(`You have **${user.trophies}** trophies!
${
    user.league === "SUPREME"
        ? `You are in the highest league!`
        : `Next league at ${leagues[user.league]} trophies`
}`),
                ...(
                    await Promise.all(
                        utils
                            .chunk(
                                (await users.find())
                                    .filter((u) => u.league === user.league)
                                    .sort((a, b) => b.trophies - a.trophies),
                                size
                            )
                            .map((users) =>
                                Promise.all(users.map((u) => client.users.fetch(u._id)))
                            )
                    )
                )
                    .map((users, i) =>
                        users
                            .map(
                                (u, j) =>
                                    `${j + i * size + 1} – **${u.tag}**${
                                        u.id === user._id ? " (you)" : ""
                                    }`
                            )
                            .join("\n")
                    )
                    .map((d) => new Embed().setTitle(`Users in your league`).setDescription(d)),
            ],
            {
                fastForwardAndRewind: {
                    time: 10000,
                },
                goTo: {
                    time: 10000,
                },
                time: 120000,
            }
        );
    },
} as Command;
