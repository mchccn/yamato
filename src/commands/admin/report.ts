import { Command } from "@aeroware/aeroclient/dist/types";

export default {
    name: "report",
    args: true,
    usage: "<id> <reason>",
    description: "Report a user for a reason.",
    details: "Notifies staff when someone is being naughty.",
    category: "admin",
    cooldown: 60,
    async callback({ message, args, client }) {
        if (!args[1]) {
            message.channel.send(`Please provide a reason.`);
            return "invalid";
        }

        const reason = args.slice(1).join(" ");

        const staff = client.clientOptions.staff!;

        for (const id of staff) {
            const user = await client.users.fetch(id);

            await user.createDM();

            await user.send(`User ${id} was reported for \`${reason}\`.`);
        }

        return message.channel.send(`User has been reported to staff! Thank you.`);
    },
} as Command;
