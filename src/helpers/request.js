import axios from "axios";
import Swal from 'sweetalert2';
import eventBus from "./event-bus";

export const request = async (method, url, params, data, ext_token) => {

  let token = localStorage.getItem('token')
  if (ext_token) {
    token = ext_token
  }
  const config = {
    method: method,
    url: url,
    params: params,
    data: data,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    console.log(error)
    if (error.response && error.response.status === 401) {
      Swal.fire({
        title: 'Error!',
        text: `Sesion inactiva`,
        icon: 'error',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false
      })
      eventBus.emit('expired-sesion', true)
    } else {
      Swal.fire({
        title: 'Error!',
        text: `Ocurrio un error inesperado!`,
        icon: 'error',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false
      })
      // .then(() => {
      //   window.location.href = '/'
      // })
      throw new Error(error);
    }
  }
}
