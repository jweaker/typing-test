const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const sqlite3 = require("sqlite3");

if (require("electron-squirrel-startup")) {
  app.quit();
}

const isDev = process.env.IS_DEV === "true";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "main.jsx"),
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

const database = new sqlite3.Database("./db.sqlite3", (err) => {
  if (err) console.error("Database opening error: ", err);
});

ipcMain.on("asynchronous-message", (event, arg) => {
  const sql = arg;
  database.all(sql, (err, rows) => {
    event.reply("asynchronous-reply", (err && err.message) || rows);
  });
});
