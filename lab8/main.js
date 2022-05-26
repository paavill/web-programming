import * as calc from './calculations.js'

let shapes = []

let tstBtm = document.getElementById('testBtn')
tstBtm.addEventListener('click', handler)

let shapeTypeForm = document.getElementById('shape-type-form')
shapeTypeForm.addEventListener('click', () => {
    RadioGroupClickHandler(document.getElementById('shape-type-form'))
})

let ShapeType = { CIRCLE: 'circle', RECTANGLE: 'rectangle', TRIANGLE: 'triangle' }

function BaseObject() {
    let registrationInformation = []

    this.ConsoleLogAll = function () {
        registrationInformation.forEach(e => console.log(e))
    }

    this.GetAllRegistrationInformation = function () {
        return structedClone(registrationInformation)
    }

    this.Register = function (functionName) {
        registrationInformation.push(
            {
                functionName,
                date: new Date(),
                arguments: JSON.stringify(arguments),
            }
        )
    }

    this.ClearInformation = function () {
        registrationInformation = []
    }
}

function Shape(shapeType, vertices) {

    var SetVerticesDependingType = function SetVerticesDependingType(type, vertices) {
        switch (type) {
            case ShapeType.CIRCLE:
                if(vertices.length >= 2) {
                    return vertices.slice(0, 2)
                } else {
                    throw new Error('Too few vertices for this shape type')
                }
            case ShapeType.RECTANGLE:
                if(vertices.length >= 4) {
                    return vertices.slice(0, 4)
                } else {
                    throw new Error('Too few vertices for this shape type')
                }
            case ShapeType.TRIANGLE:
                if(vertices.length >= 3) {
                    return vertices.slice(0, 3)
                } else {
                    throw new Error('Too few vertices for this shape type')
                }
            default:
                throw new Error('Unsupported shape type!')
        }
    }

    var _vertices = SetVerticesDependingType(shapeType, vertices)
    var _shapeType = shapeType

    this.GetShapeType = function GetShapeType() {
        Shape.prototype.Register(this.GetShapeType.name, arguments)
        return _shapeType
    }

    this.GetVertices = function GetVertices() {
        Shape.prototype.Register(this.GetVertices.name, arguments)
        return _vertices
    }

    //#region Изменение параметров
    this.SetVertices = function SetVertices(vertices) {
        Shape.prototype.Register(this.SetVertices.name, arguments)
        _vertices = SetVerticesDependingType(_shapeType, vertices)
    }
    //#endregion

    //#region Преобразования
    this.Rotate = function Rotate(degrees) {
        Shape.prototype.Register(this.Rotate.name, arguments)
        _vertices = _vertices.map(vertex => {
            vertex.push(0)
            let rotationMatrix = calc.GetZRotationMatrix(degrees)
            return calc.MultiplyMatrix(rotationMatrix, vertex.map(e => [e])).slice(0, 2)
        })
    }

    this.MoveTo = function MoveTo(point) {
        Shape.prototype.Register(this.MoveTo.name, arguments)
        _vertices = _vertices.map(vertex => [point.x, point.y])
    }

    this.MoveOnVec = function MoveOnVec(vec) {
        Shape.prototype.Register(this.MoveOnVec.name, arguments)
        _vertices = _vertices.map(vertex => [vertex[0] + vec.x, vertex[1] + vec.y])
    }

    this.GetSquare = function GetSquare() {
        switch (_shapeType) {
            case ShapeType.CIRCLE:
                return Math.PI * Math.pow(calc.GetVecLength(_vertices[0], _vertices[1], 2))
            case ShapeType.RECTANGLE:
                let bottomLineLength = calc.GetVecLength(_vertices[0], [_vertices[1][0],_vertices[0][1]]);
                let sideLineLength = calc.GetVecLength([_vertices[1][0],_vertices[0][1]], _vertices[1]);
                return bottomLineLength * sideLineLength
            case ShapeType.TRIANGLE:
                let a = calc.GetVecLength(_vertices[0], _vertices[1])
                let b = calc.GetVecLength(_vertices[1], _vertices[2])
                let c = calc.GetVecLength(_vertices[2], _vertices[0])
                let p = (a + b + c)/2
                let s = Math.sqrt(p*(p-a)*(p-b)*(p-c)) 
                return s
            default:
                return Error('Unsupported shape type!')
        }
    }

    this.GetPerimeter = function GetPerimeter() {
        switch (_shapeType) {
            case ShapeType.CIRCLE:
                return 2 * Math.PI * calc.GetVecLength(_vertices[0], _vertices[1])
            case ShapeType.RECTANGLE:
                let bottomLineLength = calc.GetVecLength(_vertices[0], _vertices[1]);
                let sideLineLength = calc.GetVecLength(_vertices[1], _vertices[2]);
                return bottomLineLength * sideLineLength
            case ShapeType.TRIANGLE:
                let a = calc.GetVecLength(_vertices[0], _vertices[1])
                let b = calc.GetVecLength(_vertices[1], _vertices[2])
                let c = calc.GetVecLength(_vertices[2], _vertices[0])
                let p = (a + b + c)/2
                let s = Math.sqrt(p*(p-a)*(p-b)*(p-c)) 
                return s
            default:
                return Error('Unsupported shape type!')
        }
    }
    //#endregion
}
Shape.prototype = new BaseObject()

function draw(ver, c_canvas, context){    
    context.clearRect(0, 0, c_canvas.width, c_canvas.height);
    let coef = 30
    let c = 0
    context.beginPath();
    ver.forEach((e, ind) => {
        context.moveTo(e[0]*coef + c, e[1]*coef + c)
        if(ind + 1 < ver.length){
            context.lineTo(ver[ind + 1][0]*coef + c, ver[ind + 1][1]*coef + c)   
        } else {
            context.lineTo(ver[0][0]*coef + c, ver[0][1]*coef + c)   
        }
    })
    context.strokeStyle = "#000000";
    context.stroke();
}

function handler() {
    let tes = new Shape(ShapeType.TRIANGLE, [[0, 0], [1, 0], [1, 1]])
    tes.GetShapeType()
    var c_canvas = document.getElementById("canv");
    var context = c_canvas.getContext("2d");
    draw(tes.GetVertices(), c_canvas, context)
    setInterval(()=>{
        tes.Rotate(10 * Math.PI / 180)
        draw(tes.GetVertices(), c_canvas, context)
        //console.log(tes.GetSquare())
    }, 400)
    
    tes.GetSquare()
    tes.ConsoleLogAll()
}

function RadioGroupClickHandler(form){
    showIfChecked(form.Circle, document.getElementById('circleCard'))
    showIfChecked(form.Triangle, document.getElementById('triangleCard'))
    showIfChecked(form.Rectangle, document.getElementById('rectangleCard'))
}

function showIfChecked(button, col){
    if(!button.checked){
        col.setAttribute('class', col.getAttribute('class') + " hidden")
    } else {
        col.setAttribute('class', col.getAttribute('class').replace(' hidden', ''))
    }
}

function CreateCircleHandler(form){
    let x = form['circleInputX'].value
    let y = form['circleInputY'].value
    let r = form['circleInputR'].value
    CreteCircle(x, y, r)
}

function CreateRectangleHandler(form){

}

function CreateTriangleHandler(form){

}

function CreteCircle(x, y, r){
    shapes.push(new Shape(ShapeType.CIRCLE, [[x, y],[x + r, y + r]]))
}

function CreateTriangle(points){
    shapes.push(new Shape(ShapeType.TRIANGLE, points))
}

function CreateRectangle(points){
    shapes.push(new Shape(ShapeType.RECTANGLE, points))
}