import { Link } from 'react-router-dom'
import '../../App.scss'
import AnimalCards from '../segmentation/AnimalCards'
import ProductList from '../segmentation/ProductsList'

export default function Landing() {

  return (
    <>
      <AnimalCards />
      {/* <Link to={'/products'}>
        <button>Products</button>
      </Link> */}
      {/* <ProductList /> */}
    </>
  )

}