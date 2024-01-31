import {
    RpcProvider,
    Account,
    InvokeFunctionResponse,
    Contract,
    shortString,
    InvocationsDetails,
    AllowArray,
    Call,
    num,
    Result,
    CallContractResponse,
} from "starknet";
import { Provider } from "./provider";
import { WorldEntryPoints } from "../types";
import { LOCAL_KATANA } from "../constants";
import { getContractByName } from "../utils";

/**
 * DojoProvider: The DojoProvider is an execution provider for dojo worlds. It allows you to easily interact with a dojo world via the Starknet.js library.
 * ```ts
 * import { DojoProvider } from "@dojoengine/core";
 *
 * const provider = new DojoProvider(
 *      manifest
 * );
 *
 * await provider.execute(signer, contract, system, call_data);
 * ```
 */
export class DojoProvider extends Provider {
    public provider: RpcProvider;
    public contract: Contract;
    public manifest: any;

    /**
     * Constructor: Initializes the DojoProvider with the given world address, manifest and URL.
     *
     * @param {string} world_address - Address of the world.
     * @param {string} [url=LOCAL_KATANA] - RPC URL (defaults to LOCAL_KATANA).
     */
    constructor(manifest?: any, url: string = LOCAL_KATANA) {
        super(manifest.world.address);
        this.provider = new RpcProvider({
            nodeUrl: url,
        });

        this.contract = new Contract(
            manifest.world.abi,
            this.getWorldAddress(),
            this.provider
        );
        this.manifest = manifest;
    }

    /**
     * Retrieves a single entity's details.
     *
     * @param {string} model - The component to query.
     * @param {Array<string>} keys - The keys to query.
     * @param {number} [offset=0] - Starting offset (defaults to 0).
     * @param {number} [length=0] - Length to retrieve (defaults to 0).
     * @returns {Promise<Array<bigint>>} - A promise that resolves to an array of bigints representing the entity's details.
     */
    public async entity(
        model: string,
        keys: Array<string>,
        offset: number = 0,
        length: number = 0,
        layout: Array<number>
    ): Promise<Array<bigint>> {
        try {
            return (await this.contract.call(WorldEntryPoints.get, [
                shortString.encodeShortString(model),
                keys.length,
                ...(keys as any),
                offset,
                length,
                layout.length,
                layout,
            ])) as unknown as Array<bigint>;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves multiple entities' details.
     *
     * @param {string} model - The component to query.
     * @param {number} index - The index to query.
     * @param {Array<string>} values - The values to query.
     * @param {number} valuesLength - The values length to query.
     * @param {Array<number>} valuesLayout - The values layout to query.
     */
    public async entities(
        model: string,
        index: string,
        values: Array<string>,
        valuesLength: number,
        valuesLayout: Array<number>
    ): Promise<Array<Array<bigint>>> {
        try {
            return (await this.contract.call(WorldEntryPoints.entities, [
                shortString.encodeShortString(model),
                index,
                values,
                valuesLength,
                valuesLayout,
            ])) as unknown as Promise<Array<Array<bigint>>>;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves a models
     *
     * @param {string} name - Name of the model.
     * @returns {Promise<bigint>} - A promise that resolves to a bigint representing the model's details.
     */
    public async model(name: string): Promise<bigint> {
        try {
            return (await this.contract.call(WorldEntryPoints.model, [
                shortString.encodeShortString(name),
            ])) as unknown as bigint;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Executes a function with the given parameters.
     * This function is a wrapper around the Starknet.js Account.execute function, but is more convenient to use.
     *
     * ```ts
     * await provider.execute(signer, contract, system, call_data);
     * ```
     * @param {Account} account - The account to use.
     * @param {string} contract - The contract to execute.
     * @param {string} call - The function to call.
     * @param {num.BigNumberish[]} call_data - The call data for the function.
     * @param {InvocationsDetails | undefined} transactionDetails - The transactionDetails allow to override maxFee & version
     * @returns {Promise<InvokeFunctionResponse>} - A promise that resolves to the response of the function execution.
     */
    public async execute(
        account: Account,
        contract_name: string,
        call: string,
        calldata: num.BigNumberish[],
        transactionDetails?: InvocationsDetails | undefined
    ): Promise<InvokeFunctionResponse> {
        try {
            const nonce = await account?.getNonce();

            return await account?.execute(
                [
                    {
                        contractAddress: getContractByName(
                            this.manifest,
                            contract_name
                        )?.address,
                        entrypoint: call,
                        calldata: calldata,
                    },
                ],
                undefined,
                {
                    maxFee: 0, // TODO: Update this value as needed.
                    ...transactionDetails,
                    nonce,
                }
            );
        } catch (error) {
            throw error;
        }
    }

    /**
     * Executes a multicall.
     * This function is a wrapper around the Starknet.js Account.execute function, but allows for executing multiple calls at once.
     *
     * ```ts
     * await provider.executeMulti(account, calls);
     * ```
     * @param {Account} account - The account to use.
     * @param {AllowArray<Call>} calls - The calls to execute.
     * @param {InvocationsDetails | undefined} transactionDetails - The transactionDetails allow to override maxFee & version
     * @returns {Promise<InvokeFunctionResponse>} - A promise that resolves to the response of the function execution.
     */
    public async executeMulti(
        account: Account,
        calls: AllowArray<Call>,
        transactionDetails?: InvocationsDetails | undefined
    ): Promise<InvokeFunctionResponse> {
        try {
            const nonce = await account?.getNonce();

            return await account?.execute(calls, undefined, {
                maxFee: 0, // TODO: Update this value as needed.
                ...transactionDetails,
                nonce,
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves current uuid from the world contract.
     *
     * @returns {Promise<number>} - A promise that resolves to the world uuid
     * @throws {Error} - Throws an error if the call fails.
     *
     * @example
     * const uuid = await provider.uuid();
     * console.log(uuid);
     * // => 6
     *
     */
    public async uuid(): Promise<number> {
        try {
            const { result } = await this.provider.callContract({
                contractAddress: this.getWorldAddress(),
                entrypoint: WorldEntryPoints.uuid,
                calldata: [],
            });
            if (result && result.length === 1) {
                return parseInt(result[0]);
            }
            throw new Error("Contract did not return expected uuid");
        } catch (error) {
            throw new Error(`Failed to fetch uuid: ${error}`);
        }
    }
    /**
     * Calls a function with the given parameters.
     *
     * @param {string} contract_name - The contract to call.
     * @param {string} call - The function to call.
     * @returns {Promise<CallContractResponse>} - A promise that resolves to the response of the function call.
     */
    public async call(
        contract_name: string,
        call: string,
        calldata?: num.BigNumberish[]
    ): Promise<CallContractResponse> {
        try {
            return await this.provider.callContract({
                contractAddress: getContractByName(this.manifest, contract_name)
                    ?.address,
                entrypoint: call,
                calldata,
            });
        } catch (error) {
            throw new Error(`Failed to call: ${error}`);
        }
    }
    /**
     * Calls a function with the given parameters and return parsed results.
     *
     * @param {string} contract_name - The contract to call.
     * @param {string} call - The function to call.
     * @returns {Promise<Result>} - A promise that resolves to the response of the function call.
     */
    public async callContract(
        contract_name: string,
        call: string,
        calldata?: num.BigNumberish[]
    ): Promise<Result> {
        try {
            const contractInfos = getContractByName(
                this.manifest,
                contract_name
            );
            const contract = new Contract(
                contractInfos.abi,
                contractInfos.address,
                this.provider
            );
            return await contract.call(call, calldata);
        } catch (error) {
            throw new Error(`Failed to callContract: ${error}`);
        }
    }
}
