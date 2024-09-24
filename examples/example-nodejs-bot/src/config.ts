import { GraphQLClient } from "graphql-request";

import { dojoConfig } from "../dojoConfig.js";
import { getSdk } from "./generated/graphql.js";

export const sdk = getSdk(new GraphQLClient(dojoConfig.toriiUrl + "/graphql"));

export const POLL_INTERVAL = 3000;
