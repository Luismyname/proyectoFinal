const { BrowserWindow } = require('@electron/remote')
const fetch = require('node-fetch')
const recurso = 'http://127.0.0.1:8080'
const fs = require('fs');
const { get } = require('http');
const path = require('path'); // para construir rutas seguras

//boton que te lleva al menu principal

let paginaPrincipal = document.getElementById('pagina-principal')

paginaPrincipal.addEventListener('click', () => {
    BrowserWindow.getFocusedWindow().loadFile('admin.html');
});

let clienteP = document.getElementById('cliente-principal')

clienteP.addEventListener('click', () => {
    BrowserWindow.getFocusedWindow().loadFile('clientes.html')
})

let calendarioP = document.getElementById('calendario-principal')

calendarioP.addEventListener('click', () => {
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

let selectedImagePath = null; // ruta del archivo seleccionada (capturada en el change)

function MostrarEmpleados() {
    fetch(recurso + '/users4/employee')
        .then(res => res.json())
        .then(json => {
            AllEmpleados = json;
            const contenedor = document.getElementById('contenedor');
            if (!contenedor) return; // evita fallos si no existe
            contenedor.innerHTML = ''; // Limpiar contenido previo

            AllEmpleados.forEach(empleado => {
                empleado.date_ini = new Date(empleado.date_ini);

                const div = document.createElement('div');
                div.className = 'mvistas';

                const img = document.createElement('img');
                img.className = 'logo';
                img.src = `./imagen/${empleado._id}.png`;
                img.addEventListener('error', () => {
                    img.src = './imagen/default.png';
                });

                const h3 = document.createElement('h3');
                h3.textContent = `Empleado: ${empleado.name}`;

                const pFecha = document.createElement('p');
                pFecha.textContent = `Fecha de inicio: ${empleado.date_ini.getDate()}/${empleado.date_ini.getMonth() + 1}/${empleado.date_ini.getFullYear()}`;

                const pEmail = document.createElement('p');
                pEmail.textContent = `Email: ${empleado.email}`;

                div.appendChild(img);
                div.appendChild(h3);
                div.appendChild(pFecha);
                div.appendChild(pEmail);
                contenedor.appendChild(div);
            });
            MostrarDetalle();

            // Agregar funcionalidad de búsqueda en empleados
            let searchInput = document.getElementById('form-control');
            searchInput.addEventListener('input', function () {
                let filter = searchInput.value.toLowerCase();
                let items = document.querySelectorAll('.mvistas');
                items.forEach(item => {
                    let text = item.textContent.toLowerCase();
                    if (text.includes(filter)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });

            function MostrarDetalle() {
                let dettaleEmpleado = document.getElementsByClassName('mvistas');
                for (let i = 0; i < dettaleEmpleado.length; i++) {
                    dettaleEmpleado[i].addEventListener('click', () => {
                        let empleadoSeleccionado = AllEmpleados[i];
                        alert(`Nombre: ${empleadoSeleccionado.name}\nApellidos: ${empleadoSeleccionado.lastname}\nTelefono: ${empleadoSeleccionado.phone}\nEmail: ${empleadoSeleccionado.email}\nFecha de nacimiento: ${empleadoSeleccionado.birthday}\nFecha de inicio: ${empleadoSeleccionado.date_ini}\nDireccion: ${empleadoSeleccionado.direction}\nEspecialidad: ${empleadoSeleccionado.specialitation}\nEAN: ${empleadoSeleccionado.EAN}`);
                    }
                    )
                }
            }


        });
}

// Registrar listeners ONCE (fuera de MostrarEmpleados)
document.addEventListener('DOMContentLoaded', () => {
    MostrarEmpleados();

    // Nuevo empleado (se registra solo una vez)
    let nuevoEmpleado = document.getElementById('nuevo-empleado');
    let desplazar = document.getElementById('desplazar');
    if (nuevoEmpleado) {
        nuevoEmpleado.addEventListener('click', () => {
            // formulario: botón con type="button" para evitar submit automático
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
                <button id="agregar-empleado" type="button">Agregar empleado</button>
                <input type="file" accept="image/png" id="imagenEmpleado" />
            `;
            // listener change para guardar la ruta del archivo seleccionado
            let inputImagen = document.getElementById('imagenEmpleado');
            selectedImagePath = null;
            if (inputImagen) {
                inputImagen.addEventListener('change', (event) => {
                    if (event.target.files && event.target.files[0] && event.target.files[0].path) {
                        selectedImagePath = event.target.files[0].path;
                    } else {
                        selectedImagePath = null;
                    }
                });
            }

            // listener agregar empleado (se crea solo una vez al abrir el formulario)
            let agregarEmpleado = document.getElementById('agregar-empleado');
            if (agregarEmpleado) {
                agregarEmpleado.addEventListener('click', async () => {
                    try {
                        // calcula newId antes de POST
                        const resIds = await fetch(recurso + '/users');
                        const arr = await resIds.json();
                        const allIds = arr.map(u => u._id);
                        const newId = allIds.length > 0 ? Math.max(...allIds) + 1 : 1;

                        const newEmployee = {
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

                        // POST
                        const resp = await fetch(recurso + '/users', {
                            method: 'POST',
                            body: JSON.stringify(newEmployee),
                            headers: { 'Content-Type': 'application/json' }
                        });
                        const json = await resp.json();
                        console.log('Empleado agregado', json);

                        // Guardado de imagen: hazlo después del POST usando selectedImagePath y newId
                        if (selectedImagePath) {
                            try {
                                const buffer = await fs.promises.readFile(selectedImagePath);
                                const outPath = path.join(__dirname, 'imagen', `${newId}.png`);
                                await fs.promises.writeFile(outPath, buffer);
                                console.log('Imagen guardada correctamente en', outPath);
                            } catch (err) {
                                console.error('Error al leer/escribir imagen:', err);
                            }
                        }

                        alert('Empleado agregado correctamente');
                        MostrarEmpleados();
                        desplazar.innerHTML = '';
                    } catch (err) {
                        console.error('Error al agregar empleado:', err);
                        alert('Error al agregar empleado');
                    }
                });
            }
        });
    }
});