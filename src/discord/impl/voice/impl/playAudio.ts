import { createAudioPlayer, createAudioResource } from "@discordjs/voice";
import type { VoiceConnection } from "@discordjs/voice";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { join } from "node:path";
import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import { CharacterWords } from "../../../../types/impl/lib/impl/voices";

export const playAudio = async (voice: CharacterWords, connection: VoiceConnection): Promise<void> => {
    // Download the audio file and play it in the voice channel
    try {
        const response = await fetch(voice.voiceURL!);

        if (!response.ok) {
            throw new Error(`Failed to download file from ${voice.voiceURL}: ${response.statusText}`);
        }

        const path = join(import.meta.dir, `./voices/${voice.language}/${voice.charWordId}.mp3`);

        if (!existsSync(join(import.meta.dir, `./voices/${voice.language}`))) {
            mkdirSync(join(import.meta.dir, `./voices/${voice.language}`), { recursive: true });
        }

        if (!existsSync(path)) {
            const pipelineAsync = promisify(pipeline);

            const writer = createWriteStream(path) as NodeJS.WritableStream;

            const finishPromise = new Promise<void>((resolve, reject) => {
                writer.on("finish", () => resolve());
                writer.on("error", (err) => reject(err));
            });

            await pipelineAsync(response.body!, writer);

            await finishPromise;
        }

        const player = createAudioPlayer();
        const resource = createAudioResource(path);

        player.play(resource);
        connection.subscribe(player);
    } catch {
        throw new Error(`Failed to download file from ${voice.voiceURL}.`);
    }
};
