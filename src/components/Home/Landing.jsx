import '../../App.scss'
import LazyComponent from '../../helpers/lazyComponents';
import Products from '../Product/Products';

export default function Landing() {
  return (
    <>
      <LazyComponent>
        <Products />
      </LazyComponent>
    </>
  );
}