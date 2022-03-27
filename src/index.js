const path = require("path");
const { app, BrowserWindow } = require("electron");

if (require("electron-squirrel-startup")) {
  app.quit();
}

const isDev = process.env.IS_DEV === "true";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 300,
    transparent: true,
    minWidth: 200,
    minHeight: 200,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    mainWindow.removeMenu();
    mainWindow.loadFile(
      path.join(__dirname.replace("src", ""), "build", "index.html")
    );
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
