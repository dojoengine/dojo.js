/* tslint:disable */
/* eslint-disable */
/**
 */
export enum ErrorCode {
    StarknetFailedToReceiveTransaction = 1,
    StarknetContractNotFound = 20,
    StarknetBlockNotFound = 24,
    StarknetInvalidTransactionIndex = 27,
    StarknetClassHashNotFound = 28,
    StarknetTransactionHashNotFound = 29,
    StarknetPageSizeTooBig = 31,
    StarknetNoBlocks = 32,
    StarknetInvalidContinuationToken = 33,
    StarknetTooManyKeysInFilter = 34,
    StarknetContractError = 40,
    StarknetTransactionExecutionError = 41,
    StarknetClassAlreadyDeclared = 51,
    StarknetInvalidTransactionNonce = 52,
    StarknetInsufficientMaxFee = 53,
    StarknetInsufficientAccountBalance = 54,
    StarknetValidationFailure = 55,
    StarknetCompilationFailed = 56,
    StarknetContractClassSizeIsTooLarge = 57,
    StarknetNonAccount = 58,
    StarknetDuplicateTx = 59,
    StarknetCompiledClassHashMismatch = 60,
    StarknetUnsupportedTxVersion = 61,
    StarknetUnsupportedContractClassVersion = 62,
    StarknetUnexpectedError = 63,
    StarknetNoTraceAvailable = 10,
    SignError = 101,
    StorageError = 102,
    AccountFactoryError = 103,
    PaymasterExecutionTimeNotReached = 104,
    PaymasterExecutionTimePassed = 105,
    PaymasterInvalidCaller = 106,
    PaymasterRateLimitExceeded = 107,
    PaymasterNotSupported = 108,
    PaymasterHttp = 109,
    PaymasterExcecution = 110,
    PaymasterSerialization = 111,
    CartridgeControllerNotDeployed = 112,
    InsufficientBalance = 113,
    OriginError = 114,
    EncodingError = 115,
    SerdeWasmBindgenError = 116,
    CairoSerdeError = 117,
    CairoShortStringToFeltError = 118,
    DeviceCreateCredential = 119,
    DeviceGetAssertion = 120,
    DeviceBadAssertion = 121,
    DeviceChannel = 122,
    DeviceOrigin = 123,
    AccountSigning = 124,
    AccountProvider = 125,
    AccountClassHashCalculation = 126,
    AccountClassCompression = 127,
    AccountFeeOutOfRange = 128,
    ProviderRateLimited = 129,
    ProviderArrayLengthMismatch = 130,
    ProviderOther = 131,
    SessionAlreadyRegistered = 132,
}
export interface JsInvocationsDetails {
    maxFee: Felt;
}

export interface JsOutsideExecution {
    caller: Felt;
    executeBefore: number;
    executeAfter: number;
    calls: JsCall[];
    nonce: Felt;
}

export interface WebauthnSigner {
    rpId: string;
    credentialId: string;
    publicKey: string;
}

export interface StarknetSigner {
    privateKey: JsFelt;
}

export interface Signer {
    webauthn?: WebauthnSigner;
    starknet?: StarknetSigner;
}

export interface JsEstimateFeeDetails {
    nonce: Felt;
}

export interface JsCall {
    contractAddress: Felt;
    entrypoint: string;
    calldata: Felt[];
}

export interface Policy {
    target: string;
    method: string;
}

export type Felts = JsFelt[];

export type JsFelt = Felt;

export interface SessionMetadata {
    session: Session;
    maxFee: Felt | null;
    credentials: Credentials | null;
    isRegistered: boolean;
}

export interface Session {
    policies: Policy[];
    expiresAt: number;
}

export interface Credentials {
    authorization: Felt[];
    privateKey: Felt;
}

/**
 */
export class CartridgeAccount {
    free(): void;
    /**
     * Creates a new `CartridgeAccount` instance.
     *
     * # Parameters
     * - `app_id`: Application identifier.
     * - `rpc_url`: The URL of the JSON-RPC endpoint.
     * - `chain_id`: Identifier of the blockchain network to interact with.
     * - `address`: The blockchain address associated with the account.
     * - `username`: Username associated with the account.
     * - `signer`: A Signer struct containing the signer type and associated data.
     * @param {string} app_id
     * @param {string} rpc_url
     * @param {JsFelt} chain_id
     * @param {JsFelt} address
     * @param {string} username
     * @param {Signer} signer
     * @returns {CartridgeAccount}
     */
    static new(
        app_id: string,
        rpc_url: string,
        chain_id: JsFelt,
        address: JsFelt,
        username: string,
        signer: Signer
    ): CartridgeAccount;
    /**
     * @returns {JsFelt}
     */
    ownerGuid(): JsFelt;
    /**
     * @param {(Policy)[]} policies
     * @param {bigint} expires_at
     * @param {JsFelt} public_key
     * @param {JsFelt} max_fee
     * @returns {Promise<any>}
     */
    registerSession(
        policies: Policy[],
        expires_at: bigint,
        public_key: JsFelt,
        max_fee: JsFelt
    ): Promise<any>;
    /**
     * @param {(Policy)[]} policies
     * @param {bigint} expires_at
     * @param {JsFelt} public_key
     * @returns {any}
     */
    registerSessionCalldata(
        policies: Policy[],
        expires_at: bigint,
        public_key: JsFelt
    ): any;
    /**
     * @param {JsFelt} new_class_hash
     * @returns {JsCall}
     */
    upgrade(new_class_hash: JsFelt): JsCall;
    /**
     * @param {(Policy)[]} policies
     * @param {bigint} expires_at
     * @returns {Promise<void>}
     */
    createSession(policies: Policy[], expires_at: bigint): Promise<void>;
    /**
     * @param {(JsCall)[]} calls
     * @returns {Promise<any>}
     */
    estimateInvokeFee(calls: JsCall[]): Promise<any>;
    /**
     * @param {(JsCall)[]} calls
     * @param {JsInvocationsDetails} details
     * @returns {Promise<any>}
     */
    execute(calls: JsCall[], details: JsInvocationsDetails): Promise<any>;
    /**
     * @param {(JsCall)[]} calls
     * @returns {Promise<any>}
     */
    executeFromOutside(calls: JsCall[]): Promise<any>;
    /**
     * @param {(JsCall)[]} calls
     * @returns {boolean}
     */
    hasSession(calls: JsCall[]): boolean;
    /**
     * @param {(Policy)[]} policies
     * @param {JsFelt | undefined} [public_key]
     * @returns {SessionMetadata | undefined}
     */
    session(
        policies: Policy[],
        public_key?: JsFelt
    ): SessionMetadata | undefined;
    /**
     */
    revokeSession(): void;
    /**
     * @param {string} typed_data
     * @returns {Promise<Felts>}
     */
    signMessage(typed_data: string): Promise<Felts>;
    /**
     * @returns {Promise<any>}
     */
    getNonce(): Promise<any>;
    /**
     * @param {JsFelt} max_fee
     * @returns {Promise<any>}
     */
    deploySelf(max_fee: JsFelt): Promise<any>;
    /**
     * @returns {Promise<JsFelt>}
     */
    delegateAccount(): Promise<JsFelt>;
}
/**
 */
export class CartridgeSessionAccount {
    free(): void;
    /**
     * @param {string} rpc_url
     * @param {JsFelt} signer
     * @param {JsFelt} address
     * @param {JsFelt} chain_id
     * @param {(JsFelt)[]} session_authorization
     * @param {Session} session
     * @returns {CartridgeSessionAccount}
     */
    static new(
        rpc_url: string,
        signer: JsFelt,
        address: JsFelt,
        chain_id: JsFelt,
        session_authorization: JsFelt[],
        session: Session
    ): CartridgeSessionAccount;
    /**
     * @param {string} rpc_url
     * @param {JsFelt} signer
     * @param {JsFelt} address
     * @param {JsFelt} owner_guid
     * @param {JsFelt} chain_id
     * @param {Session} session
     * @returns {CartridgeSessionAccount}
     */
    static new_as_registered(
        rpc_url: string,
        signer: JsFelt,
        address: JsFelt,
        owner_guid: JsFelt,
        chain_id: JsFelt,
        session: Session
    ): CartridgeSessionAccount;
    /**
     * @param {JsFelt} hash
     * @param {(JsCall)[]} calls
     * @returns {Promise<Felts>}
     */
    sign(hash: JsFelt, calls: JsCall[]): Promise<Felts>;
    /**
     * @param {(JsCall)[]} calls
     * @returns {Promise<any>}
     */
    execute(calls: JsCall[]): Promise<any>;
    /**
     * @param {(JsCall)[]} calls
     * @returns {Promise<any>}
     */
    execute_from_outside(calls: JsCall[]): Promise<any>;
}
/**
 */
export class JsControllerError {
    free(): void;
    /**
     */
    code: ErrorCode;
    /**
     */
    data?: string;
    /**
     */
    message: string;
}
