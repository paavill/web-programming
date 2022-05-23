let personArray = []
let url = 'https://api.randomdatatools.ru/'

function createObject(element){
    return {
        fullName:{
            lastName: element.LastName,
            firstName: element.FirstName,
            fatherName: element.FatherName
        },
        biometrics: {
            gender: element.Gender,
            dateOfBirth:element.DateOfBirth
        } ,
        phoneNumber: element.Phone,
        residentialAddress: {
            city: element.City,
            street: element.Street,
            house: element.House,
            apartment: element.Apartment
        }
    }
}

function onLoad(){
    replaseTableWithId(personArray, 'tables')
}

function birthFilterCheckBoxClick(){
    let needBirthFilter = document.getElementById('needBirthFilter').checked
    document.getElementById('birthFilterLow').required = needBirthFilter
    document.getElementById('birthFilterHigh').required = needBirthFilter
}

function cityFilterCheckBoxClick(){
    let needCityFilter = document.getElementById('needCityFilter').checked
    document.getElementById('cityFilterValue').required = needCityFilter
}

async function generate(form){
    deleteElemendById('error-text');
    setDisabledPropButtons(true)
    try{
        let count = getNumberOrThrow(form['count'].value, parseInt)
        while (count > 0) {
            let resultUrl = url;
            if(count > 100){
                resultUrl += '?count=100'
                count = count - 100
            } else {
                resultUrl += `?count=${count}`
                count = 0
            }
            let responce = await fetch(resultUrl)
            let jsonResponce = await responce.json()
            if(jsonResponce.forEach !== undefined){
                jsonResponce.forEach(element => {
                    personArray.push(createObject(element))
                })
            }
            else
            {
                personArray.push(createObject(jsonResponce))
            }
            console.log("sleep")
        }
        replaseTableWithId(personArray, 'tables')
        document.getElementById('persons-count').innerHTML = personArray.length
    }catch(e){
        let div = document.createElement('div')
        div.setAttribute("id", "error-text")
        div.innerHTML = e.toString()
        document.getElementById('body').appendChild(div)
    }
    setDisabledPropButtons(false)
}

function setDisabledPropButtons(value){
    let buttons = document.getElementsByClassName('btn')
    buttons = Array.from(buttons)
    buttons.forEach(e => e.disabled = value)
}

function applyFilters(form){
    let resultArray = [];
    let needCityFilter = form['needCityFilter'].checked
    let cityFilterValue = form['cityFilterValue'].value
    let needGenderFilter = form['needGenderFilter'].checked
    let genderFilterValue = form['genderFilterValue'].value
    let needBirthFilter = form['needBirthFilter'].checked
    let birthFilterLow =  form['birthFilterLow'].value
    let birthFilterHigh = form['birthFilterHigh'].value
    
    resultArray = applyFilter(personArray, needCityFilter, 'residentialAddress.city', cityFilterValue, stringPredicate)
    resultArray = applyFilter(resultArray, needGenderFilter, 'biometrics.gender', genderFilterValue, stringPredicate)
    resultArray = applyFilter(resultArray, needBirthFilter, 'biometrics.dateOfBirth', birthFilterLow, biggerDatePredicate)
    resultArray = applyFilter(resultArray, needBirthFilter, 'biometrics.dateOfBirth', birthFilterHigh, lessDatePredicate)

    replaseTableWithId(resultArray, 'tables')
}

function stringPredicate(first, second){
    return first.includes(second)
}

function lessDatePredicate(first, second){
    return new Date(first).getFullYear() <= new Date(second).getFullYear()
}

function biggerDatePredicate(first, second){
    return new Date(first).getFullYear() >= new Date(second).getFullYear()
}

function applyFilter(array, need, propPath, value, predicat){
    if(need){
        let path = propPath.split('.')
        return array.filter(e => {
            let propValue = getPropByPath(path, e, 0);
            let res = predicat(propValue, value)
            return res
        })
    }else{
        return array
    }
}

function getPropByPath(path, value, count){
    if(path.length - 1 == count){
        return value[path[count]]
    }else{
        return getPropByPath(path, value[path[count]], count + 1)
    }
}

function clearFilters(){
    replaseTableWithId(personArray, 'tables')
}

function replaseTableWithId(array, id){
    let tablesPar = document.getElementById(id).parentElement
    deleteElemendById(id);
    let div = document.createElement('div')
    div.setAttribute('id', id)
    div.setAttribute('class', 'table-responsive')
    let objectDom = getArrayAsDOMObject(array, 'persons-table')
    div.appendChild(objectDom)
    tablesPar.appendChild(div)
}

function deleteElemendById(id){
    let toDel = document.getElementById(id);
    if(toDel !== null && toDel !== undefined)
    {
        toDel.remove();
    }
}

function getHeader(){
    let thead = document.createElement('thead')
    //thead.setAttribute("class", "thead-dark")
    thead.innerHTML = `
        <tr>
            <th rowspan='2' scope="col">#</th>
            <th scope="col" colspan='3'>Full name</th>
            <th scope="col" colspan='2'>Biometrics</th>
            <th scope="col" rowspan='3'>Phone number</th>
            <th scope="col" colspan='4'>Residential address</th>
        </tr>
        <tr>
            <th scope="col">First name</th>
            <th scope="col">Last name</th>
            <th scope="col">Father name</th>
            <th scope="col">Gender</th>
            <th scope="col">Date of birth</th>
            <th scope="col">City</th>
            <th scope="col">Street</th>
            <th scope="col">House</th>
            <th scope="col">Apartment</th>
        </tr>
    `
    return thead
}

function appendTdToTr(tr, tdContent){
    let td = document.createElement("td")
    td.innerHTML = tdContent
    tr.appendChild(td)
}

function getArrayAsDOMObject(array, id){
    let table = document.createElement("table");
    table.setAttribute("id", id);
    table.setAttribute("class", "table table-bordered");
    let thead = getHeader();
    let tbody = document.createElement("tbody");
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    array.forEach((e, index) => {
        let ntr = tr.cloneNode()
        appendTdToTr(ntr, index)    
        appendTdToTr(ntr, e.fullName.firstName)
        appendTdToTr(ntr, e.fullName.lastName)
        appendTdToTr(ntr, e.fullName.fatherName)
        
        appendTdToTr(ntr, e.biometrics.gender)
        appendTdToTr(ntr, e.biometrics.dateOfBirth)

        appendTdToTr(ntr, e.phoneNumber)

        appendTdToTr(ntr, e.residentialAddress.city)
        appendTdToTr(ntr, e.residentialAddress.street)
        appendTdToTr(ntr, e.residentialAddress.house)
        appendTdToTr(ntr, e.residentialAddress.apartment)
        tbody.appendChild(ntr)
    })
    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}

//ВАЛИДАЦИЯ
function getNumberOrThrow(value, parse){
    if(!isNaN(parse(value)) && isFinite(value)) {
        return parse(value);
    } else {
        throw new ValidationError('Value: ', value);
    }
}



class ValidationError extends Error {
    constructor(message, value) {
      super(message);
      this.name = "ValidationError";
      this.value = value;
    }
    
    toString() {
        let result = super.toString();
        result += this.value.toString();
        return result;
    }
}
//----------