import { sdk } from "../config.js";
// import { client } from "../index.js";

export const getMoves = async () => {
    try {
        const { data } = await sdk.getMoves();

        console.log(data);

        return data;
    } catch (error) {
        console.error("Fetching error:", error);
        throw error;
    }
};
