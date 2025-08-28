const { BrowserWindow } = require('@electron/remote')
const fetch = require('node-fetch')
const recurso = 'http://127.0.0.1:8080'

//boton que te lleva al menu principal

let paginaPrincipal = document.getElementById('pagina-principal')

paginaPrincipal.addEventListener('click', () => {
    BrowserWindow.getFocusedWindow().loadFile('admin.html');
});

let clienteP = document.getElementById('cliente-principal')

clienteP.addEventListener('click', ()=>{
    BrowserWindow.getFocusedWindow().loadFile('clientes.html')
})

let calendarioP = document.getElementById('calendario-principal')

calendarioP.addEventListener('click', ()=>{
    BrowserWindow.getFocusedWindow().loadFile('calendario.html')
})

let pagosP = document.getElementById('pagos-principal')

pagosP.addEventListener('click', () => {
    BrowserWindow.getFocusedWindow().loadFile('pagos.html');
});

let AllEmpleados = []

function MostrarEmpleados(){
    fetch(recurso + '/users4/'+'employee')
    .then(res => res.json())
    .then(json => {
        AllEmpleados = json;
        let lista = ''
        AllEmpleados.forEach(empleado => {
            empleado.date_ini = new Date(empleado.date_ini);
            lista += `<div class="mvistas" id="vista-empleados">
                        <img src="./imagen/${empleado.id}.png" class="logo" />
                        <h3>Empleado: ${empleado.name}</h3>
                        <p>Fecha de inicio: ${empleado.date_ini.getDate()}/${empleado.date_ini.getMonth() + 1}/${empleado.date_ini.getFullYear()} </p>
                        <p>Email: ${empleado.email} </p>
                    </div>`
        })
        document.getElementById('contenedor').innerHTML = lista;
    })
}

MostrarEmpleados();