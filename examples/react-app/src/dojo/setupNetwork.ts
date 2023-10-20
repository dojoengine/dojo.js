import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { RPCProvider, Query } from "@dojoengine/core";
import { Account, num } from "starknet";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "../generated/graphql";
import manifest from "../../../dojo-starter/target/dev/manifest.json";
import * as torii from "@dojoengine/torii";

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

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
		[
			{
				model: "Position",
				keys: [
					"0x517ececd29116499f4a1b64b094da79ba08dfd54a3edaa316134c41f8160973",
				],
			},
		],
		{
			rpcUrl: "http://0.0.0.0:5050",
			toriiUrl: "http://0.0.0.0:8080/grpc",
			worldAddress:
				"0x1af130f7b9027f3748c1e3b10ca4a82ac836a30ac4f2f84025e83a99a922a0c",
		}
	);

	client.onEntityChange(
		{
			model: "Position",
			keys: ["0x517ececd29116499f4a1b64b094da79ba08dfd54a3edaa316134c41f8160973"],
		},
		() => {
			const values = client.getModelValue("Position", [
				"0x517ececd29116499f4a1b64b094da79ba08dfd54a3edaa316134c41f8160973",
			]);
			console.log("Position changed", values);
		}
	);

	// Return the setup object.
	return {
		provider,
		world,

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
