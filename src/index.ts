import AeroClient from "@aeroware/aeroclient";
import { config as dotenv } from "dotenv";
import connect from "./database/connect";

dotenv();

(async () => {
    try {
        await connect();

        const client = new AeroClient({
            token: process.env.TOKEN,
            prefix: ".",
            allowSpaces: true,
            commandsPath: "commands",
            staff: ["508442553754845184"],
            disableStaffCooldowns: true,
            logging: true,
        });

        client.on("ready", async () => {
            client.user?.setActivity({
                type: "PLAYING",
                name: "battleship",
            });
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
