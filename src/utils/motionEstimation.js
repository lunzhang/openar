import jsfeat from 'jsfeat';

jsfeat.fast_corners.set_threshold(20);

// calculates the relative camera pose using two frames
function motionEstimation(prevFrame, currentFrame, width, height) {
    // allocate pyramid data structure for tracker
    const currentPyramidT = new jsfeat.pyramid_t(3);
    const prevPyramidT = new jsfeat.pyramid_t(3);
    currentPyramidT.allocate(width, height, jsfeat.U8_t | jsfeat.C1_t);
    prevPyramidT.allocate(width, height, jsfeat.U8_t | jsfeat.C1_t);

    // get greyscale version of previous and current frame
    jsfeat.imgproc.grayscale(currentFrame, width, height, currentPyramidT.data[0], jsfeat.COLOR_RGBA2GRAY);
    jsfeat.imgproc.grayscale(prevFrame, width, height, prevPyramidT.data[0], jsfeat.COLOR_RGBA2GRAY);

    // build layers of pyramid
    currentPyramidT.build(currentPyramidT.data[0], false);
    prevPyramidT.build(prevPyramidT.data[0], false);

    // detect features for previous frame only using fast algorithm
    const prevCornersTemp = [];
    for (let i = 0; i < width * height; i++) {
        prevCornersTemp[i] = new jsfeat.keypoint_t();
    }
    const featuresCount = jsfeat.fast_corners.detect(prevPyramidT.data[0], prevCornersTemp, 3);

    // convert detected frames to array format
    const prevCorners = [];
    const currentCorners = [];
    for (let i = 0; i < featuresCount; i++) {
        prevCorners.push(prevCornersTemp[i].x);
        prevCorners.push(prevCornersTemp[i].y);
    }

    // klt tracker - tracks features in previous img and maps them to current
    const status = [];
    jsfeat.optical_flow_lk.track(prevPyramidT, currentPyramidT,
    prevCorners, currentCorners, featuresCount,
    15, 30, status, 0.01, 0.0001);

    // estimate motion even with wrong correspondences
    const ransac = jsfeat.motion_estimator.ransac;

    // create homography kernel
    const homo_kernel = new jsfeat.motion_model.homography2d();
    const essentialMatrix = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);
    const params = new jsfeat.ransac_params_t(4, 3, 0.5, 0.99);

    // calculate essential matrix using features detected in the images
    ransac(params, homo_kernel, prevCorners, currentCorners, featuresCount, essentialMatrix, status, 1000);

    const rotation = [];
    const translation = [];
    recoverPose(essentialMatrix, currentCorners, prevCorners, rotation, translation);

    return {
        rotation,
        translation,
    };
};

// calculates the rotation and translation using essentialMatrix
// E = U * D * V after svd
// R = U * Winvert * V
// T = U * W * D * Ut
function recoverPose(essentialMatrix, currentCorners, prevCorners, rotation, translation) {
    const D = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);
    const U = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);
    const V = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);
    const W = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);
    W.data[1] = -1;
    W.data[3] = 1;
    W.data[8] = 1;

    // get inverse of W
    const Winvert = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);
    jsfeat.linalg.svd_invert(Winvert, W);

    // rotation and translation matrices
    const R = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);
    const T = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);

    // calculate SVD of essential matrix
    jsfeat.linalg.svd_decompose(essentialMatrix, D, U, V);

    // R = U * Winvert * V
    jsfeat.matmath.multiply_3x3(R, U, Winvert);
    jsfeat.matmath.multiply_3x3(R, R, V);

    // T = U * W * D * Ut
    jsfeat.matmath.multiply_3x3(T, U, W);
    jsfeat.matmath.multiply_3x3(T, T, D);
    jsfeat.matmath.multiply_ABt(T, T, U);

    rotation = R.data;
    translation = T.data;
};

export default motionEstimation;
