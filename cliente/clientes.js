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

function MostrarClientes() {
    fetch(recurso + '/users4/' + 'client')
        .then(res => res.json())
        .then(json => {
            AllClientes = json;
            let contenedor = document.getElementById('contenedor');
            contenedor.innerHTML = ''; // Limpiar antes de agregar

            AllClientes.forEach(cliente => {
                const div = document.createElement('div');
                div.className = 'mvistas';
                div.id = 'vista-clientes';

                const img = document.createElement('img');
                img.className = 'logo';
                img.src = `./imagen/${cliente._id}.png`;
                img.addEventListener('error', () => {
                    img.src = './imagen/default.png';
                });

                const h3 = document.createElement('h3');
                h3.textContent = `Cliente: ${cliente.name}`;

                const p = document.createElement('p');
                p.textContent = `Email: ${cliente.email}`;

                div.appendChild(img);
                div.appendChild(h3);
                div.appendChild(p);
                contenedor.appendChild(div);
            });
        });
}

//agregar cliente
let nuevoCliente = document.getElementById('nuevo-cliente')
let desplazar = document.getElementById('desplazar')

nuevoCliente.addEventListener('click', () => {
    desplazar.innerHTML = `
    <form>
            <fieldset class="formulario-cliente">
                <legend>Informacion de cliente</legend>
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
                </div>
                <div class="formulario">
                    <label for="birthday">Fecha de nacimiento:
                        <input type="date" id="birthday" name="birthday">
                    </label>
                    <br/>
                    <label for="email">Email:
                        <input type="email" id="email" name="email" maxlength="40">
                    </label>
                </div>
            </fieldset>
        </form>
        <form>
            <fieldset class="formulario-cliente">
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
        <button id="agregar-cliente">Agregar cliente</button>
        <input type="file" accept="image/png" id="imagenCliente" />
            `
    
        // Ahora que el botón existe, le agregas el event listener
        let agregarCliente = document.getElementById('agregar-cliente');
        agregarCliente.addEventListener('click', () => {
            fetch(recurso + '/users')
                .then(res => res.json())
                .then(json => {
                    // Genera el nuevo _id como el máximo + 1
                    let allIds = json.map(u => u._id);
                    let newId = allIds.length > 0 ? Math.max(...allIds) + 1 : 1;
    
                    let newClient = {
                        "_id": newId,
                        "name": document.getElementById('name').value,
                        "lastname": document.getElementById('lastname').value,
                        "phone": document.getElementById('phone').value,
                        "direction": `calle: ${document.getElementById('street').value} Estado:${document.getElementById('state').value} Ciudad:${document.getElementById('city').value} Codigo Postal:${document.getElementById('zip').value}`,
                        "birthday": document.getElementById('birthday').value,
                        "email": document.getElementById('email').value,
                        "role": ["client"]
                    };
    
                    fetch(recurso + '/users', {
                        method: 'POST',
                        body: JSON.stringify(newClient),
                        headers: {'Content-Type': 'application/json'}
                    })
                    .then(res => res.json())
                    .then(json => {
                        console.log('Cliente agregado', json);
                        alert('Cliente agregado correctamente');
                        MostrarClientes();
                        desplazar.innerHTML = '';
                    })
                    .catch(error => {
                        console.error('Error al agregar cliente', error);
                        alert('Error al agregar cliente');
                    });
                });
                let inputImagen = document.getElementById('imagenCliente');
                inputImagen.addEventListener('change', (event) => {
                    fs.readFile(event.target.files[0].path, (err, data) => {
                        if (err) {
                            console.error('Error al leer la imagen', err);
                            return;
                        }else {
                            fs.writeFile(`./imagen/${newId}.png`, data, (err) => {
                                if (err) {
                                    console.error('Error al guardar la imagen', err);
                                } else {
                                    console.log('Imagen guardada correctamente');
                                }
                            });
                        }
                    });
                });
        });
    });

MostrarClientes();