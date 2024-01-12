use crate::types::ScalarOrVec;

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
                .into_iter()
                .zip(vec_b.into_iter())
                .map(|(x, y)| x * y)
                .collect())
        }
    }
}
