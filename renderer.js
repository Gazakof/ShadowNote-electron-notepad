const toggleThemeBtn = document.getElementById("toggleTheme");
const body = document.body;

document.getElementById("editor").addEventListener("input", () => {
  window.electron.setFileModified(true);
  isModified = true;
});

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    const content = document.getElementById("editor").innerText;
    window.electron.saveFile(content);
    window.electron.setFileModified(false);
  }
});

window.electron.onSaveBeforeExit(() => {
  const content = document.getElementById("editor").innerText;
  window.electron.saveFile(content);
  window.electron.setFileModified(false);
});

toggleThemeBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
});
