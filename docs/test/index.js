const IMAGE_WIDTH = 150;
const IMAGE_HEIGHT = 150;

// Draw image to canvas
function addImage(canvasId, imageSrc) {
    return new Promise(function(res, rej) {
        var canvas = document.getElementById(canvasId);
        var context = canvas.getContext('2d');
        var image = new Image();
        image.src = imageSrc;

        image.onload = function() {
            canvas.width = IMAGE_WIDTH;
            canvas.height = IMAGE_HEIGHT;
            context.drawImage(image, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
            var frame = context.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
            res(frame);
        };
    });
}

// Computes the grayscale of an images
// Renders the grayscale image to canvas
function drawGrayScale(canvasId, frame) {
    return new Promise(function(res, rej) {
        var canvas = document.getElementById(canvasId);
        var context = canvas.getContext('2d');
        canvas.width = IMAGE_WIDTH;
        canvas.height = IMAGE_HEIGHT;
        var grayScale = convertToGrayScale(frame.data, IMAGE_WIDTH, IMAGE_HEIGHT);
        var grayImg = grayScale.data[0].data;
        var imageData = new ImageData(IMAGE_WIDTH, IMAGE_HEIGHT);
        var c = 0;
        /**
         * Since image data is in RGBA, and grayImg is just one pixel
         * R = G = B = A for each pixel in grayImg
         */
        for(var i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] = grayImg[c];
            imageData.data[i + 1] = grayImg[c];
            imageData.data[i + 2] = grayImg[c];
            imageData.data[i + 3] = grayImg[c];
            c++;
        }
        context.putImageData(imageData, 0, 0);

        res(grayScale);
    });
}

/**
* Detect image1 features and renders them to canvas1
* Tracks image2 features and renders them to canvas2
*/
function detectAndTrackFeatures(canvas1Id, canvas2Id, frame1, frame2) {
    return new Promise(function(res, rej) {
        var canvas1 = document.getElementById(canvas1Id);
        var context1 = canvas1.getContext('2d');
        context1.fillStyle = "#ff0000";
        var canvas2 = document.getElementById(canvas2Id);
        var context2 = canvas2.getContext('2d');
        context2.fillStyle = "#ff0000";
        var frame1Feat = [];
        var frame2Feat = [];

        // Detect and draw image1 features
        var featuresCount = detectFeatures(frame1, frame1Feat, IMAGE_WIDTH, IMAGE_HEIGHT);
        for(var i = 0; i < frame1Feat.length; i += 2) {
            context1.beginPath();
            context1.arc(frame1Feat[i], frame1Feat[i + 1], 1, 0, 2 * Math.PI);
            context1.fill();
        }

        // track image2 features
        var status = [];
        jsfeat.optical_flow_lk.track(
            frame1, frame2, frame1Feat, frame2Feat,
            featuresCount, 30, 30, status, 0.01, 0.001,
        );

        var counter = 0;
        // Draw detected image 2 features
        for(var i = 0; i < frame2Feat.length; i += 2) {
            if(status[counter] === 1) {
                context2.beginPath();
                context2.arc(frame2Feat[i], frame2Feat[i + 1], 1, 0, 2 * Math.PI);
                context2.fill();
            }
            counter++;
        }

        res({frame1Feat, frame2Feat, featuresCount, status});
    });
}

function normalizeXCoord(xCoord) {
    const Xcoordinate = 2 * xCoord / IMAGE_WIDTH - 1;

    return Xcoordinate;
};

function normalizeYCoord(yCoord) {
    const Ycoordinate = 2 * yCoord / IMAGE_HEIGHT - 1;

    return Ycoordinate;
};

// calculate camera pose using frame features
function calculateCameraPose(frame1Feat, frame2Feat, featuresCount, status) {
    var text = document.getElementById('camera-pose');

    // ransac with 8 point algorithm
    var ransac = jsfeat.motion_estimator.ransac;
    // create homography kernel
    var homo_kernel = new jsfeat.motion_model.homography2d();
    var essentialMatrix = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);
    var params = new jsfeat.ransac_params_t(4, 3, 0.5, 0.99);

    var mask = new jsfeat.matrix_t(featuresCount, 1, jsfeat.U8_t | jsfeat.C1_t);
    copyArray(status, mask.data);

    let q = [];
    let qp = [];
    for (let i = 0; i < 5; i++) {
        q.push([]);
        qp.push([]);
        q[i].push(normalizeXCoord(frame1Feat[i * 20]));
        q[i].push(normalizeYCoord(frame1Feat[i * 20 + 1]));
        qp[i].push(normalizeXCoord(frame2Feat[i * 20]));
        qp[i].push(normalizeYCoord(frame2Feat[i * 20 + 1]));
    }

    let { Ematrices, nroots } = computeEMats(q, qp);

    for(let i = 0; i < nroots; i++) {
        var essentialMatrix = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);
        essentialMatrix.data = Ematrices[i];
        var pose = recoverPose(essentialMatrix);
        console.log(pose.rotation);
    }
    // text.innerHTML = 'Rotation X: ' + pose.rotation.x + '\n';
    // text.innerHTML += 'Rotation Y: ' + pose.rotation.y + '\n';
    // text.innerHTML += 'Rotation Z: ' + pose.rotation.z + '\n';
    // text.innerHTML += 'Translation X: ' + pose.translation.x + '\n';
    // text.innerHTML += 'Translation Y: ' + pose.translation.y + '\n';
    // text.innerHTML += 'Translation Z: ' + pose.translation.z + '\n';
}

// Draw image 2 first
addImage('original-image-2', '../res/test2.jpg').then(function(frame) {
    drawGrayScale('grayscale-image-2', frame);
    return drawGrayScale('feature-image-2', frame);
}).then(function(frame2) {
    // Draw image 1
    addImage('original-image-1', '../res/test1.jpg').then(function(frame1) {
        drawGrayScale('grayscale-image-1', frame1);
        return drawGrayScale('feature-image-1', frame1);
    }).then(function(frame1) {
        return detectAndTrackFeatures('feature-image-1', 'feature-image-2', frame1, frame2);
    }).then(function({frame1Feat, frame2Feat, featuresCount, status}) {

        return calculateCameraPose(frame1Feat, frame2Feat, featuresCount, status);
    });
});
