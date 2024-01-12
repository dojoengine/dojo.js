use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, PartialEq, Debug)]
pub enum ScalarOrVec {
    Scalar(f64),
    Vec(Vec<f64>),
}
