//! Minimal JS bindings for the torii client.

use std::str::FromStr;

use torii_grpc::types::{KeysClause, Clause, Query};
use futures::StreamExt;
use starknet::core::types::FieldElement;
use starknet::core::utils::cairo_short_string_to_felt;
use wasm_bindgen::prelude::*;

mod types;
mod utils;

use types::{ClientConfig, EntityModel, IEntityModel};
use utils::{parse_ty_as_json_str, parse_entities_as_json_str};

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

#[wasm_bindgen]
impl Client {
    #[wasm_bindgen(js_name = getEntities)]
    pub async fn get_entities(
        &self,
        limit: u32,
        offset: u32
    ) -> Result<JsValue, JsValue> {
        #[cfg(feature = "console-error-panic")]
        console_error_panic_hook::set_once();

        let results = self.inner.entities(Query {
            clause: None,
            limit,
            offset
        }).await;

        match results {
            Ok(entities) => Ok(js_sys::JSON::parse(&parse_entities_as_json_str(entities).to_string())?),
            Err(err) => Err(JsValue::from(format!("failed to get entities: {err}"))),
        }
    }
    
    #[wasm_bindgen(js_name = getEntitiesByKeys)]
    pub async fn get_entities_by_keys(
        &self,
        model: &str,
        keys: Vec<JsFieldElement>,
        limit: u32,
        offset: u32
    ) -> Result<JsValue, JsValue> {
        #[cfg(feature = "console-error-panic")]
        console_error_panic_hook::set_once();

        let keys = keys
            .into_iter()
            .map(serde_wasm_bindgen::from_value::<FieldElement>)
            .collect::<Result<Vec<FieldElement>, _>>()
            .map_err(|err| JsValue::from(format!("failed to parse entity keys: {err}")))?;

        let results = self.inner.entities(Query {
            clause: Some(Clause::Keys(KeysClause {
                model: model.to_string(),
                keys
            })),
            limit,
            offset
        }).await;
        
        match results {
            Ok(entities) => Ok(js_sys::JSON::parse(&parse_entities_as_json_str(entities).to_string())?),
            Err(err) => Err(JsValue::from(format!("failed to get entities: {err}"))),
        }
    }

    /// Retrieves the model value of an entity. Will fetch from remote if the requested entity is not one of the entities that are being synced.
    #[wasm_bindgen(js_name = getModelValue)]
    pub async fn get_model_value(
        &self,
        model: &str,
        keys: Vec<JsFieldElement>,
    ) -> Result<JsValue, JsValue> {
        #[cfg(feature = "console-error-panic")]
        console_error_panic_hook::set_once();

        let keys = keys
            .into_iter()
            .map(serde_wasm_bindgen::from_value::<FieldElement>)
            .collect::<Result<Vec<FieldElement>, _>>()
            .map_err(|err| JsValue::from(format!("failed to parse entity keys: {err}")))?;

        match self
            .inner
            .model(&KeysClause {
                model: model.to_string(),
                keys,
            })
            .await
        {
            Ok(Some(ty)) => Ok(js_sys::JSON::parse(&parse_ty_as_json_str(&ty).to_string())?),
            Ok(None) => Ok(JsValue::NULL),

            Err(err) => Err(JsValue::from(format!("failed to get entity: {err}"))),
        }
    }

    /// Register new entities to be synced.
    #[wasm_bindgen(js_name = addModelsToSync)]
    pub async fn add_models_to_sync(&self, models: Vec<IEntityModel>) -> Result<(), JsValue> {
        log("adding models to sync...");

        #[cfg(feature = "console-error-panic")]
        console_error_panic_hook::set_once();

        let models = models
            .into_iter()
            .map(|e| TryInto::<KeysClause>::try_into(e))
            .collect::<Result<Vec<_>, _>>()?;

        self.inner
            .add_models_to_sync(models)
            .await
            .map_err(|err| JsValue::from(err.to_string()))
    }

    /// Remove the entities from being synced.
    #[wasm_bindgen(js_name = removeModelsToSync)]
    pub async fn remove_models_to_sync(
        &self,
        models: Vec<IEntityModel>,
    ) -> Result<(), JsValue> {
        log("removing models to sync...");

        #[cfg(feature = "console-error-panic")]
        console_error_panic_hook::set_once();

        let models = models
            .into_iter()
            .map(|e| TryInto::<KeysClause>::try_into(e))
            .collect::<Result<Vec<_>, _>>()?;

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
            .map(|id| FieldElement::from_str(&id).map_err(|err| JsValue::from(format!("failed to parse entity id: {err}"))))
            .collect::<Result<Vec<_>, _>>()?;

        let mut stream = self
            .inner
            .on_entity_updated(ids)
            .await
            .unwrap();

        wasm_bindgen_futures::spawn_local(async move {
            while let Some(update) = stream.next().await {
                let entity = update.expect("no updated entity");
                let json_str = parse_entities_as_json_str(vec![entity]).to_string();
                let _ = callback.call1(
                    &JsValue::null(), 
                    &js_sys::JSON::parse(&json_str).expect("json parse failed")
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
    initialModelsToSync: Vec<IEntityModel>,
    config: ClientConfig,
) -> Result<Client, JsValue> {
    #[cfg(feature = "console-error-panic")]
    console_error_panic_hook::set_once();

    let ClientConfig {
        rpc_url,
        torii_url,
        world_address,
    } = config;

    let models = initialModelsToSync
        .into_iter()
        .map(|e| TryInto::<KeysClause>::try_into(e))
        .collect::<Result<Vec<_>, _>>()?;

    let world_address = FieldElement::from_str(&world_address)
        .map_err(|err| JsValue::from(format!("failed to parse world address: {err}")))?;

    let client =
        torii_client::client::Client::new(torii_url, rpc_url, world_address, Some(models))
            .await
            .map_err(|err| JsValue::from(format!("failed to build client: {err}")))?;

    wasm_bindgen_futures::spawn_local(client.start_subscription().await.map_err(|err| {
        JsValue::from(format!(
            "failed to start torii client subscription service: {err}"
        ))
    })?);

    Ok(Client { inner: client })
}
