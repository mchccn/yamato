import AeroClient from "@aeroware/aeroclient";
import { config as dotenv } from "dotenv";
import connect from "./database/connect";
import users from "./database/models/user";
import addExp from "./utils/leveling";

dotenv();

(async () => {
    try {
        await connect();
        await import("./database/weapons");
        await import("./database/ships");

        const expBuffer = new Map<string, boolean>();

        const client = new AeroClient({
            token: process.env.TOKEN,
            prefix: ".",
            allowSpaces: true,
            commandsPath: "commands",
            staff: ["508442553754845184", "564930157371195437"],
            disableStaffCooldowns: true,
            logging: true,
        });

        client.on("ready", async () => {
            await client.user?.setActivity({
                type: "PLAYING",
                name: "battleship",
            });

            process.stdout.write("> ");

            process.stdin.on("data", (data: Buffer) => {
                try {
                    console.log(eval(data.toString("utf8")));
                } catch (e) {
                    console.log(e);
                } finally {
                    process.stdout.write("> ");
                }
            });
        });

        client.use(async ({ message, command }, next, stop) => {
            const user = await users.findById(message.author.id);

            if (!user)
                await users.create({
                    _id: message.author.id,
                });
            else {
                if (user.banned && !client.clientOptions.staff?.includes(user._id))
                    return stop();

                if (!expBuffer.get(message.author.id)) {
                    expBuffer.set(message.author.id, true);
                    addExp(
                        message.author.id,
                        command && command.cooldown ? Math.max(command.cooldown, 60) : 1,
                        client
                    );
                    setTimeout(() => expBuffer.delete(message.author.id), 60000);
                }
            }

            return next();
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
