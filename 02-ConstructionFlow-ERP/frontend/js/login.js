/**
 * Logica de la pantalla de acceso.
 */

const API_URL = 'http://localhost:3000/api';

const formulario = document.getElementById('formulario-login');
const mensajeError = document.getElementById('mensaje-error');
const botonAcceder = document.getElementById('boton-acceder');

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  ocultarError();
  bloquearFormulario(true);

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const respuesta = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const resultado = await respuesta.json();

    if (!resultado.success) {
      mostrarError(resultado.error.message);
      return;
    }

    sessionStorage.setItem('token', resultado.data.token);
    sessionStorage.setItem('usuario', JSON.stringify(resultado.data.usuario));
    sessionStorage.setItem('permisos', JSON.stringify(resultado.data.permisos));

    window.location.href = 'dashboard.html';

  } catch (error) {
    mostrarError('No se pudo conectar con el servidor');
  } finally {
    bloquearFormulario(false);
  }
});

function mostrarError(texto) {
  mensajeError.textContent = texto;
  mensajeError.hidden = false;
}

function ocultarError() {
  mensajeError.hidden = true;
}

function bloquearFormulario(bloqueado) {
  botonAcceder.disabled = bloqueado;
  botonAcceder.textContent = bloqueado ? 'Accediendo...' : 'Acceder';
}