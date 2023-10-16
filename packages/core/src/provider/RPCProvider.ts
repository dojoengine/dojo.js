import {
  RpcProvider,
  Account,
  InvokeFunctionResponse,
  Contract,
  shortString,
  InvocationsDetails,
  AllowArray,
  Call,
} from "starknet";
import { Provider } from "./provider";
import { Query, WorldEntryPoints } from "../types";
import { LOCAL_KATANA } from "../constants";
import abi from "../constants/abi.json";

/**
 * RPCProvider class: Extends the generic Provider to handle RPC interactions.
 */
export class RPCProvider extends Provider {
  public provider: RpcProvider;
  public contract: Contract;

  /**
   * Constructor: Initializes the RPCProvider with the given world address and URL.
   *
   * @param {string} world_address - Address of the world.
   * @param {string} [url=LOCAL_KATANA] - RPC URL (defaults to LOCAL_KATANA).
   */
  constructor(world_address: string, url: string = LOCAL_KATANA) {
    super(world_address);
    this.provider = new RpcProvider({
      nodeUrl: url,
    });
    this.contract = new Contract(abi, this.getWorldAddress(), this.provider);
  }

  /**
   * Retrieves a single entity's details.
   *
   * @param {string} component - The component to query.
   * @param {Query} query - The query details.
   * @param {number} [offset=0] - Starting offset (defaults to 0).
   * @param {number} [length=0] - Length to retrieve (defaults to 0).
   * @returns {Promise<Array<bigint>>} - A promise that resolves to an array of bigints representing the entity's details.
   */
  public async entity(
    component: string,
    query: Query,
    offset: number = 0,
    length: number = 0
  ): Promise<Array<bigint>> {
    try {
      return (await this.contract.call(WorldEntryPoints.get, [
        shortString.encodeShortString(component),
        query.keys.length,
        ...(query.keys as any),
        offset,
        length,
      ])) as unknown as Array<bigint>;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves multiple entities' details.
   *
   * @param {string} component - The component to query.
   * @param {number} length - Number of entities to retrieve.
   * @returns {Promise<Array<bigint>>} - A promise that resolves to an array of bigints representing the entities' details.
   */
  public async entities(
    component: string,
    length: number
  ): Promise<Array<bigint>> {
    try {
      return (await this.contract.call(WorldEntryPoints.entities, [
        shortString.encodeShortString(component),
        length,
      ])) as unknown as Array<bigint>;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a component's details.
   *
   * @param {string} name - Name of the component.
   * @returns {Promise<bigint>} - A promise that resolves to a bigint representing the component's details.
   */
  public async component(name: string): Promise<bigint> {
    try {
      return (await this.contract.call(WorldEntryPoints.component, [
        shortString.encodeShortString(name),
      ])) as unknown as bigint;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Executes a function with the given parameters.
   *
   * @param {Account} account - The account to use.
   * @param {AllowArray<Call>} calls - The calls to execute.
   * @param {InvocationsDetails | undefined} transactionDetails - The transactionDetails allow to override maxFee & version
   * @returns {Promise<InvokeFunctionResponse>} - A promise that resolves to the response of the function execution.
   */
  public async execute(
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
   * Retrieves current uuid from the world contract
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
        entrypoint: "uuid",
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
}
