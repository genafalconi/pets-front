export const req_constants = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE'
}

export const ord_constants = {
  DELIVERED: 'DELIVERED',
  CONFIRMED: 'CONFIRMED',
  PROGRESS: 'PROGRESS',
  CANCELLED: 'CANCELLED'
}

export const type_ord = {
  ORDER: 'order',
  REORDER: 're-order'
}

export const endpoints = {
  CHECKOUT_ORD: '/checkout/order',
  CHECKOUT_REORD: '/checkout/re-order'
}