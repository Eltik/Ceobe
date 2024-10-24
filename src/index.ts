import dotenv from "dotenv";
dotenv.config();

import { init as initLib } from "./lib";
import { init as initDatabase } from "./database";
import { init as initDiscord } from "./discord";

import { listener } from "./events/impl/listener";

(async () => {
    await listener();

    await initLib();
    await initDatabase();
    await initDiscord();
})();
