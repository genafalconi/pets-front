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

export const CategoryDto = {
  ALIMENTO_BALANCEADO: 'ALIMENTO BALANCEADO',
  ACCESORIOS: 'ACCESORIOS',
  PIEDRAS: 'PIEDRAS',
  MEDICAMENTO: 'MEDICAMENTO'
}

export const AnimalDto = {
  CAT: 'CAT',
  DOG: 'DOG'
}

export const AnimalSizeDto = {
  SMALL: 'SMALL',
  MEDIUM: 'MEDIUM',
  MEDIUM_LARGE: 'MEDIUM AND LARGE',
  LARGE: 'LARGE',
  ALL: 'ALL'
}

export const AnimalAgeDto = {
  PUPPY: 'PUPPY',
  ADULT: 'ADULT',
  SENIOR: 'SENIOR',
  ALL: 'ALL',
  KITTEN: 'KITTEN'
}

export const BrandDto = {
  ROYAL_CANIN: 'ROYAL CANIN',
  PRO_PLAN: 'PRO PLAN',
  EXCELLENT: 'EXCELLENT',
  EUKANUBA: 'EUKANUBA',
  IAMS: 'IAMS',
  PEDIGREE: 'PEDIGREE',
  VITAL_CAN: 'VITAL CAN',
  CAN_CAT: 'CAN CAT',
  ABSORSOL: 'ABSORSOL',
  OLD_PRINCE: 'OLD PRINCE',
  BIOPET: 'BIOPET',
  UNIK: 'UNIK',
  OPTIMUM: 'OPTIMUM'
}


export const carouelImages = [
  {
    name: 'Image1',
    img: 'Landing/CAROUSEL/sportive-dog-performing-during-lure-coursing-competition_1_zdiqiz',
    text: `Bienvenidos a Pet's Zone`
  },
  {
    name: 'Image2',
    img: 'Landing/CAROUSEL/close-up-beautiful-cat-with-owner_1_cnizg7_zl0tlu',
    text: 'Entregas GRATIS a domicilio'
  },
  {
    name: 'Image3',
    img: 'Landing/CAROUSEL/close-up-portrait-beautiful-cat_1_rpst7l_eptzvt',
    text: 'Somos la primer comunidad integral para mascotas'
  },
  {
    name: 'Image4',
    img: 'Landing/CAROUSEL/cute-scottish-straight-gray-cat-hunting-playing_mn7pmx_sbbuva',
    text: 'Pagas una vez que recibis tu pedido en condiciones'
  },
  {
    name: 'Image5',
    img: 'Landing/CAROUSEL/hungry-white-brown-dog-with-big-ears-brown-eyes-ready-eat-bowl-full-food_cytspy_va5mrg',
    text: 'Suscribite a nuestra re-compra automatica'
  }
]