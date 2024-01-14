use utils_wasm::snoise;


fn main() {
    const MAP_AMPLITUDE: f64 = 16.0;
    let x = 11.5;
    let y = 158;
    let noise_value = snoise(vec![x as f64 / MAP_AMPLITUDE, 0.0, y as f64 / MAP_AMPLITUDE]);
    let seed = ((noise_value + 1.0) / 2.0 * 100.0).floor();

    println!("Coord ({}, {}) : Seed {}", x, y, seed);

}