const form = document.getElementById('loginForm');
const email = document.getElementById('email');
const password = document.getElementById('password');
const mensaje = document.getElementById('mensaje');

/* Lista de usuarios */
const usuarios = [
    { correo: "admin@gmail.com", contraseña: "1234", nombre: "Administrador hernando" },
    { correo: "juan@gmail.com", contraseña: "5678", nombre: "Juan" }
];
/* Función para manejar el evento de envío del formulario */
form.addEventListener("submit", function (e) {
    e.preventDefault();

    mensaje.innerHTML = "";
/* Validación de campos vacíos */
    if (email.value === "" || password.value === "") {
        mensaje.innerHTML = "<div class='alert alert-danger' role='alert'> ⚠️Por favor, complete todos los campos.</div>";
        return;
    }
/* Búsqueda del usuario en la lista */
    const usuarioEncontrado = usuarios.find(usuario => 
        usuario.correo === email.value && 
        usuario.contraseña === password.value);
/* Manejo del resultado de la búsqueda */
    if (usuarioEncontrado) {
        localStorage.setItem("usuario", JSON.stringify(usuarioEncontrado));
        mensaje.innerHTML = "<div class='alert alert-success' role='alert'>✅Inicio de sesión exitoso. Redirigiendo...</div>";
/* Redirección a la página de tablas después de 1.5 segundos */
        setTimeout(() => {
            window.location.href = "/src/views/tables/tables.html";
        }, 1500);
/* Manejo de error si el usuario no es encontrado */
    }else{
        mensaje.innerHTML = "<div class='alert alert-danger' role='alert'>❌Correo electrónico o contraseña incorrectos.</div>";
    }
});