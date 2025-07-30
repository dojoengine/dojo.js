import * as math from "mathjs";

const multiply = (a: any, b: any) => {
    if (!Array.isArray(a) || !Array.isArray(b)) return math.multiply(a, b);
    return a.map((v, i) => v * b[i]);
};

const floor = (a: any) => {
    return a.map((v: any) => Math.floor(v));
};

const step = (a: any, b: any) => {
    return a.map((v: any, i: any) => (b[i] <= v ? 0 : 1));
};

const mod289 = (x: any) => {
    return x.map((v: any) => v - Math.floor(v * (1.0 / 289.0)) * 289.0);
};

const permute = (x: any) => {
    x = x.map((v: any) => (v * 34.0 + 1.0) * v);
    return mod289(x);
};

const taylorInvSqrt = (r: any) => {
    return r.map((v: any) => 1.79284291400159 - 0.85373472095314 * v);
};

export const snoise = (v: any) => {
    const C = [1.0 / 6.0, 1.0 / 3.0];
    const D = [0.0, 0.5, 1.0, 2.0];

    // First corner
    const i = floor(math.add(v, math.dot(v, [C[1], C[1], C[1]])));
    const x0 = math.add(math.subtract(v, i), math.dot(i, [C[0], C[0], C[0]]));

    // Other corners
    const g = step([x0[1], x0[2], x0[0]], [x0[0], x0[1], x0[2]]);
    const l = math.subtract(1.0, g);
    const i1 = math.min(
        [
            [g[0], g[1], g[2]],
            [l[2], l[0], l[1]],
        ],
        0
    );
    const i2 = math.max(
        [
            [g[0], g[1], g[2]],
            [l[2], l[0], l[1]],
        ],
        0
    );

    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    const x1 = math.add(math.subtract(x0, i1), [C[0], C[0], C[0]]);
    const x2 = math.add(math.subtract(x0, i2), [C[1], C[1], C[1]]); // 2.0*C.x = 1/3 = C.y
    const x3 = math.subtract(x0, [D[1], D[1], D[1]]); // -1.0+3.0*C.x = -0.5 = -D.y

    // Permutations
    let p1 = permute(math.add(i[2], [0.0, i1[2], i2[2], 1.0]));
    let p2 = permute(math.add(math.add(p1, i[1]), [0.0, i1[1], i2[1], 1.0]));
    const p = permute(math.add(math.add(p2, i[0]), [0.0, i1[0], i2[0], 1.0]));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    const ns = [0.285714285714286, -0.928571428571428, 0.142857142857143]; // these must be *exact*
    const j = math.subtract(p, multiply(49, floor(multiply(p, ns[2] * ns[2])))); //  mod(p,7*7)

    const x_ = floor(multiply(j, ns[2]));
    const y_ = floor(math.subtract(j, multiply(7, x_))); // mod(j,N)

    const x = math.add(multiply(x_, ns[0]), [ns[1], ns[1], ns[1], ns[1]]);
    const y = math.add(multiply(y_, ns[0]), [ns[1], ns[1], ns[1], ns[1]]);
    const h = math.subtract(math.subtract(1.0, math.abs(x)), math.abs(y));

    const b0 = [x[0], x[1], y[0], y[1]];
    const b1 = [x[2], x[3], y[2], y[3]];
    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    const s0 = math.add(multiply(floor(b0), 2.0), 1.0);
    const s1 = math.add(multiply(floor(b1), 2.0), 1.0);
    const sh = multiply(-1, step(h, [0, 0, 0, 0]));

    const a0 = math.add(
        [b0[0], b0[2], b0[1], b0[3]],
        multiply([s0[0], s0[2], s0[1], s0[3]], [sh[0], sh[0], sh[1], sh[1]])
    );
    const a1 = math.add(
        [b1[0], b1[2], b1[1], b1[3]],
        multiply([s1[0], s1[2], s1[1], s1[3]], [sh[2], sh[2], sh[3], sh[3]])
    );

    let p0 = [a0[0], a0[1], h[0]];
    p1 = [a0[2], a0[3], h[1]];
    p2 = [a1[0], a1[1], h[2]];
    let p3 = [a1[2], a1[3], h[3]];

    // Normalise gradients
    const norm = taylorInvSqrt([
        math.dot(p0, p0),
        math.dot(p1, p1),
        math.dot(p2, p2),
        math.dot(p3, p3),
    ]);
    p0 = multiply(p0, norm[0]);
    p1 = multiply(p1, norm[1]);
    p2 = multiply(p2, norm[2]);
    p3 = multiply(p3, norm[3]);

    // Mix final noise value
    //@ts-ignore
    let m = math.max(
        [
            //@ts-ignore
            math.subtract(0.5, [
                math.dot(x0, x0),
                math.dot(x1, x1),
                math.dot(x2, x2),
                math.dot(x3, x3),
            ]),
            [0, 0, 0, 0],
        ],
        0
    );
    m = multiply(m, m);
    m = multiply(m, m);
    const noise = multiply(
        105.0,
        //@ts-ignore
        math.dot(m, [
            math.dot(p0, x0),
            math.dot(p1, x1),
            math.dot(p2, x2),
            math.dot(p3, x3),
        ])
    );
    return noise;
};

export const recursiveSNoise = (p: any, pers: any, octaves: any) => {
    let total = 0.0;
    let frequency = 1.0;
    let amplitude = 1.0;
    let maxValue = 0.0;

    for (let i = 0; i < octaves; i++) {
        total += snoise(multiply(p, frequency)) * amplitude;
        maxValue += amplitude;
        amplitude *= pers;
        frequency *= 2.0;
    }

    const noise = total / maxValue;
    return noise;
};

export default {
    snoise,
    recursiveSNoise,
};
