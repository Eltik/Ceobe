import { createAudioPlayer, createAudioResource } from "@discordjs/voice";
import type { VoiceConnection } from "@discordjs/voice";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { join } from "node:path";
import { createWriteStream } from "node:fs";

export const playAudio = async (url: string, connection: VoiceConnection): Promise<void> => {
    // Download the audio file and play it in the voice channel
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to download file from ${url}: ${response.statusText}`);
        }

        const pipelineAsync = promisify(pipeline);

        const writer = createWriteStream(join(import.meta.dir, "./audio.mp3")) as NodeJS.WritableStream;

        const finishPromise = new Promise<void>((resolve, reject) => {
            writer.on("finish", () => resolve());
            writer.on("error", (err) => reject(err));
        });

        await pipelineAsync(response.body!, writer);

        await finishPromise;

        const player = createAudioPlayer();
        const resource = createAudioResource(join(import.meta.dir, `./audio.mp3`));

        player.play(resource);
        connection.subscribe(player);
    } catch {
        throw new Error(`Failed to download file from ${url}.`);
    }
};
