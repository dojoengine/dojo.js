/* tslint:disable */
/* eslint-disable */
/**
* Create the a client with the given configurations.
* @param {any[]} initial_entities_to_sync
* @param {ClientConfig} config
* @returns {Promise<Client>}
*/
export function createClient(initial_entities_to_sync: any[], config: ClientConfig): Promise<Client>;
export interface ClientConfig {
    rpcUrl: string;
    toriiUrl: string;
    worldAddress: string;
}

/**
*/
export class Client {
  free(): void;
/**
* Retrieves the model value of an entity.
* @param {string} model
* @param {any[]} keys
* @returns {any}
*/
  getModelValue(model: string, keys: any[]): any;
/**
* Register new entities to be synced.
* @param {any[]} entities
* @returns {Promise<void>}
*/
  addEntitiesToSync(entities: any[]): Promise<void>;
/**
* Remove the entities from being synced.
* @param {any[]} entities
* @returns {Promise<void>}
*/
  removeEntitiesToSync(entities: any[]): Promise<void>;
/**
* Register a callback to be called every time the specified entity change.
* @param {any} entity
* @param {Function} callback
*/
  onEntityChange(entity: any, callback: Function): void;
}
/**
*/
export class IntoUnderlyingByteSource {
  free(): void;
/**
* @param {any} controller
*/
  start(controller: any): void;
/**
* @param {any} controller
* @returns {Promise<any>}
*/
  pull(controller: any): Promise<any>;
/**
*/
  cancel(): void;
/**
*/
  readonly autoAllocateChunkSize: number;
/**
*/
  readonly type: string;
}
/**
*/
export class IntoUnderlyingSink {
  free(): void;
/**
* @param {any} chunk
* @returns {Promise<any>}
*/
  write(chunk: any): Promise<any>;
/**
* @returns {Promise<any>}
*/
  close(): Promise<any>;
/**
* @param {any} reason
* @returns {Promise<any>}
*/
  abort(reason: any): Promise<any>;
}
/**
*/
export class IntoUnderlyingSource {
  free(): void;
/**
* @param {any} controller
* @returns {Promise<any>}
*/
  pull(controller: any): Promise<any>;
/**
*/
  cancel(): void;
}
/**
* Raw options for [`pipeTo()`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/pipeTo).
*/
export class PipeOptions {
  free(): void;
/**
*/
  readonly preventAbort: boolean;
/**
*/
  readonly preventCancel: boolean;
/**
*/
  readonly preventClose: boolean;
/**
*/
  readonly signal: AbortSignal | undefined;
}
/**
*/
export class QueuingStrategy {
  free(): void;
/**
*/
  readonly highWaterMark: number;
}
/**
* Raw options for [`getReader()`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/getReader).
*/
export class ReadableStreamGetReaderOptions {
  free(): void;
/**
*/
  readonly mode: any;
}
