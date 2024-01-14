extern crate utils_wasm;
extern crate wasm_bindgen;
mod ts_values;

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

/* Test snoise */
#[test]
fn test_snoise() {
    let mut results = Vec::new();
    for x in 0..=9 {
        for y in 0..=9 {
            let input = vec![x as f64, 0.0, y as f64];
            let noise_result = utils_wasm::snoise(&input);
            results.push(noise_result);
        }
    }

    for (result, expected) in results.iter().zip(ts_values::SNOISE_TS_VALUES.iter()) {
        assert!((*result - expected).abs() < 1e-9);
    }
}

/* Test recursive_s_noise */
#[test]
fn test_recursive_snoise() {
    let mut results = Vec::new();
    let pers_values = [0.5, 0.7];
    let octave_counts = [1, 2, 3];

    let mut points = Vec::new();

    // Grid of points
    for x in (-1..=1).map(|n| n as f64) {
        for y in (-1..=1).map(|n| n as f64) {
            for z in (-1..=1).map(|n| n as f64) {
                points.push(vec![x, y, z]);
            }
        }
    }

    for p in &points {
        for &pers in &pers_values {
            for &octaves in &octave_counts {
                let noise_value = utils_wasm::recursive_s_noise(p.to_vec(), pers, octaves);
                results.push(noise_value);
            }
        }
    }

    for (result, expected) in results
        .iter()
        .zip(ts_values::RECURSIVE_SNOISE_TS_VALUES.iter())
    {
        assert!((*result - expected).abs() < 1e-9);
    }
}
