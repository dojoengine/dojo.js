extern crate utils_wasm;
extern crate wasm_bindgen;
use utils_wasm::types::ScalarOrVec;

/* Test multiply_logic */
// #[test]
// fn test_multiply_logic_scalars() {
//     let a = ScalarOrVec::Scalar(2.0);
//     let b = ScalarOrVec::Scalar(3.0);
//     assert_eq!(multiply_logic(a, b), ScalarOrVec::Scalar(6.0));
// }

// #[test]
// fn test_multiply_logic_scalar_vector() {
//     let a = ScalarOrVec::Scalar(2.0);
//     let b = ScalarOrVec::Vec(vec![1.0, 2.0, 3.0]);
//     assert_eq!(multiply_logic(a, b), ScalarOrVec::Vec(vec![2.0, 4.0, 6.0]));
// }

// #[test]
// fn test_multiply_logic_vector_scalar() {
//     let a = ScalarOrVec::Vec(vec![1.0, 2.0, 3.0]);
//     let b = ScalarOrVec::Scalar(2.0);
//     assert_eq!(multiply_logic(a, b), ScalarOrVec::Vec(vec![2.0, 4.0, 6.0]));
// }

// #[test]
// fn test_multiply_logic_vector_vector() {
//     let a = ScalarOrVec::Vec(vec![1.0, 2.0, 3.0]);
//     let b = ScalarOrVec::Vec(vec![2.0, 3.0, 4.0]);
//     assert_eq!(multiply_logic(a, b), ScalarOrVec::Vec(vec![2.0, 6.0, 12.0]));
// }

/* Test floor */
#[test]
fn test_floor() {
    let input = vec![0.1, 1.999, 4.5, 7.0];
    let expected = vec![0.0, 1.0, 4.0, 7.0];
    let actual = utils_wasm::floor(input);
    assert_eq!(expected, actual);
}

/* Test step */
#[test]
fn test_step() {
    let a = vec![0.0, 3.0, 8.0, 2.0, 1.0];
    let b = vec![1.0, 4.0, 2.0, 2.0, 5.0];
    let expected = vec![1, 1, 0, 0, 1];
    let actual = utils_wasm::step(a, b);
    assert_eq!(expected, actual);
}

/* Test mod289 */
#[test]
fn test_mod289() {
    let input = vec![290.0, 578.0, 867.0];
    let expected = vec![1.0, 0.0, 0.0];
    assert_eq!(utils_wasm::mod289(input), expected);
}

/* Test permute */
#[test]
fn test_permute() {
    let input = vec![1.0, 2.0, 3.0];
    let expected = vec![35.0, 138.0, 20.0];
    assert_eq!(utils_wasm::permute(input), expected);
}

/* Test taylor_inv_sqrt */
#[test]
fn test_taylor_inv_sqrt() {
    let input = vec![0.0, 1.0, 2.0];
    let expected = vec![1.79284291400159, 0.93910819304845, 0.08537347209531];
    let result = utils_wasm::taylor_inv_sqrt(input);
    for (a, b) in result.iter().zip(expected.iter()) {
        assert!((a - b).abs() < 1e-9);
    }
}
