const { BrowserWindow } = require('@electron/remote')
const fetch = require('node-fetch')
const recurso = 'http://127.0.0.1:8080'

let usuario = document.getElementById('usuario')
let contraseña = document.getElementById('contraseña')
let iniciar = document.getElementById('iniciar')
let limpiar = document.getElementById('limpiar')

let comprobar = (usua, pass, encontrado) => {
    if (!Array.isArray(encontrado) || encontrado.length === 0) {
        document.getElementById('logo-container').innerHTML = '<div><h1>No se encontraron directores o hubo un error.</h1></div>';
        return;
    }

    const usuario = encontrado[0]; // 👈 tomamos directamente el primer (y único) elemento

    if (usuario.email === usua && usuario.password === pass && usuario.role.includes('admin')) {
        BrowserWindow.getFocusedWindow().loadFile('admin.html');
    }else if (usuario.email === usua && usuario.password === pass && usuario.role.includes('employee')) {
        BrowserWindow.getFocusedWindow().loadFile('employee.html');
    }else {
        document.getElementById('logo-container').innerHTML = `<div><h1>Usuario o contraseña incorrectos</h1></div>`;
    }
}

iniciar.addEventListener('click', () => {
    if (usuario.value === '' || contraseña.value === '') {
        if (usuario.value === '') {
            alert('el usuario esta vacio')
        }
        if (contraseña.value === '') {
            alert('la contraseña esta vacia')
        }
    } else {
        fetch(recurso + '/users/' + usuario.value)
            .then(res => res.json())
            .then(json => comprobar(usuario.value, contraseña.value, json))
    }
})

limpiar.addEventListener('click', () => {
    usuario.value = ''
    contraseña.value = ''
})

contraseña.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        iniciar.click()
    }
})