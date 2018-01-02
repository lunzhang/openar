import compute_e_matrices from './Ematrix_5pt';

const MAX_ITERATIONS = 100;
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

function computeEssential(feature1, feature2) {
    let essentialMatrix;
    let maxInliers;

    const feats1 = [];
    const feats2 = [];
    for (let i = 0; i < feature1.length; i+=2) {
        feats1.push(normalizeXCoord(feature1[i]));
        feats1.push(normalizeYCoord(feature1[i + 1]));
        feats2.push(normalizeXCoord(feature2[i]));
        feats2.push(normalizeYCoord(feature2[i + 1]));
    }

    let iterations = 0;
    while(iterations < MAX_ITERATIONS) {
        const points1 = [];
        const points2 = [];
        const indexDict = {};

        // Select 5 random points
        for (let i = 0; i < 5; i++) {
            let index = Math.floor(Math.random() * (feature1.length / 2));

            // avoid picking same points
            while(indexDict[index]) {
                index = Math.floor(Math.random() * (feature1.length / 2));
            }

            let point1 = [feats1[index * 2], feats1[index * 2 + 1]];
            let point2 = [feats2[index * 2], feats2[index * 2 + 1]];
            points1.push(point1);
            points2.push(point2);

            indexDict[index] = true;
        }

        // compute the essential matrix
        const { Ematrices, nroots } = compute_e_matrices(points1, points2);

        // if no roots are found, avoid unncessary steps
        if(nroots === 0) continue;

        let E;
        let minError;
        /** gets the eMat with the lowest error
         *  X'EX = 0 or in our case the error
         * [x', x', 1] * E * [x, x, 1] = 0
         * Found here https://www.cc.gatech.edu/~hays/compvision/proj3/
        **/
        for (let i = 0; i < nroots; i++) {
            let eMat = Ematrices[i];

            /**
             *  We test with first points out of the 5 random
             *  Matrix with the lowest error is picked
            **/
            let error = (eMat[0][0] * points1[0][0] * points2[0][0]) +
            (eMat[0][1] * points1[0][1] * points2[0][0]) +
            (eMat[0][2] * points2[0][0]) +
            (eMat[1][0] * points1[0][0] * points2[0][1]) +
            (eMat[1][1] * points1[0][1] * points2[0][1]) +
            (eMat[1][2] * points2[0][1]) +
            (eMat[2][0] * points1[0][0]) +
            (eMat[2][1] * points1[0][1]) +
            (eMat[2][2]);

            error = Math.abs(error);

            if (minError === undefined) {
                minError = error;
                E = eMat;
            } else if(error < minError){
                minError = error;
                E = eMat;
            }
        }

        // Count number of inliers
        let inliers = 0;
        for(let i = 0; i < feats1.length; i+=2) {
            let error = (E[0][0] * feats1[i] * feats2[i]) +
            (E[0][1] * feats1[i + 1] * feats2[i]) +
            (E[0][2] * feats2[i]) +
            (E[1][0] * feats1[i] * feats2[i + 1]) +
            (E[1][1] * feats1[i + 1] * feats2[i + 1]) +
            (E[1][2] * feats2[i + 1]) +
            (E[2][0] * feats1[i]) +
            (E[2][1] * feats1[i + 1]) +
            (E[2][2]);

            error = Math.abs(error);

            if (error < 1e-10) inliers++;
        }

        // Set essential if first computed or one with greater inliers
        if (maxInliers === undefined || inliers > maxInliers) {
            maxInliers = inliers;
            essentialMatrix = E;
        }

        iterations++;
    }

    return essentialMatrix;
}

export default computeEssential;
