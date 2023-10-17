import wasm from "@dojoengine/torii/wasm"

// import client from "@dojoengine/torii/pkg";

export async function setup() {
	console.log("Initializing torii client worker 🚧");

	console.log(wasm)
	// console.log(client)

	// try {
	// 	await wasm_bindgen(wasm);

	// 	const client = await spawn_client(
	// 		"http://0.0.0.0:8080/grpc",
	// 		"http://0.0.0.0:5050",
	// 		"0x3fa481f41522b90b3684ecfab7650c259a76387fab9c380b7a959e3d4ac69f",
	// 		[
	// 			{
	// 				model: "Position",
	// 				keys: [
	// 					"0x517ececd29116499f4a1b64b094da79ba08dfd54a3edaa316134c41f8160973",
	// 				],
	// 			},
	// 		]
	// 	);

	// 	setTimeout(() => {
	// 		client.addEntitiesToSync([
	// 			{
	// 				model: "Moves",
	// 				keys: [
	// 					"0x517ececd29116499f4a1b64b094da79ba08dfd54a3edaa316134c41f8160973",
	// 				],
	// 			},
	// 		]);
	// 	}, 10000);

	// 	// setup the message handler for the worker
	// 	// self.onmessage = function (e: MessageEvent) {
	// 	//     const event = e.data.type;
	// 	//     const data = e.data.data;

	// 	//     if (event === "getModelValue") {
	// 	//         getModelValueHandler(client, data);
	// 	//     } else if (event === "addEntityToSync") {
	// 	//         addEntityToSyncHandler(client, data);
	// 	//     } else {
	// 	//         console.log("Sync Worker: Unknown event type", event);
	// 	//     }
	// 	// };

	// 	console.log("Torii client initialized 🔥");
	// } catch (e) {
	// 	console.error("Error initiating torii client: ", e);
	// }
}

// async function getModelValueHandler(client: any, data: any) {
//     const model = data.model;
//     const keys = data.keys;

//     const values = await client.getModelValue(model, keys);

//     console.log("Sync Worker | Got model value | values: ", values);

//     // Uncomment this if you want to send data back to the main thread
//     /*
//     self.postMessage({
//         type: "getModelValue",
//         data: {
//             model: "Position",
//             keys,
//             values,
//         },
//     });
//     */
// }

// Uncomment this function if you wish to use it later
/*
function addEntityToSyncHandler(client: any, data: any) {
	console.log("Sync Worker | Adding new entity to sync | data: ", data);
	client.addEntityToSync(data);
}
*/

setup()