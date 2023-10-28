mod utils;

use std::str::FromStr;

use dojo_world::contracts::{self};
use starknet::{
    core::types::FieldElement,
    providers::{jsonrpc::HttpTransport, JsonRpcClient},
};

use url::Url;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct WorldContract(contracts::WorldContractReader<JsonRpcClient<HttpTransport>>);

#[wasm_bindgen]
impl WorldContract {
    #[wasm_bindgen(constructor)]
    pub fn new(address: &str, url: &str) -> Result<WorldContract, JsValue> {
        let rpc_url = Url::parse(url).map_err(|e| JsValue::from(e.to_string()))?;
        let address = FieldElement::from_str(address).map_err(|e| JsValue::from(e.to_string()))?;
        let provider = JsonRpcClient::new(HttpTransport::new(rpc_url));
        let world_reader = contracts::WorldContractReader::new(address, provider);
        Ok(Self(world_reader))
    }

    pub async fn executor(&self) -> Result<JsValue, JsValue> {
        self.0
            .executor()
            .await
            .map(|executor| format!("{executor:#x}").into())
            .map_err(|e| JsValue::from(e.to_string()))
    }

    pub async fn model(&self, name: &str) -> Result<JsValue, JsValue> {
        self.0
            .model(name)
            .await
            .map(|m| format!("{:#x}", m.class_hash()).into())
            .map_err(|e| JsValue::from(e.to_string()))
    }

    pub async fn entity(&self, model: &str, keys: Vec<JsValue>) -> Result<JsValue, JsValue> {
        let model = self
            .0
            .model(model)
            .await
            .map_err(|e| JsValue::from(e.to_string()))?;

        let keys = keys
            .into_iter()
            .map(serde_wasm_bindgen::from_value::<FieldElement>)
            .collect::<Result<Vec<FieldElement>, _>>()
            .map_err(|e| JsValue::from(e.to_string()))?;

        let value = model
            .entity(&keys)
            .await
            .map_err(|e| JsValue::from(e.to_string()))?;

        Ok(serde_wasm_bindgen::to_value(
            &utils::ty_with_value_as_json(value),
        )?)
    }
}
