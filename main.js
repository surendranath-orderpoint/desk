const { app, BrowserWindow } = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 900,
        height: 800,
        icon: 'assets/images/icon.png'
    })

    win.loadURL('https://app.vikrayashaala.com');

    win.webContents.session.webRequest.onBeforeSendHeaders(
        (details, callback) => {
            const url = details.url;
            const { requestHeaders } = details;
            if (url.indexOf('v2.vikrayashaala.com') == -1) {
                UpsertKeyValue(requestHeaders, 'Access-Control-Allow-Origin', ['*']);
            }
            callback({ requestHeaders });
        },
    );

    win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        const url = details.url;
        const { responseHeaders } = details;
        if (url.indexOf('v2.vikrayashaala.com') == -1) {
            UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Origin', ['*']);
            UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Headers', ['*']);
        }
        callback({
            responseHeaders,
        });
    });

}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

function UpsertKeyValue(obj, keyToChange, value) {
    const keyToChangeLower = keyToChange.toLowerCase();
    for (const key of Object.keys(obj)) {
        if (key.toLowerCase() === keyToChangeLower) {
            // Reassign old key
            obj[key] = value;
            // Done
            return;
        }
    }
    // Insert at end instead
    obj[keyToChange] = value;
}

