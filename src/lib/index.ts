import { init as initLocal } from "./impl/local";

export const init = async () => {
    await initLocal();
};
