import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Interaction } from "discord.js";
import type { Command } from "../../../types/impl/discord";
import { getByDiscordId as getUser } from "../../../database/impl/tables/users/impl/get";
import { colors } from "../..";
import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import type { SKRSContext2D } from "@napi-rs/canvas";
import { ACESHIP_REPOSITORY } from "../../../lib/impl/operators";
import { get as getOperator } from "../../../lib/impl/operators/impl/get";
import { getExperienceForNextLevel } from "../../../lib/impl/leveling";
import { OperatorRarity } from "../../../types/impl/lib/impl/operators";
import { join } from "node:path";
import { exists, mkdir } from "node:fs/promises";

export default {
    data: new SlashCommandBuilder()
        .setName("get-user")
        .setDescription("Get's an users experience and level.")
        .addUserOption((option) => option.setName("target").setDescription("The user to get the experience and level of.")),
    execute: async (interaction: Interaction) => {
        if (!interaction.isCommand()) return;

        const user = interaction.options.get("target")?.user ?? interaction.user;

        const data = await getUser({
            user_id: user.id,
        });

        if (!data) {
            const embed = new EmbedBuilder().setDescription("User not found.").setColor(colors.errorColor);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {
            const wrapText = (ctx: SKRSContext2D, text: string, maxWidth: number) => {
                const words = text.split(" ");
                let line = "";
                const lines = [];

                words.forEach((word) => {
                    const testLine = line + word + " ";
                    const { width } = ctx.measureText(testLine);
                    if (width > maxWidth) {
                        lines.push(line);
                        line = word + " ";
                    } else {
                        line = testLine;
                    }
                });

                lines.push(line.trim());
                return lines;
            };

            GlobalFonts.registerFromPath(join(import.meta.dir, "./fonts/Roboto.ttf"), "Roboto");

            // Create canvas and set dimensions
            const canvas = createCanvas(800, 400);
            const ctx = canvas.getContext("2d");

            // Background
            ctx.fillStyle = "#1e1e1e";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const backgroundImage = await loadImage(`https://raw.githubusercontent.com/${ACESHIP_REPOSITORY}/main/avg/backgrounds/21_G1_interrogat_room.png`);
            ctx.globalAlpha = 0.5;
            ctx.filter = "blur(10px)";
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1.0;
            ctx.filter = "none";

            // Draw user avatar
            const avatar = await loadImage(user.displayAvatarURL({ extension: "png" }));
            ctx.save();
            ctx.beginPath();
            ctx.arc(100, 100, 80, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, 20, 20, 160, 160);
            ctx.restore();

            // Username and Level
            ctx.font = "bold 30px Roboto";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(`${user.username}`, 210, 70);

            ctx.font = "20px Roboto";
            ctx.fillStyle = "#bbbbbb";
            ctx.fillText(`Level: ${data.level}`, 210, 110);

            const experienceNeeded = getExperienceForNextLevel(data.level);
            const experienceProgress = data.exp / experienceNeeded;
            const startAngle = -Math.PI / 2; // Start at the top
            const endAngle = startAngle + Math.PI * 2 * experienceProgress;

            // Draw background circle
            ctx.lineWidth = 15;
            ctx.strokeStyle = "#555";
            ctx.beginPath();
            ctx.arc(100, 100, 85, 0, Math.PI * 2);
            ctx.stroke();

            // Draw progress circle
            ctx.strokeStyle = "#00FF00"; // Or use a color matching your theme
            ctx.beginPath();
            ctx.arc(100, 100, 85, startAngle, endAngle);
            ctx.stroke();

            // Favorite Operators
            ctx.font = "bold 25px Roboto";
            ctx.fillStyle = "#ffffff";
            ctx.fillText("Favorite Operators:", 210, 160);

            ctx.font = "20px Roboto";
            ctx.fillStyle = "#bbbbbb";
            const operator = await getOperator(data.favorites?.operator);
            const operatorsText = operator ? operator.name : "No favorite operator.";
            wrapText(ctx, operatorsText, 580).forEach((line, index) => {
                ctx.fillText(line, 210, 190 + index * 30);
            });

            try {
                if (operator) {
                    const skinImage =
                        operator?.rarity === OperatorRarity.oneStar || operator?.rarity === OperatorRarity.twoStar || operator?.rarity === OperatorRarity.threeStar
                            ? `https://raw.githubusercontent.com/${ACESHIP_REPOSITORY}/main/characters/${encodeURIComponent(operator?.id?.replaceAll("#", "_") ?? "")}_1.png`
                            : `https://raw.githubusercontent.com/${ACESHIP_REPOSITORY}/main/characters/${encodeURIComponent(operator?.id?.replaceAll("#", "_") ?? "")}_2.png`;

                    const skin = await loadImage(skinImage);
                    const skinHeight = canvas.height * 0.8;
                    const skinWidth = (skin.width / skin.height) * skinHeight;

                    // Draw the skin image on the right side of the canvas
                    ctx.drawImage(skin, canvas.width - skinWidth - 10, (canvas.height - skinHeight) / 2, skinWidth, skinHeight);
                }
            } catch {
                console.log(
                    `Unable to load skin image ` + operator?.rarity === OperatorRarity.oneStar || operator?.rarity === OperatorRarity.twoStar || operator?.rarity === OperatorRarity.threeStar
                        ? `https://raw.githubusercontent.com/${ACESHIP_REPOSITORY}/main/characters/${encodeURIComponent(operator?.id?.replaceAll("#", "_") ?? "")}_1.png`
                        : `https://raw.githubusercontent.com/${ACESHIP_REPOSITORY}/main/characters/${encodeURIComponent(operator?.id?.replaceAll("#", "_") ?? "")}_2.png` + ` for operator ` + operator?.id,
                );
            }

            // Completed Challenges
            ctx.font = "bold 25px Roboto";
            ctx.fillStyle = "#ffffff";
            ctx.fillText("Completed Challenges:", 210, 280);

            ctx.font = "20px Roboto";
            ctx.fillStyle = "#bbbbbb";
            const challengesText = `${data.submitted_challenges.length} challenges completed.`;
            wrapText(ctx, challengesText, 580).forEach((line, index) => {
                ctx.fillText(line, 210, 310 + index * 30);
            });

            // Draw image
            const attachment = canvas.toBuffer("image/png");

            const dir = join(import.meta.dir, `./profiles/`);
            const profile = join(import.meta.dir, `./profiles/${user.id}.png`);
            if (!(await exists(dir))) {
                await mkdir(dir);
            }

            Bun.write(join(profile), attachment);

            await interaction.reply({ files: [profile] });
        } catch (e) {
            console.error(e);

            const embed = new EmbedBuilder().setDescription("An error occurred while processing the request.").setColor(colors.errorColor);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
} as Command;
