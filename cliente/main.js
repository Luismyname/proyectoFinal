const electron = require('electron');
require('@electron/remote/main').initialize()

let mainWindow

function createWindow(){
    mainWindow = new electron.BrowserWindow({
        width: 900,
        height: 600,
        resizable: false,
        maximizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    require('@electron/remote/main').enable(mainWindow.webContents)

    mainWindow.loadFile('index.html');
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
    //mainWindow.webContents.openDevTools()
}

electron.app.on('ready', () => {
    createWindow();

    const template = [
        {
            label: 'Archivo',
            submenu: [
                {
                    label: 'Salir',
                    accelerator: 'CmdOrCtrl+Q',
                    click() {
                        electron.app.quit();
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

   const menu = electron.Menu.buildFromTemplate(template);
   electron.Menu.setApplicationMenu(menu);
});