// theme.js

document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");

  // Tema guardado o preferencia del sistema
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    html.setAttribute("data-bs-theme", savedTheme);
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    html.setAttribute("data-bs-theme", prefersDark ? "dark" : "light");
  }

  // Actualizar icono
  function updateThemeIcon() {
    const isDark = html.getAttribute("data-bs-theme") === "dark";

    themeToggle.innerHTML = isDark
      ? '<i class="bi bi-sun"></i>'
      : '<i class="bi bi-moon"></i>';
  }

  updateThemeIcon();

  // Cambio de tema
  themeToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-bs-theme");

    const newTheme = currentTheme === "dark" ? "light" : "dark";

    html.setAttribute("data-bs-theme", newTheme);

    localStorage.setItem("theme", newTheme);

    updateThemeIcon();
  });
});
