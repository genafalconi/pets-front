import '../../App.scss'
import LazyComponent from '../../helpers/lazyComponents';
import Products from '../Product/Products';
import Highlights from '../Starting/Highlight';
import Carousel from '../Starting/ImageCarousel';

export default function Landing() {
  return (
    <>
      <LazyComponent>
        <Carousel />
        <Highlights />
      </LazyComponent>
    </>
  );
}