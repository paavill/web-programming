export function DrawAll(context, canvas){
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.beginPath()
    DrawNet(canvas, context)
    context.strokeStyle = "#AAAAAA"
    context.stroke()
    context.beginPath()
    shapes.forEach(e => {
        if (e.GetShapeType() !== ShapeType.CIRCLE) {
            DrawVertex(e.GetVertices(), canvas, context)
        } else[
            DrawCircle(e, canvas, context)
        ]
    })
    context.strokeStyle = "#000000"
    context.stroke()
}

export function DrawCircle(shape, canvas, context) {
    let ver = shape.GetVertices()
    context.arc(ver[0][0]*scaleCoef, ver[0][1]*scaleCoef, Math.abs(ver[0][0] - ver[1][0]) * scaleCoef, 0, 2 * Math.PI)
}

export function DrawNet(canvas, context) {
    for (var x = 0; x < canvas.width; x += scaleCoef) {
        context.moveTo(x, 0);
        context.lineTo(x, canvas.width);
    }

    for (var y = 0; y < canvas.height; y += scaleCoef) {
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
    }
}

export function DrawVertex(ver, canvas, context) {
    ver.forEach((e, ind) => {
        context.moveTo(e[0] * scaleCoef, e[1] * scaleCoef)
        if (ind + 1 < ver.length) {
            context.lineTo(ver[ind + 1][0] * scaleCoef, ver[ind + 1][1] * scaleCoef)
        } else {
            context.lineTo(ver[0][0] * scaleCoef, ver[0][1] * scaleCoef)
        }
    })
}