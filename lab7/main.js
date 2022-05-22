let personArray = []
let url = 'https://api.randomdatatools.ru/'

async function generate(form){
    try{
        //TODO: сделать задержку
        let count = getNumberOrThrow(form['count'].value, parseInt)
        while(count > 0){
            if(count > 100){
                let responce = await fetch(url + '?count=100');
                let jsonResponce = await responce.json();
                jsonResponce.forEach(element => {
                    personArray.push({
                        fullName:{
                            lastName: element.LastName,
                            firstName: element.FirstName,
                            fatherName: element.FatherName
                        },
                        biometrics: {
                            gender: element.Gender,
                            dateOfBirth:element.DateOfBirth
                        }  
                    })
                })
                count = count - 100
            } else {
                let responce = await fetch(url + `?count=${count}`);
                let jsonResponce = await responce.json();
                jsonResponce.forEach(element => {
                    personArray.push({
                        fullName:{
                            lastName: element.LastName,
                            firstName: element.FirstName,
                            fatherName: element.FatherName
                        },
                        biometrics: {
                            gender: element.Gender,
                            dateOfBirth:element.DateOfBirth
                        }    
                    })
                })
                count = 0;
            }
        }
        deleteElemendById('output-text');
        let div = document.createElement('div')
        div.setAttribute("id", "output-text")
        div.innerHTML = JSON.stringify(personArray)
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
