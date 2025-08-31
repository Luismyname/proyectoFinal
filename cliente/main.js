// Importa el módulo principal de Electron
const electron = require('electron');

// Inicializa el módulo @electron/remote para permitir el acceso remoto a objetos principales desde el renderer
require('@electron/remote/main').initialize()

// Variable global para la ventana principal
let mainWindow

// Función para crear la ventana principal de la aplicación
function createWindow(){
    mainWindow = new electron.BrowserWindow({
        width: 900,              // Ancho de la ventana
        height: 600,             // Alto de la ventana
        //resizable: false,        // No permite redimensionar la ventana
        //maximizable: false,      // No permite maximizar la ventana
        webPreferences: {
            nodeIntegration: true,    // Permite usar Node.js en el renderer (no recomendado para producción)
            contextIsolation: false,  // Desactiva el aislamiento de contexto (no recomendado para producción)
        }
    });

    // Habilita el acceso remoto a la webContents de la ventana principal
    require('@electron/remote/main').enable(mainWindow.webContents)

    // Carga el archivo HTML principal de la aplicación
    mainWindow.loadFile('index.html');

    // Evento que se dispara cuando la ventana se cierra
    mainWindow.on('closed', function () {
        mainWindow = null; // Libera la referencia a la ventana
    });

    // Abre las herramientas de desarrollo de Chromium (DevTools)
    //mainWindow.webContents.openDevTools()
}

// Evento que se dispara cuando Electron ha terminado de inicializarse y está listo para crear ventanas
electron.app.on('ready', () => {
    createWindow(); // Crea la ventana principal

    // Plantilla para el menú de la aplicación (barra superior)
    const template = [
        {
            label: 'Archivo',
            submenu: [
                {
                    label: 'Salir',
                    accelerator: 'CmdOrCtrl+Q', // Atajo de teclado para salir
                    click() {
                        electron.app.quit(); // Cierra la aplicación
                    }
                }
            ]
        },
        {
            label: 'Ayuda',
            submenu: [
                {
                    label: 'Acerca de',
                    click() {
                        // Muestra un cuadro de diálogo con información de la app
                        electron.dialog.showMessageBox({
                            type: 'info',
                            title: 'Acerca de',
                            message: 'Aplicación de ejemplo con Electron'
                        });
                    }
                }
            ]
        }
    ];

    // Crea el menú de la aplicación a partir de la plantilla
    const menu = electron.Menu.buildFromTemplate(template);
    // Establece el menú de la aplicación
    electron.Menu.setApplicationMenu(menu);

    // Crea un menú contextual vacío (clic derecho)
    const ctxMenu = new electron.Menu();

    // Añade las opciones de pegar, copiar y cortar al menú contextual
    ctxMenu.append(new electron.MenuItem({ role: 'paste' })); // Permite pegar texto
    ctxMenu.append(new electron.MenuItem({ role: 'copy' }));  // Permite copiar texto
    ctxMenu.append(new electron.MenuItem({ role: 'cut' }));   // Permite cortar texto

    // Escucha el evento 'context-menu' que se dispara cuando el usuario hace clic derecho en la ventana principal
    mainWindow.webContents.on('context-menu', function (e, params) {
        // Muestra en consola si el elemento donde se hizo clic es editable (input, textarea, etc.)
        console.log('isEditable:', params.isEditable); // Depuración

        // Solo muestra el menú contextual si el usuario hizo clic en un campo editable
        // Esto evita que el menú aparezca en otras partes de la ventana
        if (params.isEditable) {
            ctxMenu.popup({
                window: mainWindow, // Ventana donde se mostrará el menú
                x: params.x,        // Posición X del clic
                y: params.y         // Posición Y del clic
            });
        }
    })
});