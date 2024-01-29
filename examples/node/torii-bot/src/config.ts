import { getSdk } from "./generated/graphql.js";
import { GraphQLClient } from "graphql-request";
import { dojoConfig } from "./dojoConfig.js";

if (!process.env.TWITTER_ACCESS_TOKEN) {
    throw new Error("TWITTER_BEARER_TOKEN is not defined");
}

if (!process.env.TWITTER_ACCESS_TOKEN_SECRET) {
    throw new Error("TWITTER_BEARER_TOKEN is not defined");
}

if (!process.env.TWITTER_APP_KEY) {
    throw new Error("TWITTER_APP_KEY is not defined");
}

if (!process.env.TWITTER_APP_SECRET) {
    throw new Error("TWITTER_APP_SECRET is not defined");
}

export const sdk = getSdk(
    new GraphQLClient(dojoConfig().toriiUrl + "/graphql")
);

export const POLL_INTERVAL = 3000;
