import {
    type Account,
    type AccountInterface,
    type AllowArray,
    type ArgsOrCalldata,
    type Call,
    type CallContractResponse,
    CallResult,
    Contract,
    type InvokeFunctionResponse,
    RpcProvider,
    shortString,
    type UniversalDetails,
} from "starknet";

import { LOCAL_KATANA } from "../constants";
import { ConsoleLogger, type LogLevel } from "../logger/logger";
import { type DojoCall, WorldEntryPoints } from "../types";
import { getContractByName, parseDojoCall } from "../utils";
import { Provider } from "./provider";

type DojoActionInputs<Fn> = Fn extends { inputs: infer Inputs }
    ? keyof Inputs extends never
        ? undefined
        : Inputs
    : undefined;

type ActionSignature = {
    inputs: object;
    outputs: unknown;
};

export type DojoActionInterface = Record<string, ActionSignature>;

type UnionToIntersection<U> = (
    U extends unknown
        ? (k: U) => void
        : never
) extends (k: infer I) => void
    ? I
    : never;

type EnsureActionInterface<T> = T extends object
    ? {
          [K in keyof T]: T[K] extends ActionSignature ? T[K] : never;
      } extends T
        ? { [K in keyof T]: T[K] }
        : never
    : never;

type ExtractActionUnion<Actions> = Actions extends ReadonlyArray<infer Item>
    ? EnsureActionInterface<Item>
    : EnsureActionInterface<Actions>;

type NormalizeActions<Actions> = EnsureActionInterface<
    UnionToIntersection<ExtractActionUnion<Actions>>
> extends infer Result
    ? Result extends never
        ? Record<never, ActionSignature>
        : Result
    : Record<never, ActionSignature>;

type DojoActionMethod<Fn> = DojoActionInputs<Fn> extends undefined
    ? (account: Account | AccountInterface) => Promise<InvokeFunctionResponse>
    : (
          account: Account | AccountInterface,
          args: DojoActionInputs<Fn>
      ) => Promise<InvokeFunctionResponse>;

type DojoActionMethodMap<Actions> = {
    [K in keyof NormalizeActions<Actions> & string]: DojoActionMethod<
        NormalizeActions<Actions>[K]
    >;
};

type ActionMethodImplementation = (
    account: Account | AccountInterface,
    args?: Record<string, unknown>
) => Promise<InvokeFunctionResponse>;

/**
 * Core runtime implementation for the Dojo provider. Prefer using the exported `DojoProvider`
 * constructor which augments this base instance with strongly typed action methods.
 */
class DojoProviderBase extends Provider {
    public provider: RpcProvider;
    public contract: Contract;
    public manifest: any;
    public logger: ConsoleLogger;

    /**
     * Constructor: Initializes the DojoProvider with the given world address, manifest and URL.
     *
     * @param {string} world_address - Address of the world.
     * @param {string} [url=LOCAL_KATANA] - RPC URL (defaults to LOCAL_KATANA).
     */
    constructor(
        manifest?: any,
        url: string = LOCAL_KATANA,
        logLevel: LogLevel = "none"
    ) {
        super(manifest.world.address);
        this.provider = new RpcProvider({
            nodeUrl: url,
        });

        this.contract = new Contract({
            abi: manifest.world.abi,
            address: this.getWorldAddress(),
            providerOrAccount: this.provider,
        });
        this.manifest = manifest;
        this.logger = new ConsoleLogger({ level: logLevel });

        this.initializeActionMethods();
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
            this.logger.error("Error occured: ", error);
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
            this.logger.error("Error occured: ", error);
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
            this.logger.error("Error occured: ", error);
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
            const result = await this.provider.callContract({
                contractAddress: this.getWorldAddress(),
                entrypoint: WorldEntryPoints.uuid,
                calldata: [],
            });
            if (result && result.length === 1) {
                return parseInt(result[0]);
            }
            throw new Error("Contract did not return expected uuid");
        } catch (error) {
            this.logger.error(`Failed to fetch uuid: ${error}`);
            throw new Error(`Failed to fetch uuid: ${error}`);
        }
    }

    /**
     * Executes a function with the given parameters.
     * This function is a wrapper around the Starknet.js Account.execute function, but is more convenient to use.
     *
     * ```ts
     * await provider.execute(signer, { contractName, entrypoint, calldata });
     * await provider.execute(signer, { contractAddress, entrypoint, calldata });
     * await provider.execute(signer, [{ contractName, entrypoint, calldata }, { contractAddress, entrypoint, calldata }]);
     * ```
     * @param {Account} account - The account to use.
     * @param {AllowArray<DojoCall | Call>} call - The call or calls
     * @param {UniversalDetails} details - https://github.com/starknet-io/starknet.js/blob/5efa196017ee8f761ae837ecac9c059da8f3e09a/src/types/account.ts#L26
     * @returns {Promise<InvokeFunctionResponse>} - A promise that resolves to the response of the function execution.
     */
    public async execute(
        account: Account | AccountInterface,
        call: AllowArray<DojoCall | Call>,
        nameSpace: string,
        details: UniversalDetails = {}
    ): Promise<InvokeFunctionResponse> {
        const dojoCalls = Array.isArray(call) ? call : [call];
        const calls = dojoCalls.map((i) =>
            parseDojoCall(this.manifest, nameSpace, i)
        );

        try {
            return await account?.execute(calls, details);
        } catch (error) {
            this.logger.error("Error occured: ", error);
            throw error;
        }
    }

    /**
     * Calls a function with the given parameters and return parsed results for a DojoCall.
     *
     * ```ts
     * let parsedResult = await provider.call({ contractName, entrypoint, calldata });
     * ```
     * @param {DojoCall | Call} call - The dojoCall or call
     * @returns {Promise<Result>} - A promise that resolves to the response of the function call.
     */
    public async call(
        nameSpace: string,
        call: DojoCall | Call
    ): Promise<CallResult> {
        if ("contractName" in call) {
            try {
                const contractInfos = getContractByName(
                    this.manifest,
                    nameSpace,
                    call.contractName
                );
                const contract = new Contract({
                    abi: contractInfos.abi,
                    address: contractInfos.address,
                    providerOrAccount: this.provider,
                });
                return await contract.call(
                    call.entrypoint,
                    call.calldata as ArgsOrCalldata
                );
            } catch (error) {
                this.logger.error(
                    `Failed to callContract ${call.contractName}: ${error}`
                );
                throw new Error(
                    `Failed to callContract ${call.contractName}: ${error}`
                );
            }
        } else {
            return this.callRaw(nameSpace, call);
        }
    }

    /**
     * Calls a function with the given parameters.
     *
     * @param {string} nameSpace - The namespace of the contract within the world
     * @param {DojoCall | Call} call - The dojoCall or call
     * @returns {Promise<CallContractResponse>} - A promise that resolves to the response of the function call.
     * @throws {Error} - Throws an error if the call fails.
     *
     * @example
     * const result = await provider.callRaw("namespace", { contractAddress, entrypoint, calldata });
     */
    async callRaw(
        nameSpace: string,
        call: DojoCall | Call
    ): Promise<CallContractResponse> {
        const parsedCall = parseDojoCall(this.manifest, nameSpace, call);
        try {
            return await this.provider.callContract(parsedCall);
        } catch (error) {
            this.logger.error(
                `Failed to call ${parsedCall.contractAddress}: ${error}`
            );
            throw new Error(
                `Failed to call ${parsedCall.contractAddress}: ${error}`
            );
        }
    }

    private initializeActionMethods(): void {
        if (!this.manifest?.contracts) {
            return;
        }

        const host = this as unknown as Record<
            string,
            ActionMethodImplementation
        >;

        for (const contract of this.manifest.contracts as Array<any>) {
            if (
                !contract?.systems?.length ||
                typeof contract.tag !== "string"
            ) {
                continue;
            }

            const names = this.parseContractTag(contract.tag);
            if (!names) {
                continue;
            }

            const abiItems = Array.isArray(contract.abi) ? contract.abi : [];

            for (const systemName of contract.systems as Array<string>) {
                if (systemName in host) {
                    continue;
                }

                const interfaceAbi = abiItems.find(
                    (item: any) =>
                        item?.type === "interface" &&
                        item?.items.find(
                            (i: any) =>
                                i?.type === "function" && i?.name === systemName
                        )
                );

                if (!interfaceAbi) {
                    continue;
                }
                const functionAbi = interfaceAbi.items.find(
                    (i: any) => i?.type === "function" && i?.name === systemName
                );
                if (!functionAbi) {
                    continue;
                }

                const expectsArgs = Array.isArray(functionAbi.inputs)
                    ? functionAbi.inputs.length > 0
                    : false;

                host[systemName] = async (
                    account: Account | AccountInterface,
                    args?: Record<string, unknown>
                ) => {
                    if (expectsArgs && args === undefined) {
                        throw new Error(
                            `Missing arguments for action "${systemName}"`
                        );
                    }

                    return this.execute(
                        account,
                        {
                            contractName: names.contractName,
                            entrypoint: systemName,
                            calldata: (args ?? []) as unknown as ArgsOrCalldata,
                        },
                        names.namespace
                    );
                };
            }
        }
    }

    private parseContractTag(
        tag: string
    ): { namespace: string; contractName: string } | null {
        const separatorIndex = tag.lastIndexOf("-");
        if (separatorIndex === -1) {
            return null;
        }

        return {
            namespace: tag.slice(0, separatorIndex),
            contractName: tag.slice(separatorIndex + 1),
        };
    }
}

export type DojoProviderInstance<Actions = never> = DojoProviderBase &
    DojoActionMethodMap<Actions>;

export type DojoProvider<Actions = never> = DojoProviderInstance<Actions>;

type DojoProviderConstructor = new <Actions = never>(
    manifest?: any,
    url?: string,
    logLevel?: LogLevel
) => DojoProvider<Actions>;

export const DojoProvider =
    DojoProviderBase as unknown as DojoProviderConstructor;
