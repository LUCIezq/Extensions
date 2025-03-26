const containerElements = document.getElementById('containerElements')
let contador = 0;
const inputHeader = document.getElementById('headerInput');
const statusP = document.querySelector('.main__extension-status');
const buttons = Array.from(document.querySelectorAll('.main__filter-options li'));
let extensionesJson;
let extensionesJsonActives = [];
const darkModeButton = document.getElementById('headerLabelInput');
let buttonActual = 'filter-all';


async function obtenerDatos() {
    const datos = await obtenerDatosJson('./data.json');
    extensionesJson = datos;
    generarContenido(datos);
    removeExtensiones();
    searchExtension();
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
                                    <button class = 'button__remove' data-id="${element.id}">Remove</button>
                                    <div class="checkbox-apple">
                                        <input class="yep" id="${element.id}" type="checkbox">
                                        <label for="${element.id}"></label>
                                    </div>
                                </div>                                
                            </div>`;

        newItem.classList.add('extension');
        containerElements.appendChild(newItem);
        contador++;
    })
    statusController();
    removeExtensiones();
    activateExtension();
}

function removeExtensiones() {
    const extensionesNode = document.querySelectorAll('.extension');

    extensionesNode.forEach(extension => {
        const buttonRemove = extension.getElementsByTagName('button')[0];
        const dataId = buttonRemove.getAttribute('data-id');

        buttonRemove.addEventListener('click', () => {
            extensionesJson = extensionesJson.filter(extension => extension.id != dataId);
            generarContenido(extensionesJson);
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
    const nodeExtensions = document.querySelectorAll('.extension');

    buttons.forEach(button => {
        button.addEventListener('click', () => {

            let buttonActive = buttons.find(button => button.classList.contains('main__option--active'));

            if (buttonActive) {
                buttonActive.classList.remove('main__option--active');
                button.classList.add('main__option--active');
            } else {
                throw new Error('Boton no encontrado');
            }

            const filterType = button.getAttribute('data-filter');
            buttonActual = filterType;
            console.log(buttonActual)
            let filter = [];

            switch (filterType) {
                case 'filter-all': filter = extensionesJson;
                    break;
                case 'filter-active': filter = extensionesJson.filter(element => element.isActive == true);
                    break;
                case 'filter-inactive': filter = extensionesJson.filter(element => element.isActive == false);
                    break;
            }
            if (filter != undefined) {
                generarContenido(filter);
            }
        })
    })

}

const searchExtension = () => {
    inputHeader.addEventListener('keyup', () => {
        const inputValue = inputHeader.value.toLowerCase().trim();

        if (buttonActual == 'filter-all') {
            generarContenido(extensionesJson.filter(extension => extension.name.toLowerCase().includes(inputValue)));
        } else {
            if (buttonActual == 'filter-active') {
                generarContenido(extensionesJsonActives.filter(extension => extension.name.toLowerCase().includes(inputValue)));
            } else {
                generarContenido(extensionesJson.filter(extension => extension.name.toLowerCase().includes(inputValue)));
            }
        }
    })
}

const activateExtension = () => {
    const extensiones = document.querySelectorAll('.extension');

    extensiones.forEach(extension => {
        const extensionButton = extension.querySelector('input');

        extensionButton.addEventListener('click', () => {
            const extensionBuscada = extensionesJson.find(element => element.id == extensionButton.getAttribute('id'));

            if (extensionBuscada && !extensionBuscada.isActive) {
                extensionBuscada.isActive = true;
                extensionesJsonActives.push(extensionBuscada);
            } else {
                extensionBuscada.isActive = false;
                extensionesJsonActives = extensionesJsonActives.filter(extension => extension.id != extensionBuscada.id);
            }
            if (buttonActual == 'filter-active') {
                generarContenido(extensionesJsonActives);
            } else {
                if (buttonActual == 'filter-inactive') {
                    generarContenido(extensionesJson.filter(extension => !extension.isActive));
                }
            }
        })
    })
}

const activateDarkMode = () => {
    darkModeButton.addEventListener('click', () => {
        if (!document.getElementById("dark-mode-style")) { //Pregunta si existe o no -> Si no existe devuelve null y entra 
            const linkCss = document.createElement('link');
            linkCss.rel = 'stylesheet';
            linkCss.href = './DarkMode.css';
            linkCss.id = 'dark-mode-style';
            document.head.appendChild(linkCss);
        } else {
            document.getElementById("dark-mode-style").remove();
            //Si existe lo que hace es obtenerlo y eliminarlo.
        }
    })
}

activateDarkMode();
activateExtension();
obtenerDatos();
filterExtensions();
