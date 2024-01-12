// JS bindings for simplex

extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn floor_vec(values: Vec<f64>) -> Vec<f64> {
    values.into_iter().map(|v| v.floor()).collect()
}