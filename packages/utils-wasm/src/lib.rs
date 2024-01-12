// JS bindings for simplex
pub mod helpers;
pub mod types;

extern crate wasm_bindgen;
use crate::helpers::multiply_logic;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

#[wasm_bindgen]
pub fn multiply(a: JsValue, b: JsValue) -> JsValue {
    use multiply_logic;
    let scalar_or_vec_a = serde_wasm_bindgen::from_value(a).unwrap(); // todo: handle error
    let scalar_or_vec_b = serde_wasm_bindgen::from_value(b).unwrap();

    let result = multiply_logic(scalar_or_vec_a, scalar_or_vec_b);

    serde_wasm_bindgen::to_value(&result).unwrap()
}

#[wasm_bindgen]
pub fn floor(values: Vec<f64>) -> Vec<f64> {
    values.into_iter().map(|v| v.floor()).collect()
}

#[wasm_bindgen]
pub fn step(a: Vec<f64>, b: Vec<f64>) -> Vec<i32> {
    a.into_iter()
        .zip(b.into_iter())
        .map(|(a_elem, b_elem)| if b_elem <= a_elem { 0 } else { 1 })
        .collect()
}
