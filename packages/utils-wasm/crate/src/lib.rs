// JS bindings for simplex
pub mod helpers;
pub mod types;

extern crate wasm_bindgen;
use crate::helpers::{
    abs_vec, add, add_scalar_vec, dot_product, max_vec, min_vec, multiply_scalar_vec, multiply_vec,
    subtract,
};
use wasm_bindgen::prelude::*;

pub fn floor(values: Vec<f64>) -> Vec<f64> {
    values.into_iter().map(|v| v.floor()).collect()
}

pub fn step(a: Vec<f64>, b: Vec<f64>) -> Vec<i32> {
    a.into_iter()
        .zip(b.into_iter())
        .map(|(a_elem, b_elem)| if b_elem <= a_elem { 0 } else { 1 })
        .collect()
}

pub fn mod289(values: Vec<f64>) -> Vec<f64> {
    values
        .into_iter()
        .map(|v| v - (v * (1.0 / 289.0)).floor() * 289.0)
        .collect()
}

pub fn permute(x: Vec<f64>) -> Vec<f64> {
    let transformed_x: Vec<f64> = x.into_iter().map(|v| (v * 34.0 + 1.0) * v).collect();
    mod289(transformed_x)
}

pub fn taylor_inv_sqrt(r: Vec<f64>) -> Vec<f64> {
    r.into_iter()
        .map(|v| 1.79284291400159 - 0.85373472095314 * v)
        .collect()
}

#[wasm_bindgen]
pub fn snoise(v: &[f64]) -> f64 {

    let v = v.to_vec();
    let c: [f64; 2] = [1.0 / 6.0, 1.0 / 3.0];
    let d: [f64; 4] = [0.0, 0.5, 1.0, 2.0];

    // First corner
    let dot_v_c1 = dot_product(&v, &vec![c[1], c[1], c[1]]);
    let i = floor(add(&v, &vec![dot_v_c1; 3]));

    let subtract_v_i = subtract(&v, &i);
    let dot_i_c0 = dot_product(&i, &vec![c[0], c[0], c[0]]);
    let x0 = add(&subtract_v_i, &vec![dot_i_c0; 3]);

    // Other corners
    let g = step(vec![x0[1], x0[2], x0[0]], vec![x0[0], x0[1], x0[2]]);
    let l = g.iter().map(|&value| 1 - value).collect::<Vec<i32>>();

    let i1 = min_vec(
        vec![g[0] as f64, g[1] as f64, g[2] as f64],
        vec![l[2] as f64, l[0] as f64, l[1] as f64],
    );
    let i2 = max_vec(
        vec![g[0] as f64, g[1] as f64, g[2] as f64],
        vec![l[2] as f64, l[0] as f64, l[1] as f64],
    );

    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    let x1 = add(&subtract(&x0, &vec![i1[0], i1[1], i1[2]]), &vec![c[0]; 3]);
    let x2 = add(&subtract(&x0, &vec![i2[0], i2[1], i2[2]]), &vec![c[1]; 3]);
    let x3 = subtract(&x0, &vec![d[1]; 3]);

    // Permutations
    let mut p1 = permute(add_scalar_vec(i[2], &vec![0.0, i1[2], i2[2], 1.0]));
    let mut p2 = permute(add(
        &add_scalar_vec(i[1], &p1),
        &vec![0.0, i1[1], i2[1], 1.0],
    ));
    let p_before = add(&add_scalar_vec(i[0], &p2), &vec![0.0, i1[0], i2[0], 1.0]);
    let p = permute(p_before);

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    let ns = [0.285714285714286, -0.928571428571428, 0.142857142857143]; // these must be *exact*

    let j = subtract(
        &p,
        &multiply_vec(
            &vec![49.0; 4],
            &floor(multiply_scalar_vec(ns[2] * ns[2], &p)),
        ),
    ); //  mod(p,7*7)

    let x_ = floor(multiply_scalar_vec(ns[2], &j));
    let y_ = floor(subtract(&j, &multiply_vec(&vec![7.0; 4], &x_))); // mod(j,N)

    let x = add(&multiply_scalar_vec(ns[0], &x_.clone()), &vec![ns[1]; 4]);
    let y = add(&multiply_scalar_vec(ns[0], &y_.clone()), &vec![ns[1]; 4]);
    let h = subtract(
        &subtract(&vec![1.0; x.len()], &abs_vec(x.clone())),
        &abs_vec(y.clone()),
    );

    let b0 = vec![x[0], x[1], y[0], y[1]];
    let b1 = vec![x[2], x[3], y[2], y[3]];
    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;

    let b0_clone = b0.clone();
    let b1_clone = b1.clone();

    let s0 = add_scalar_vec(1.0, &multiply_scalar_vec(2.0, &floor(b0_clone)));
    let s1 = add_scalar_vec(1.0, &multiply_scalar_vec(2.0, &floor(b1_clone)));
    let sh = multiply_scalar_vec(
        -1.0,
        &step(h.clone(), vec![0.0, 0.0, 0.0, 0.0])
            .iter()
            .map(|&x| x as f64)
            .collect::<Vec<f64>>(),
    );

    let a0 = add(
        &vec![b0[0], b0[2], b0[1], b0[3]],
        &multiply_vec(
            &vec![s0[0], s0[2], s0[1], s0[3]],
            &vec![sh[0], sh[0], sh[1], sh[1]],
        ),
    );
    let a1 = add(
        &vec![b1[0], b1[2], b1[1], b1[3]],
        &multiply_vec(
            &vec![s1[0], s1[2], s1[1], s1[3]],
            &vec![sh[2], sh[2], sh[3], sh[3]],
        ),
    );

    let p0 = vec![a0[0], a0[1], h[0]];
    p1 = vec![a0[2], a0[3], h[1]];
    p2 = vec![a1[0], a1[1], h[2]];
    let p3 = vec![a1[2], a1[3], h[3]];

    let dot_p0 = dot_product(&p0, &p0);
    let dot_p1 = dot_product(&p1, &p1);
    let dot_p2 = dot_product(&p2, &p2);
    let dot_p3 = dot_product(&p3, &p3);

    // Normalise gradients
    let norm = taylor_inv_sqrt(vec![dot_p0, dot_p1, dot_p2, dot_p3]);

    let p0 = multiply_scalar_vec(norm[0], &p0);
    let p1 = multiply_scalar_vec(norm[1], &p1);
    let p2 = multiply_scalar_vec(norm[2], &p2);
    let p3 = multiply_scalar_vec(norm[3], &p3);

    // Mix final noise value
    let subtract_and_max = |dot_product: f64| -> f64 {
        let value = 0.5 - dot_product;
        if value > 0.0 {
            value
        } else {
            0.0
        }
    };

    let m = vec![
        subtract_and_max(dot_product(&x0, &x0)),
        subtract_and_max(dot_product(&x1, &x1)),
        subtract_and_max(dot_product(&x2, &x2)),
        subtract_and_max(dot_product(&x3, &x3)),
    ];

    let m_squared = multiply_vec(&m, &m);
    let m_fourth = multiply_vec(&m_squared, &m_squared);

    let dot_m = dot_product(
        &m_fourth,
        &vec![
            dot_product(&p0, &x0),
            dot_product(&p1, &x1),
            dot_product(&p2, &x2),
            dot_product(&p3, &x3),
        ],
    );

    let noise = 105.0 * dot_m;

    noise
}
