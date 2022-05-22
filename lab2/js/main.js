//Using of jQuery
function loadAnimation() {
    $(document).ready(() => {
        //all body is set display none
        $("body").css("display", "none");
        //appearance time set and fade
        $("body").fadeIn(200);

        $("a").click(function (event) {
            event.preventDefault();
            let linkLocation = this.href;
            $("body").fadeOut(200, () => {
                window.location = linkLocation;
            });
        });
    });
}

function showMenu(event){
    let elem = document.getElementsByClassName("menu");
    if (elem.length == 0){
        event.currentTarget.classList.add("menu");
        let newElem = document.getElementsByClassName("menu");
        let newChild = document.createElement("a");
        newChild.href = "javascript: deleteMenu()";
        newChild.innerHTML = "В прослушивание";
        newChild.style = "color: #ffffff; background-color:#7d8d62;" + 
        "border-radius: 3px; padding: 3px; "
        newElem[0].appendChild(newChild);  
    }
       // let len = event.currentTarget.children.length;
       // event.currentTarget.children[len -1].remove();
       // event.currentTarget.classList.remove("menu");
}

function deleteMenu() {
    alert("Добавлено!");
    let elem = document.getElementsByClassName("menu"); 
    let len = elem[0].children.length;
    elem[0].children[len -1].remove();
    elem[0].classList.remove("menu");
}
