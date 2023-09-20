import { useEffect, useState } from 'react';
import '../../App.scss'
import LazyComponent from '../../helpers/lazyComponents';
import Highlights from '../Starting/Highlight';
import Carousel from '../Starting/ImageCarousel';
import TextHomecoming from '../Starting/TextHomecoming';
import Footer from '../Starting/Footer';

export default function Landing() {

  const [isLoadingHighlight, setIsLoadingHighlight] = useState(true);

  useEffect(() => {

  }, [isLoadingHighlight])

  return (
    <LazyComponent>
      <TextHomecoming />
      <Carousel isLoadingHighlight={isLoadingHighlight} />
      <Highlights setIsLoadingHighlight={setIsLoadingHighlight} />
      <Footer isLoadingHighlight={isLoadingHighlight} />
    </LazyComponent>
  );
}