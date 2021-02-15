import { Command } from "@aeroware/aeroclient/dist/types";
import { IPureWeapon } from "../../database/models/weapon";
import Embed from "../../utils/Embed";

const effects: Record<IPureWeapon["effect"], string> = {
    CRYO:
        "The cryo effect freezes your ship, reducing its speed by 20% and making it take 20% more damage from incoming projectiles.",
    PYRO: "This burns your ship and deals damage over time. Pyro effects are able to stack.",
    KINETIC: "Kinetic weapons do 20% more damage to flagships, submarines, and frigates.",
    TOXIC: "Toxic weapons deal massive damage over time but it can affect your ships as well.",
    CORROSION: "Corrosion eats away slowly at your ship until it sinks.",
    SUPRESSION:
        "The supression effect supresses your ship's firepower, making your ship deal 20% less damage.",
    NONE: "No effect on your ships.",
};

export default {
    name: "effects",
    args: false,
    usage: "[effect]",
    description: "View all effects.",
    details: "Each effect does something different.",
    category: "utility",
    cooldown: 2.5,
    async callback({ message, args }) {
        if (!args.length)
            return message.channel.send(
                new Embed().setTitle("All effects").setColor("RANDOM").setDescription(`
Effects can last for a couple of turns, but after an effect wears off, 
the targeted ship gains immunity to the effect for a while.

**Cryogenic Freeze** – CRYO

**Pyrotechnic Meltdown** – PYRO

**Kinetic destruction** – KINETIC

**Toxic fumes** – TOXIC

**Corrosive substances** – CORROSION

**System Supression** – SUPRESSION

**No effect** – NONE`)
            );

        const effect = args[0].toUpperCase();

        if (
            !["CRYO", "PYRO", "KINETIC", "TOXIC", "CORROSION", "SUPRESSION", "NONE"].includes(
                effect
            )
        ) {
            message.channel.send(`That's not an effect.`);
            return "invalid";
        }

        return message.channel.send(
            new Embed()
                .setTitle(args[0])
                .setDescription(effects[effect as IPureWeapon["effect"]])
        );
    },
} as Command;
