import { readFile } from 'node:fs/promises';
const wasmURL = /* #__PURE__ */ new URL('../pkg/torii_client_wasm_bg.wasm', import.meta.url);
const wasm = /* #__PURE__ */ readFile(wasmURL);
export default wasm;