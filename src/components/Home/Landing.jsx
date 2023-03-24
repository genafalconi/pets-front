import { Link } from 'react-router-dom'
import '../../App.scss'

export default function Landing() {

  return (
    <>
      <Link to={'/products'}>
        <button>Products</button>
      </Link>
    </>
  )

}