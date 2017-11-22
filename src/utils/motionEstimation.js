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

    // initialize previous and current frame features
    // detect features for previous frame only using fast algorithm
    const currentCorners = [];
    const prevCorners = [];
    for (let i = 0; i < width * height; i++) {
        prevCorners[i] = new jsfeat.keypoint_t();
    }
    const featuresCount = jsfeat.fast_corners.detect(prevPyramidT.data[0], prevCorners, 3);

    // convert detected frames to array format
    const prevCornersArray = [];
    for (let i = 0; i < featuresCount; i++) {
        prevCornersArray.push(prevCorners[i].x);
        prevCornersArray.push(prevCorners[i].y);
    }

    // klt tracker - tracks features in previous img and maps them to current
    const status = [];
    jsfeat.optical_flow_lk.track(prevPyramidT, currentPyramidT,
    prevCornersArray, currentCorners, featuresCount,
    15, 30, status, 0.01, 0.0001);

    // this class allows you to use above Motion Kernels
    // to estimate motion even with wrong correspondences
    var ransac = jsfeat.motion_estimator.ransac;

    // create homography kernel
    // you can reuse it for different point sets
    var homo_kernel = new jsfeat.motion_model.homography2d();
    var transform = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);

    var params = new jsfeat.ransac_params_t(4, 3, 0.5, 0.99);

    var ok = ransac(params, homo_kernel, prevCornersArray, currentCorners, featuresCount, transform, status, 1000);

    return transform;
};

export default motionEstimation;
