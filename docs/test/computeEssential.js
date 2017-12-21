const MAX_ITERATIONS = 1;
const MODEL_SIZE = 5;
const PROBABILITY = 0.99;
const focal = 800;
const IMAGE_WIDTH = 150;
const IMAGE_HEIGHT = 150;
const cameraParams = [[focal, 0, IMAGE_WIDTH / 2],
[0,	focal, IMAGE_HEIGHT / 2],
[0, 0, 1]];

// nX = x - px / 2
function normalizeXCoord(xCoord) {
    const Xcoordinate = (xCoord - cameraParams[0][2]) / cameraParams[0][0];

    return Xcoordinate;
};

// nY = y - py / 2
function normalizeYCoord(yCoord) {
    const Ycoordinate = (yCoord - cameraParams[1][2]) / cameraParams[1][1];

    return Ycoordinate;
};

// E = K1t * F * K2 -> F = E * K'1t * K'2
function getFundamentalMat(eMat) {
    let fMat = [];

    const K = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);
    const Kt = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);
    const F = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);
    const E = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);

    E.data = eMat[0].concat(eMat[1].concat(eMat[2]));
    K.data = cameraParams[0].concat(cameraParams[1].concat(cameraParams[2]));
    jsfeat.matmath.transpose(Kt, K);
    jsfeat.matmath.invert_3x3(K, K);
    jsfeat.matmath.invert_3x3(Kt, Kt);

    jsfeat.matmath.multiply_3x3(F, E, K);
    jsfeat.matmath.multiply_3x3(F, F, Kt);

    for(let i = 0; i < 3; i++) {
        fMat.push([F.data[i * 3], F.data[i * 3 + 1], F.data[i * 3 + 2]]);
    }

    return fMat;
};

function computeEssential(feature1, feature2) {
    // 3x3 matrix;
    const essentialMatrix = [];
    for (let i = 0; i < 3; i++) {
        essentialMatrix.push([]);
    }

    const feats1 = [];
    const feats2 = [];

    for (let i = 0; i < feature1.length; i++) {
        feats1.push(normalizeXCoord(feature1[i * 2]));
        feats1.push(normalizeYCoord(feature1[i * 2 + 1]));
        feats2.push(normalizeXCoord(feature2[i * 2]));
        feats2.push(normalizeYCoord(feature2[i * 2 + 1]));
    }

    let iterations = 0;

    while(iterations < MAX_ITERATIONS) {
        let points1 = [];
        let points2 = [];

        // Select 5 random points
        for (let i = 0; i < 5; i++) {
            let index = Math.floor(Math.random() * (feature1.length / 2));
            let point1 = [feats1[index * 2], feats1[index * 2 + 1]];
            let point2 = [feats2[index * 2], feats2[index * 2 + 1]];
            points1.push(point1);
            points2.push(point2);
        }

        const { Ematrices, nroots } = compute_e_matrices(points1, points2);

        let E;
        for (let i = 0; i < nroots; i++) {
            let fMat = getFundamentalMat(Ematrices[i]);
            // x'Fx = 0 or close to 0
            let error = (fMat[0][0] * feature1[0] * feature2[0]) +
            (fMat[0][1] * feature1[1] * feature2[0]) +
            (fMat[0][2] * feature2[0]) +
            (fMat[1][0] * feature1[0] * feature2[1]) +
            (fMat[1][1] * feature1[1] * feature2[1]) +
            (fMat[1][2] * feature2[1]) +
            (fMat[2][0] * feature1[0]) +
            (fMat[2][1] * feature1[1]) +
            (fMat[2][2]);
        }

        iterations++;
    }

    return essentialMatrix;
}
