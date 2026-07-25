// frontend/js/api.js
// Capa central de comunicación con el backend.
// Todas las pantallas llaman aquí en lugar de usar fetch directamente.

// Ajusta el puerto y el prefijo para que coincidan con tu servidor Express.
const API_BASE_URL = 'http://localhost:3000/api';

// El token que guardamos en sessionStorage tras el login.
function getToken() {
  return sessionStorage.getItem('token');
}

// Función interna: hace la llamada real y aplica nuestras convenciones.
async function apiFetch(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Si tenemos token, lo enviamos en cada petición.
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  } catch (err) {
    // El servidor no responde (apagado, sin red, CORS bloqueado...).
    return {
      success: false,
      error: { code: 'NETWORK_ERROR', message: 'No se pudo conectar con el servidor.' },
    };
  }

  // Token inválido o caducado: limpiamos y volvemos al login.
  if (response.status === 401) {
    sessionStorage.clear();
    window.location.href = '../pages/login.html';
    return;
  }

  // El backend SIEMPRE responde con {success, data} o {success, error}.
  // Aunque haya sido un 400/404/409, el cuerpo trae ese formato, así que lo devolvemos tal cual.
  try {
    return await response.json();
  } catch (err) {
    return {
      success: false,
      error: { code: 'INVALID_JSON', message: 'Respuesta no válida del servidor.' },
    };
  }
}

// Métodos de conveniencia: así en clientes.js escribes api.get('/clientes') y ya está.
const api = {
  get: (endpoint) => apiFetch(endpoint, { method: 'GET' }),
  post: (endpoint, data) => apiFetch(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) => apiFetch(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint) => apiFetch(endpoint, { method: 'DELETE' }),
};