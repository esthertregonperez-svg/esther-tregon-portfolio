// frontend/js/configuracion.js
// Pantalla de Configuracion: idioma, tamano de letra y tema.
// Todo se guarda en localStorage (no toca backend).
// El idioma traduce SOLO esta pantalla mediante atributos data-i18n.

document.addEventListener('DOMContentLoaded', () => {

  // --- Claves con las que guardamos en localStorage ---
  const CLAVE_IDIOMA = 'cf_idioma';
  const CLAVE_LETRA  = 'cf_letra';
  const CLAVE_TEMA   = 'cf_tema';

  // --- Valores por defecto si el usuario no ha elegido nada aun ---
  const POR_DEFECTO = { idioma: 'es', letra: 'normal', tema: 'claro' };

  // --- Diccionario de traducciones SOLO de esta pantalla ---
  const TEXTOS = {
    es: {
      titulo: 'Configuración',
      subtitulo: 'Personaliza la apariencia de la aplicación',
      idioma_titulo: 'Idioma',
      idioma_ayuda: 'Idioma de esta pantalla de configuración',
      letra_titulo: 'Tamaño de letra',
      letra_ayuda: 'Ajusta el tamaño del texto de la interfaz',
      letra_pequena: 'Pequeña',
      letra_normal: 'Normal',
      letra_grande: 'Grande',
      tema_titulo: 'Tema',
      tema_ayuda: 'Elige entre modo claro y oscuro',
      tema_claro: 'Claro',
      tema_oscuro: 'Oscuro',
    },
    en: {
      titulo: 'Settings',
      subtitulo: 'Customize the appearance of the application',
      idioma_titulo: 'Language',
      idioma_ayuda: 'Language of this settings screen',
      letra_titulo: 'Font size',
      letra_ayuda: 'Adjust the size of the interface text',
      letra_pequena: 'Small',
      letra_normal: 'Normal',
      letra_grande: 'Large',
      tema_titulo: 'Theme',
      tema_ayuda: 'Choose between light and dark mode',
      tema_claro: 'Light',
      tema_oscuro: 'Dark',
    },
  };

  const raiz = document.documentElement; // el <html>

  // ---------------------------------------------------------
  // APLICAR cada ajuste al documento.
  // ---------------------------------------------------------
  function aplicarLetra(valor) {
    raiz.setAttribute('data-letra', valor);
  }

  function aplicarTema(valor) {
    // Solo marcamos el atributo cuando es oscuro; en claro lo quitamos
    // para que valgan las variables originales de :root.
    if (valor === 'oscuro') {
      raiz.setAttribute('data-tema', 'oscuro');
    } else {
      raiz.removeAttribute('data-tema');
    }
  }

  function aplicarIdioma(valor) {
    const diccionario = TEXTOS[valor] ?? TEXTOS.es;
    raiz.setAttribute('lang', valor);

    // Recorremos cada elemento con data-i18n y le ponemos su texto.
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const clave = el.getAttribute('data-i18n');
      if (diccionario[clave]) {
        el.textContent = diccionario[clave];
      }
    });
  }

  // ---------------------------------------------------------
  // Marca visualmente el boton activo dentro de un grupo.
  // ---------------------------------------------------------
  function marcarActivo(idGrupo, valor) {
    const grupo = document.getElementById(idGrupo);
    grupo.querySelectorAll('.opcion').forEach((boton) => {
      const activo = boton.getAttribute('data-valor') === valor;
      boton.classList.toggle('opcion--activa', activo);
    });
  }

  // ---------------------------------------------------------
  // Conecta un grupo de botones: al hacer clic, aplica + guarda + marca.
  // ---------------------------------------------------------
  function conectarGrupo(idGrupo, clave, aplicar) {
    const grupo = document.getElementById(idGrupo);
    grupo.addEventListener('click', (evento) => {
      const boton = evento.target.closest('.opcion');
      if (!boton) return; // clic fuera de un boton

      const valor = boton.getAttribute('data-valor');
      aplicar(valor);
      localStorage.setItem(clave, valor);
      marcarActivo(idGrupo, valor);
    });
  }

  // ---------------------------------------------------------
  // ARRANQUE: leemos lo guardado, lo aplicamos y marcamos.
  // ---------------------------------------------------------
  function iniciar() {
    const idioma = localStorage.getItem(CLAVE_IDIOMA) ?? POR_DEFECTO.idioma;
    const letra  = localStorage.getItem(CLAVE_LETRA)  ?? POR_DEFECTO.letra;
    const tema   = localStorage.getItem(CLAVE_TEMA)   ?? POR_DEFECTO.tema;

    // Aplicamos el estado guardado.
    aplicarLetra(letra);
    aplicarTema(tema);
    aplicarIdioma(idioma); // el idioma va el ultimo: retraduce ya con todo puesto

    // Marcamos el boton activo de cada grupo.
    marcarActivo('opciones-idioma', idioma);
    marcarActivo('opciones-letra', letra);
    marcarActivo('opciones-tema', tema);

    // Conectamos los clics.
    conectarGrupo('opciones-idioma', CLAVE_IDIOMA, aplicarIdioma);
    conectarGrupo('opciones-letra', CLAVE_LETRA, aplicarLetra);
    conectarGrupo('opciones-tema', CLAVE_TEMA, aplicarTema);
  }

  // ---------------------------------------------------------
  // Montamos el layout comun y arrancamos la pantalla.
  // ---------------------------------------------------------
  montarLayout('configuracion');
  iniciar();
});