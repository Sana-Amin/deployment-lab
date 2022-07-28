const addForm = document.querySelector('form');
const nameInput = document.querySelector('input');
const container = document.querySelector('section');

function putTheThingInTheView(res) {
    container.innerHTML = ''
    nameInput.value = ''

    res.data.forEach((plantName, index) => {
        container.innerHTML += `<p name=${index}>${plantName}</p>`
    })

    document.querySelectorAll('p').forEach(element => {
        const theIndexValue = element.getAttribute('name');

        element.addEventListener('click', () => {
            axios
                .delete(`/api/plants/${theIndexValue}`)
                .then(res => {
                    putTheThingInTheView(res)
                })
        })
    })
}
function submitHandler(evt) {
    evt.preventDefault();

    axios
        .post('/api/plants', { name: nameInput.value })
        .then(res => {
            putTheThingInTheView(res)
        })
        .catch(err => {
            nameInput.value = ''

            const notif = document.createElement('aside')
            notif.innerHTML = `<p>${err.response.data}</p>
            <button class="close">close</button>`
            document.body.appendChild(notif)

            document.querySelectorAll('.close').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.target.parentNode.remove()
                })
            })
        })
}

// get plant list on initial load
axios
    .get('/api/plants')
    .then(res => {
        putTheThingInTheView(res)
    })

addForm.addEventListener('submit', submitHandler)