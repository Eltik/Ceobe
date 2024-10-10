import { client } from "../..";
import { readdirSync } from "node:fs";
import { join } from "node:path";

export const registerEvents = async () => {
    const events = readdirSync(join(import.meta.dir, "../events")).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of events) {
        const event = await import(`../../events/${file}`);

        if (event.default.once) {
            client.once(event.default.name, (...args) => event.default.execute(client, ...args));
            continue;
        }

        client.on(event.default.name, (...args) => event.default.execute(client, ...args));
    }
};
