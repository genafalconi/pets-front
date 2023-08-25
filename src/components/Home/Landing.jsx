import '../../App.scss'
import LazyComponent from '../../helpers/lazyComponents';
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