const { BrowserWindow } = require('@electron/remote')
const fetch = require('node-fetch')
const recurso = 'http://127.0.0.1:8080'

let paginaPrincipal = document.getElementById('pagina-principal')

paginaPrincipal.addEventListener('click', () => {
    BrowserWindow.getFocusedWindow().loadFile('admin.html');
});