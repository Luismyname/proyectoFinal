const { BrowserWindow } = require('@electron/remote')
const fetch = require('node-fetch')
const recurso = 'http://127.0.0.1:8080'

//boton que te lleva al menu principal

let paginaPrincipal = document.getElementById('pagina-principal')

paginaPrincipal.addEventListener('click', () => {
    BrowserWindow.getFocusedWindow().loadFile('admin.html');
});

let calendarioP = document.getElementById('calendario-principal')

calendarioP.addEventListener('click', ()=>{
    BrowserWindow.getFocusedWindow().loadFile('calendario.html')
})

let clienteP = document.getElementById('cliente-principal')

clienteP.addEventListener('click', ()=>{
    BrowserWindow.getFocusedWindow().loadFile('clientes.html')
})

let empleadoP = document.getElementById('empleado-principal');

empleadoP.addEventListener('click', () => {
    BrowserWindow.getFocusedWindow().loadFile('empleados.html');
});


let pagosP = document.getElementById('pagos-principal')

pagosP.addEventListener('click', () => {
    BrowserWindow.getFocusedWindow().loadFile('pagos.html');
});

let AllClientes = []

function MostrarClientes(){
    fetch(recurso + '/users4/'+'client')
    .then(res => res.json())
    .then(json => {
        AllClientes = json;
        let lista = ''
        AllClientes.forEach(cliente => {
            lista += `<div class="mvistas" id="vista-empleados">
                        <img src="./imagen/${cliente.id}.png" class="logo" />
                        <h3>Cliente: ${cliente.name}</h3>
                        <p>Email: ${cliente.email} </p>
                    </div>`
        })
        document.getElementById('contenedor').innerHTML = lista;
    })
}

MostrarClientes();