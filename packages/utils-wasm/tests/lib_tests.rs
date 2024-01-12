extern crate wasm_bindgen;
use utils_wasm::floor;

extern crate utils_wasm;
use utils_wasm::helpers::multiply_logic;
use utils_wasm::types::ScalarOrVec;

/* Test multiply_logic */
#[test]
fn test_multiply_logic_scalars() {
    let a = ScalarOrVec::Scalar(2.0);
    let b = ScalarOrVec::Scalar(3.0);
    assert_eq!(multiply_logic(a, b), ScalarOrVec::Scalar(6.0));
}

#[test]
fn test_multiply_logic_scalar_vector() {
    let a = ScalarOrVec::Scalar(2.0);
    let b = ScalarOrVec::Vec(vec![1.0, 2.0, 3.0]);
    assert_eq!(multiply_logic(a, b), ScalarOrVec::Vec(vec![2.0, 4.0, 6.0]));
}

#[test]
fn test_multiply_logic_vector_scalar() {
    let a = ScalarOrVec::Vec(vec![1.0, 2.0, 3.0]);
    let b = ScalarOrVec::Scalar(2.0);
    assert_eq!(multiply_logic(a, b), ScalarOrVec::Vec(vec![2.0, 4.0, 6.0]));
}

#[test]
fn test_multiply_logic_vector_vector() {
    let a = ScalarOrVec::Vec(vec![1.0, 2.0, 3.0]);
    let b = ScalarOrVec::Vec(vec![2.0, 3.0, 4.0]);
    assert_eq!(multiply_logic(a, b), ScalarOrVec::Vec(vec![2.0, 6.0, 12.0]));
}

/* Test floor */
#[test]
fn test_floor() {
    let input = vec![0.1, 1.999, 4.5, 7.0];
    let expected = vec![0.0, 1.0, 4.0, 7.0];
    let actual = floor(input);
    assert_eq!(expected, actual);
}
