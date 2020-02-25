const load = () => {
    fetch('./getposts')
        .then(
            response => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                response.json().then(data => {
                    document.querySelector('#myTable tbody').textContent = '';
                    data.forEach(elem => {
                        document.querySelector('#myTable tbody').innerHTML += `<td class="bg">${elem.id}</td><td>${elem.firstname}</td><td>${elem.surname}</td><td>${elem.birth}</td><td>${elem.power}</td><td><button class="remove" onclick="removeCosmonaut(event)">x</button></td>`;
                    });

                });
            }
        )
        .catch(err => {
            console.log('Fetch Error :-S', err);
        });
}

document.addEventListener('load', load());

document.querySelector('#send').addEventListener('click', () => document.querySelector('#popup').style.display = "flex");

const addCosmonaut = () => {
    let data = {};
    let ready = true;

    [...document.querySelector('#popup').children].filter(elem => elem.nodeName == "INPUT").forEach((elem) => {
        if (elem.value) {
            data[elem.id] = elem.value;
            elem.classList.remove('empty');
            elem.classList.add('alright');
        } else {
            elem.classList.remove('alright');
            elem.classList.add('empty');
            ready = false;
        }
    });

    if (ready) {
        fetch('./addpost', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(res => res.json())
            .then(res => console.log(res));

        closePopup();
        load();
        [...document.querySelector('#popup').children].filter(elem => elem.nodeName == "INPUT").forEach(elem => {
            elem.value = "";
            elem.classList.remove('empty');
            elem.classList.remove('alright');
        });
    }
}


const removeCosmonaut = event => {
    fetch('./rempost', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: parseInt(event.target.parentNode.parentNode.firstChild.innerHTML)
        })
    }).then(res => res.json())
    .then(res => console.log(res));

    load();
}

const closePopup = () => document.querySelector('#popup').style.display = "none";