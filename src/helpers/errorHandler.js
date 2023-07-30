import Swal from "sweetalert2";

export default function errorHandler(error) {
  console.log(error)
  return Swal.fire({
    title: 'Ha ocurrido un error',
    text: 'Sera dirigido al inicio',
    icon: 'error',
    timer: 2500,
    timerProgressBar: true
  })
  // .then(() => window.location.href = '/')
}