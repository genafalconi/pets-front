import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../../App.scss'

export default function Landing() {


  useEffect(() => {
  }, [])

  return (
    <>
      <Link to={'/productos'}>
        <button>Products</button>
      </Link>
    </>
  )

}