
//#region Функции
function f1(x){
    return (Math.pow(x, 3) + 2*x)/(4*Math.sin(4*x)) + Math.pow(Math.tan(4*x), 3)
}

function f2(x){
    return Math.pow(Math.sin(x), 2) - Math.abs(Math.log(x) + Math.exp(x))/4
}

function f3(x){
    return Math.sqrt(Math.pow(x, 3) + 6*x)/(Math.pow(x, 5) - 4*x)
}

function memoization(func){
    let memory = []
    
    let result = function(x){
        let result = func(x)
        memory.push(result)
        return result        
    }

    result.getValuesNumber = function(){
        return memory.length
    }

    result.getValuesWithIndex = function(index){
        return memory[index]
    }

    return result
}

function debug(func){
    return function(x){
        console.log('Time: '+ new Date().toTimeString())
        console.log('x: '+ x)
        let result = func(x)
        console.log('y: '+ result)
        return result        
    }
}

function callsCount(func){
    let count = 0

    let result = function(x){
        count++
        return func(x)
    }

    result.getCallsCount = function(){
        return count
    }

    result.getSetCallsCount = function(value){
        count = value
    }

    return result
}

//#endregion

function inputChanged(prop, value, input){
    input.setAttribute(prop, value)
}

function calculate(form, functionForm, characForm, optionsForm){
    let min = form.min.value
    let max = form.max.value
    let h = form.h.value
    let func = getFunction(functionForm)
    let options = getOptions(optionsForm)
    func = applyOptions(func, options)
    let charact = getCharacteristics(characForm)
    let funcValues = getFunctionValues(func, parseFloat(min), parseFloat(max), parseFloat(h))
    let res = checkСharacteristics(funcValues, charact)
    displayCharacteristics('characteristicsResult', res, document.getElementById('mainRow'))
}

function getFunction(functionForm){
    let funcName = functionForm.func.value
    if(funcName === 'f1'){
        return f1;
    } else if(funcName === 'f2') {
        return f2;
    } else {
        return f3;
    }
}

function displayCharacteristics(id, characteristics, parent){
    deleteElemendById(id)
    let div = document.createElement('div')
    div.setAttribute('class', 'col')
    div.setAttribute('id', id)
    div.innerHTML = `
        <div class="card">
            <div class="card-header">
                Characteristics results
            </div>
            <div id="resultEntrails" class="list-group">
                
            </div>
        </div>
    `
    parent.appendChild(div)
    let group = document.getElementById('resultEntrails')

    let charact = document.createElement('div')
    charact.setAttribute('class', 'list-group-item')
    characteristics.forEach(e => {
        let nnode = charact.cloneNode(true)
        nnode.innerHTML = e.key + " " + e.result
        group.appendChild(nnode)
    })
    if(group.children.length === 0){
        deleteElemendById(id)
    }
}

function deleteElemendById(id){
    let toDel = document.getElementById(id);
    if(toDel !== null && toDel !== undefined)
    {
        toDel.remove();
    }
}

function getCharacteristics(characForm){
    let result = []
    if(characForm.averageCheckBox.checked){
        result.push({key: "Avarage: ", func: avarageValueCharacteristic})
    }
    if(characForm.zeroCheckBox.checked){
        result.push({key: "Zero: ", func: zeroValueNumberCharacteristic})
    }
    if(characForm.negativeCheckBox.checked){
        result.push({key: "Negative: ", func: nerativeValueNumberCharacteristic})
    }
    return result
}

function getOptions(optionsForm){
    let result = []
    if(optionsForm.memoization.checked){
        result.push({key: "memoization", func: memoization})
    }
    if(optionsForm.debugging.checked){
        result.push({key: "debug", func: debug})
    }
    if(optionsForm.callsNumber.checked){
        result.push({key: "callsCount", func: callsCount})
    }
    return result
}

function getFunctionValues(func, min, max, h){
    let result = []
    for(i = min; i <= max; i+=h) {
        result.push(func(i))
    }
    return result
}

function applyOptions(func, options){
    options.unshift(func)
    return options.reduce((previousValue, currentValue) => currentValue.func(previousValue))
}

function checkСharacteristics(funcValues, characteristics){
    return characteristics.map(e => {return {key: e.key, result: e.func(funcValues)}})
}

function avarageValueCharacteristic(funcValues){
    let result = 0;
    let count = funcValues.length
    funcValues.forEach(e => {
        if(!isNaN(e) && isFinite(e)){
            result += e
        }
    })
    return result / count
}

function zeroValueNumberCharacteristic(funcValues){
    let result = 0;
    funcValues.forEach(e => {
        if(Math.abs(e) < 1e-5){
            result++
        }
    })
    return result
}

function nerativeValueNumberCharacteristic(funcValues){
    let result = 0;
    funcValues.forEach(e => {
        if(e < 0){
            result++
        }
    })
    return result
}