
export function GetZRotationMatrix(degrees){
    let matrix = [
        [Math.cos(degrees), -Math.sin(degrees), 0],
        [Math.sin(degrees), Math.cos(degrees), 0],
        [0, 0, 1],
    ]
    return  matrix
}

export function GetTriangleSquareGeron(vertices){
    let a = GetVecLength(vertices[0], vertices[1])
    let b = GetVecLength(vertices[1], vertices[2])
    let c = GetVecLength(vertices[2], vertices[0])
    let p = (a + b + c)/2
    let s = Math.sqrt(p*(p-a)*(p-b)*(p-c)) 
    return s
}

export function GetVecLength(start, end){
    return Math.sqrt(Math.pow(start[0] - end[0], 2) + Math.pow(start[1] - end[1], 2))
}

export function MultiplyMatrix(A, B) {
    var rowsA = A.length, colsA = A[0].length,
        rowsB = B.length, colsB = B[0].length,
        C = [];
    if (colsA != rowsB) return false;
    for (var i = 0; i < rowsA; i++) C[i] = [];
    for (var k = 0; k < colsB; k++) {
        for (var i = 0; i < rowsA; i++) {
            var t = 0;
            for (var j = 0; j < rowsB; j++) t += A[i][j] * B[j][k];
            C[i][k] = t;
        }
    }
    return C;
}