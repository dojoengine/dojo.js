pub fn multiply_vec(a: &Vec<f64>, b: &Vec<f64>) -> Vec<f64> {
    a.iter().zip(b.iter()).map(|(&x, &y)| x * y).collect()
}

pub fn multiply_scalar_vec(scalar: f64, vec: &Vec<f64>) -> Vec<f64> {
    vec.iter().map(|&x| x * scalar).collect()
}

pub fn add(a: &Vec<f64>, b: &Vec<f64>) -> Vec<f64> {
    a.iter().zip(b.iter()).map(|(&x, &y)| x + y).collect()
}

pub fn add_scalar_vec(scalar: f64, vec: &Vec<f64>) -> Vec<f64> {
    vec.iter().map(|&x| x + scalar).collect()
}

pub fn subtract(a: &Vec<f64>, b: &Vec<f64>) -> Vec<f64> {
    a.iter().zip(b.iter()).map(|(&x, &y)| x - y).collect()
}

pub fn min_vec(v1: Vec<f64>, v2: Vec<f64>) -> Vec<f64> {
    v1.iter().zip(v2.iter()).map(|(&a, &b)| a.min(b)).collect()
}

pub fn max_vec(v1: Vec<f64>, v2: Vec<f64>) -> Vec<f64> {
    v1.iter().zip(v2.iter()).map(|(&a, &b)| a.max(b)).collect()
}

pub fn abs_vec(v: Vec<f64>) -> Vec<f64> {
    v.iter().map(|&x| x.abs()).collect()
}

pub fn dot_product(v1: &Vec<f64>, v2: &Vec<f64>) -> f64 {
    v1.iter().zip(v2.iter()).map(|(&a, &b)| a * b).sum()
}
