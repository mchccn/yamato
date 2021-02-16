import { AeroEmbed } from "@aeroware/aeroclient";
import { Command } from "@aeroware/aeroclient/dist/types";
import ships from "../../database/models/ship";
import weapons from "../../database/models/weapon";

export default {
    name: "info",
    aliases: ["lookup", "view"],
    args: true,
    usage: "<weapon/ship>",
    description: "View a weapon or ship.",
    details: "Displays more details on a specific item.",
    category: "admin",
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
            message.channel.send(`Item not found.`);
            return "invalid";
        }

        if (item instanceof weapons) {
            return message.channel.send(
                new AeroEmbed()
                    .setTitle(item.name)
                    .setDescription(item.description)
                    .twoByTwo([
                        [
                            {
                                name: "Damage",
                                value: item.damage,
                            },
                            {
                                name: "Type",
                                value: item.type.toLowerCase(),
                            },
                        ],
                        [
                            {
                                name: "Effect",
                                value: item.effect.toLowerCase(),
                            },
                            {
                                name: "Cost",
                                value: item.cost,
                            },
                        ],
                    ])
                    .twoByTwo([
                        [
                            {
                                name: "Deviation",
                                value: item.deviation,
                            },
                            {
                                name: "Max level",
                                value: item.maxLevel,
                            },
                        ],
                        [
                            {
                                name: "Level Required",
                                value: item.levelRequired,
                            },
                            {
                                name: "Crit chance",
                                value: item.critChance.toFixed(2) + "%",
                            },
                        ],
                    ])
                    .setColor("RANDOM")
            );
        } else {
            return message.channel.send(
                new AeroEmbed()
                    .setTitle(item.name)
                    .setDescription(item.description)
                    .twoByTwo([
                        [
                            {
                                name: "Health",
                                value: item.health,
                            },
                            {
                                name: "Class",
                                value: item.class.toLowerCase(),
                            },
                        ],
                        [
                            {
                                name: "Speed",
                                value: `${item.speed} knots`,
                            },
                            {
                                name: "Cost",
                                value: `${item.cost} coins`,
                            },
                        ],
                    ])
                    .addField("Max level", item.maxLevel, true)
                    .addField("Level Required", item.levelRequired, true)
                    .addField(
                        "Weapon slots",
                        `Heavies: ${item.weapons.heavySlots}\nMediums: ${item.weapons.mediumSlots}\nLights: ${item.weapons.lightSlots}`
                    )
                    .setColor("RANDOM")
            );
        }
    },
} as Command;
