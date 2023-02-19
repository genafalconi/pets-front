// Función para almacenar la posición actual del usuario en sessionStorage
function storeScrollPosition() {
  var currentScrollPosition = window.pageYOffset;
  sessionStorage.setItem('scrollPosition', currentScrollPosition);
}

// Función para restaurar la posición almacenada del usuario desde sessionStorage
function restoreScrollPosition() {
  var scrollPosition = sessionStorage.getItem('scrollPosition');
  if (scrollPosition !== null) {
    window.scrollTo(0, scrollPosition);
    sessionStorage.removeItem('scrollPosition');
  }
}

// Ejecutar la función restoreScrollPosition en la carga de la página para restaurar la posición de desplazamiento del usuario
document.addEventListener('DOMContentLoaded', restoreScrollPosition);

// Ejecutar la función storeScrollPosition cuando se produce un evento de desplazamiento en la página
document.addEventListener('scroll', storeScrollPosition);
