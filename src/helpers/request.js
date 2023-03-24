import axios from "axios";
import Swal from 'sweetalert2';

export const request = async (method, url, params, data, token) => {

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
    if (error.response) {
      Swal.fire({
        title: 'Error!',
        text: `${error.response}`,
        icon: 'error'
      })
      throw new Error(error.response);
    } else if (error.request) {
      Swal.fire({
        title: 'Error!',
        text: `Error del servidor!`,
        icon: 'error'
      })
      throw new Error(error.request);
    } else {
      Swal.fire({
        title: 'Error!',
        text: `Ocurrio un error inesperado!`,
        icon: 'error'
      })
      throw new Error(error);
    }
  }
}
