import axios from "axios";

export const request = (method, url, params, data, token) => {

  const res = axios({
    method: method,
    url: url,
    params: params,
    data: data,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  return res
}