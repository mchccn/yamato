import { AeroEmbed, utils } from "@aeroware/aeroclient";
import { Command } from "@aeroware/aeroclient/dist/types";
import users from "../../database/models/user";

export default {
    name: "bans",
    category: "admin",
    hidden: true,
    staffOnly: true,
    async callback({ message, args }) {
        const all = await users.find({
            banned: true,
        });

        const fields = utils.chunk(all, 10);

        const pages = fields.map((f, i) =>
            new AeroEmbed()
                .setTitle(`All banned users`)
                .setDescription(f.map((u) => u._id).join("\n"))
                .setFooter(`page ${i + 1} out of ${fields.length}`)
        );

        return utils.paginate(message, pages, {
            fastForwardAndRewind: {
                time: 10000,
            },
            goTo: {
                time: 10000,
            },
            time: 120000,
        });
    },
} as Command;
