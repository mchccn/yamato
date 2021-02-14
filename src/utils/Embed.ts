import { TipEmbed } from "@aeroware/aeroclient";

export default TipEmbed(["placeholder"], {
    easterEggs: {
        chance: 0.1,
        eggs: ["no u", "whassup fuckers", "never gonna give you up", "baby yoda"],
    },
    timestamps: true,
});
