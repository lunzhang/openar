import jsfeat from 'jsfeat';

jsfeat.fast_corners.set_threshold(20);

/**
* Converts frame to grayscale
* @return pyramidT : pyramid_t
*/
function convertToGrayScale(frame, width, height) {
    // allocate pyramid data structure for feature tracker
    const pyramidT = new jsfeat.pyramid_t(3);
    pyramidT.allocate(width, height, jsfeat.U8_t);

    // get grayscale version of frames
    jsfeat.imgproc.grayscale(frame, width, height, pyramidT.data[0], jsfeat.COLOR_RGBA2GRAY);

    // build pyramid layers
    pyramidT.build(pyramidT.data[0], false);

    return pyramidT;
}

/**
* Detect features in frame using fast algorithm
* @return number of features detected
*/
function detectFeatures(frame, features, width, height) {
    // detect features for frame
    const tempFeatures = [];
    for (let i = 0; i < width * height; i++) {
        tempFeatures[i] = new jsfeat.keypoint_t();
    }
    const count = jsfeat.fast_corners.detect(frame.data[0], tempFeatures, 3);

    // add detected features to array
    for (let i = 0; i < count; i++) {
        features.push(tempFeatures[i].x);
        features.push(tempFeatures[i].y);
    }

    return count;
}

/**
* Converts a 3x3 rotation matrix in array format to x/y/z angles
* Uses equation found here http://nghiaho.com/?page_id=846
*/
function decomposeRotationMatrix(matrix) {
    return {
        x: Math.atan2(matrix[7], matrix[8]),
        y: Math.atan2(-matrix[6], Math.sqrt((matrix[7] ** 2) + (matrix[8] ** 2))),
        z: Math.atan2(matrix[3], matrix[0]),
    };
}

/** Calculates the rotation and translation using an essential matrix
* E = U * D * V after svd
* R = U * Winvert * V
* T = U * W * D * Ut
*/
function recoverPose(essentialMatrix) {
    const D = new jsfeat.matrix_t(3, 3, jsfeat.F32_t);
    const U = new jsfeat.matrix_t(3, 3, jsfeat.F32_t);
    const V = new jsfeat.matrix_t(3, 3, jsfeat.F32_t);
    const W = new jsfeat.matrix_t(3, 3, jsfeat.F32_t);
    W.data[1] = -1;
    W.data[3] = 1;
    W.data[8] = 1;

    // get inverse of W
    const Winvert = new jsfeat.matrix_t(3, 3, jsfeat.F32_t);
    jsfeat.linalg.svd_invert(Winvert, W);

    // rotation and translation matrices
    const R = new jsfeat.matrix_t(3, 3, jsfeat.F32_t);
    const T = new jsfeat.matrix_t(3, 3, jsfeat.F32_t);

    // calculate SVD of essential matrix
    jsfeat.linalg.svd_decompose(essentialMatrix, D, U, V);

    // R = U * Winvert * V
    jsfeat.matmath.multiply_3x3(R, U, Winvert);
    jsfeat.matmath.multiply_3x3(R, R, V);

    // T = U * W * D * Ut
    jsfeat.matmath.multiply_3x3(T, U, W);
    jsfeat.matmath.multiply_3x3(T, T, D);
    jsfeat.matmath.multiply_ABt(T, T, U);

    return {
        rotation: decomposeRotationMatrix(R.data),
        translation: T.data,
    };
}

/**
* Calculates the relative camera pose using two frames
* 1. Convert frames to grayscale
* 2. Find feature in previous frame
* 3. Map features in previous frame to current frame
* 4. Use 8 point algorithm with ransac to find essential matrix
* 5. Compute R and T from essential matrix
*/
function motionEstimation(prevFrame, currentFrame, width, height) {
    // convert frames to grayscale
    const prevPyramidT = convertToGrayScale(prevFrame, width, height);
    const currentPyramidT = convertToGrayScale(currentFrame, width, height);

    const prevFeatures = [];
    const currentFeatures = [];
    // detect features for previous frame
    const featuresCount = detectFeatures(prevPyramidT, prevFeatures, width, height);

    // klt tracker - tracks features in previous img and maps them to current
    const status = [];
    jsfeat.optical_flow_lk.track(
        prevPyramidT, currentPyramidT, prevFeatures, currentFeatures,
        featuresCount, 15, 30, status, 0.01, 0.0001,
    );

    // ransac with 8 point algorithm
    const ransac = jsfeat.motion_estimator.ransac;
    // create homography kernel
    const homo_kernel = new jsfeat.motion_model.homography2d();
    const essentialMatrix = new jsfeat.matrix_t(3, 3, jsfeat.F32_t);
    const params = new jsfeat.ransac_params_t(4, 3, 0.5, 0.99);

    // calculate essential matrix using features detected in the two images
    ransac(params, homo_kernel, prevFeatures, currentFeatures, featuresCount, essentialMatrix, status, 1000);

    // return rotation and translation calculated from essentialMatrix
    return recoverPose(essentialMatrix);
}

export default motionEstimation;
