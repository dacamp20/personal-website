function setTheme(theme) {
    const root = document.documentElement;

    if (theme == 'thanksgiving') {
        //override system light-dark colors
        root.style.setProperty('background-color', 'var(--thanksgiving-background-color)');
        root.style.setProperty('color', 'var(--thanksgiving-text-color)');
        root.style.setProperty('--dark-text-color', 'var(--thanksgiving-text-color)');
        root.style.setProperty('--dark-text-box-color', 'var(--thanksgiving-text-box-color)');
        root.style.setProperty('--dark-input-box-color', 'var(--thanksgiving-input-box-color)');
        root.style.setProperty('--light-text-color', 'var(--thanksgiving-text-color)');
        root.style.setProperty('--light-text-box-color', 'var(--thanksgiving-text-box-color)');
        root.style.setProperty('--light-input-box-color', 'var(--thanksgiving-input-box-color)');

    } else {
        //return to normal system-driven theme 
        root.style.removeProperty("background-color");
        root.style.removeProperty("color");
        root.style.removeProperty('--dark-text-color');
        root.style.removeProperty('--dark-text-box-color');
        root.style.removeProperty('--dark-input-box-color');
        root.style.removeProperty('--light-text-color');
        root.style.removeProperty('--light-text-box-color');
        root.style.removeProperty('--light-input-box-color');

    }
}

function toggleTheme() {
    const currentTheme = localStorage.getItem("theme") || "system";
    const newTheme = currentTheme === "thanksgiving" ? "system" : "thanksgiving";

    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
}

function setSavedTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "thanksgiving") {
        setTheme("thanksgiving");
        document.getElementById("themeToggle").checked = true;
    }
}

document.addEventListener("DOMContentLoaded", setSavedTheme);