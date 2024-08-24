import { VoiceState } from "discord.js";

export default {
    name: "voiceStateUpdate",
    once: false,
    execute: async (oldState: VoiceState, newState: VoiceState) => {
        if (!oldState.channelId && newState.channelId) {
            //const memberId = oldState.member?.id;
        } else if (oldState.channelId && !newState.channelId) {
            //const memberId = oldState.member?.id;
        }
    },
};
