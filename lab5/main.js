let M1 = [];
let M2 = [];
let lostVec = [];

function onLoad(){
    //document.getElementById('fillInfButton').setAttribute('disabled', true);
     //   document.getElementById('createLostVecButton').setAttribute('disabled', true);
}
class ValidationError extends Error {
    value;
    constructor(message, value) {
      super(message);
      this.name = "ValidationError";
      this.value = value;
    }
    toString(){
        let result = super.toString();
        result += this.value.toString();
        return result;
    }
}
//ВАЛИДАЦИЯ
function getNumberOrThrow(value, parse){
    if(!isNaN(parse(value)) && isFinite(value)) {
        return parse(value);
    } else {
        throw new ValidationError('Value: ', value);
    }
}

function checkMinMaxOrTrow(min, max){
    if(min > max){
        throw new ValidationError("Min must be lesser then max: ", "min:" + min.toString() +
                " max:" + max.toString());
    }
}
//
//ГЕНЕРАЦИЯ
function getArrayAsDOMObject(array, id){
    let table = document.createElement("table");
    table.setAttribute("id", id);
    let tbody = document.createElement("tbody");
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    array.forEach(a => {
        let ntr = tr.cloneNode(true);
        a.forEach(e => {
            let ntd = td.cloneNode(true);
            ntd.innerHTML = e;
            ntr.appendChild(ntd);
        })
        tbody.appendChild(ntr);
    })
    table.appendChild(tbody);
    return table;
}

function deleteElemendById(id){
    let toDel = document.getElementById(id);
    if(toDel !== null && toDel !== undefined)
    {
        toDel.remove();
    }
}

function getArrayFomDOMParam(form, matrixNumber){
    let min = getNumberOrThrow(form['min'].value, parseInt);
    let max = getNumberOrThrow(form['max'].value, parseInt);
    checkMinMaxOrTrow(min, max);
    let width = getNumberOrThrow(form['widthM' + matrixNumber].value, parseInt);
    let height = getNumberOrThrow(form['heightM'].value, parseInt);
    let M = new Array(height);
    M.fill(new Array(width).fill(0));
    M = M.map(row => row.map(() => Math.floor(Math.random()*(max - min) + min)));
    return M;
}

function addArrayToDom(conteiner, array, id){
    let innerDiv = document.createElement('div');
    let M1Table = getArrayAsDOMObject(array, id);
    innerDiv.innerHTML += id;
    innerDiv.appendChild(M1Table);
    conteiner.appendChild(innerDiv);
}

function generateAndShow(form){
    try{
        M1 = getArrayFomDOMParam(form, '1');
        M2 = getArrayFomDOMParam(form, '2');

        let div = document.createElement('div');
        div.setAttribute("id", "tables")
        div.setAttribute("style", "display: flex;")

        addArrayToDom(div, M1, 'M1');
        addArrayToDom(div, M2, 'M2');

        deleteElemendById('tables');
        document.getElementById('body').appendChild(div);
        document.getElementById('fillInfButton').disabled = true;
        document.getElementById('checkButton').disabled = false;
        document.getElementById('checkAllButton').disabled = false;
        document.getElementById('createLostVecButton').disabled = true;
    }
    catch (e){
        deleteElemendById('error-text');
        let div = document.createElement('div');
        div.setAttribute("id", "error-text");
        div.innerHTML = e.toString();
        document.getElementById('body').appendChild(div);
    }
}
//
//ВХОЖДЕНИЕ
function checkVectorsWithNumber(form){
    try{
        let rowNumberInM1 = getNumberOrThrow(form['rowNumberInM1'].value, parseInt);
        let rowNumberInM2 = getNumberOrThrow(form['rowNumberInM2'].value, parseInt);
        alert(isVectorIn(M1[rowNumberInM1], M2[rowNumberInM2]));
    }
    catch (e){
        deleteElemendById('error-text');
        let div = document.createElement('div');
        div.setAttribute("id", "error-text");
        div.innerHTML = e.toString();
        document.getElementById('body').appendChild(div);
    }
}

function checkAllRows(){
    let toDel = document.getElementById('res');
    deleteParentByObj(toDel);
    result = getCheckResultAllRows();
    let div = document.getElementById('tables');
    addArrayToDom(div, result, 'res');
    document.getElementById('createLostVecButton').disabled = false;
}

function getCheckResultAllRows(){
    result = [];
    M1.forEach((e, index) => {
        if(M2[index] !== undefined){
            result.push([isVectorIn(e,M2[index])])
        }
    })
    return result;
}

function isVectorIn(L1, L2){
    if(L1 !== undefined && L2 !== undefined){
        if (L1.length > L2.length){
            return serchInFirsr(L1, L2) == 0 ? 0 : 3
        } else if (L1.length < L2.length) {
            return serchInFirsr(L2, L1) == 0 ? 1 : 3
        } else {
            return serchInFirsr(L1, L2) == 0 ? 2 : 3
        }
    }
    return 3;
}

function serchInFirsr(first, second){
    let currentInd = -1;
    let len = second.length;
    first.every(e => {
        let newInd = second.indexOf(e, currentInd == -1 ? 0 : currentInd + 1);
        if(newInd != -1 && (newInd - currentInd == 1)){
            len -= 1;
            currentInd = newInd;
        } else {
            len = second.length;
            currentInd = -1;
        }
        return len != 0
    });
    return len;
}   
//
//СОСТАВЛЕНИЕ НЕ ВОШЕДШИХ
function createVecOfLost(){
    deleteParentByObj(document.getElementById('lostVec'));
    let result = getCheckResultAllRows();
    lostVec = [];
    result.forEach((e, ind) => {
        if(M1[ind] !== undefined && M2[ind] !== undefined && e[0] === 3){
            lostVec = lostVec.concat(M1[ind].concat(M2[ind]));
        }
    })
    let div = document.getElementById('tables');
    addArrayToDom(div, [lostVec], 'lostVec')
    document.getElementById('fillInfButton').disabled = false;
}

function deleteParentByObj(obj){
    if (obj !== null){
        let per = obj.parentElement;
        per.remove();
    }
}

function fillInf(){
    deleteParentByObj(document.getElementById('lostVecCount'));
    deleteParentByObj(document.getElementById('lostVec'));
    let result = new Map();
    lostVec.forEach(e => {
        if(result.get(e) == undefined){
            result.set(e, 1);
        } else {
            let val = result.get(e);
            val += 1;
            result.set(e, val);
        }
    })
    let k = result.keys();
    let v = result.values();
    lostVec = lostVec.map(e => {
        if(result.get(e) > 1){
            return Infinity;
        }
    })
    let div = document.getElementById('tables');
    addArrayToDom(div, [lostVec], 'lostVec')
    addArrayToDom(div, [Array.from(k), Array.from(v)], 'lostVecCount')
}