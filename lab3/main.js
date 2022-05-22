let x0glob;
let xnglob;
let charactersAfterСommaNumberglob;
let stepglob;
let y0glob;
let ynglob;
let aglob;
let nm1glob;
let nm2glob;

function factorial(n) {
    return (n != 1) && (n != 0) ? n * factorial(n - 1) : 1;
}

function f(x, y) 
{
    let summ = 0;
    if(x + y <= aglob){
        for (let n = 0; n <= nm1glob; n++){
            summ += Math.pow((x + y)/n, n);
        }
        return summ;
    } else {
        for (let n = 0; n <= nm2glob; n++){
            summ += Math.pow(y, n)/(factorial(n) + 2);
        }
    }
    return summ;
}

//функция определения числового значения
function isNumeric(n) 
{
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isValid(val)
{
	return !isNaN(parseInt(val)) && isFinite(val) && 2 <= val && val <= 6;
}

//табулирование функции от x0 до xn с шагом sx
function tabFunc(x0, xn, y0, yn, a, nm1, nm2, step) 
{
    //получаем ссылку на элемент div для вывода значений
    var rez = document.getElementById("result");

    //если значения параметров не числовые - выводим ошибку
    if (!isNumeric(x0) || !isNumeric(xn) ||
		!isNumeric(y0) || !isNumeric(yn) || 
		!isNumeric(step) || !isNumeric(a) || 
		!isValid(nm1) || !isValid(nm2))
	{
        rez.innerHTML = "Ошибка! Проверьте введёные значения<br>";
        return;
    }

    x0 = x0glob = parseFloat(x0);
    xn = xnglob = parseFloat(xn);
    charactersAfterСommaNumber = charactersAfterСommaNumberglob = step.length - 2;
    step = stepglob = parseFloat(step);
	y0 = y0glob = parseFloat(y0);
    yn = ynglob = parseFloat(yn);
	a = aglob = parseFloat(a);
    nm1 = nm1glob = parseInt(nm1);
	nm2 = nm2glob = parseInt(nm2);


    //проверим допустимость границ диапазона табулирования
    if ((x0 > xn && step > 0) || 
		(x0 < xn && step < 0) ||
		(y0 > yn && step > 0) || 
		(y0 < yn && step < 0) || x0 == xn
		|| y0 == yn || step == 0) 
	{
        rez.innerHTML = "Ошибка! C такими значениями нельзя табулировать функцию<br>";
        return;
    }

    // очищаем содержание элемента div и выводим заголовок
	// свойство innerHTML позволяет заменить содержимое элемента
    rez.innerHTML = "Результаты табуляции от " + x0 + " до " + xn + " c шагом " + step + ":<br>";

    //табулируем функцию и выводим значение в элемент div
    let x;
	let y;
    let maxX;
    let maxY;
    let maxF = Number.NEGATIVE_INFINITY;
    let minX;
    let minY;
    let minF = Number.POSITIVE_INFINITY;
	var s = "<table><tr><td>X/Y</td>";
    for (y = y0; y0 < yn ? y < yn + step * 0.5: y > yn + step * 0.5; y += step) 
	{
		s += "<td>" + y.toFixed(charactersAfterСommaNumber) + "</td>";
	}
    s += "</tr>";
    for (x = x0; x0 < xn ? x < xn + step * 0.5: x > xn + step * 0.5; x += step) 
	{
		s += "<tr><td>" + x.toFixed(charactersAfterСommaNumber) + "</td>";
		for (y = y0; y0 < yn ? y < yn + step * 0.5: y > yn + step * 0.5; y += step) 
		{
            let fxy = f(x, y);
            if(fxy > maxF)
            {
                maxF = fxy;
                maxX = x;
                maxY = y;
            }
            if(fxy < minF)
            {
                minF = fxy;
                minX = x;
                minY = y;
            }
			s += "<td>" + fxy.toFixed(charactersAfterСommaNumber) + "</td>";
		}
		s += "</tr>";
    }
	s += "</table>";
	
	console.log(s);
	rez.innerHTML += s; // добавляем вёрстку в содержимое элемента
    let maxElm = document.createElement("div");
    maxElm.innerHTML = "max f("+ maxX + ","+ maxY +") = " + maxF + "<br>";
    maxElm.innerHTML += "min f("+ minX + ","+ minY +") = " + minF;
    rez.insertBefore(maxElm, rez.children[0]);
}