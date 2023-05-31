export function validateSearchInput(value) {
  const response = {
    valid: false,
    error: 'El texto ingresado es erróneo',
  };
  const regex = /^[a-zA-Z0-9\s]*$/;

  if (value.length > 30) {
    response.error = 'Maxima longitud';
  } else if (!regex.test(value)) {
    response.error = 'Caractere no válido';
  } else {
    response.valid = true;
    response.error = '';
  }

  return response;
}

export function validateLoginInputs(value) {
  const { email, password } = value;

  const response = {
    valid: false,
    error: 'El texto ingresado es erróneo',
  };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email.length > 40) {
    response.error = 'El correo electrónico ingresado es demasiado largo';
  } else if (!emailRegex.test(email)) {
    response.error = 'El correo electrónico ingresado no es válido';
  } else if (password.length < 6) {
    response.error = 'La contraseña debe tener al menos 6 caracteres';
  } else {
    response.valid = true;
    response.error = '';
  }

  return response;
}
