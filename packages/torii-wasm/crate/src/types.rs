use torii_grpc::types::KeysClause;
use serde::{Deserialize, Serialize};
use starknet::core::types::FieldElement;
use tsify::Tsify;
use wasm_bindgen::prelude::wasm_bindgen;

// TODO: remove this in favour of the new EntityQuery
#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct EntityModel {
    pub model: String,
    pub keys: Vec<FieldElement>,
}

impl From<EntityModel> for KeysClause {
    fn from(value: EntityModel) -> Self {
        Self {
            model: value.model,
            keys: value.keys,
        }
    }
}

#[wasm_bindgen(typescript_custom_section)]
pub const ENTITY_MODEL_STR: &'static str = r#"
export interface EntityModel {
    model: string;
    keys: string[];
}
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "EntityModel")]
    pub type IEntityModel;
}

impl TryFrom<IEntityModel> for KeysClause {
    type Error = serde_wasm_bindgen::Error;
    fn try_from(value: IEntityModel) -> Result<Self, Self::Error> {
        serde_wasm_bindgen::from_value::<EntityModel>(value.into()).map(|e| e.into())
    }
}

#[derive(Tsify, Serialize, Deserialize)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct ClientConfig {
    #[serde(rename = "rpcUrl")]
    pub rpc_url: String,
    #[serde(rename = "toriiUrl")]
    pub torii_url: String,
    #[serde(rename = "relayUrl")]
    pub relay_url: String,
    #[serde(rename = "worldAddress")]
    pub world_address: String,
}

#[cfg(test)]
mod test {

    use starknet::macros::felt;

    use super::*;

    #[test]
    fn convert_entity_model_to_keys_clause() {
        let entity_model = EntityModel {
            model: "Position".into(),
            keys: vec![felt!("0x1"), felt!("0x2")],
        };

        let keys_clause: KeysClause = entity_model.try_into().unwrap();

        assert_eq!(keys_clause.model, "Position");
        assert_eq!(
            keys_clause.keys,
            vec![felt!("0x1"), felt!("0x2")]
        );
    }
}
