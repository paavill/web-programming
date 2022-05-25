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



//#region ОБРАБОТЧИКИ СОБЫТИЙ
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

function inputChanged(prop, value, biggerInput){
    biggerInput.setAttribute(prop, value)
}

function navBarItemClick(element, toShow){
    let elements = document.getElementsByClassName('nav-link active')
    elements = Array.from(elements)
    elements.forEach(e => e.setAttribute('class', 'nav-link'))
    element.setAttribute('class', element.getAttribute('class') + ' active')

    elements = document.getElementsByClassName('no-hidden')
    elements = Array.from(elements)
    elements.forEach(e => e.setAttribute('class', 'hidden'))
    
    document.getElementById(toShow).setAttribute('class', 'no-hidden')
}
//#endregion

//#region ГЕНЕРАЦИЯ

function showAllHidden(){
    let elements = document.getElementsByClassName('hidden')
    elements = Array.from(elements)
    elements.forEach(e => e.setAttribute('class', e.getAttribute('class').replace(' hidden', '')))
}

async function generate(form){
    showAllHidden()
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
//#endregion

//#region JSON
function loadFromJSON(element){
    showAllHidden()
    let personArrayOld = personArray;
    try {
        personArray = JSON.parse(element.value, (key, value) => {
            if (key === "biometrics.dateOfBirth") {
                return new Date(value);
            }
            return value;
        });
        try {
            replaseTableWithId(personArray, 'tables')
            document.getElementById('persons-count').innerHTML = personArray.length
        } catch (e) {
            window.alert("JSON не соответствует программе")
            personArray = personArrayOld;
            replaseTableWithId(personArray, 'tables')
        }
    } catch (e) {
        window.alert("Во время десериализации произошла ошибка")
    }
}

function unloadToJSON(){
    navigator.clipboard.writeText(JSON.stringify(personArray))
            .then(() => window.alert("JSON скопирован в буфер обмена"));
}
//#endregion

//#region ФИЛЬТРЫ
function applyFilters(form){
    setDisabledPropButtons(true)
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
    setDisabledPropButtons(false)
}

function stringPredicate(first, second){
    return first.toLowerCase().includes(second.toLowerCase())
}

function lessDatePredicate(first, second){
    let splitedDatef = first.split('.')
    let datef = new Date(splitedDatef[2], parseInt(splitedDatef[1])-1, splitedDatef[0])
    return datef.getFullYear() <= parseInt(second)
}

function biggerDatePredicate(first, second){
    let splitedDatef = first.split('.')
    let datef = new Date(splitedDatef[2], parseInt(splitedDatef[1])-1, splitedDatef[0])
    return datef.getFullYear() >= parseInt(second)
}

function applyFilter(array, need, propPath, value, predicat){
    if(need){
        let path = propPath.split('.')
        return array.filter(e => {
            let propValue = getPropByPath(path, e, 0)
            return predicat(propValue, value)
        })
    }else{
        return array
    }
}

function clearFilters(){
    setDisabledPropButtons(true)
    replaseTableWithId(personArray, 'tables')
    setDisabledPropButtons(false)
}

function getPropByPath(path, value, count){
    if(path.length - 1 == count){
        return value[path[count]]
    }else{
        return getPropByPath(path, value[path[count]], count + 1)
    }
}
//#endregion

//#region ИЗМЕНЕНИЕ DOM
function replaseTableWithId(array, id){
    let tablesPar = document.getElementById(id).parentElement
    deleteElemendById(id);
    let div = document.createElement('div')
    div.setAttribute('id', id)
    div.setAttribute('class', 'table-responsive')
    let objectDom = getArrayAsDOMObject(array, 'persons-table')
    div.appendChild(objectDom)
    tablesPar.appendChild(div);
}

function deleteElemendById(id){
    let toDel = document.getElementById(id);
    if(toDel !== null && toDel !== undefined)
    {
        toDel.remove();
    }
}
//#endregion

//#region ФОРМИРОВАНИЕ DOM ТАБЛИЦЫ
function getHeader(){
    let thead = document.createElement('thead')
    thead.innerHTML = `
        <tr>
            <th rowspan='2' scope="col">#</th>
            <th scope="col" colspan='3'>Full name</th>
            <th scope="col" colspan='2'>Biometrics</th>
            <th scope="col" rowspan='3'>Phone number</th>
            <th scope="col" colspan='5'>Residential address</th>
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
            <th scope="col">Naiborhood</th>
        </tr>
    `
    return thead
}

function appendTdToTr(tr, tdContent){
    let td = document.createElement("td")
    if(tdContent !== undefined){
        td.innerHTML = tdContent
    } else {
        td.innerHTML = ""
    }
    tr.appendChild(td)
}

function getArrayAsDOMObject(array, id){
    let table = document.createElement("table");
    table.setAttribute("id", id);
    table.setAttribute("class", "table table-bordered");
    let thead = getHeader();
    let tbody = document.createElement("tbody");
    let tr = document.createElement("tr");
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
        appendTdToTr(ntr, e.residentialAddress.naiborhood)
        tbody.appendChild(ntr)
    })
    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}

function addNaiborhood(element){
    setDisabledPropButtons(true)
    let phoneNumber = element['phoneNumber'].value
    let naiborhoodName = element['naiborhoodName'].value
    personArray.forEach(e => {
        if(e.phoneNumber.includes(`(${phoneNumber})`)){
            e.residentialAddress.naiborhood = naiborhoodName
        }
    })
    replaseTableWithId(personArray, 'tables')
    setDisabledPropButtons(false)
}

function deleteBirthAfterDate(element){
    setDisabledPropButtons(true)
    let year = element['dateInput'].value
    personArray.forEach(e => {
        if(e.biometrics.dateOfBirth !== undefined){
            let splitedDate = e.biometrics.dateOfBirth.split('.')
            let date = new Date(splitedDate[2], parseInt(splitedDate[1])-1, splitedDate[0])
            if(date.getFullYear() > parseInt(year)){
                delete e.biometrics.dateOfBirth
            }
        }
    })
    replaseTableWithId(personArray, 'tables')
    setDisabledPropButtons(false)
}
//#endregion

//#region ВАЛИДАЦИЯ
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
//#endregion