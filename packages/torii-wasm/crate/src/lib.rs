//! Minimal JS bindings for the torii client.

use std::str::FromStr;

use crypto_bigint::U256;
use futures::StreamExt;
use serde::{Deserialize, Serialize};
use starknet::core::types::FieldElement;
use starknet::core::utils::cairo_short_string_to_felt;
use tsify::Tsify;
use wasm_bindgen::prelude::*;

mod types;
mod utils;

use types::{ClientConfig, EntityModel, IEntityModel};
use utils::{parse_entities_as_json_str, parse_ty_as_json_str};

type JsFieldElement = JsValue;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    fn error(s: &str);
}

#[wasm_bindgen]
pub struct Client {
    inner: torii_client::client::Client,
}

#[derive(Tsify, Serialize, Deserialize, Debug)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct Query {
    pub limit: u32,
    pub offset: u32,
    #[tsify(optional)]
    pub clause: Option<Clause>,
}

impl From<&Query> for torii_grpc::types::Query {
    fn from(value: &Query) -> Self {
        Self {
            limit: value.limit,
            offset: value.offset,
            clause: value.clause.as_ref().map(|c| c.into()),
        }
    }
}

#[derive(Tsify, Serialize, Deserialize, Debug)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub enum Clause {
    Keys(KeysClause),
    Member(MemberClause),
}

impl From<&Clause> for torii_grpc::types::Clause {
    fn from(value: &Clause) -> Self {
        match value {
            Clause::Keys(keys) => Self::Keys(keys.into()),
            Clause::Member(member) => Self::Member(member.into()),
        }
    }
}

#[derive(Tsify, Serialize, Deserialize, Debug)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct KeysClauses(pub Vec<KeysClause>);

#[derive(Tsify, Serialize, Deserialize, Debug)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct KeysClause {
    pub model: String,
    pub keys: Vec<String>,
}

impl From<&KeysClause> for torii_grpc::types::KeysClause {
    fn from(value: &KeysClause) -> Self {
        Self {
            model: value.model.to_string(),
            keys: value
                .keys
                .iter()
                .map(|k| FieldElement::from_str(k.as_str()).unwrap())
                .collect(),
        }
    }
}

#[derive(Tsify, Serialize, Deserialize, Debug)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct MemberClause {
    pub model: String,
    pub member: String,
    pub operator: ComparisonOperator,
    pub value: Value,
}

impl From<&MemberClause> for torii_grpc::types::MemberClause {
    fn from(value: &MemberClause) -> Self {
        Self {
            model: value.model.to_string(),
            member: value.member.to_string(),
            operator: (&value.operator).into(),
            value: (&value.value).into(),
        }
    }
}

#[derive(Tsify, Serialize, Deserialize, Debug)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub enum LogicalOperator {
    And,
    Or,
}

impl From<&LogicalOperator> for torii_grpc::types::LogicalOperator {
    fn from(value: &LogicalOperator) -> Self {
        match value {
            LogicalOperator::And => Self::And,
            LogicalOperator::Or => Self::Or,
        }
    }
}

#[derive(Tsify, Serialize, Deserialize, Debug)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub enum ComparisonOperator {
    Eq,
    Neq,
    Gt,
    Gte,
    Lt,
    Lte,
}

impl From<&ComparisonOperator> for torii_grpc::types::ComparisonOperator {
    fn from(value: &ComparisonOperator) -> Self {
        match value {
            ComparisonOperator::Eq => Self::Eq,
            ComparisonOperator::Neq => Self::Neq,
            ComparisonOperator::Gt => Self::Gt,
            ComparisonOperator::Gte => Self::Gte,
            ComparisonOperator::Lt => Self::Lt,
            ComparisonOperator::Lte => Self::Lte,
        }
    }
}

#[derive(Tsify, Serialize, Deserialize, Debug)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct Value {
    pub primitive_type: Primitive,
    pub value_type: ValueType,
}

impl From<&Value> for torii_grpc::types::Value {
    fn from(value: &Value) -> Self {
        Self {
            primitive_type: (&value.primitive_type).into(),
            value_type: (&value.value_type).into(),
        }
    }
}

#[derive(Tsify, Serialize, Deserialize, Debug)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub enum ValueType {
    String(String),
    Int(i64),
    UInt(u64),
    VBool(bool),
    Bytes(Vec<u8>),
}

impl From<&ValueType> for torii_grpc::types::ValueType {
    fn from(value: &ValueType) -> Self {
        match &value {
            ValueType::String(s) => Self::String(s.to_string()),
            ValueType::Int(i) => Self::Int(*i),
            ValueType::UInt(u) => Self::UInt(*u),
            ValueType::VBool(b) => Self::Bool(*b),
            ValueType::Bytes(b) => Self::Bytes(b.to_vec()),
        }
    }
}

#[derive(Tsify, Serialize, Deserialize, Debug)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub enum Primitive {
    U8(Option<u8>),
    U16(Option<u16>),
    U32(Option<u32>),
    U64(Option<u64>),
    U128(Option<String>),
    U256(Option<String>),
    USize(Option<u32>),
    Bool(Option<bool>),
    Felt252(Option<String>),
    ClassHash(Option<String>),
    ContractAddress(Option<String>),
}

impl From<&Primitive> for dojo_types::primitive::Primitive {
    fn from(value: &Primitive) -> Self {
        match value {
            Primitive::U8(Some(value)) => Self::U8(Some(*value)),
            Primitive::U16(Some(value)) => Self::U16(Some(*value)),
            Primitive::U32(Some(value)) => Self::U32(Some(*value)),
            Primitive::U64(Some(value)) => Self::U64(Some(*value)),
            Primitive::U128(Some(value)) => Self::U128(Some(u128::from_str(value).unwrap())),
            Primitive::U256(Some(value)) => Self::U256(Some(U256::from_be_hex(value.as_str()))),
            Primitive::USize(Some(value)) => Self::USize(Some(*value)),
            Primitive::Bool(Some(value)) => Self::Bool(Some(*value)),
            Primitive::Felt252(Some(value)) => {
                Self::Felt252(Some(FieldElement::from_str(value).unwrap()))
            }
            Primitive::ClassHash(Some(value)) => {
                Self::ClassHash(Some(FieldElement::from_str(value).unwrap()))
            }
            Primitive::ContractAddress(Some(value)) => {
                Self::ContractAddress(Some(FieldElement::from_str(value).unwrap()))
            }
            _ => unimplemented!(),
        }
    }
}

#[wasm_bindgen]
impl Client {
    #[wasm_bindgen(js_name = getEntities)]
    pub async fn get_entities(&self, query: Query) -> Result<JsValue, JsValue> {
        #[cfg(feature = "console-error-panic")]
        console_error_panic_hook::set_once();

        let results = self.inner.entities((&query).into()).await;

        match results {
            Ok(entities) => Ok(js_sys::JSON::parse(
                &parse_entities_as_json_str(entities).to_string(),
            )?),
            Err(err) => Err(JsValue::from(format!("failed to get entities: {err}"))),
        }
    }

    #[wasm_bindgen(js_name = getEntitiesByKeys)]
    pub async fn get_entities_by_keys(
        &self,
        model: &str,
        keys: Vec<String>,
        limit: u32,
        offset: u32,
    ) -> Result<JsValue, JsValue> {
        #[cfg(feature = "console-error-panic")]
        console_error_panic_hook::set_once();

        let query = Query {
            clause: Some(Clause::Keys(KeysClause {
                model: model.to_string(),
                keys,
            })),
            limit,
            offset,
        };

        let results = self.inner.entities((&query).into()).await;

        match results {
            Ok(entities) => Ok(js_sys::JSON::parse(
                &parse_entities_as_json_str(entities).to_string(),
            )?),
            Err(err) => Err(JsValue::from(format!("failed to get entities: {err}"))),
        }
    }

    /// Register new entities to be synced.
    #[wasm_bindgen(js_name = addModelsToSync)]
    pub async fn add_models_to_sync(&self, models: KeysClauses) -> Result<(), JsValue> {
        log("adding models to sync...");

        #[cfg(feature = "console-error-panic")]
        console_error_panic_hook::set_once();

        let models = models.0.iter().map(|e| e.into()).collect();

        self.inner
            .add_models_to_sync(models)
            .await
            .map_err(|err| JsValue::from(err.to_string()))
    }

    /// Remove the entities from being synced.
    #[wasm_bindgen(js_name = removeModelsToSync)]
    pub async fn remove_models_to_sync(&self, models: KeysClauses) -> Result<(), JsValue> {
        log("removing models to sync...");

        #[cfg(feature = "console-error-panic")]
        console_error_panic_hook::set_once();

        let models = models.0.iter().map(|e| e.into()).collect();

        self.inner
            .remove_models_to_sync(models)
            .await
            .map_err(|err| JsValue::from(err.to_string()))
    }

    /// Register a callback to be called every time the specified synced entity's value changes.
    #[wasm_bindgen(js_name = onSyncModelChange)]
    pub fn on_sync_model_change(
        &self,
        model: IEntityModel,
        callback: js_sys::Function,
    ) -> Result<(), JsValue> {
        #[cfg(feature = "console-error-panic")]
        console_error_panic_hook::set_once();

        let model = serde_wasm_bindgen::from_value::<EntityModel>(model.into())?;
        let name = cairo_short_string_to_felt(&model.model).expect("invalid model name");
        let mut rcv = self
            .inner
            .storage()
            .add_listener(name, &model.keys)
            .unwrap();

        wasm_bindgen_futures::spawn_local(async move {
            while rcv.next().await.is_some() {
                let _ = callback.call0(&JsValue::null());
            }
        });

        Ok(())
    }

    #[wasm_bindgen(js_name = onEntityUpdated)]
    pub async fn on_entity_updated(
        &self,
        ids: Option<Vec<String>>,
        callback: js_sys::Function,
    ) -> Result<(), JsValue> {
        #[cfg(feature = "console-error-panic")]
        console_error_panic_hook::set_once();

        let ids = ids
            .unwrap_or(vec![])
            .into_iter()
            .map(|id| {
                FieldElement::from_str(&id)
                    .map_err(|err| JsValue::from(format!("failed to parse entity id: {err}")))
            })
            .collect::<Result<Vec<_>, _>>()?;

        let mut stream = self.inner.on_entity_updated(ids).await.unwrap();

        wasm_bindgen_futures::spawn_local(async move {
            while let Some(update) = stream.next().await {
                let entity = update.expect("no updated entity");
                let json_str = parse_entities_as_json_str(vec![entity]).to_string();
                let _ = callback.call1(
                    &JsValue::null(),
                    &js_sys::JSON::parse(&json_str).expect("json parse failed"),
                );
            }
        });

        Ok(())
    }
}

/// Create the a client with the given configurations.
#[wasm_bindgen(js_name = createClient)]
#[allow(non_snake_case)]
pub async fn create_client(
    initialModelsToSync: KeysClauses,
    config: ClientConfig,
) -> Result<Client, JsValue> {
    #[cfg(feature = "console-error-panic")]
    console_error_panic_hook::set_once();

    let ClientConfig {
        rpc_url,
        torii_url,
        relay_url,
        world_address,
    } = config;

    let models = initialModelsToSync.0.iter().map(|e| e.into()).collect();

    let world_address = FieldElement::from_str(&world_address)
        .map_err(|err| JsValue::from(format!("failed to parse world address: {err}")))?;

    let client = torii_client::client::Client::new(
        torii_url,
        rpc_url,
        relay_url,
        world_address,
        Some(models),
    )
    .await
    .map_err(|err| JsValue::from(format!("failed to build client: {err}")))?;

    wasm_bindgen_futures::spawn_local(client.start_subscription().await.map_err(|err| {
        JsValue::from(format!(
            "failed to start torii client subscription service: {err}"
        ))
    })?);

    Ok(Client { inner: client })
}