import emitter, { Events } from "../../../events";
import type { Event } from "../../../types/impl/discord";

export default {
    name: "ready",
    execute: async () => {
        await emitter.emit(Events.DISCORD_READY);
    },
} as Event;
