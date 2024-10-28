import type { EmbedField } from "discord.js";
import type { Range } from "../../../../types/impl/lib/impl/ranges";

/**
 * @author All credit to https://github.com/Awedtan/HellaBot/
 *
 * @param range
 * @returns
 */
export function buildRangeField(range: Range): EmbedField {
    let left = 0,
        right = 0,
        top = 0,
        bottom = 0;
    for (const square of range.grids) {
        if (square.col < left) left = square.col;
        else if (square.col > right) right = square.col;
        if (square.row < bottom) bottom = square.row;
        else if (square.row > top) top = square.row;
    }

    const arrCols = right - left + 1;
    const arrRows = top - bottom + 1;
    const rangeArr = new Array(arrCols);
    for (let i = 0; i < arrCols; i++) {
        rangeArr[i] = new Array(arrRows);
    }
    for (const square of range.grids) {
        rangeArr[square.col - left][-square.row - bottom] = 1;
    }
    rangeArr[-left][-bottom] = 2;

    let rangeString = "";
    for (let i = 0; i < arrRows; i++) {
        for (let j = 0; j < arrCols; j++) {
            switch (rangeArr[j][i]) {
                case 1:
                    rangeString += "🔳";
                    break;
                case 2:
                    rangeString += "🟦";
                    break;
                default:
                    rangeString += "⬛";
                    break;
            }
        }
        rangeString += "\n";
    }
    return { name: "Range", value: rangeString, inline: false };
}
