import { AeroEmbed, utils } from "@aeroware/aeroclient";
import { Command } from "@aeroware/aeroclient/dist/types";
import ships from "../../database/models/ship";
import users from "../../database/models/user";
import weapons from "../../database/models/weapon";

export default {
    name: "shop",
    //TODO: ADD COMMAND METADATA
    args: true,
    usage: "[weapons/ships/extras]",
    async callback({ message, args }) {
        const user = (await users.findById(message.author.id))!;

        const color = Math.floor(Math.random() * 16777215).toString(16);

        switch (args[0]) {
            case "weapons":
                return utils.paginate(
                    message,
                    (await weapons.find())
                        .filter((w) => w.levelRequired <= user.level)
                        .sort((a, b) =>
                            a.levelRequired === b.levelRequired
                                ? a.type === b.type
                                    ? a.cost - b.cost
                                    : a.type === "MEDIUM"
                                    ? b.type === "HEAVY"
                                        ? -1
                                        : b.type === "MEDIUM"
                                        ? 0
                                        : 1
                                    : a.type.length - b.type.length
                                : a.levelRequired - b.levelRequired
                        )
                        .map((w) =>
                            new AeroEmbed()
                                .setTitle(w.name)
                                .setDescription(w.description || "No description")
                                .twoByTwo([
                                    [
                                        {
                                            name: "Damage",
                                            value: w.damage,
                                        },
                                        {
                                            name: "Type",
                                            value: w.type.toLowerCase(),
                                        },
                                    ],
                                    [
                                        {
                                            name: "Effect",
                                            value: w.effect.toLowerCase(),
                                        },
                                        {
                                            name: "Cost",
                                            value: w.cost,
                                        },
                                    ],
                                ])
                                .setColor(color)
                        )
                );
            case "ships":
                return utils.paginate(
                    message,
                    (await ships.find())
                        .filter((s) => s.levelRequired <= user.level)
                        .sort((a, b) => a.levelRequired - b.levelRequired)
                        .map((s) =>
                            new AeroEmbed()
                                .setTitle(s.name)
                                .setDescription(s.description)
                                .twoByTwo([
                                    [
                                        {
                                            name: "Health",
                                            value: s.health,
                                        },
                                        {
                                            name: "Class",
                                            value: s.class.toLowerCase(),
                                        },
                                    ],
                                    [
                                        {
                                            name: "Speed",
                                            value: `${s.speed} knots`,
                                        },
                                        {
                                            name: "Cost",
                                            value: `${s.cost} coins`,
                                        },
                                    ],
                                ])
                                .addField(
                                    "Weapon slots",
                                    `Heavies: ${s.weapons.heavySlots}\nMediums: ${s.weapons.mediumSlots}\nLights: ${s.weapons.lightSlots}`
                                )
                                .setColor(color)
                        )
                );
            case "extras":
            default:
                return message.channel.send(
                    `You can only view \`weapons\`, \`ships\`, and \`extras\`.`
                );
        }
    },
} as Command;
