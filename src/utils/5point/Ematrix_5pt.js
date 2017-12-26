
// Degree of the polynomial
const PolynomialDegree = 10;

function createMatrix(row, col, depth) {
    let M = [];

    if (col) {
        for (let i = 0; i < row; i++) {
            M.push([]);
            if (depth) {
                for(let j = 0; j < col; j++) {
                    M[i].push([]);
                    // 3d matrix
                    for(let k = 0; k < depth; k++) {
                        M[i][j].push(0);
                    }
                }
            } else {
                // 2d matrix
                for(let j = 0; j < col; j++) {
                    M[i].push(0);
                }
            }
        }
    } else {
        // 1d matrix
        for (let i = 0; i < row; i++) {
            M.push(0);
        }
    }

    return M;
}

function clearMatrix(matrix) {
    const row = matrix.length;
    for(let i = 0; i < row; i++) {
        const col = matrix[i].length;
        if (col) {
            for (let j = 0; j < col; j++) {
                const depth = matrix[i][j].length;
                if (depth) {
                    for (k = 0; k < depth; k++) {
                        matrix[i][j][k] = 0;
                    }
                } else {
                    // clears 2d matrix
                    matrix[i][j] = 0;
                }
            }
        } else {
            // clears 1d matrix
            matrix[i] = 0;
        }
    }
}

//=============================================================================
//           Polynomial Functions
//=============================================================================
function multi4_1By4_1(p1, p2) {
    const prod = createMatrix(4, 4);

    prod[0][0]  = p1[0]*p2[0];
    prod[0][1]  = p1[0]*p2[1];
    prod[0][2]  = p1[0]*p2[2];
    prod[0][3]  = p1[0]*p2[3];

    prod[0][1] += p1[1]*p2[0];
    prod[1][1]  = p1[1]*p2[1];
    prod[1][2]  = p1[1]*p2[2];
    prod[1][3]  = p1[1]*p2[3];

    prod[0][2] += p1[2]*p2[0];
    prod[1][2] += p1[2]*p2[1];
    prod[2][2]  = p1[2]*p2[2];
    prod[2][3]  = p1[2]*p2[3];

    prod[0][3] += p1[3]*p2[0];
    prod[1][3] += p1[3]*p2[1];
    prod[2][3] += p1[3]*p2[2];
    prod[3][3]  = p1[3]*p2[3];

    return prod;
}

function multi4_2By4_1(p1, p2) {
    const prod = createMatrix(4, 4, 4);

    prod[0][0][0]  = p1[0][0]*p2[0];
    prod[0][0][1]  = p1[0][0]*p2[1];
    prod[0][0][2]  = p1[0][0]*p2[2];
    prod[0][0][3]  = p1[0][0]*p2[3];

    prod[0][0][1] += p1[0][1]*p2[0];
    prod[0][1][1]  = p1[0][1]*p2[1];
    prod[0][1][2]  = p1[0][1]*p2[2];
    prod[0][1][3]  = p1[0][1]*p2[3];

    prod[0][0][2] += p1[0][2]*p2[0];
    prod[0][1][2] += p1[0][2]*p2[1];
    prod[0][2][2]  = p1[0][2]*p2[2];
    prod[0][2][3]  = p1[0][2]*p2[3];

    prod[0][0][3] += p1[0][3]*p2[0];
    prod[0][1][3] += p1[0][3]*p2[1];
    prod[0][2][3] += p1[0][3]*p2[2];
    prod[0][3][3]  = p1[0][3]*p2[3];

    prod[0][1][1] += p1[1][1]*p2[0];
    prod[1][1][1]  = p1[1][1]*p2[1];
    prod[1][1][2]  = p1[1][1]*p2[2];
    prod[1][1][3]  = p1[1][1]*p2[3];

    prod[0][1][2] += p1[1][2]*p2[0];
    prod[1][1][2] += p1[1][2]*p2[1];
    prod[1][2][2]  = p1[1][2]*p2[2];
    prod[1][2][3]  = p1[1][2]*p2[3];

    prod[0][1][3] += p1[1][3]*p2[0];
    prod[1][1][3] += p1[1][3]*p2[1];
    prod[1][2][3] += p1[1][3]*p2[2];
    prod[1][3][3]  = p1[1][3]*p2[3];

    prod[0][2][2] += p1[2][2]*p2[0];
    prod[1][2][2] += p1[2][2]*p2[1];
    prod[2][2][2]  = p1[2][2]*p2[2];
    prod[2][2][3]  = p1[2][2]*p2[3];

    prod[0][2][3] += p1[2][3]*p2[0];
    prod[1][2][3] += p1[2][3]*p2[1];
    prod[2][2][3] += p1[2][3]*p2[2];
    prod[2][3][3]  = p1[2][3]*p2[3];

    prod[0][3][3] += p1[3][3]*p2[0];
    prod[1][3][3] += p1[3][3]*p2[1];
    prod[2][3][3] += p1[3][3]*p2[2];
    prod[3][3][3]  = p1[3][3]*p2[3];

    return prod;
}

function multi4_3ByNum(p1, num) {
    const prod = createMatrix(4, 4, 4);

    prod[0][0][0] = p1[0][0][0] * num;
    prod[0][0][1] = p1[0][0][1] * num;
    prod[0][0][2] = p1[0][0][2] * num;
    prod[0][0][3] = p1[0][0][3] * num;
    prod[0][1][1] = p1[0][1][1] * num;
    prod[0][1][2] = p1[0][1][2] * num;
    prod[0][1][3] = p1[0][1][3] * num;
    prod[0][2][2] = p1[0][2][2] * num;
    prod[0][2][3] = p1[0][2][3] * num;
    prod[0][3][3] = p1[0][3][3] * num;
    prod[1][1][1] = p1[1][1][1] * num;
    prod[1][1][2] = p1[1][1][2] * num;
    prod[1][1][3] = p1[1][1][3] * num;
    prod[1][2][2] = p1[1][2][2] * num;
    prod[1][2][3] = p1[1][2][3] * num;
    prod[1][3][3] = p1[1][3][3] * num;
    prod[2][2][2] = p1[2][2][2] * num;
    prod[2][2][3] = p1[2][2][3] * num;
    prod[2][3][3] = p1[2][3][3] * num;
    prod[3][3][3] = p1[3][3][3] * num;

    return prod;
}

function add4_3By4_3(p1, p2) {
    const sum = createMatrix(4, 4, 4);

    sum[0][0][0] = p1[0][0][0] + p2[0][0][0];
    sum[0][0][1] = p1[0][0][1] + p2[0][0][1];
    sum[0][0][2] = p1[0][0][2] + p2[0][0][2];
    sum[0][0][3] = p1[0][0][3] + p2[0][0][3];
    sum[0][1][1] = p1[0][1][1] + p2[0][1][1];
    sum[0][1][2] = p1[0][1][2] + p2[0][1][2];
    sum[0][1][3] = p1[0][1][3] + p2[0][1][3];
    sum[0][2][2] = p1[0][2][2] + p2[0][2][2];
    sum[0][2][3] = p1[0][2][3] + p2[0][2][3];
    sum[0][3][3] = p1[0][3][3] + p2[0][3][3];
    sum[1][1][1] = p1[1][1][1] + p2[1][1][1];
    sum[1][1][2] = p1[1][1][2] + p2[1][1][2];
    sum[1][1][3] = p1[1][1][3] + p2[1][1][3];
    sum[1][2][2] = p1[1][2][2] + p2[1][2][2];
    sum[1][2][3] = p1[1][2][3] + p2[1][2][3];
    sum[1][3][3] = p1[1][3][3] + p2[1][3][3];
    sum[2][2][2] = p1[2][2][2] + p2[2][2][2];
    sum[2][2][3] = p1[2][2][3] + p2[2][2][3];
    sum[2][3][3] = p1[2][3][3] + p2[2][3][3];
    sum[3][3][3] = p1[3][3][3] + p2[3][3][3];

    return sum;
}

function add4_3To4_3(p1, p2) {
    p1[0][0][0] += p2[0][0][0];
    p1[0][0][1] += p2[0][0][1];
    p1[0][0][2] += p2[0][0][2];
    p1[0][0][3] += p2[0][0][3];
    p1[0][1][1] += p2[0][1][1];
    p1[0][1][2] += p2[0][1][2];
    p1[0][1][3] += p2[0][1][3];
    p1[0][2][2] += p2[0][2][2];
    p1[0][2][3] += p2[0][2][3];
    p1[0][3][3] += p2[0][3][3];
    p1[1][1][1] += p2[1][1][1];
    p1[1][1][2] += p2[1][1][2];
    p1[1][1][3] += p2[1][1][3];
    p1[1][2][2] += p2[1][2][2];
    p1[1][2][3] += p2[1][2][3];
    p1[1][3][3] += p2[1][3][3];
    p1[2][2][2] += p2[2][2][2];
    p1[2][2][3] += p2[2][2][3];
    p1[2][3][3] += p2[2][3][3];
    p1[3][3][3] += p2[3][3][3];
}

function multNumTo4_3(p1, num) {
    p1[0][0][0] *= num;
    p1[0][0][1] *= num;
    p1[0][0][2] *= num;
    p1[0][0][3] *= num;
    p1[0][1][1] *= num;
    p1[0][1][2] *= num;
    p1[0][1][3] *= num;
    p1[0][2][2] *= num;
    p1[0][2][3] *= num;
    p1[0][3][3] *= num;
    p1[1][1][1] *= num;
    p1[1][1][2] *= num;
    p1[1][1][3] *= num;
    p1[1][2][2] *= num;
    p1[1][2][3] *= num;
    p1[1][3][3] *= num;
    p1[2][2][2] *= num;
    p1[2][2][3] *= num;
    p1[2][3][3] *= num;
    p1[3][3][3] *= num;
}

function sub4_3By4_3(p1, p2) {
    const dif = createMatrix(4, 4, 4);

    dif[0][0][0] = p1[0][0][0] - p2[0][0][0];
    dif[0][0][1] = p1[0][0][1] - p2[0][0][1];
    dif[0][0][2] = p1[0][0][2] - p2[0][0][2];
    dif[0][0][3] = p1[0][0][3] - p2[0][0][3];
    dif[0][1][1] = p1[0][1][1] - p2[0][1][1];
    dif[0][1][2] = p1[0][1][2] - p2[0][1][2];
    dif[0][1][3] = p1[0][1][3] - p2[0][1][3];
    dif[0][2][2] = p1[0][2][2] - p2[0][2][2];
    dif[0][2][3] = p1[0][2][3] - p2[0][2][3];
    dif[0][3][3] = p1[0][3][3] - p2[0][3][3];
    dif[1][1][1] = p1[1][1][1] - p2[1][1][1];
    dif[1][1][2] = p1[1][1][2] - p2[1][1][2];
    dif[1][1][3] = p1[1][1][3] - p2[1][1][3];
    dif[1][2][2] = p1[1][2][2] - p2[1][2][2];
    dif[1][2][3] = p1[1][2][3] - p2[1][2][3];
    dif[1][3][3] = p1[1][3][3] - p2[1][3][3];
    dif[2][2][2] = p1[2][2][2] - p2[2][2][2];
    dif[2][2][3] = p1[2][2][3] - p2[2][2][3];
    dif[2][3][3] = p1[2][3][3] - p2[2][3][3];
    dif[3][3][3] = p1[3][3][3] - p2[3][3][3];

    return dif;
}

function add4_2By4_2(p1, p2) {
    const sum = createMatrix(4, 4);

    sum[0][0] = p1[0][0] + p2[0][0];
    sum[0][1] = p1[0][1] + p2[0][1];
    sum[0][2] = p1[0][2] + p2[0][2];
    sum[0][3] = p1[0][3] + p2[0][3];
    sum[1][1] = p1[1][1] + p2[1][1];
    sum[1][2] = p1[1][2] + p2[1][2];
    sum[1][3] = p1[1][3] + p2[1][3];
    sum[2][2] = p1[2][2] + p2[2][2];
    sum[2][3] = p1[2][3] + p2[2][3];
    sum[3][3] = p1[3][3] + p2[3][3];

    return sum;
}

function add4_2To4_2(p1, p2) {
    p1[0][0] += p2[0][0];
    p1[0][1] += p2[0][1];
    p1[0][2] += p2[0][2];
    p1[0][3] += p2[0][3];
    p1[1][1] += p2[1][1];
    p1[1][2] += p2[1][2];
    p1[1][3] += p2[1][3];
    p1[2][2] += p2[2][2];
    p1[2][3] += p2[2][3];
    p1[3][3] += p2[3][3];
}

function sub4_2By4_2(p1, p2) {
    const dif = createMatrix(4, 4);

    dif[0][0] = p1[0][0] - p2[0][0];
    dif[0][1] = p1[0][1] - p2[0][1];
    dif[0][2] = p1[0][2] - p2[0][2];
    dif[0][3] = p1[0][3] - p2[0][3];
    dif[1][1] = p1[1][1] - p2[1][1];
    dif[1][2] = p1[1][2] - p2[1][2];
    dif[1][3] = p1[1][3] - p2[1][3];
    dif[2][2] = p1[2][2] - p2[2][2];
    dif[2][3] = p1[2][3] - p2[2][3];
    dif[3][3] = p1[3][3] - p2[3][3];

    return dif;
}

function add4_1By4_1(p1, p2) {
    const sum = createMatrix(4);

    sum[0] = p1[0] + p2[0];
    sum[1] = p1[1] + p2[1];
    sum[2] = p1[2] + p2[2];
    sum[3] = p1[3] + p2[3];

    return sum;
}

function sub4_1By4_1(p1, p2) {
    const diff = createMatrix(4);

    dif[0] = p1[0] - p2[0];
    dif[1] = p1[1] - p2[1];
    dif[2] = p1[2] - p2[2];
    dif[3] = p1[3] - p2[3];

    return dif;
}

//=============================================================================

function polydet4(E) {
    // Takes the determinant of a polynomial
    const poly1 = sub4_2By4_2(multi4_1By4_1(E[1][1], E[2][2]), multi4_1By4_1(E[2][1], E[1][2]));
    const poly2 = sub4_2By4_2(multi4_1By4_1(E[2][1], E[0][2]), multi4_1By4_1(E[0][1], E[2][2]));
    const poly3 = sub4_2By4_2(multi4_1By4_1(E[0][1], E[1][2]), multi4_1By4_1(E[1][1], E[0][2]));

    const poly4 = multi4_2By4_1(poly1, E[0][0]);
    const poly5 = multi4_2By4_1(poly2, E[1][0]);
    const poly6 = multi4_2By4_1(poly3, E[2][0]);

    const det = add4_3By4_3(add4_3By4_3(poly4, poly5), poly6);

    return det;
}

function traceEEt(E) {
    // Takes the trace of E E' -- returns a quadratic polynomial
    // Trace of product is the elementwise product of the elements
    const poly1 = multi4_1By4_1(E[0][0], E[0][0]);
    const poly2 = multi4_1By4_1(E[0][1], E[0][1]);
    const poly3 = multi4_1By4_1(E[0][2], E[0][2]);
    const poly4 = multi4_1By4_1(E[1][0], E[1][0]);
    const poly5 = multi4_1By4_1(E[1][1], E[1][1]);
    const poly6 = multi4_1By4_1(E[1][2], E[1][2]);
    const poly7 = multi4_1By4_1(E[2][0], E[2][0]);
    const poly8 = multi4_1By4_1(E[2][1], E[2][1]);
    const poly9 = multi4_1By4_1(E[2][2], E[2][2]);

    const poly10 = add4_2By4_2(add4_2By4_2(poly1, poly2), add4_2By4_2(poly3, poly4));
    const poly11 = add4_2By4_2(add4_2By4_2(poly5, poly6), add4_2By4_2(poly7, poly8))

    const tr = add4_2By4_2(add4_2By4_2(poly9, poly10), poly11);

    return tr;
}

function mono_coeff(B, A, n) {
    // Extracts the monomial coefficients in x and y (with z = 1) from
    // a cubic homogeneous polynomial. Returns 4 vectors (degrees 0 to 3 in w)

    // Make some constants to make the code easier to read

    // Degrees of terms in w
    const w0 = 0;
    const w1 = 1;
    const w2 = 2;
    const w3 = 3;

    // Linear variables
    const w = 0;
    const x = 1;
    const y = 2;
    const z = 3;

    // Monomials
    const xx = 3;
    const xy = 4;
    const yy = 5;
    const xxx = 6;
    const xxy = 7;
    const xyy = 8;
    const yyy = 9;

    // Terms in w^0
    A[w0][n][0] = B[z][z][z];
    A[w0][n][x] = B[x][z][z];
    A[w0][n][y] = B[y][z][z];
    A[w0][n][xx] = B[x][x][z];
    A[w0][n][yy] = B[y][y][z];
    A[w0][n][xy] = B[x][y][z];
    A[w0][n][xxx] = B[x][x][x];
    A[w0][n][xxy] = B[x][x][y];
    A[w0][n][xyy] = B[x][y][y];
    A[w0][n][yyy] = B[y][y][y];

    // Terms in w^1
    A[w1][n][0] = B[w][z][z];
    A[w1][n][x] = B[w][x][z];
    A[w1][n][y] = B[w][y][z];
    A[w1][n][xx] = B[w][x][x];
    A[w1][n][yy] = B[w][y][y];
    A[w1][n][xy] = B[w][x][y];

    // Terms in w^2
    A[w2][n][0] = B[w][w][z];
    A[w2][n][x] = B[w][w][x];
    A[w2][n][y] = B[w][w][y];

    // Terms in w^3
    A[w3][n][0] = B[w][w][w];
}

function EEeqns_5pt (E, A) {
    //
    // Computes the equations that will be used to input to polyeig.
    //    void EEeqns_5pt(E, A)
    // where E has dimensions E(3, 3, 4).  The output is a matrix
    // of dimension A(4, 10, 10), where A(i, :, :) is the coeffient of w^{i-1}
    //

    // Makes all the equations from the essential matrix E

    // First of all, set the equations to zero
    // memset (&(A[0][0][0]), 0, sizeof(EquationSet));

    // Find the trace - this is a quadratic polynomial
    const tr = traceEEt(E);

    // First equation is from the determinant
    mono_coeff(polydet4(E), A, 0);

    // Other equations from the equation 2 E*E'*E - tr(E*E') E = 0
    // In the following loop, we compute EE'E(i,j) = sum_pq E(i,p)*E(q,p)*E(q,j)
    // The way this is done is optimized for speed.  We compute first the matrix
    // EE'(i, q) and then use this to accumulate EE'E(i, j)

    let eqn = 1;  // Count on the next equation
    for (let i=0; i<3; i++) {
        // An array of cubic polynomials, one for each j = 0 ... 2
        const EEE_i = [];  // Will hold (EE'E)(i,j)
        for(let temp = 0; temp < 3; temp++) {
            EEE_i.push(createMatrix(4, 4, 4));
        }

        // Compute each EE'(i,q) = sum_p E(i,p) E(q,p)
        for (let q=0; q<3; q++) {
            // Accumulate EE(i, q)
            const EE_iq = createMatrix(4, 4);

            for (let p=0; p<3; p++) {
                add4_2To4_2(EE_iq, multi4_1By4_1(E[i][p], E[q][p]));
            }

            // Now, accumulate EEE(ij) = sum_q  EE'(i,q) * E(q, j)
            for (let j=0; j<3; j++) {
                 add4_3To4_3(EEE_i[j], multi4_2By4_1(EE_iq, E[q][j]));
            }
        }

        // Now, EE'E(i,j) is computed for this i and all j
        // We can complete the computation of the coefficients from EE'E(i, j)
        for (let j=0; j<3; j++) {
            mono_coeff(sub4_3By4_3(multi4_3ByNum(EEE_i[j], 2), multi4_2By4_1(tr, E[i][j])), A, eqn++);
        }

    }
}

function null_space_solve2(A) {
    // Solve for the null-space of the matrix

    // This time we will do pivoting
    let x,y;
    let p1;
    let f0 = Math.abs(A[0][2]), f1 = Math.abs(A[1][2]), f2 = Math.abs(A[2][2]);
    if (f0 > f1) p1 = (f0>f2)? 0 : 2;
    else p1 = (f1>f2) ? 1 : 2;

    // The other two rows
    let r1 = (p1+1)%3, r2 = (p1+2)%3;

    // Now, use this to pivot
    let fac = A[r1][2] / A[p1][2];
    A[r1][0] -= fac * A[p1][0];
    A[r1][1] -= fac * A[p1][1];

    fac = A[r2][2] / A[p1][2];
    A[r2][0] -= fac * A[p1][0];
    A[r2][1] -= fac * A[p1][1];

    // Second pivot - largest element in column 1
    let p2 = Math.abs(A[r1][1]) > Math.abs(A[r2][1]) ? r1 : r2;

    // Now, read off the values - back substitution
    x = - A[p2][0] / A[p2][1];
    y = -(A[p1][0] + A[p1][1]*x) / A[p1][2];

    return {
        x,
        y,
    };
}

function null_space_solve1(A, E) {
    // This will compute the set of solutions for the equations
    // Sweep out one column at a time, starting with highest column number

    // We do Gaussian elimination to convert M to the form M = [X | I]
    // Then the null space will be [-I | X].

    // For present, this is done without pivoting.
    // Mostly, do not need to actually change right hand part (that becomes I)
    const lastrow  = 4;
    const firstcol = 4; // First column to do elimination to make I
    const lastcol  = 8;

    // First sweep is to get rid of the above diagonal parts
    // No need to do first col
    for (let col=lastcol; col>firstcol; col--) {
        // Remove column col
        const row = col-firstcol;	// Row to pivot around
        const pivot = A[row][col];

        if (pivot === 0) {
            return false;
        }

        // Sweep out all rows up to the current one
        for (let i=0; i<row; i++) {
            // This factor of the pivot row is to subtract from row i
            const fac = A[i][col] / pivot;

            // Constant terms
            for (let j=0; j<col; j++) {
                A[i][j] -= fac * A[row][j];
            }
        }
    }

    // Now, do backward sweep to clear below the diagonal
    for (let col=firstcol; col<lastcol; col++) // No need to do lastcol
    {
        // Remove column col
        const row = col-firstcol;	// Row to pivot around
        const pivot = A[row][col];

        if (pivot === 0) {
            return false;
        }

        // Sweep out all rows up to the current one
        for (let i=row+1; i<=lastrow; i++)
        {
            // This factor of the pivot row is to subtract from row i
            const fac = A[i][col] / pivot;

            // Constant terms
            for (let j=0; j<firstcol; j++)
            A[i][j] -= fac * A[row][j];
        }
    }

    // Make this into a matrix of solutions
    let fac;
    E[0][0] = [1, 0, 0, 0];
    E[0][1] = [0, 1, 0, 0];
    E[0][2] = [0, 0, 1, 0];
    E[1][0] = [0, 0, 0, 1];
    fac = -1.0/A[0][4];
    E[1][1] = [fac*A[0][0], fac*A[0][1], fac*A[0][2], fac*A[0][3]];
    fac = -1.0/A[1][5];
    E[1][2] = [fac*A[1][0], fac*A[1][1], fac*A[1][2], fac*A[1][3]];
    fac = -1.0/A[2][6];
    E[2][0] = [fac*A[2][0], fac*A[2][1], fac*A[2][2], fac*A[2][3]];
    fac = -1.0/A[3][7];
    E[2][1] = [fac*A[3][0], fac*A[3][1], fac*A[3][2], fac*A[3][3]];
    fac = -1.0/A[4][8];
    E[2][2] = [fac*A[4][0], fac*A[4][1], fac*A[4][2], fac*A[4][3]];

    return true;
}

function Ematrix_5pt(q, qp, E, A) {
    // Computes the E-matrix from match inputs

    // A matrix to solve linearly for the ematrix
    // epipolar equations for the points
    const M = createMatrix(9, 9);

    for (let i=0; i<5; i++) {
        M[i][0] = qp[i][0]*q[i][0];
        M[i][1] = qp[i][0]*q[i][1];
        M[i][2] = qp[i][0];
        M[i][3] = qp[i][1]*q[i][0];
        M[i][4] = qp[i][1]*q[i][1];
        M[i][5] = qp[i][1];
        M[i][6] = q[i][0];
        M[i][7] = q[i][1];
        M[i][8] = 1;
    }

    // Solve using null_space_solve
    if(!null_space_solve1(M, E)) {
        return false;
    }

    EEeqns_5pt(E, A);

    return true;
}

function sweep_up (A, row, col, degree) {
    // Use the given pivot point to sweep out above the pivot
    const num1 = 6; // number of nonzero columns of A in degree 1
    const num2 = 3; // number of nonzero columns of A in degree 2
    const num3 = 1; // number of nonzero columns of A in degree 3

    // Find the pivot value
    const pivot = A[degree][row][col];

    // Sweep out all rows up to the current one
    for (let i=0; i<row; i++) {
        // This factor of the pivot row is to subtract from row i
        const fac = A[degree][i][col] / pivot;

        // Constant terms
        for (let j=0; j<=col; j++)
        A[0][i][j] -= fac * A[0][row][j];

        // Degree 1 terms
        for (let j=0; j<num1; j++)
        A[1][i][j] -= fac * A[1][row][j];

        // Degree 2 terms
        for (let j=0; j<num2; j++)
        A[2][i][j] -= fac * A[2][row][j];

        // Degree 3 terms
        for (let j=0; j<num3; j++)
        A[3][i][j] -= fac * A[3][row][j];
    }
}

function sweep_down (A, row, col, degree, lastrow) {
    // Use the given pivot point to sweep out below the pivot
    const num1 = 6; // number of nonzero columns of A in degree 1
    const num2 = 3; // number of nonzero columns of A in degree 2
    const num3 = 1; // number of nonzero columns of A in degree 3

    // The value of the pivot point
    const pivot = A[degree][row][col];

    // Sweep out all rows up to the current one
    for (let i=row+1; i<=lastrow; i++)
    {
        // This factor of the pivot row is to subtract from row i
        const fac = A[degree][i][col] / pivot;

        // Constant terms
        for (let j=0; j<=col; j++)
        A[0][i][j] -= fac * A[0][row][j];

        // Degree 1 terms
        for (let j=0; j<num1; j++)
        A[1][i][j] -= fac * A[1][row][j];

        // Degree 2 terms
        for (let j=0; j<num2; j++)
        A[2][i][j] -= fac * A[2][row][j];

        // Degree 3 terms
        for (let j=0; j<num3; j++)
        A[3][i][j] -= fac * A[3][row][j];
    }
}

function pivot(A, col, deg, lastrow) {
    // Pivot so that the largest element in the column is in the diagonal

    // Use the given pivot point to sweep out below the pivot
    const num1 = 6; // number of nonzero columns of A in degree 1
    const num2 = 3; // number of nonzero columns of A in degree 2
    const num3 = 1; // number of nonzero columns of A in degree 3

    // Find the maximum value in the column
    let maxval = -1.0;
    let row = -1;
    for (let i=0; i<=lastrow; i++) {
        if (i != col && Math.abs(A[deg][i][col]) > maxval) {
            row = i;
            maxval = Math.abs(A[deg][i][col]);
        }
    }

    // We should add or subtract depending on sign
    let fac;
    if (A[deg][row][col] * A[deg][col][col] < 0.0) {
        fac = -1.0;
    } else {
        fac = 1.0;
    }

    // Next, add row to the pivot row
    // Constant terms
    for (let j=0; j<=col; j++) {
        A[0][col][j] += fac * A[0][row][j];
    }

    // Degree 1 terms
    for (let j=0; j<num1; j++) {
        A[1][col][j] += fac * A[1][row][j];
    }

    // Degree 2 terms
    for (let j=0; j<num2; j++) {
        A[2][col][j] += fac * A[2][row][j];
    }

    // Degree 3 terms
    for (let j=0; j<num3; j++) {
        A[3][col][j] += fac * A[3][row][j];
    }
}

function reduce_Ematrix(A) {
    // This reduces the equation set to 3 x 3.  In this version there is
    // no pivoting, which relies on the pivots to be non-zero.

    // Relies on the particular form of the A matrix to reduce it
    // That means that there are several rows of zero elements in different
    // degrees, as given below.

    // Sweeping out the constant terms to reduce to 6 x 6
    pivot (A, 9, 0, 8);
    sweep_up (A, 9, 9, 0);
    pivot (A, 8, 0, 7);
    sweep_up (A, 8, 8, 0);
    pivot (A, 7, 0, 6);
    sweep_up (A, 7, 7, 0);
    pivot (A, 6, 0, 5);
    sweep_up (A, 6, 6, 0);

    // Now, the matrix is 6 x 6.  Next we need to handle linear terms
    pivot (A, 5, 0, 4);
    sweep_up (A, 5, 5, 0);
    pivot (A, 4, 0, 3);
    sweep_up (A, 4, 4, 0);
    pivot (A, 3, 0, 2);
    sweep_up (A, 3, 3, 0);

    let lastrow = 5;
    sweep_down (A, 3, 3, 0, lastrow);
    sweep_down (A, 4, 4, 0, lastrow);

    // Also sweep out the first-order terms
    sweep_up   (A, 2, 5, 1);
    sweep_up   (A, 1, 4, 1);

    sweep_down (A, 0, 3, 1, lastrow);
    sweep_down (A, 1, 4, 1, lastrow);
    sweep_down (A, 2, 5, 1, lastrow);

    // Now, sweep out the x terms by increasing the degree
    for (let i=0; i<3; i++) {
        let fac = A[1][i][3+i] / A[0][3+i][3+i];

        // Introduces 4-th degree term
        A[4][i][0] = -A[3][i+3][0] * fac;

        // Transfer terms of degree 0 to 3
        for (let j=0; j<3; j++) {
            A[3][i][j] -= A[2][i+3][j] * fac;
            A[2][i][j] -= A[1][i+3][j] * fac;
            A[1][i][j] -= A[0][i+3][j] * fac;
        }
    }
}

function one_cofactor (A, poly, r0,  r1,  r2) {
    // Computes one term of the 3x3 cofactor expansion

    // Get a polynomial to hold a 2x2 determinant
    const two = createMatrix(7);

    // Compute the 2x2 determinant - results in a 6x6 determinant
    for (let i=0; i<=3; i++) {
        for (let j=0; j<=3; j++) {
            two[i+j] += A[i][r1][1]*A[j][r2][2] - A[i][r2][1]*A[j][r1][2];
        }
    }

    // Now, multiply by degree 4 polynomial
    for (let i=0; i<=6; i++) {
        for (let j=0; j<=4; j++) {
            poly[i+j] += A[j][r0][0]*two[i];
        }
    }
}

function compute_determinant (A, poly) {
    // Does the final determinant computation to return the determinant

    // Now, the three cofactors
    one_cofactor(A, poly, 0, 1, 2);
    one_cofactor(A, poly, 1, 2, 0);
    one_cofactor(A, poly, 2, 0, 1);
}

function compute_E_matrix (Es, A, w, E) {
    // Compute the essential matrix corresponding to this root
    let w2 = w*w;
    let w3 = w2*w;
    let w4 = w3*w;

    // Form equations to solve
    const M = createMatrix(3, 3);
    for (let i=0; i<3; i++) {
        for (let j=0; j<3; j++) {
            M[i][j] = A[0][i][j] + w*A[1][i][j] + w2*A[2][i][j] + w3*A[3][i][j];
        }

        // Only the first row has degree 4 terms
        M[i][0] += w4*A[4][i][0];
    }

    // Now, find the solution
    let {x, y} = null_space_solve2(M);

    // Multiply out the solution to get the essential matrix
    for (let i=0; i<3; i++) {
        for (let j=0; j<3; j++) {
            const p = Es[i][j];
            E[i][j] = w*p[0] + x*p[1] + y*p[2] + p[3];
        }
    }
}

function compute_e_matrices(pts1, pts2) {
    let Ematrices = [];
    for(let i = 0; i < 10; i++) {
        Ematrices[i] = createMatrix(3, 3);
    }

    let nroots = 0;
    // Get the matrix set
    const A = createMatrix(5, 10, 10);
    const E = createMatrix(3, 3, 4);

    if(!Ematrix_5pt(pts1, pts2, E, A)) {
        return {
            nroots,
            Ematrices,
        };
    };

    // Now, reduce its dimension to 3 x 3
    reduce_Ematrix(A);

    // Finally, get the 10-th degree polynomial out of this
    const poly = createMatrix(PolynomialDegree + 1);
    compute_determinant (A, poly);

    // Find the roots
    const roots = createMatrix(PolynomialDegree);
    nroots = find_real_roots_sturm(poly, PolynomialDegree, roots);

    // Now, get the ematrices
    for (let i = 0; i < nroots; i++) {
        compute_E_matrix(E, A, roots[i], Ematrices[i]);
    }

    return {
        nroots,
        Ematrices,
    };
}

export default compute_e_matrices;
