const { BrowserWindow } = require('@electron/remote')
const fetch = require('node-fetch')
const recurso = 'http://127.0.0.1:8080'

let winContent = document.getElementsByClassName('window-content')[0]; // Contenedor principal de la ventana
let empleadoP = document.getElementById('empleado-principal'); // Botón o elemento para mostrar empleados
let viewempleados = document.getElementById('vista-empleados')
let clienteV = document.getElementById('vista-clientes'); // Botón o elemento para mostrar clientes
let viewClientes = document.getElementById('cliente-principal')
let AllEmplados = []

//funcion para mostrar personas
function mostrarPersonas(role, contenido) {
    fetch(recurso + '/users')
        .then(res => res.json())
        .then(json => {
            AllEmplados = json;

            let listaE = '';
            for (let empleado of AllEmplados) {
                if (!empleado.role.includes(role)) continue; //muestra solo el rol que queremos ver
                listaE += `<li class="list-group-item">
                        <img>
                        <div class="media-body">
                            <strong>${empleado.name}</strong>
                            <p>${empleado.email}</p>
                        </div>
                    </li>`;
            }

            contenido.innerHTML = `
            <div id="desplazar">
                <div id="resultado">
                    <ul class="list-group">
                        <li class="list-group-header">
                            <input id="form-control" type="text" placeholder="Search for someone">
                        </li>
                        ${listaE}
                    </ul>
                </div>
            </div>
            `;
            winContent.appendChild(contenido);
            
            // Agregar funcionalidad de búsqueda en empleados
            let searchInput = document.getElementById('form-control');
            searchInput.addEventListener('input', function() {
                let filter = searchInput.value.toLowerCase();
                let items = document.querySelectorAll('.list-group-item');
                
                items.forEach(item => {
                    let text = item.textContent.toLowerCase();
                    if (text.includes(filter)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    
viewempleados.addEventListener('click', () => {
    // Elimina el div anterior si existe
    const oldResultado = document.getElementById('desplazar');
    if (oldResultado) {
        oldResultado.remove();
    }

    let contenido = document.createElement('div');

    mostrarPersonas('employee', contenido); // Muestra empleados al hacer clic en el botón

    
});

//cambio de pagina para ver a todos los empleados


empleadoP.addEventListener('click', () => {
    BrowserWindow.getFocusedWindow().loadFile('vistaEmpleados.html');
});

//conteo de empleados
let numEmpleados = document.getElementById('num-empleados');
let conteoEmpleados = 0; // Variable para contar empleados

function contarEmpleados() {
    
    fetch(recurso + '/users')
        .then(res => res.json())
        .then(json => {AllEmplados = json

        for (let empleado of AllEmplados) {
            if (empleado.role.includes('employee')) {
                conteoEmpleados++;
            }
        }
    numEmpleados.innerHTML = `<p id="num-empleados">Total de empleados: ${conteoEmpleados} </p>`;
    })
}

contarEmpleados(); // Llamada inicial para contar empleados al cargar el script

//manejo con clientes

//navegacion a paginas de clientes
viewClientes.addEventListener('click',()=>{
    BrowserWindow.getFocusedWindow().loadFile('vistaClientes.html');
});

clienteV.addEventListener('click', () => {
    // Elimina el div anterior si existe
    const oldResultado = document.getElementById('desplazar');
    if (oldResultado) {
        oldResultado.remove();
    }
    let contenido = document.createElement('div');
    mostrarPersonas('client', contenido); // Muestra clientes al hacer clic en el botón
});

//conteo de clientes
let numClientes = document.getElementById('num-clientes');
let conteoClientes = 0; //Variable para contar Clientes

function contarClientes(){

    fetch(recurso + '/users')
        .then(res => res.json())
        .then(json => {AllEmplados = json
            for(let personas of AllEmplados){
                if(personas.role.includes('client')){
                    conteoClientes++;
                }
            }
    numClientes.innerHTML = `<p id="num-clientes">Total de clientes: ${conteoClientes} </p>`;
        })
}

contarClientes(); // Llamada inicial para contar clientes al cargar el script

//funcion para mostrar citas de manera cronologica
function mostrarCitas(contenido) {
    fetch(recurso + '/appointments')
        .then(res => res.json())
        .then(json => {
            console.log('Citas obtenidas:', json);
            let citas = json;
            
            if (!citas || citas.length === 0) {
                contenido.innerHTML = `
                <div id="desplazar">
                    <div id="resultado">
                        <p style="padding: 20px; text-align: center;">No hay citas programadas</p>
                    </div>
                </div>
                `;
                winContent.appendChild(contenido);
                return;
            }
            
            // Ordenar citas cronológicamente
            citas.sort((a, b) => {
                return new Date(a.start) - new Date(b.start);
            });

            let listaCitas = '';
            for (let cita of citas) {
                const fechaInicio = new Date(cita.start).toLocaleDateString('es-ES');
                const horaInicio = new Date(cita.start).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                listaCitas += `<li class="list-group-item">
                        <div class="media-body">
                            <strong>${cita.title || 'Sin nombre'}</strong>
                            <p>Fecha: ${fechaInicio}</p>
                            <p>Hora: ${horaInicio}</p>
                            <p>Detalles: ${cita.description || 'N/A'}</p>
                        </div>
                    </li>`;
            }

            contenido.innerHTML = `
            <div id="desplazar">
                <div id="resultado">
                    <ul class="list-group">
                        <li class="list-group-header">
                            <input id="form-control" type="text" placeholder="Buscar cita...">
                        </li>
                        ${listaCitas}
                    </ul>
                </div>
            </div>
            `;
            winContent.appendChild(contenido);
            
            // Agregar funcionalidad de búsqueda en citas
            let searchInput = document.getElementById('form-control');
            searchInput.addEventListener('input', function() {
                let filter = searchInput.value.toLowerCase();
                let items = document.querySelectorAll('.list-group-item');
                
                items.forEach(item => {
                    let text = item.textContent.toLowerCase();
                    if (text.includes(filter)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error al obtener citas:', error);
            contenido.innerHTML = `
            <div id="desplazar">
                <div id="resultado">
                    <p style="padding: 20px; color: red;">Error al cargar citas: ${error.message}</p>
                </div>
            </div>
            `;
            winContent.appendChild(contenido);
        });
}

//evento para vista de calendario
let vistaCalendario = document.getElementById('vista-calendario');

vistaCalendario.addEventListener('click', () => {
    // Elimina el div anterior si existe
    const oldResultado = document.getElementById('desplazar');
    if (oldResultado) {
        oldResultado.remove();
    }
    let contenido = document.createElement('div');
    mostrarCitas(contenido); // Muestra citas al hacer clic
});

//funcion de pagina principal 
let paginaPrincipal = document.getElementById('pagina-principal');

/*al darle click al boton principal, eliminara todas las busquedas activas del
lado derecho de la pantalla, dando lugar a una vista como la pagina principal*/
paginaPrincipal.addEventListener('click', () => {
    const oldResultado = document.getElementById('desplazar');
    if (oldResultado) {
        oldResultado.remove();
    }
});

let calendarioP = document.getElementById('calendario-principal')

calendarioP.addEventListener('click', ()=>{
    BrowserWindow.getFocusedWindow().loadFile('vistaCalendario.html')
})


let pagosP = document.getElementById('pagos-principal')

pagosP.addEventListener('click', () => {
    BrowserWindow.getFocusedWindow().loadFile('vistaPagos.html');
});

let clientesP = document.getElementById('cliente-principal')

clientesP.addEventListener('click', ()=>{
    BrowserWindow.getFocusedWindow().loadFile('vistaClientes.html');
})

// Botón cerrar sesión
let btnCerrarSesion = document.getElementById('btn-cerrar-sesion')

btnCerrarSesion.addEventListener('click', () => {
    BrowserWindow.getFocusedWindow().loadFile('index.html');
})