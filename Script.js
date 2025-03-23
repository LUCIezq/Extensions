const containerElements = document.getElementById('containerElements')
let contador = 0;
const inputHeader = document.getElementById('headerInput');
const statusP = document.querySelector('.main__extension-status');
let extensionesJson = [];


async function obtenerDatos() {
    const datos = await obtenerDatosJson('./data.json');
    extensionesJson = datos;
    generarContenido(datos);
    removeExtensiones();
    activateExtension();
}

async function obtenerDatosJson(url) {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
        throw new Error('Error al cargar los datos');
    }

    return await respuesta.json();
}

function generarContenido(datos) {
    containerElements.innerHTML = '';
    datos.forEach(element => {
        const newItem = document.createElement('div');

        newItem.innerHTML = `<div class = 'content'>
                                <div class= 'content__top'>
                                    <img src = '${element.logo}' class='content__logo'>
                                    <div>
                                        <h2 class='content__name'>${element.name}</h2>
                                        <p class='content__description'>${element.description}</p>    
                                    </div>
                                </div>

                                <div class='content__bottom'>
                                    <button class = 'button__remove'>Remove</button>
                                    <div class="checkbox-apple">
                                        <input class="yep" id="${contador}" type="checkbox">
                                        <label for="${contador}"></label>
                                    </div>
                                </div>                                
                            </div>`;

        newItem.classList.add('extension');
        containerElements.appendChild(newItem);
        contador++;
    })
}

function removeExtensiones() {
    const extensionesNode = document.querySelectorAll('.extension');
    extensionesNode.forEach(extension => {
        const buttonRemove = extension.querySelector('button');
        buttonRemove.addEventListener('click', () => {
            extension.remove();
            statusController();
        })
    })
}

function statusController() {
    if (containerElements.innerHTML == '') {
        statusP.classList.add('visible');
    } else {
        statusP.classList.remove('visible');
    }
}

function filterExtensions() {
    const buttons = document.querySelectorAll('.main__filter-options li');
    const nodeExtensions = document.querySelectorAll('.extension');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            let buttonActive = obtenerButtonActive(buttons).classList.remove('main__option--active');
            button.classList.add('main__option--active');

            const filterType = button.getAttribute('data-filter');
            let filter;
            switch (filterType) {
                case 'filter-all': filter = extensionesJson;
                    break;
                case 'filter-active': filter = extensionesJson.filter(element => element.isActive == true);
                    break;
                case 'filter-inactive': filter = extensionesJson.filter(element => element.isActive == false);
                    break;
            }
            generarContenido(filter);
        })
    })

}

const searchExtension = () => {
    inputHeader.addEventListener('keyup', () => {
        const inputValue = inputHeader.value.toLowerCase();

        const filteredExtensions = extensionesJson.filter(extension => extension.name.toLowerCase().includes(inputValue));

        generarContenido(filteredExtensions);
        statusController();
    })
}

function obtenerButtonActive(buttons) {
    return Array.from(buttons).find(button => button.classList.contains('main__option--active'));
}

const activateExtension = () => {
    const extensiones = document.querySelectorAll('.extension');

    extensiones.forEach(extension => {
        const extensionButton = extension.querySelector('input');
        extensionButton.addEventListener('click', () => {
            const id = extensionButton.getAttribute('id');
            const extensionBuscada = extensionesJson.find(element => element.id == id);

            if (extensionBuscada) {
                extensionBuscada.isActive = !extensionBuscada.isActive;
            }
        })
    })
}

searchExtension();
filterExtensions();
obtenerDatos();
