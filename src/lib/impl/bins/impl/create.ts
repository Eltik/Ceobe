import { URL } from "../";

export const create = async (content: string) => {
    const data = (await (
        await fetch(`${URL}/api/bins`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Referer: URL,
            },
            body: JSON.stringify({
                files: [
                    {
                        content,
                    },
                ],
            }),
        })
    ).json()) as {
        key: string;
        languages: number[];
    };

    return `${URL}/${data.key}`;
};
