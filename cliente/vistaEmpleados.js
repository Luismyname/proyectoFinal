const { BrowserWindow } = require('@electron/remote')
const fetch = require('node-fetch')
const recurso = 'http://127.0.0.1:8080'
const fs = require('fs');
const { get } = require('http');
const path = require('path'); // para construir rutas seguras

//boton que te lleva al menu principal

let paginaPrincipal = document.getElementById('pagina-principal')

paginaPrincipal.addEventListener('click', () => {
    BrowserWindow.getFocusedWindow().loadFile('employee.html');
});

let clienteP = document.getElementById('cliente-principal')

clienteP.addEventListener('click', () => {
    BrowserWindow.getFocusedWindow().loadFile('vistaClientes.html')
})

let calendarioP = document.getElementById('calendario-principal')

calendarioP.addEventListener('click', () => {
    BrowserWindow.getFocusedWindow().loadFile('vistaCalendario.html')
})

let pagosP = document.getElementById('pagos-principal')

pagosP.addEventListener('click', () => {
    BrowserWindow.getFocusedWindow().loadFile('vistaPagos.html');
});

let empleadoP = document.getElementById('empleado-principal');

empleadoP.addEventListener('click', () => {
    BrowserWindow.getFocusedWindow().loadFile('vistaEmpleados.html');
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
MostrarEmpleados();

// Botón cerrar sesión
let btnCerrarSesion = document.getElementById('btn-cerrar-sesion')

btnCerrarSesion.addEventListener('click', () => {
    BrowserWindow.getFocusedWindow().loadFile('index.html');
})