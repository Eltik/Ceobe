import { removeStyleTags } from "../../local/impl/helper";

/**
 * @author All credit to https://github.com/Awedtan/HellaBot/
 *
 * @param text
 * @param blackboard
 * @returns string | null
 */
export function insertBlackboard(
    text: string,
    blackboard: {
        key: string;
        value: number;
        valueStr: string | null;
    }[],
): string | null {
    // Note: check these every so often to see if their skills still display properly
    // silverash s2/s3
    // eyjafjalla s2
    // lin s1
    // tachanka s1/s2
    // mizuki s1
    // mostima s3
    // irene s1
    // utage s2

    const formatVariable = (
        chunk: string,
        blackboard: {
            key: string;
            value: number;
            valueStr: string | null;
        }[],
    ) => {
        // {tag} {tag:0} {tag:0%} {tag:0.0} {tag:0.0%}
        const tag = chunk.split(":")[0].toLowerCase();
        const negative = tag.startsWith("-");
        const key = negative ? tag.slice(1) : tag;
        const variable = blackboard.find((variable) => variable.key === key);

        if (!variable) return chunk;

        const value = negative ? -variable.value : variable.value;
        return chunk.charAt(chunk.length - 1) === "%" ? `\`${Math.round(value * 100)}%\`` : `\`${value}\``;
    };

    const textArr = removeStyleTags(text.trim()).split(/{|}/);

    if (textArr.join("") === "") return null;

    for (let i = 0; i < textArr.length; i++) {
        textArr[i] = formatVariable(textArr[i], blackboard);
    }

    return textArr.join("").replaceAll("-`", "`-").replaceAll("+`", "`+");
}
