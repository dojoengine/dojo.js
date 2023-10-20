import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { RPCProvider, Query } from "@dojoengine/core";
import { Account, num } from "starknet";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "../generated/graphql";
import manifest from "../../../dojo-starter/target/dev/manifest.json";
import * as torii from "@dojoengine/torii";

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

export interface ToriiModel {
	model: string;
	keys: string[];
}

export async function setupNetwork() {
	// Extract environment variables for better readability.
	const { VITE_PUBLIC_WORLD_ADDRESS, VITE_PUBLIC_NODE_URL, VITE_PUBLIC_TORII } =
		import.meta.env;

	// Create a new RPCProvider instance.
	const provider = new RPCProvider(
		VITE_PUBLIC_WORLD_ADDRESS,
		manifest,
		VITE_PUBLIC_NODE_URL
	);

	const client = await torii.createClient(
		[],
		{
			rpcUrl: VITE_PUBLIC_NODE_URL,
			toriiUrl: VITE_PUBLIC_TORII + "/grpc",
			worldAddress:
				VITE_PUBLIC_WORLD_ADDRESS,
		}
	);

	// Return the setup object.
	return {
		provider,
		world,
		client,
		worldAddress: VITE_PUBLIC_WORLD_ADDRESS,
		// torii_client: async (models: ToriiModel[]) => {
		// 	return await torii.createClient(models,
		// 		{
		// 			rpcUrl: VITE_PUBLIC_NODE_URL,
		// 			toriiUrl: VITE_PUBLIC_TORII + "/grpc",
		// 			worldAddress:
		// 				VITE_PUBLIC_WORLD_ADDRESS,
		// 		}
		// 	);
		// },

		// Define contract components for the world.
		contractComponents: defineContractComponents(world),

		// Define the graph SDK instance.
		graphSdk: () => getSdk(new GraphQLClient(VITE_PUBLIC_TORII)),

		// Execute function.
		execute: async (
			signer: Account,
			contract: string,
			system: string,
			call_data: num.BigNumberish[]
		) => {
			return provider.execute(signer, contract, system, call_data);
		},

		// Entity query function.
		entity: async (model: string, query: Query) => {
			return provider.entity(model, query);
		},

		// Entities query function.
		entities: async (model: string, partition: number) => {
			return provider.entities(model, partition);
		},
	};
}
