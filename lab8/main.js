import * as calc from './calculations.js'
import * as draw from './drawing.js'

let shapes = []
let selectedShapeIndex = 0;
let drawingSpeed = 200
let drawingIntervalId = null;

OnLoad()
RadioGroupClickHandler()

export let ShapeType = { CIRCLE: 'circle', RECTANGLE: 'rectangle', TRIANGLE: 'triangle' }

function BaseObject() {
    let registrationInformation = []

    this.ConsoleLogAll = function () {
        registrationInformation.forEach(e => console.log(e))
    }

    this.ClearRistryInf = function () {
        registrationInformation = []
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
                if (vertices.length >= 2) {
                    return vertices.slice(0, 2)
                } else {
                    throw new Error('Too few vertices for this shape type')
                }
            case ShapeType.RECTANGLE:
                if (vertices.length >= 4) {
                    return vertices.slice(0, 4)
                } else {
                    throw new Error('Too few vertices for this shape type')
                }
            case ShapeType.TRIANGLE:
                if (vertices.length >= 3) {
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
        if (_shapeType !== ShapeType.CIRCLE) {
            _vertices = _vertices.map(vertex => {
                vertex = vertex.map((e, i) => e - _vertices[0][i])
                vertex.push(0)
                let rotationMatrix = calc.GetZRotationMatrix(degrees)
                vertex = calc.MultiplyMatrix(rotationMatrix, vertex.map((e, i) => [e])).slice(0, 2)
                vertex = vertex.map(e => e[0])
                vertex = vertex.map((e, i) => e + _vertices[0][i])
                return vertex
            })
        }
    }

    this.MoveTo = function MoveTo(x, y) {
        Shape.prototype.Register(this.MoveTo.name, arguments)
        let oldMainVertex = _vertices[0]
        _vertices = _vertices.map(vertex => {
            let norm = [vertex[0] - oldMainVertex[0], vertex[1] - oldMainVertex[1]]
            return [norm[0] + x, norm[1] + y]
        })
    }

    this.MoveOnVec = function MoveOnVec(x, y) {
        Shape.prototype.Register(this.MoveOnVec.name, arguments)
        _vertices = _vertices.map(vertex => [vertex[0] + x, vertex[1] + y])
    }

    this.GetSquare = function GetSquare() {
        Shape.prototype.Register(this.GetSquare.name, arguments)
        switch (_shapeType) {
            case ShapeType.CIRCLE:
                let result = Math.PI * Math.pow(calc.GetVecLength(_vertices[0], _vertices[1]), 2)
                return result
            case ShapeType.RECTANGLE:
                let firstTriangle = calc.GetTriangleSquareGeron([_vertices[0], _vertices[1], _vertices[2]])
                let secondTriangle = calc.GetTriangleSquareGeron([_vertices[0], _vertices[3], _vertices[2]])
                return firstTriangle + secondTriangle
            case ShapeType.TRIANGLE:
                return calc.GetTriangleSquareGeron(_vertices)
            default:
                return Error('Unsupported shape type!')
        }
    }

    this.GetPerimeter = function GetPerimeter() {
        Shape.prototype.Register(this.GetPerimeter.name, arguments)
        switch (_shapeType) {
            case ShapeType.CIRCLE:
                return 2 * Math.PI * calc.GetVecLength(_vertices[0], _vertices[1])
            case ShapeType.RECTANGLE:
                let bottomLineLength = calc.GetVecLength(_vertices[0], _vertices[1]);
                let sideLineLength = calc.GetVecLength(_vertices[1], _vertices[2]);
                return (bottomLineLength + sideLineLength)*2
            case ShapeType.TRIANGLE:
                let a = calc.GetVecLength(_vertices[0], _vertices[1])
                let b = calc.GetVecLength(_vertices[1], _vertices[2])
                let c = calc.GetVecLength(_vertices[2], _vertices[0])
                return a + b + c
            default:
                return Error('Unsupported shape type!')
        }
    }

    this.toString = function toString(){
        Shape.prototype.Register(this.toString.name, arguments)
        return "vertices: "+JSON.stringify(_vertices)+" shapeType: "+JSON.stringify(_shapeType)
    }
    //#endregion
}
Shape.prototype = new BaseObject()

function OnLoad() {
    var canvas = document.getElementById("canv");
    var context = canvas.getContext("2d");
    drawingIntervalId = setInterval(() => {
        draw.DrawAll(shapes, context, canvas)
    }, drawingSpeed);

    let renderStopButton = document.getElementById('renderStopButton')
    renderStopButton.addEventListener('click', () => {
        if(drawingIntervalId !== null){
            clearInterval(drawingIntervalId)
            alert('Ok. Stopped!')
            drawingIntervalId = null
        } else {
            alert('Already stopped!')
        }
    })

    let renderStartButton = document.getElementById('renderStartButton')
    renderStartButton.addEventListener('click', () => {
        if(drawingIntervalId === null){
            drawingIntervalId = setInterval(() => {
                draw.DrawAll(shapes, context, canvas)
            }, drawingSpeed);
            alert('Ok. Stopped! Id: ' + drawingIntervalId)
        } else {
            alert('Already run!')
        }
    })

    document.getElementById('stepUpButton').addEventListener('click', () => {
        shapes[selectedShapeIndex].MoveOnVec(0, -1)
    })

    document.getElementById('stepLeftButton').addEventListener('click', () => {
        shapes[selectedShapeIndex].MoveOnVec(-1, 0)
    })

    document.getElementById('stepRightButton').addEventListener('click', () => {
        shapes[selectedShapeIndex].MoveOnVec(1, 0)
    })

    document.getElementById('stepDownButton').addEventListener('click', () => {
        shapes[selectedShapeIndex].MoveOnVec(0, 1)
    })

    let clearRegInfButton = document.getElementById('clearRegInfButton')
    clearRegInfButton.addEventListener('click', ClearRegInfHandler)
    
    let printToConsoleRegInfButton = document.getElementById('printToConsoleRegInfButton')
    printToConsoleRegInfButton.addEventListener('click', PrintToConsoleRegInfHandler)
    
    let moveToForm = document.getElementById('moveToForm')
    moveToForm.addEventListener('submit', MoveToHandler)

    let showPerimeterButton = document.getElementById('showPerimeterButton')
    showPerimeterButton.addEventListener('click', ShowPerimeterHandler)

    let showAreaButton = document.getElementById('showAreaButton')
    showAreaButton.addEventListener('click', ShowAreaHandler)

    let mainContainer = document.getElementById('mainContainer')
    let canv = document.getElementById('canv')
    canv.width = mainContainer.offsetWidth
    window.addEventListener('resize', () => {
        canv.width = mainContainer.offsetWidth
    })

    let shapesRadio = document.getElementsByName('shape')
    shapesRadio = Array.from(shapesRadio)
    shapesRadio.forEach(e => e.addEventListener('click', RadioGroupClickHandler))

    let forationForm = document.getElementById('forationForm')
    forationForm.addEventListener('submit', RotateHandler)

    let shapeControl = document.getElementById('controlForm')
    shapeControl.addEventListener('input', ShapeControlInputChange)

    let addShapeButton = document.getElementById('addShapeButton')
    addShapeButton.addEventListener('click', () => {
        ShapeControlInputMaxValueSet(shapes.length)
        if(shapes.length === 0){
            RemoveClassFromElementsWithClass('show-after-add', ' hidden')
        }
    })
}

function RadioGroupClickHandler() {
    let form = document.getElementById('shape-type-form')
    let addShapeButton = document.getElementById('addShapeButton')
    let setNewVertShapeButton = document.getElementById('setNewVertShapeButton')

    ShowIfChecked(form.Circle, document.getElementById('circleCard'))
    SetHandlerIfChecked(form.Circle, addShapeButton, CreateCircleHandler)
    SetHandlerIfChecked(form.Circle, setNewVertShapeButton, SetNewVertCircleHandler)
    SetFormForButtonIfChecked(form.Circle, addShapeButton, document.getElementById('circleForm'))

    ShowIfChecked(form.Triangle, document.getElementById('triangleCard'))
    SetHandlerIfChecked(form.Triangle, addShapeButton, CreateTriangleHandler)
    SetHandlerIfChecked(form.Triangle, setNewVertShapeButton, SetNewVertTriangleHandler)
    SetFormForButtonIfChecked(form.Triangle, addShapeButton, document.getElementById('triangleForm'))

    ShowIfChecked(form.Rectangle, document.getElementById('rectangleCard'))
    SetHandlerIfChecked(form.Rectangle, addShapeButton, CreateRectangleHandler)
    SetHandlerIfChecked(form.Rectangle, setNewVertShapeButton, SetNewVertRectangleHandler)
    SetFormForButtonIfChecked(form.Rectangle, addShapeButton, document.getElementById('rectangleForm'))
}

function RemoveClassFromElementsWithClass(className, deletingClass){
    let elements =  document.getElementsByClassName(className)
    elements = Array.from(elements)
    elements.forEach(e => RemoveClassFromElement(e, deletingClass))
}

function AddClassToElementIfNotExist(element, classElement){
    if (!element.getAttribute('class').includes(classElement)) {
        element.setAttribute('class', element.getAttribute('class') + classElement)
    }
}

function RemoveClassFromElement(element, classElement){
    element.setAttribute('class', element.getAttribute('class').replace(classElement, ''))
}

function ShowIfChecked(radio, col) {
    if (!radio.checked) {
        AddClassToElementIfNotExist(col, ' hidden')
    } else {
        RemoveClassFromElement(col, ' hidden')
    }
}

function SetFormForButtonIfChecked(radio, button, form) {
    if (radio.checked) {
        button.setAttribute('form', form)
    } else {
        button.setAttribute('form', null)
    }
}

function SetHandlerIfChecked(radio, button, handler) {  
    if (radio.checked) {
        button.addEventListener('click', handler)
    } else {
        button.removeEventListener('click', handler)
    }
}

function GetVertCircleArray() {
    let form = document.getElementById('circleForm')
    let x = parseFloat(form.circleInputX.value)
    let y = parseFloat(form.circleInputY.value)
    let r = parseFloat(form.circleInputR.value)
    return [[x, y], [x + r, y + r]]
}

function GetVertTriangleArray() {
    let form = document.getElementById('triangleForm')
    let x1 = parseFloat(form.triangleInputX1.value)
    let y1 = parseFloat(form.triangleInputY1.value)
    let x2 = parseFloat(form.triangleInputX2.value)
    let y2 = parseFloat(form.triangleInputY2.value)
    let x3 = parseFloat(form.triangleInputX3.value)
    let y3 = parseFloat(form.triangleInputY3.value)
    return [[x1, y1], [x2, y2], [x3, y3]]
}

function GetVertRectangleArray() {
    let form = document.getElementById('rectangleForm')
    let x1 = parseFloat(form.recInputX1.value)
    let y1 = parseFloat(form.recInputY1.value)
    let x2 = parseFloat(form.recInputX2.value)
    let y2 = parseFloat(form.recInputY2.value)
    let x3 = parseFloat(form.recInputX3.value)
    let y3 = parseFloat(form.recInputY3.value)
    let x4 = parseFloat(form.recInputX4.value)
    let y4 = parseFloat(form.recInputY4.value)
    return [[x1, y1], [x2, y2], [x3, y3], [x4, y4]]
}

function SetNewVert(shape, array) {
    CorrectRadioChecked()
    shape.SetVertices(array)
}

function SetNewVertCircleHandler() {
    SetNewVert(shapes[selectedShapeIndex], GetVertCircleArray())
}

function SetNewVertTriangleHandler() {
    SetNewVert(shapes[selectedShapeIndex], GetVertTriangleArray())
}

function SetNewVertRectangleHandler() {
    SetNewVert(shapes[selectedShapeIndex], GetVertRectangleArray())
}

function CreateCircleHandler() {
    let array = GetVertCircleArray()
    CreteCircle(array)
}

function CreateRectangleHandler() {
    let array = GetVertRectangleArray()
    CreateRectangle(array)
}

function CreateTriangleHandler() {
    let array = GetVertTriangleArray()
    CreateTriangle(array)
}

function ShapeControlInputMaxValueSet(value) {
    let shapeControlInput = document.getElementById('shapeControlInput')
    shapeControlInput.setAttribute('max', value)
}

function CorrectRadioChecked(){
    let radioButtons = Array.from(document.getElementsByName('shape'))
    radioButtons.forEach(e => {
        if(e.value === shapes[selectedShapeIndex].GetShapeType()){
            e.checked = true
            RadioGroupClickHandler()
        }
    })
}

function ShapeControlInputChange() {
    let message = document.getElementById('shapeControlInvalidMessage')
    if (IsShapeControlFormValide()) {
        selectedShapeIndex = parseInt(document.getElementById('shapeControlInput').value)
        CorrectRadioChecked()
        SetComponentsWithNameDisabled('shapeControlButton', false)
        message.setAttribute('class', message.getAttribute('class').replace(' no-hidden', ' hidden'))
    } else {
        selectedShapeIndex = null
        SetComponentsWithNameDisabled('shapeControlButton', true)
        message.setAttribute('class', message.getAttribute('class').replace(' hidden', ' no-hidden'))
    }

}

function SetComponentsWithNameDisabled(name, value) {
    let comp = document.getElementsByName(name)
    comp = Array.from(comp)
    comp.forEach(e => e.disabled = value)
}

function IsShapeControlFormValide() {
    let r = document.getElementById('controlForm')
    return r.checkValidity()
}

function RotateHandler(event) {
    event.preventDefault()
    let degree = parseFloat(document.getElementById('rotateInput').value)
    RotateShape(shapes[selectedShapeIndex], degree)
}

function RotateShape(shape, degree) {
    shape.Rotate(degree * Math.PI / 180)
}

function CreteCircle(points) {
    shapes.push(new Shape(ShapeType.CIRCLE, points))
}

function CreateTriangle(points) {
    shapes.push(new Shape(ShapeType.TRIANGLE, points))
}

function CreateRectangle(points) {
    shapes.push(new Shape(ShapeType.RECTANGLE, points))
}

function ShowAreaHandler(){
    alert(shapes[selectedShapeIndex].GetSquare())
}

function ShowPerimeterHandler(){
    alert(shapes[selectedShapeIndex].GetPerimeter())
}

function MoveToHandler(event){
    event.preventDefault()
    let x = parseFloat(document.getElementById('moveToX').value)
    let y = parseFloat(document.getElementById('moveToY').value)
    MoveToShape(shapes[selectedShapeIndex], x, y)
}

function MoveToShape(shape, x, y){
    shape.MoveTo(x, y)
}

function PrintToConsoleRegInfHandler(){
    shapes.forEach((e, index) =>{
        console.log('*-------------------------------*')
        console.log(`Element id:${index}`)
        e.ConsoleLogAll()
        console.log('*-------------------------------*')
    })
}

function ClearRegInfHandler(){
    shapes.forEach((e, index) =>{
        console.log('*-------------------------------*')
        console.log(`Element id:${index}`)
        e.ClearRistryInf()
        console.log('Cleared!')
        console.log('*-------------------------------*')
    })
}