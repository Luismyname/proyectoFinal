const { BrowserWindow } = require('@electron/remote')
const fetch = require('node-fetch')
const recurso = 'http://127.0.0.1:8080'

//boton que te lleva al menu principal

let paginaPrincipal = document.getElementById('pagina-principal')

paginaPrincipal.addEventListener('click', () => {
    BrowserWindow.getFocusedWindow().loadFile('employee.html');
});

let clienteP = document.getElementById('cliente-principal')

clienteP.addEventListener('click', ()=>{
    BrowserWindow.getFocusedWindow().loadFile('vistaClientes.html')
})

let empleadoP = document.getElementById('empleado-principal');

empleadoP.addEventListener('click', () => {
    BrowserWindow.getFocusedWindow().loadFile('vistaEmpleados.html');
});


let calendarioP = document.getElementById('calendario-principal')

calendarioP.addEventListener('click', ()=>{
    BrowserWindow.getFocusedWindow().loadFile('vistaCalendario.html')
})

// Botón cerrar sesión
let btnCerrarSesion = document.getElementById('btn-cerrar-sesion')

btnCerrarSesion.addEventListener('click', () => {
    BrowserWindow.getFocusedWindow().loadFile('index.html');
})