const toggleThemeBtn = document.getElementById("toggleTheme");
const body = document.body;

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    const content = document.getElementById("editor").innerText;
    window.electron.saveFile(content);
  }
});

window.electron.onSaveBeforeExit(() => {
  const content = document.getElementById("editor").innerText;
  window.electron.saveFile(content);
  setTimeout(() => {
    window.electron.exitApp();
  }, 600);
});
