//Funkce load() requestne kosmonauty od serveru a zapíše je do tabulky
function load() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //Zde se parsnou data, co přišla
            let data = JSON.parse(xhttp.responseText);
            for (i in data) {
                //zde se vytvoří node řádku s daty, které se pak zapíší do tabulky
                let cont = document.createElement('tr');
                var elem = '<td class="bg">' + data[i].id + '</td><td>' + data[i].firstname + '</td><td>' + data[i].surname + '</td><td>' + data[i].birth + '</td><td>' + data[i].power + '</td><td><button class="remove" onclick="remove(event)">x</button></td>';
                cont.innerHTML = elem;
                document.getElementById('myTable').appendChild(cont);
            }

        }
    };
    xhttp.open("GET", './getposts', true);
    xhttp.send();
}

load(); //volání funkce po načtení stránky


//Zviditelnění popupu pro přídání nového kosmonauta
document.getElementById('send').addEventListener('click', () => {
    document.getElementById('popup').style.display = "flex";
});


//Sběr dat a jejich následnovné odeslání serveru ke zpracování
function addOne(event) {
    let data = {};
    let ready = true;

    //Zápis dat do json formátu, kdy id je klíč a value hodnota
    for (let i = 1; i < 5; i++) {
        //jednotlivé elementy hledám relativně od zmáčknutého buttonu, xd
        if (event.target.parentNode.parentNode.children[i].value) {
            data[event.target.parentNode.parentNode.children[i].id] = event.target.parentNode.parentNode.children[i].value;
            //třídy yope a nope mění vzhled inputů, když nejsou/jsou prádné
            event.target.parentNode.parentNode.children[i].classList.remove("nope");
            event.target.parentNode.parentNode.children[i].classList.add("yope");
        } else {
            event.target.parentNode.parentNode.children[i].classList.remove("yope");
            event.target.parentNode.parentNode.children[i].classList.add("nope");
            ready = false;
        }
    }

    //Pokud jsou zadána všehna data (ready===true), odešlou se serveru ke zpracovnání
    if (ready) {
        var xhttp = new XMLHttpRequest();
        xhttp.open('POST', './addpost', true);
        xhttp.setRequestHeader('Content-type', 'application/json');

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                console.log(xhttp.responseText);
            }
        }
        xhttp.send(JSON.stringify(data));

        closePopup(null); //zavřít popup

        //Smazání tabulku se starými daty
        while (document.getElementById('myTable').children.length > 1) {
            document.getElementById('myTable').removeChild(document.getElementById('myTable').children[1]);
        }
        load(); //načtení dat nových

        //Ostranit vzhledové změny inputů
        for (let i = 1; i < 5; i++) {
            event.target.parentNode.parentNode.children[i].value = "";
            event.target.parentNode.parentNode.children[i].classList.remove("yope");
            event.target.parentNode.parentNode.children[i].classList.remove("nope");
        }
    }
}


//Ostranění jednoho kosmonauta podle jeho id, které je schované v tabulce
function remove(event) {
    var xhttp = new XMLHttpRequest();
    let id = parseInt(event.target.parentNode.parentNode.firstChild.innerHTML);
    let nodes = Array.prototype.slice.call(document.getElementsByClassName('remove'));
    xhttp.open("POST", './rempost', true);
    let data = {
        id: id
    };

    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(xhttp.responseText);
        }
    }
    xhttp.send(JSON.stringify(data));
    location.reload(); //reload stránky, aby neměla stará data
}

//Zavření poupu
function closePopup(event) {
    document.getElementById('popup').style.display = "none";
}