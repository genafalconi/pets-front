import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ADD_TO_CART, ADD_TO_LOCAL_CART, GET_ACTIVE_PRODUCTS } from "../../redux/actions"
import ProductCart from "./ProductCard"

export default function Products() {

  const dispatch = useDispatch()
  const activeProducts = useSelector((state) => state.clientReducer.products)
  const user = localStorage.getItem('user')

  const [isLoading, setIsLoading] = useState(false)

  const addToCart = (prod) => {
    console.log(prod)
    if (user) {
      dispatch(ADD_TO_CART(prod))
    } else {
      dispatch(ADD_TO_LOCAL_CART(prod))
    }
  }

  useEffect(() => {
    if (activeProducts.length !== 0) {
      setIsLoading(true)
    } else {
      dispatch(GET_ACTIVE_PRODUCTS())
        .then((res) => {
          setIsLoading(false)
        })
    }
  }, [user, activeProducts, dispatch])

  return (
    <>
      {
        isLoading ?
          <h2>Cargando...</h2>
          : activeProducts?.map((elem) => {
            return (
              <ProductCart key={elem.id} name={elem.name} sizes={0} prices={0}/>
            )
          })
      }
    </>
  )
}