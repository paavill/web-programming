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

async function generate(form){
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
            jsonResponce.forEach(element => {
                personArray.push(createObject(element))
            })
            console.log("sleep")
        }
        deleteElemendById('output-text');
        let div = document.createElement('div')
        div.setAttribute("id", "output-text")
        div.innerHTML += personArray.length
        div.innerHTML += JSON.stringify(personArray)
        document.getElementById('body').appendChild(div)
    }catch(e){
        deleteElemendById('error-text');
        let div = document.createElement('div')
        div.setAttribute("id", "error-text")
        div.innerHTML = e.toString()
        document.getElementById('body').appendChild(div)
    }
}

function deleteElemendById(id){
    let toDel = document.getElementById(id);
    if(toDel !== null && toDel !== undefined)
    {
        toDel.remove();
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
