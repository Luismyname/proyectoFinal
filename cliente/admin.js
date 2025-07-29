const { BrowserWindow } = require('@electron/remote')
const fetch = require('node-fetch')
const recurso = 'http://127.0.0.1:8080'

let winContent = document.getElementsByClassName('window-content')[0]; // Contenedor principal de la ventana
let empleadoP = document.getElementById('empleado-principal'); // Botón o elemento para mostrar empleados
let AllEmplados = []

//funcion para mostrar personas
function mostrarPersonas(role, contenido) {
    fetch(recurso + '/users')
        .then(res => res.json())
        .then(json => {
            AllEmplados = json;

            let listaE = '';
            for (let empleado of AllEmplados) {
                if (empleado.role !== role) continue; //muestra solo el rol que queremos ver
                listaE += `<li class="list-group-item">
                        <img>
                        <div class="media-body">
                            <strong>${empleado.name}</strong>
                            <p>${empleado.email}</p>
                        </div>
                    </li>`;
            }

            contenido.innerHTML = `
                <div id="resultado">
                    <ul class="list-group">
                        <li class="list-group-header">
                            <input id="form-control" type="text" placeholder="Search for someone">
                        </li>
                        ${listaE}
                    </ul>
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

empleadoP.addEventListener('click', () => {
    // Elimina el div anterior si existe
    const oldResultado = document.getElementById('resultado');
    if (oldResultado) {
        oldResultado.remove();
    }

    let contenido = document.createElement('div');

    mostrarPersonas('employee', contenido); // Muestra empleados al hacer clic en el botón

    
});

//cambio de pagina para ver a todos los empleados
let viewempleados = document.getElementById('vista-empleados')

viewempleados.addEventListener('click', () => {
    BrowserWindow.getFocusedWindow().loadFile('empleados.html');
});

//conteo de empleados
let numEmpleados = document.getElementById('num-empleados');
let conteoEmpleados = 0; // Variable para contar empleados

function contarEmpleados() {
    
    fetch(recurso + '/users')
        .then(res => res.json())
        .then(json => {AllEmplados = json

        for (let empleado of AllEmplados) {
            if (empleado.role === 'employee') {
                conteoEmpleados++;
            }
        }
    numEmpleados.innerHTML = `<p id="num-empleados">Total de empleados: ${conteoEmpleados} </p>`;
    })
}

contarEmpleados(); // Llamada inicial para contar empleados al cargar el script

//buscar clientes

let clientesP = document.getElementById('cliente-principal');

clientesP.addEventListener('click', () => {
    // Elimina el div anterior si existe
    const oldResultado = document.getElementById('resultado');
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
                if(personas.role === 'client'){
                    conteoClientes++;
                }
            }
    numClientes.innerHTML = `<p id="num-clientes">Total de clientes: ${conteoClientes} </p>`;
        })
}

contarClientes(); // Llamada inicial para contar clientes al cargar el script

//funcion de pagina principal 
let paginaPrincipal = document.getElementById('pagina-principal');

paginaPrincipal.addEventListener('click', () => {
    const oldResultado = document.getElementById('resultado');
    if (oldResultado) {
        oldResultado.remove();
    }
});