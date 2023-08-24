import '../../App.scss'
import LazyComponent from '../../helpers/lazyComponents';
import Products from '../Product/Products';
import AnimalCards from '../Segmentation/AnimalCards';

export default function Landing() {
  return (
    <>
      <LazyComponent>
        <Products />
      </LazyComponent>
    </>
  );
}