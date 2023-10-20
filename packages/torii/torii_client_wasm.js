import * as wasm from "./torii_client_wasm_bg.wasm";
import { __wbg_set_wasm } from "./torii_client_wasm_bg.js";
__wbg_set_wasm(wasm);
export * from "./torii_client_wasm_bg.js";
