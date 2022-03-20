const { ipcRenderer } = window.require("electron");

export default function sql(message) {
  return new Promise((resolve) => {
    ipcRenderer.once("asynchronous-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("asynchronous-message", message);
  });
}
