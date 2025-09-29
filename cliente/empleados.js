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

let empleadoP = document.getElementById('empleado-principal');

empleadoP.addEventListener('click', () => {
    BrowserWindow.getFocusedWindow().loadFile('empleados.html');
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
                        <img src="./imagen/${empleado._id}.png" class="logo" />
                        <h3>Empleado: ${empleado.name}</h3>
                        <p>Fecha de inicio: ${empleado.date_ini.getDate()}/${empleado.date_ini.getMonth() + 1}/${empleado.date_ini.getFullYear()} </p>
                        <p>Email: ${empleado.email} </p>
                    </div>`
        })
        document.getElementById('contenedor').innerHTML = lista;
    })
}

//agregar empleados

let nuevoEmpleado = document.getElementById('nuevo-empleado')
let desplazar = document.getElementById('desplazar')

nuevoEmpleado.addEventListener('click', ()=>{
    desplazar.innerHTML = `
    <form>
        <fieldset class="formulario-empleado">
            <legend>Informacion de empleado</legend>
            <div class="formulario">
                <label for="name">Nombre:
                    <input type="text" id="name" name="name">
                </label>
                <br/>
                <label for="lastname">Apellidos:
                    <input type="text" id="lastname" name="lastname">
                </label>
                <br/>
                <label for="phone">Telefono:
                    <input type="text" id="phone" name="phone">
                </label>
                <br/>
                <label for="email">Email:
                    <input type="email" id="email" name="email" maxlength="40">
                </label>
                <br/>
                <label for="password">Contraseña:
                    <input type="password" id="password" name="password">
                </label>
                <br/>
            </div>
            <div class="formulario">
                <label for="birthday">Fecha de nacimiento:
                    <input type="date" id="birthday" name="birthday">
                </label>
                <br/>
                <label for="date_ini">Fecha de inicio:
                    <input type="date" id="date_ini" name="date_ini">
                </label>
            <br/>
                <label for="EAN">EAN:
                    <input type="text" id="EAN" name="EAN">
                </label>
                <br/>
                <label for="specialitation">Especialidad:
                    <select id="specialitation" name="specialitation">
                        <option value="neurologia">Neurología</option>
                        <option value="pediatrica">Pediátrica</option>
                        <option value="geriatrica">Geriátrica</option>
                        <option value="deportiva">Deportiva</option>
                        <option value="respiratoria">Respiratoria</option>
                        <option value="ginecologia">Ginecología</option>
                        <option value="oncologia">Oncología</option>
                        <option value="traumatologia">Traumatología</option>
                        <option value="psiquiatrica">Psiquiátrica</option>
                        <option value="estetica">Estética</option>
                        <option value="paliativos">Paliativos</option>
                    </select>
                </label>
            </div>
        </fieldset>
    </form>
    <form>
        <fieldset class="formulario-empleado">
            <legend>Direccion</legend>
            <div class="formulario">
                <label for="street">Calle:
                    <input type="text" id="street" name="street">
                </label>
                <br/>
                <label for="city">Ciudad:
                <input type="text" id="city" name="city">
            </label>
            <br/>
            </div>
            <div class="formulario">
            <label for="state">Estado:
                <input type="text" id="state" name="state">
            </label>
            <br/>
            <label for="zip">Codigo Postal:
                <input type="text" id="zip" name="zip">
            </label>
            <br/>
            </div>
        </fieldset>
    </form>
    <button id="agregar-empleado">Agregar empleado</button>
        `

    // Ahora que el botón existe, le agregas el event listener
    let agregarEmpleado = document.getElementById('agregar-empleado');
    agregarEmpleado.addEventListener('click', () => {
        fetch(recurso + '/users')
            .then(res => res.json())
            .then(json => {
                // Genera el nuevo _id como el máximo + 1
                let allIds = json.map(u => u._id);
                let newId = allIds.length > 0 ? Math.max(...allIds) + 1 : 1;

                let newEmployee = {
                    "_id": newId,
                    "name": document.getElementById('name').value,
                    "lastname": document.getElementById('lastname').value,
                    "phone": document.getElementById('phone').value,
                    "direction": `calle: ${document.getElementById('street').value} Estado:${document.getElementById('state').value} Ciudad:${document.getElementById('city').value} Codigo Postal:${document.getElementById('zip').value}`,
                    "birthday": document.getElementById('birthday').value,
                    "date_ini": document.getElementById('date_ini').value,
                    "email": document.getElementById('email').value,
                    "password": document.getElementById('password').value,
                    "role": ["employee", "client"],
                    "specialitation": [document.getElementById('specialitation').value],
                    "EAN": document.getElementById('EAN').value
                };

                fetch(recurso + '/users', {
                    method: 'POST',
                    body: JSON.stringify(newEmployee),
                    headers: {'Content-Type': 'application/json'}
                })
                .then(res => res.json())
                .then(json => {
                    console.log('Empleado agregado', json);
                    alert('Empleado agregado correctamente');
                    MostrarEmpleados();
                    desplazar.innerHTML = '';
                })
                .catch(error => {
                    console.error('Error al agregar empleado', error);
                    alert('Error al agregar empleado');
                });
            });
    });
})


document.addEventListener('DOMContentLoaded', () => {
    MostrarEmpleados();
});