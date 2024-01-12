// JS bindings for simplex

extern crate wasm_bindgen;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

#[derive(Serialize, Deserialize, PartialEq, Debug)]
pub enum ScalarOrVec {
    Scalar(f64),
    Vec(Vec<f64>),
}

fn scalar_or_vec_to_js_value(scalar_or_vec: ScalarOrVec) -> JsValue {
    match scalar_or_vec {
        ScalarOrVec::Scalar(scalar) => JsValue::from_f64(scalar),
        ScalarOrVec::Vec(vec) => {
            serde_wasm_bindgen::to_value(&vec).unwrap() // todo: handle error
        }
    }
}

pub fn multiply_logic(a: ScalarOrVec, b: ScalarOrVec) -> ScalarOrVec {
    use ScalarOrVec::*;

    match (a, b) {
        (Scalar(scalar_a), Scalar(scalar_b)) => Scalar(scalar_a * scalar_b),
        (Scalar(scalar), Vec(vec)) | (Vec(vec), Scalar(scalar)) => {
            Vec(vec.iter().map(|&x| x * scalar).collect())
        }
        (Vec(vec_a), Vec(vec_b)) => {
            if vec_a.len() != vec_b.len() {
                panic!("Vectors must be of the same length");
            }
            Vec(vec_a
                .iter()
                .zip(vec_b.iter())
                .map(|(&x, &y)| x * y)
                .collect())
        }
    }
}

#[wasm_bindgen]
pub fn multiply(a: JsValue, b: JsValue) -> JsValue {
    use multiply_logic;
    let scalar_or_vec_a = serde_wasm_bindgen::from_value(a).unwrap(); // todo: handle error
    let scalar_or_vec_b = serde_wasm_bindgen::from_value(b).unwrap();

    let result = multiply_logic(scalar_or_vec_a, scalar_or_vec_b);

    scalar_or_vec_to_js_value(result)
}

#[wasm_bindgen]
pub fn floor(values: Vec<f64>) -> Vec<f64> {
    values.into_iter().map(|v| v.floor()).collect()
}
