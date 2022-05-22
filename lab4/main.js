function generateTable(element) {
    let err = !isNaN(parseInt(element[1].value)) && isFinite(element[1].value) &&
        parseInt(element[1].value) >= 1 && parseInt(element[1].value) <= 50;
    if (err) {
        let width = parseInt(element[1].value);
        let id = element[2].value;
        let toDelElm = document.getElementById(id);
        if (!(toDelElm === null)) {
            toDelElm.remove();
        }
        let table = document.createElement("table");
        table.setAttribute("id", id);
        let tbody = document.createElement("tbody");
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        for (let i = 0; i < width; i++) {
            let ntr = tr.cloneNode(true);
            for (let j = 0; j < width; j++) {
                let ntd = td.cloneNode(true);
                let d = Math.ceil(width / 2);
                let delta = Math.abs(d - width / 2);
                let yDelta = i - d < 0 ? 0 : (i - d) * 2 + 1 + Math.ceil(delta);
                if (j - i + yDelta + Math.ceil(delta) <= d && d <= j + i - yDelta + 1) {
                    if (j - i + yDelta + Math.ceil(delta) == d || d == j + i - yDelta + 1) {
                        ntd.innerHTML = i + 1;
                        ntd.setAttribute("style", "background: Aqua;")
                    } else {
                        ntd.setAttribute("style", "background: Red;")
                    }
                }
                ntr.appendChild(ntd);
            }
            tbody.appendChild(ntr);
        }
        table.appendChild(tbody);
        element.parentNode.appendChild(table);
    } else {
        alert("Ошибка ввода данных! Значение: " + element[0].value)
    }
}

function mediumDelete(element, rButtons) {
    let lessOrMore = rButtons[0].checked;
    let toDelete = [];
    let medium = 0;
    let count = 0;
    if (!(element === undefined) && !(element === null)) {
        runOnDOMCell(element, (td) => {
            if (!isNaN(parseFloat(td.innerHTML))) {
                count += 1;
                medium += parseFloat(td.innerHTML);
            }
        });
        medium /= count;
        runOnDOMCell(element, (td) => {
            let isNn = !isNaN(parseFloat(td.innerHTML));
            let parsed = parseFloat(td.innerHTML);
            if (isNn && lessOrMore && parsed < medium) {
                toDelete.indexOf(td.parentNode) == -1 ? toDelete.push(td.parentNode) : false;
            } else if (isNn && !lessOrMore && parsed > medium) {
                toDelete.indexOf(td.parentNode) == -1 ? toDelete.push(td.parentNode) : false;
            }
        });
        deleteElements(toDelete);
        alert("Среднее арифметическое: " + medium);
    } else {
        alert('Ошибка! Создайте таблицу. Кнопка "Создать".')
    }
}

function replaceNumbers(element) { 
    if (!(element === undefined) && !(element === null)) {
        runOnDOMRow(element, (tr) => {
            let toReplace = [];
            let count = 0;
            Array.from(tr.children).forEach(td => {
                if (!isNaN(parseFloat(td.innerHTML))) {
                    toReplace.push(td);
                } else if (td.style.backgroundColor == "red"){
                    count++;
                }
            });
            toReplace.forEach(e => {
                e.innerHTML = count;
            });
        });
        alert("Среднее арифметическое: " + medium);
    } else {
        alert('Ошибка! Создайте таблицу. Кнопка "Создать".')
    }
}

function runOnDOMCell(element, func) {
    runOnDOMRow(element, (tr) => {
        Array.from(tr.children).forEach(td => {
            func(td)
        });
    });
}

function runOnDOMRow(element, func) {
    Array.from(element.children).forEach(tbody => {
        Array.from(tbody.children).forEach(tr => {
            func(tr);
        });
    });
}

function deleteElements(elements) {
    elements.forEach(e => {
        e.remove();
    });
}

function deleteCol(element, val) {
    let toDelete = [];
    let toDelNumber = [];
    let ln = element.rows[0].children.length;
    for(let i = 0; i < ln; i++){
        for(let j = 0; j < ln; j++){
            if(toDelete[j] === undefined && toDelNumber[j]===undefined){
                toDelete[j] = [];
                toDelNumber[j] = [];
            }
            toDelete[j].push(element.rows[i].children[j]);
            if(!isNaN(parseFloat(element.rows[i].children[j].innerHTML)) &&
            isFinite(element.rows[i].children[j].innerHTML)){
                toDelNumber[j] += parseFloat(element.rows[i].children[j].innerHTML);
            }
        }   
    }
    for(let i = 0; i < ln; i++){
        if(toDelNumber[i] > parseFloat(val)){
            toDelete[i].forEach(e => {e.remove()});
        }
    }
}